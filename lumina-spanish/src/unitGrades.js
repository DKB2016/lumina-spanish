/** Transparent unit and curriculum grade aggregation. No unattempted lesson is scored zero. */
export const PASS_MARK=80;
export function lessonBreakdown(result){
  if(!result||typeof result.grade!=='number')return null;
  const scores=result.itemScores||{};
  const skills={};
  for(const [key,correct] of Object.entries(scores)){
    const skill=key.startsWith('Listen')?'Listening':key.startsWith('Read')?'Reading':key.startsWith('Build')?'Sentence building':(result.practiceSkills?.[key]||'Usage');
    const bucket=skills[skill]||(skills[skill]={correct:0,total:0});
    bucket.total++;if(correct)bucket.correct++;
  }
  return Object.fromEntries(Object.entries(skills).map(([name,v])=>[name,{...v,grade:Math.round(v.correct/v.total*100)}]));
}
export function unitSummary(unit,progress={}){
  const entries=unit.lessons.map(lesson=>({lesson,result:progress[lesson.id]}));
  const graded=entries.filter(x=>typeof x.result?.grade==='number');
  const passed=entries.filter(x=>x.result?.passed===true);
  const correct=graded.reduce((n,x)=>n+(Number.isFinite(x.result.correct)?x.result.correct:0),0);
  const total=graded.reduce((n,x)=>n+(Number.isFinite(x.result.gradedItems)?x.result.gradedItems:0),0);
  const grade=total>0?Math.round(100*correct/total):graded.length?Math.round(graded.reduce((n,x)=>n+x.result.grade,0)/graded.length):null;
  const skillTotals={};
  for(const x of graded)for(const [skill,score] of Object.entries(lessonBreakdown(x.result)||{})){
    const bucket=skillTotals[skill]||(skillTotals[skill]={correct:0,total:0});
    bucket.correct+=score.correct;bucket.total+=score.total;
  }
  const skills=Object.fromEntries(Object.entries(skillTotals).map(([name,v])=>[name,{...v,grade:Math.round(100*v.correct/v.total)}]));
  const lessons=entries.map(({lesson,result})=>({id:lesson.id,title:lesson.title,grade:typeof result?.grade==='number'?result.grade:null,passed:result?.passed===true,skills:lessonBreakdown(result)}));
  const complete=graded.length===entries.length;
  return {grade,complete,passed:complete&&passed.length===entries.length&&grade>=PASS_MARK,gradedCount:graded.length,passedCount:passed.length,totalLessons:entries.length,skills,lessons,weakest:[...lessons].filter(x=>x.grade!==null).sort((a,b)=>a.grade-b.grade)};
}
export function curriculumSummary(units,progress={}){
  const unitsWithScores=units.map(unit=>({...unit,summary:unitSummary(unit,progress)}));
  const gradedLessons=unitsWithScores.flatMap(u=>u.summary.lessons.filter(l=>l.grade!==null));
  const score=gradedLessons.length?Math.round(gradedLessons.reduce((n,l)=>n+l.grade,0)/gradedLessons.length):null;
  return {grade:score,gradedLessons:gradedLessons.length,totalLessons:unitsWithScores.reduce((n,u)=>n+u.lessons.length,0),units:unitsWithScores};
}
