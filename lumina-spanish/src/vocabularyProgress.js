/** Shared vocabulary progress across stories and topical decks. */
export const wordKey=(word)=>word.trim().normalize('NFC').toLocaleLowerCase('es');
const DAY=86400000;
const delays={again:0,guess:1,hard:3,easy:7};
export function recordRecall(previous={},rating,now=Date.now()){
  const old=previous||{};
  const success=rating==='easy';
  const streak=success?(old.streak||0)+1:0;
  const seenDays=[...new Set([...(old.seenDays||[]),new Date(now).toISOString().slice(0,10)])].slice(-30);
  const interval=success?Math.min(90,Math.round(7*Math.pow(1.8,Math.max(0,streak-1)))):delays[rating]??0;
  return {attempts:(old.attempts||0)+1,streak,confidence:rating,lastReviewed:now,next:now+interval*DAY,seenDays,mastered:success&&streak>=3&&seenDays.length>=2};
}
export function summarizeWords(progress,lessons,decks){
  const entries=new Map();
  for(const l of lessons)if(progress.completed?.includes(l.id))for(const [es] of l.vocab)entries.set(wordKey(es),es);
  // Deck catalog availability is not evidence that the learner has encountered a word.
  const knowledge=progress.wordKnowledge||{};
  const encountered=new Set([...entries.keys(),...Object.keys(knowledge)]);
  const studied=Object.values(knowledge).filter(v=>(v?.attempts||0)>0).length;
  const mastered=Object.values(knowledge).filter(v=>v?.mastered).length;
  const due=Object.values(knowledge).filter(v=>(v?.attempts||0)>0&&!v?.mastered&&(v?.next||0)<=Date.now()).length;
  return {encountered:encountered.size,studied,mastered,due};
}
export function sortDeckWords(words,knowledge,now=Date.now()){
  const urgency=(w)=>{
    const v=knowledge?.[wordKey(w.es)];
    if(!v)return 2;
    if(v.mastered)return (v.next||0)<=now?1:0;
    if((v.next||0)<=now)return 5+Math.min(3,(now-(v.next||0))/86400000);
    return 1;
  };
  const eligible=words.filter(w=>{const v=knowledge?.[wordKey(w.es)];return !v?.mastered||(v.next||0)<=now});
  return eligible.sort((a,b)=>urgency(b)-urgency(a));
}
