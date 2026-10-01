const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.join(__dirname, '../integrations/google-sheets/Code.gs'), 'utf8');

const OH = ['Opportunity ID', 'Company / Person', 'Title / Problem', 'Opportunity Type', 'Match Score', 'Why I Match', 'Potential Gaps', 'My Decision', 'Status', 'Next Action', 'Next Follow-up At', 'Source URL', 'Date Found', 'Date Posted', 'Last Verified', 'Source', 'Short Description', 'Location', 'Remote?', 'Compensation', 'Compensation Type', 'Ongoing?', 'Contact Method', 'Contact', 'Application URL', 'Relevant Portfolio Work', 'Sent At', 'Last Reply At', 'Notes', 'Canonical URL', 'Dedupe Key', 'Evidence', 'Activity', 'Positive Reply At', 'Call At', 'Paid Trial At', 'Accepted At'];
const MH = ['Message ID', 'Opportunity ID', 'Timestamp', 'Direction', 'Message Type', 'Channel', 'From', 'To', 'Subject', 'Message', 'Status', 'Notes', 'Reply Outcome'];

function fixture(opportunities = [], messages = [], headers = OH) {
  let serial = 0;
  const book = { getSheetByName: name => sheets[name] };
  const sheets = {};
  function make(name, h, rows) {
    const data = [h, ...rows.map(o => h.map(k => o[k] ?? ''))];
    const sheet = {
      data, writes: [], getName: () => name, getParent: () => book,
      getDataRange: () => ({ getValues: () => data.map(row => [...row]) }),
      getRange: (r, c) => ({ setValue: value => { data[r - 1][c - 1] = value; sheet.writes.push({ r, c, value }); } })
    };
    sheets[name] = sheet;
    return sheet;
  }
  make('OPPORTUNITIES', headers, opportunities);
  make('MESSAGES', MH, messages);
  let acquired = 0, released = 0;
  const context = vm.createContext({
    Date, Set, Number, String, Object, Array, Infinity,
    Utilities: { getUuid: () => `00000000-0000-4000-8000-${String(++serial).padStart(12, '0')}` },
    SpreadsheetApp: { getActiveSpreadsheet: () => book },
    LockService: { getDocumentLock: () => ({ tryLock: () => { acquired++; return true; }, releaseLock: () => { released++; } }) }
  });
  vm.runInContext(script, context);
  return {
    context, sheets,
    value: (name, row, key) => sheets[name].data[row - 1][sheets[name].data[0].indexOf(key)],
    set: (name, row, key, v) => { sheets[name].data[row - 1][sheets[name].data[0].indexOf(key)] = v; },
    edit: (name, row, count = 1) => context.onEdit({ source: book, range: { getSheet: () => sheets[name], getRow: () => row, getNumRows: () => count } }),
    locks: () => ({ acquired, released })
  };
}

test('manual SENT uses a static Date, preserves existing first send and human decision', () => {
  const f = fixture([{ Status: 'SENT', 'My Decision': 'YES', 'Company / Person': 'Acme' }]);
  f.edit('OPPORTUNITIES', 2);
  const first = f.value('OPPORTUNITIES', 2, 'Sent At');
  const id = f.value('OPPORTUNITIES', 2, 'Opportunity ID');
  assert.ok(first instanceof Date);
  assert.match(id, /^OP-/);
  f.set('OPPORTUNITIES', 2, 'Status', 'DRAFTED');
  f.edit('OPPORTUNITIES', 2);
  f.set('OPPORTUNITIES', 2, 'Status', 'SENT');
  f.edit('OPPORTUNITIES', 2);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Sent At'), first);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Opportunity ID'), id);
  assert.equal(f.value('OPPORTUNITIES', 2, 'My Decision'), 'YES');
  assert.deepEqual(f.locks(), { acquired: 3, released: 3 });
});

test('multi-row paste with reordered headers handles every row, preserves imported dates', () => {
  const historical = new Date('2026-09-20T09:00:00Z');
  const f = fixture([{ Status: 'SENT' }, { Status: 'SENT', 'Sent At': historical }, { Status: 'NEW' }], [], [...OH].reverse());
  f.edit('OPPORTUNITIES', 2, 3);
  assert.ok(f.value('OPPORTUNITIES', 2, 'Sent At') instanceof Date);
  assert.equal(f.value('OPPORTUNITIES', 3, 'Sent At'), historical);
  assert.equal(f.value('OPPORTUNITIES', 4, 'Sent At'), '');
  const ids = [2, 3, 4].map(r => f.value('OPPORTUNITIES', r, 'Opportunity ID'));
  assert.equal(new Set(ids).size, 3);
});

test('duplicates are visibly flagged without deletion or overwriting user notes', () => {
  const f = fixture([
    { 'Source URL': 'https://EXAMPLE.com/jobs/7/?utm_source=mail', Notes: 'Keep this note' },
    { 'Source URL': 'https://example.com/jobs/7' },
    { 'Company / Person': 'Foundry, Inc.', 'Title / Problem': 'Automate research' },
    { 'Company / Person': 'foundry inc', 'Title / Problem': 'Automate Research!' }
  ]);
  f.edit('OPPORTUNITIES', 2, 4);
  assert.equal(f.sheets.OPPORTUNITIES.data.length, 5);
  for (const r of [2, 3, 4, 5]) assert.match(f.value('OPPORTUNITIES', r, 'Notes'), /Possible duplicate/);
  assert.match(f.value('OPPORTUNITIES', 2, 'Notes'), /Keep this note/);
  f.set('OPPORTUNITIES', 3, 'Source URL', 'https://example.com/jobs/8');
  f.edit('OPPORTUNITIES', 3);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Notes'), 'Keep this note');
  assert.equal(f.value('OPPORTUNITIES', 3, 'Notes'), '');
});

test('draft messages get permanent IDs but no communication timestamp or pipeline milestone', () => {
  const f = fixture([{ 'Opportunity ID': 'OP-a', Status: 'APPROVED' }], [{ 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'DRAFT', Message: 'Draft' }]);
  f.edit('MESSAGES', 2);
  assert.match(f.value('MESSAGES', 2, 'Message ID'), /^MSG-/);
  assert.equal(f.value('MESSAGES', 2, 'Timestamp'), '');
  assert.equal(f.value('OPPORTUNITIES', 2, 'Sent At'), '');
  assert.equal(f.value('OPPORTUNITIES', 2, 'Status'), 'APPROVED');
});

test('sent and received rows link messages, record milestones and never rewrite decisions', () => {
  const sent = new Date('2026-09-25T10:00:00Z'), reply = new Date('2026-09-26T11:00:00Z');
  const f = fixture([{ 'Opportunity ID': 'OP-a', Status: 'DRAFTED', 'My Decision': 'YES' }], [
    { 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'SENT', Timestamp: sent },
    { 'Opportunity ID': 'OP-a', Direction: 'INBOUND', Status: 'RECEIVED', Timestamp: reply, 'Reply Outcome': 'POSITIVE' }
  ]);
  f.edit('MESSAGES', 2, 2);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Sent At'), sent);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Last Reply At'), reply);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Positive Reply At'), reply);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Status'), 'NEEDS RESPONSE');
  assert.equal(f.value('OPPORTUNITIES', 2, 'My Decision'), 'YES');
  f.set('OPPORTUNITIES', 2, 'Status', 'INTERVIEW / CALL');
  f.context.reconcilePipeline();
  assert.equal(f.value('OPPORTUNITIES', 2, 'Status'), 'INTERVIEW / CALL');
  assert.equal(f.sheets.MESSAGES.data.length, 3);
});

test('orphan and ambiguous opportunity links are visible and cannot alter an opportunity', () => {
  const f = fixture([{ 'Opportunity ID': 'OP-a' }, { 'Opportunity ID': 'OP-a' }], [
    { 'Opportunity ID': 'missing', Direction: 'INBOUND', Status: 'RECEIVED' },
    { 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'SENT' }
  ]);
  f.edit('MESSAGES', 2, 2);
  assert.match(f.value('MESSAGES', 2, 'Notes'), /Unlinked message/);
  assert.match(f.value('MESSAGES', 3, 'Notes'), /Ambiguous Opportunity ID/);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Sent At'), '');
  assert.equal(f.value('OPPORTUNITIES', 3, 'Sent At'), '');
});

test('milestones are first-change static dates and generic trials do not imply paid work', () => {
  const f = fixture([{ Status: 'TRIAL / TEST' }, { Status: 'PAID TRIAL' }, { Status: 'ACCEPTED' }, { Status: 'INTERVIEW / CALL' }]);
  f.edit('OPPORTUNITIES', 2, 4);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Paid Trial At'), '');
  for (const [r, key] of [[3, 'Paid Trial At'], [4, 'Accepted At'], [5, 'Call At']]) {
    const first = f.value('OPPORTUNITIES', r, key);
    assert.ok(first instanceof Date);
    f.edit('OPPORTUNITIES', r);
    assert.equal(f.value('OPPORTUNITIES', r, key), first);
  }
});

test('reconciliation uses supplied conversation dates before adding missing opportunity dates', () => {
  const early = new Date('2026-08-01T10:00:00Z'), late = new Date('2026-08-05T10:00:00Z');
  const f = fixture([{ 'Opportunity ID': 'OP-a', Status: 'SENT' }], [
    { 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'SENT', Timestamp: late },
    { 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'SENT', Timestamp: early }
  ]);
  f.context.reconcilePipeline();
  assert.equal(f.value('OPPORTUNITIES', 2, 'Sent At'), early);
  const writes = f.sheets.OPPORTUNITIES.writes.length + f.sheets.MESSAGES.writes.length;
  f.context.reconcilePipeline();
  assert.equal(f.sheets.OPPORTUNITIES.writes.length + f.sheets.MESSAGES.writes.length, writes);
});

test('header-only edit is harmless; invalid timestamps and direction mismatch do not fabricate replies', () => {
  const f = fixture([{ 'Opportunity ID': 'OP-a', Status: 'SENT' }], [
    { 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'RECEIVED' },
    { 'Opportunity ID': 'OP-a', Direction: 'INBOUND', Status: 'RECEIVED', Timestamp: 'nonsense' }
  ]);
  f.edit('OPPORTUNITIES', 1);
  assert.equal(f.sheets.OPPORTUNITIES.writes.length, 0);
  f.edit('MESSAGES', 2, 2);
  assert.match(f.value('MESSAGES', 2, 'Notes'), /disagree/);
  assert.match(f.value('MESSAGES', 3, 'Notes'), /Invalid Timestamp/);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Last Reply At'), '');
});

test('script has no outbound, network or deletion capabilities; optional installation is isolated', () => {
  assert.doesNotMatch(script, /\b(?:MailApp|GmailApp|UrlFetchApp|sendEmail|deleteRow|deleteRows|deleteTrigger)\b/);
  assert.equal((script.match(/newTrigger\(/g) || []).length, 1);
});

test('explicit standalone installer is sheet-specific and idempotent, preserves unrelated triggers', () => {
  const f = fixture();
  const id = '1J_UqraPqJTLDcC0UDRz9Jb2F71aQ_DRo_m_JWA417CQ';
  const trigger = (handler, source, event) => ({ getHandlerFunction: () => handler, getTriggerSourceId: () => source, getEventType: () => event });
  const existing = [trigger('otherHandler', 'other-sheet', 'ON_EDIT')];
  let created = 0;
  f.context.SpreadsheetApp.openById = got => { assert.equal(got, id); return { marker: id }; };
  f.context.ScriptApp = {
    EventType: { ON_EDIT: 'ON_EDIT' }, getProjectTriggers: () => existing,
    newTrigger: handler => ({ forSpreadsheet: book => {
      assert.equal(book.marker, id);
      return { onEdit: () => ({ create: () => { created++; existing.push(trigger(handler, id, 'ON_EDIT')); } }) };
    } })
  };
  assert.equal(f.context.installForSpreadsheet(), 'Edit trigger installed.');
  assert.equal(f.context.installForSpreadsheet(), 'Edit trigger already installed.');
  assert.equal(created, 1);
  assert.equal(existing.length, 2);
});

test('standalone reconcile uses explicit spreadsheet ID and script lock when no bound context exists', () => {
  const f = fixture([{ Status: 'NEW' }]);
  f.context.SpreadsheetApp.getActiveSpreadsheet = () => null;
  f.context.SpreadsheetApp.openById = () => ({ getSheetByName: name => f.sheets[name] });
  let released = false;
  f.context.LockService.getDocumentLock = () => null;
  f.context.LockService.getScriptLock = () => ({ tryLock: () => true, releaseLock: () => { released = true; } });
  f.context.reconcilePipeline();
  assert.match(f.value('OPPORTUNITIES', 2, 'Opportunity ID'), /^OP-/);
  assert.equal(released, true);
});

test('copied message IDs are flagged and do not establish send milestones', () => {
  const f = fixture([{ 'Opportunity ID': 'OP-a', Status: 'APPROVED' }], [
    { 'Message ID': 'MSG-copied', 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'SENT' },
    { 'Message ID': 'MSG-copied', 'Opportunity ID': 'OP-a', Direction: 'OUTBOUND', Status: 'SENT' }
  ]);
  f.edit('MESSAGES', 2, 2);
  assert.match(f.value('MESSAGES', 2, 'Notes'), /Repeated Message ID/);
  assert.match(f.value('MESSAGES', 3, 'Notes'), /Repeated Message ID/);
  assert.equal(f.value('OPPORTUNITIES', 2, 'Sent At'), '');
});
