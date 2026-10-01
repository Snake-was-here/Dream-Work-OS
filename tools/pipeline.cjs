// Model-neutral, dependency-free planning. Does not write to Google or send anything.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname,'../integrations/google-sheets/Code.gs'),'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const canonicalURL = value => context.canonicalUrl_(value);
const normalize = value => context.normalize_(value);
const identity = row => normalize(row['Company / Person']) && normalize(row['Title / Problem']) ? normalize(row['Company / Person'])+'|'+normalize(row['Title / Problem']) : '';
function matches(a,b) {
  const url = canonicalURL(a['Source URL']);
  if(url && url===canonicalURL(b['Source URL'])) return true;
  if(identity(a) && identity(a)===identity(b)) return true;
  const desc=normalize(a['Short Description']);
  return desc.length>=40 && desc===normalize(b['Short Description']) && normalize(a.Source) && normalize(a.Source)===normalize(b.Source);
}
function plan(existing,candidates) {
  const working=existing.map(x=>({...x})), inserts=[], updates=[], review=[];
  for(const candidate of candidates) {
    if(!candidate['Source URL'] || !candidate['Company / Person'] || !candidate['Title / Problem'] || !candidate.Evidence) throw Error('Candidate missing source, company, title or evidence');
    const hits=working.filter(row=>matches(row,candidate));
    if(hits.length>1) {review.push({candidate,reason:'Ambiguous duplicate; resolve before write',ids:hits.map(x=>x['Opportunity ID'])});continue;}
    if(hits.length===1) {
      // Discovery refreshes verification only. Never overwrite human workflow/history.
      updates.push({'Opportunity ID':hits[0]['Opportunity ID'],'Last Verified':candidate['Last Verified'],Evidence:candidate.Evidence,Activity:candidate.Activity});
      continue;
    }
    const row={...candidate,'Opportunity ID':'OP-'+randomUUID(),'Canonical URL':canonicalURL(candidate['Source URL']),'Dedupe Key':canonicalURL(candidate['Source URL'])||identity(candidate),'My Decision':'UNREVIEWED',Status:'NEW'};
    inserts.push(row);working.push(row);
  }
  return {inserts,updates,review};
}
function validateLinks(opportunities,messages) {
  const errors=[],ids=new Set(),mids=new Set();
  for(const row of opportunities) {const id=row['Opportunity ID'];if(!id||ids.has(id))errors.push('Missing/repeated opportunity ID: '+id);ids.add(id);}
  for(const row of messages) {
    const id=row['Message ID'];if(!id||mids.has(id))errors.push('Missing/repeated message ID: '+id);mids.add(id);
    if(!ids.has(row['Opportunity ID']))errors.push('Orphan message: '+id);
    if(row.Status==='SENT'&&(row.Direction!=='OUTBOUND'||!row.Timestamp))errors.push('Invalid sent message: '+id);
    if(row.Status==='RECEIVED'&&(row.Direction!=='INBOUND'||!row.Timestamp))errors.push('Invalid inbound message: '+id);
  }
  return errors;
}
module.exports={canonicalURL,normalize,matches,plan,validateLinks};
if(require.main===module) {
  const [command,a,b]=process.argv.slice(2);
  if(!['plan','validate'].includes(command)||!a||!b) {console.error('Usage: node tools/pipeline.cjs plan existing.json candidates.json | validate opportunities.json messages.json');process.exit(2);}
  const left=JSON.parse(fs.readFileSync(a,'utf8').replace(/^\uFEFF/,'')),right=JSON.parse(fs.readFileSync(b,'utf8').replace(/^\uFEFF/,''));
  const result=command==='plan'?plan(left,right):validateLinks(left,right);
  console.log(JSON.stringify(result,null,2));
  if(command==='validate'&&result.length)process.exitCode=1;
}
