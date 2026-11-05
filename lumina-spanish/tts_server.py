"""Offline Piper TTS HTTP service for Lumina. Python 3.10+, no pip dependencies."""
from __future__ import annotations
import hashlib
import json
import os
from pathlib import Path
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
VOICE = Path(os.environ.get("LUMINA_PIPER_MODEL", str(ROOT / "voices" / "es_MX.onnx"))).resolve()
PIPER = os.environ.get("LUMINA_PIPER_BIN", "piper")
CACHE = ROOT / ".audio-cache"
HOST = os.environ.get("LUMINA_TTS_HOST", "127.0.0.1")
PORT = int(os.environ.get("LUMINA_TTS_PORT", "8765"))
LOCKS: dict[str, threading.Lock] = {}
LOCKS_GUARD = threading.Lock()

class Handler(BaseHTTPRequestHandler):
    def send_json(self, code, obj):
        payload = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if urlsplit(self.path).path != "/api/tts/health":
            return self.send_json(404, {"error": "Not found"})
        self.send_json(200, {"ready": VOICE.is_file() and VOICE.with_suffix(".onnx.json").is_file(), "engine": "Piper", "voice": VOICE.stem, "offline": True})

    def do_POST(self):
        if urlsplit(self.path).path != "/api/tts":
            return self.send_json(404, {"error": "Not found"})
        if not VOICE.is_file() or not VOICE.with_suffix(".onnx.json").is_file():
            return self.send_json(503, {"error": "Piper voice files missing. See README_OFFLINE_TTS.md."})
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if size < 1 or size > 8192:
                return self.send_json(413, {"error": "Invalid request size"})
            request = json.loads(self.rfile.read(size))
            value = request.get("text")
            if not isinstance(value, str) or not value.strip() or len(value) > 1500:
                return self.send_json(400, {"error": "Text must be 1–1500 characters"})
            text = value.strip()
            slow = request.get("slow", False)
            if not isinstance(slow, bool):
                return self.send_json(400, {"error": "slow must be boolean"})
            key = hashlib.sha256((str(VOICE) + ":" + str(VOICE.stat().st_mtime_ns) + ":" + str(slow) + ":" + text).encode()).hexdigest()
            CACHE.mkdir(exist_ok=True)
            target = CACHE / (key + ".wav")
            with LOCKS_GUARD:
                lock = LOCKS.setdefault(key, threading.Lock())
            with lock:
                if not target.is_file():
                    temp = CACHE / (key + ".tmp.wav")
                    command = [PIPER, "--model", str(VOICE), "--output_file", str(temp)]
                    if slow:
                        command.extend(["--length_scale", "1.28"])
                    try:
                        subprocess.run(command, input=text + "\n", text=True, capture_output=True, timeout=90, check=True)
                        if not temp.is_file() or temp.stat().st_size < 44:
                            raise RuntimeError("Piper did not produce a WAV file")
                        temp.replace(target)
                    except (OSError, subprocess.SubprocessError, RuntimeError) as exc:
                        temp.unlink(missing_ok=True)
                        return self.send_json(503, {"error": "Local Piper synthesis failed. Check the Piper executable and voice model.", "detail": str(exc)[:300]})
            payload = target.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "audio/wav")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "private, max-age=86400")
            self.end_headers()
            self.wfile.write(payload)
        except (ValueError, json.JSONDecodeError):
            self.send_json(400, {"error": "Invalid JSON request"})
        except (BrokenPipeError, ConnectionResetError):
            pass

if __name__ == "__main__":
    print(f"Lumina offline TTS listening on http://{HOST}:{PORT}")
    print(f"Piper model: {VOICE}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
