const {test}=require('node:test');
const assert=require('node:assert/strict');
const {plan,canonicalURL,validateLinks}=require('../tools/pipeline.cjs');
const candidate={'Source URL':'https://example.com/jobs?id=42&utm_source=x','Company / Person':'Example','Title / Problem':'Build internal tools','Short Description':'A substantial description of workflow automation work','Source':'Company careers',Evidence:'Original open, date unknown',Activity:'UNCERTAIN','Last Verified':'2026-10-01'};
test('repeat discovery and tracking variants preserve identity and human fields',()=>{
 const first=plan([], [candidate]);const original={...first.inserts[0],'My Decision':'YES',Status:'SENT','Sent At':'2026-09-30'};
 const next=plan([original],[{...candidate,'Source URL':'https://example.com/jobs?utm_source=y&id=42'}]);
 assert.equal(next.inserts.length,0);assert.equal(next.updates[0]['Opportunity ID'],original['Opportunity ID']);
 assert.deepEqual(Object.keys(next.updates[0]).sort(),['Activity','Evidence','Last Verified','Opportunity ID'].sort());
});
test('two copies in a batch create only one row and unique IDs for distinct jobs',()=>{
 const batch=plan([], [candidate,candidate,{...candidate,'Source URL':'https://example.com/jobs?id=43','Title / Problem':'Build websites','Short Description':'Different brief'}]);
 assert.equal(batch.inserts.length,2);assert.notEqual(batch.inserts[0]['Opportunity ID'],batch.inserts[1]['Opportunity ID']);
});
test('cross-source identity match and ambiguous duplicates require review',()=>{
 const existing=plan([], [candidate]).inserts;
 assert.equal(plan(existing,[{...candidate,'Source URL':'https://another.com/42'}]).inserts.length,0);
 assert.equal(plan([...existing,{...existing[0],'Opportunity ID':'OP-other'}],[candidate]).review.length,1);
});
test('semantic query IDs are preserved',()=>{
 assert.notEqual(canonicalURL('https://example.com/jobs?id=42'),canonicalURL('https://example.com/jobs?id=43'));
 assert.equal(canonicalURL('https://example.com/jobs?ref=42'), 'https://example.com/jobs?ref=42');
});
test('orphan and reused message IDs fail validation',()=>{
 const opp=plan([], [candidate]).inserts; const id=opp[0]['Opportunity ID'];
 assert.deepEqual(validateLinks(opp,[{'Message ID':'MSG-a','Opportunity ID':id,Status:'DRAFT',Direction:'OUTBOUND'}]),[]);
 assert.equal(validateLinks(opp,[{'Message ID':'MSG-a','Opportunity ID':'OP-missing'}]).length,1);
});
