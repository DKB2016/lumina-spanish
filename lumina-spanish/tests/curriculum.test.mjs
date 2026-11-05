import assert from 'node:assert/strict';
import {curriculum} from '../src/curriculumData.js';
import {practiceBank} from '../src/practiceBank.js';
import {unitSummary,curriculumSummary,lessonBreakdown} from '../src/unitGrades.js';

assert.equal(curriculum.length,4);
const ids=new Set();
for(const unit of curriculum){
  assert(unit.lessons.length>=4,unit.id+' requires four lessons');
  for(const lesson of unit.lessons){
    assert(!ids.has(lesson.id),'Duplicate lesson '+lesson.id);ids.add(lesson.id);
    for(const field of ['title','dialogue','translation','writing','speaking','objective'])assert(lesson[field],lesson.id+' missing '+field);
    assert(lesson.phrases.length>=3,lesson.id+' insufficient phrases');
    assert.equal(lesson.sentence.tokens.join(' '),lesson.sentence.target,lesson.id+' invalid sentence tokens');
    for(const key of ['listening','reading']){
      const task=lesson[key];assert(task.options.length>=3,lesson.id+' '+key+' insufficient answers');
      assert(task.answer>=0&&task.answer<task.options.length,lesson.id+' '+key+' invalid answer');
    }
    for(const task of practiceBank[lesson.id]||[]){
      assert(task.options.length>=3,lesson.id+' invalid practice options');
      assert(task.answer>=0&&task.answer<task.options.length,lesson.id+' invalid practice answer');
    }
  }
}
const [first,second]=curriculum[0].lessons;
const sample={grade:83,correct:5,gradedItems:6,passed:true,itemScores:{'Listen-0':true,'Read-0':true,'Build-0':false,'Practice-0':true,'Practice-1':true,'Practice-2':true},practiceSkills:{'Practice-0':'Listening','Practice-1':'Usage','Practice-2':'Reading'}};
const progress={[first.id]:sample,[second.id]:{...sample,grade:67,correct:4,passed:false}};
const unit=unitSummary(curriculum[0],progress);
assert.equal(unit.gradedCount,2);assert.equal(unit.grade,75);assert.equal(unit.passed,false);
assert.equal(unit.skills['Sentence building'].grade,0);
assert.equal(unit.weakest[0].id,second.id);
assert.equal(unit.lessons[2].grade,null);
assert.equal(lessonBreakdown(sample).Listening.grade,100);
const course=curriculumSummary(curriculum,progress);
assert.equal(course.gradedLessons,2);assert.equal(course.grade,75);
assert.equal(unitSummary(curriculum[1],progress).grade,null);
console.log('Validated '+ids.size+' curriculum lessons and grade aggregation fixtures.');
