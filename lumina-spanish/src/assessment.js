/** First-attempt objective assessment. Practice retries never rewrite the first score. */
export const PASS_MARK=80;
export const scoreAttempt=(keys,scores)=>{
  const correct=keys.filter(k=>scores[k]===true).length;
  const gradedItems=keys.length;
  const answered=keys.filter(k=>typeof scores[k]==='boolean').length;
  const grade=gradedItems&&answered===gradedItems?Math.round(100*correct/gradedItems):null;
  return {grade,correct,gradedItems,answered,passed:grade!==null&&grade>=PASS_MARK,missed:keys.filter(k=>scores[k]===false)};
};
export function recordFirstAnswer(scores,key,correct){
  return Object.prototype.hasOwnProperty.call(scores,key)?scores:{...scores,[key]:Boolean(correct)};
}
export function saveAttempt(previous,result){
  const prior=Array.isArray(previous?.attemptHistory)?previous.attemptHistory:previous&&typeof previous.grade==='number'?[stripHistory(previous)]:[];
  const history=[...prior,stripHistory(result)];
  const valid=history.filter(x=>typeof x.grade==='number'&&Number.isFinite(x.grade));
  const best=valid.length?Math.max(...valid.map(x=>x.grade)):null;
  return {...result,attemptHistory:history,attemptCount:history.length,bestGrade:best,everPassed:valid.some(x=>x.grade>=PASS_MARK)};
}
function stripHistory(result){const {attemptHistory,attemptCount,bestGrade,everPassed,...rest}=result;return rest;}
export function bestResult(result){
  if(!result)return null;
  const attempts=Array.isArray(result.attemptHistory)?result.attemptHistory:[result];
  const valid=attempts.filter(x=>typeof x.grade==='number'&&Number.isFinite(x.grade));
  return valid.reduce((best,x)=>!best||x.grade>best.grade?x:best,null);
}
