import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:/A1 Curriculum/}).click();
  await page.getByRole('heading',{name:/Learn Spanish/}).waitFor();
  assert.equal(await page.locator('.curriculumtile').count(),4,'Four units visible');
  await page.locator('.curriculumtile').first().click();
  assert.equal(await page.locator('.curriculumlesson').count(),4,'Four lessons in first unit');
  await page.locator('.curriculumlesson').first().click();
  assert.match(await page.locator('.curriculumstepbar').innerText(),/Discover/);
  await page.getByRole('button',{name:/Continue/}).click();
  assert.match(await page.locator('.curriculumstepbar').innerText(),/Listen/);
  await page.getByRole('button',{name:/Continue/}).click();
  await page.getByText(/Answer correctly before continuing/).waitFor();
  await page.getByRole('button',{name:/Back to unit/}).click();
  await page.getByRole('button',{name:/All units/}).click();
  await page.reload({waitUntil:'networkidle'});
  await page.getByRole('button',{name:/A1 Curriculum/}).click();
  assert.equal(await page.locator('.curriculumtile').count(),4,'Units survive reload');
  assert.deepEqual(errors,[],'No browser JavaScript exceptions');
  console.log('Browser smoke test passed: load, 4 units, 4 lessons, navigation, answer gate, reload.');
}finally{await browser.close()}
