import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreAttempt,recordFirstAnswer,saveAttempt,bestResult} from '../src/assessment.js';
import {unitSummary,curriculumSummary} from '../src/unitGrades.js';
import {curriculum} from '../src/curriculumData.js';

const keys=['Listen-0','Build-0','Read-0','Practice-0','Practice-1','Practice-2'];
test('incomplete work cannot pass or be graded',()=>{
  const r=scoreAttempt(keys,{'Listen-0':true});
  assert.equal(r.grade,null);assert.equal(r.passed,false);assert.equal(r.answered,1);
});
test('first attempt is immutable after corrected retries',()=>{
  const first=recordFirstAnswer({},'Listen-0',false);
  assert.deepEqual(recordFirstAnswer(first,'Listen-0',true),first);
  const scores={...first,'Build-0':true,'Read-0':true,'Practice-0':true,'Practice-1':true,'Practice-2':true};
  assert.deepEqual(scoreAttempt(keys,scores),{grade:83,correct:5,gradedItems:6,answered:6,passed:true,missed:['Listen-0']});
});
test('80 percent threshold is inclusive',()=>{
  const five=['a','b','c','d','e'];
  assert.equal(scoreAttempt(five,{a:true,b:true,c:true,d:true,e:false}).passed,true);
  assert.equal(scoreAttempt(five,{a:true,b:true,c:true,d:false,e:false}).passed,false);
});
test('retakes keep latest, best, history and migrate old results',()=>{
  const old={grade:83,correct:5,gradedItems:6,passed:true,completedAt:1};
  const newer={grade:67,correct:4,gradedItems:6,passed:false,completedAt:2};
  const saved=saveAttempt(old,newer);
  assert.equal(saved.grade,67);assert.equal(saved.bestGrade,83);
  assert.equal(saved.attemptCount,2);assert.equal(saved.attemptHistory.length,2);
  assert.equal(saved.everPassed,true);assert.equal(bestResult(saved).grade,83);
  const third=saveAttempt(saved,{...old,grade:100,correct:6,completedAt:3});
  assert.equal(third.attemptCount,3);assert.equal(third.bestGrade,100);
  assert.equal(third.attemptHistory[0].completedAt,1);
});
test('unit and course use best attempts and weighted item totals',()=>{
  const [a,b]=curriculum[0].lessons;
  const progress={
    [a.id]:saveAttempt({grade:100,correct:6,gradedItems:6,passed:true},{grade:50,correct:3,gradedItems:6,passed:false}),
    [b.id]:{grade:50,correct:1,gradedItems:2,passed:false}
  };
  const unit=unitSummary(curriculum[0],progress);
  assert.equal(unit.grade,88);assert.equal(unit.lessons[0].latestGrade,50);
  assert.equal(unit.lessons[0].grade,100);assert.equal(unit.passed,false);
  assert.equal(curriculumSummary(curriculum,progress).grade,88);
});
test('legacy results without history remain usable',()=>{
  const legacy={grade:83,passed:true};
  assert.equal(bestResult(legacy).grade,83);
  assert.equal(saveAttempt(legacy,{grade:100}).attemptCount,2);
});
