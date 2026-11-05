import {wordKey} from './vocabularyProgress';

/** Prioritize weak and overdue vocabulary across story lessons and every topic deck. */
const DAY=86400000;
export function reviewQueue(progress,lessons,decks,mode='daily',now=Date.now()){
  const words=new Map();
  for(const lesson of lessons)if(progress.completed?.includes(lesson.id)){
    for(const [es,en] of lesson.vocab)words.set(wordKey(es),{es,en,source:'Story'});
  }
  for(const deck of decks)for(const word of deck.words){
    const key=wordKey(word.es);
    const studied=progress.wordKnowledge?.[key]?.attempts>0;
    if(studied&&!words.has(key))words.set(key,{es:word.es,en:word.en,source:'Flashcards'});
  }
  const scored=[...words.values()].map(word=>{
    const state=progress.wordKnowledge?.[wordKey(word.es)];
    const legacy=progress.reviews?.find(r=>wordKey(r.es)===wordKey(word.es));
    const next=state?.next??legacy?.next??0;
    const overdue=next<=now;
    const weak=!state||['again','guess','hard'].includes(state.confidence);
    const mastered=Boolean(state?.mastered);
    const daysSince=(now-(state?.lastReviewed||0))/86400000;
    const priority=(overdue?50:0)+(weak?25:0)+(mastered?-30:0)+Math.min(20,Math.max(0,daysSince));
    return {...word,priority,overdue,weak,mastered,lastReviewed:state?.lastReviewed||0};
  });
  const eligible=scored.filter(w=>mode==='weekly'?(w.overdue||(w.weak&&now-w.lastReviewed>=DAY)||(w.mastered&&now-w.lastReviewed>=7*DAY)):w.overdue&&!w.mastered);
  return eligible.sort((a,b)=>b.priority-a.priority||a.es.localeCompare(b.es,'es')).slice(0,mode==='weekly'?40:20);
}
