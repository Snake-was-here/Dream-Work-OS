// Model-neutral, dependency-free planning. Does not write to Google or send anything.
const fs = require('node:fs');
const {randomUUID} = require('node:crypto');
function normalize_(value) {
  return String(value || '').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function canonicalUrl_(value) {
  // Deterministic, conservative URL identity; no network requests.
  const match = String(value || '').trim().match(/^(https?):\/\/([^/?#]+)([^?#]*)(?:\?([^#]*))?(?:#.*)?$/i);
  if (!match) return '';
  const protocol = match[1].toLowerCase();
  const host = match[2].toLowerCase().replace(protocol === 'https' ? /:443$/ : /:80$/, '');
  const path = (match[3] || '').replace(/\/+$/, '') || '';
  const query = (match[4] || '').split('&').filter(Boolean).filter(function (pair) {
    const key = pair.split('=')[0].toLowerCase();
    return !/^utm_/.test(key) && !['fbclid', 'gclid'].includes(key);
  }).sort().join('&');
  return protocol + '://' + host + path + (query ? '?' + query : '');
}


const canonicalURL = canonicalUrl_;
const normalize = normalize_;
const identity = row => normalize(row['Company / Person']) && normalize(row['Title / Problem']) ? normalize(row['Company / Person'])+'|'+normalize(row['Title / Problem']) : '';
function matches(a,b) {
  const url = canonicalURL(a['Source URL']);
  if(url && url===canonicalURL(b['Source URL'])) return true;
  if(identity(a) && identity(a)===identity(b)) return true;
  const desc=normalize(a['Short Description']);
  return desc.length>=40 && desc===normalize(b['Short Description']) && normalize(a['Company / Person']) && normalize(a['Company / Person'])===normalize(b['Company / Person']) && normalize(a.Source)===normalize(b.Source);
}
function plan(existing,candidates) {
  const working=existing.map(x=>({...x})), inserts=[], updates=[], review=[];
  for(const candidate of candidates) {
    if(!candidate['Source URL'] || !candidate['Company / Person'] || !candidate['Title / Problem'] || !candidate.Evidence) throw Error('Candidate missing source, company, title or evidence');
    const hits=working.filter(row=>matches(row,candidate));
    if(hits.length>1) {review.push({candidate,reason:'Ambiguous duplicate; resolve before write',ids:hits.map(x=>x['Opportunity ID'])});continue;}
    if(hits.length===1) {
      const sameURL=canonicalURL(candidate['Source URL'])===canonicalURL(hits[0]['Source URL']);
      const sameBrief=normalize(candidate['Short Description']).length>=40 && normalize(candidate['Short Description'])===normalize(hits[0]['Short Description']);
      if(!sameURL&&!sameBrief){review.push({candidate,reason:'Possible cross-post or distinct role; compare original sources before merging',ids:[hits[0]['Opportunity ID']]});continue;}
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
