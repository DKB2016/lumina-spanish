# Lumina Spanish: fully offline neural speech (Piper)

Lumina now uses a **local Piper speech engine** instead of robotic browser TTS. There are no cloud API calls, accounts, or API keys. Audio is generated on your Windows computer and cached as WAV files. Other devices on your LAN can hear the generated audio through Vite's local proxy.

## One-time installation (internet required to download software and voice)

1. Download a Windows Piper executable from the official [rhasspy/piper releases](https://github.com/rhasspy/piper/releases) or install a compatible Piper CLI. Extract it to a folder such as `C:\\Tools\\piper`.
2. Download an **es_MX** voice from the [Piper voice catalog](https://github.com/rhasspy/piper/blob/master/VOICES.md). Listen to voice samples first; quality varies by model. Download **both** the matching `.onnx` model and `.onnx.json` configuration. Not every available Mexican Spanish model sounds equally natural.
3. Put both files under `lumina-spanish/voices/` and rename the pair to `es_MX.onnx` and `es_MX.onnx.json` respectively. Or set `LUMINA_PIPER_MODEL` to the full path of the original `.onnx` model (its adjacent JSON must have the same base name).
4. In **PowerShell terminal 1** (inside the inner `lumina-spanish` folder):

   ```powershell
   $env:LUMINA_PIPER_BIN = "C:\\Tools\\piper\\piper.exe"
   python .\\tts_server.py
   ```

   If Piper is on PATH, `python .\\tts_server.py` is sufficient. Verify `http://127.0.0.1:8765/api/tts/health` reports `"ready": true`.

5. In **PowerShell terminal 2** (same inner folder):

   ```powershell
   npm install
   npm run dev
   ```

6. Open Lumina at `http://localhost:5173`, go to Settings and press **Test audio**. For another device on the same LAN, open `http://YOUR-WINDOWS-IP:5173`. Allow inbound port 5173 on your private Windows firewall network if needed.

## Troubleshooting

- **Voice files missing:** check both model files, including the `.onnx.json` extension.
- **Piper synthesis failed:** check the Piper executable path and run the CLI manually. Some distributions require additional DLLs or runtime packages.
- **Backend unavailable:** start `tts_server.py` before Vite. The backend binds to loopback only; Vite proxies LAN browser requests to it.
- **Voice sounds unnatural:** choose a different es_MX voice from the catalog. Naturalness is fundamentally limited by the available model and training data; this integration cannot guarantee human-like audio.
- **Offline operation:** after downloading Piper and a voice, synthesis works without internet. The audio cache is in `.audio-cache/` and is ignored by Git.
- **Security:** only run this service on trusted devices. The backend is intentionally loopback-only and limits request length; the Vite development server is not a hardened production web server.

## Implementation

`POST /api/tts` accepts `{"text":"Hola","slow":false}` and returns `audio/wav`. The local cache key incorporates model path, model modification time, speed, and text. `GET /api/tts/health` reports voice-file readiness. Browser playback is deliberately not used as a silent fallback, so errors are visible.
