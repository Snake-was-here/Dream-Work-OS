/** Dream Work OS: bound, local-only Google Sheets assistance. No sending APIs. */
const DWOS = Object.freeze({
  opportunities: 'OPPORTUNITIES', messages: 'MESSAGES',
  spreadsheetId: '1J_UqraPqJTLDcC0UDRz9Jb2F71aQ_DRo_m_JWA417CQ',
  terminal: ['ACCEPTED', 'REJECTED', 'NO RESPONSE', 'CLOSED', 'DO NOT CONTACT'],
  warningPrefix: '[DWOS WARNING] '
});

/** OPTIONAL standalone fallback only. Bound scripts need no installed trigger.
 * Run explicitly from the Apps Script editor and approve Google's permissions.
 * Installs one spreadsheet-specific edit trigger; no sending or scheduled work.
 */
function installForSpreadsheet() {
  const book = SpreadsheetApp.openById(DWOS.spreadsheetId);
  const exists = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === 'onEdit' &&
      trigger.getTriggerSourceId() === DWOS.spreadsheetId &&
      trigger.getEventType() === ScriptApp.EventType.ON_EDIT;
  });
  if (!exists) ScriptApp.newTrigger('onEdit').forSpreadsheet(book).onEdit().create();
  return exists ? 'Edit trigger already installed.' : 'Edit trigger installed.';
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Dream Work OS')
    .addItem('Reconcile IDs, links and timestamps', 'reconcilePipeline').addToUi();
}

function onEdit(e) {
  if (!e || !e.range) return;
  const name = e.range.getSheet().getName();
  if (![DWOS.opportunities, DWOS.messages].includes(name)) return;
  withPipelineLock_(function () {
    const book = e.source || e.range.getSheet().getParent();
    const opp = table_(book.getSheetByName(DWOS.opportunities));
    const msg = table_(book.getSheetByName(DWOS.messages));
    const first = Math.max(2, e.range.getRow());
    const last = Math.min(e.range.getRow() + e.range.getNumRows() - 1,
      name === DWOS.opportunities ? opp.rows.length + 1 : msg.rows.length + 1);
    const now = new Date();
    // Header edits never process the whole table or rewrite user rows.
    if (e.range.getRow() === 1 && e.range.getNumRows() === 1) return;
    if (name === DWOS.opportunities) {
      for (let r = first; r <= last; r++) processOpportunity_(opp, r, now);
      refreshDuplicateWarnings_(opp);
    } else {
      // Opportunity IDs may need repair before a newly pasted message is linked.
      for (let r = 2; r <= opp.rows.length + 1; r++) ensureId_(opp, r, 'Opportunity ID', 'OP-');
      for (let r = first; r <= last; r++) processMessage_(opp, msg, r, now);
    }
  });
}

/** Explicit repair after connector/API imports (Google does not fire onEdit for those).
 * Missing send/receive dates are reconciliation time, not invented historical dates.
 * Preserve provided historical timestamps and provide them on imports when known.
 */
function reconcilePipeline() {
  withPipelineLock_(function () {
    const book = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(DWOS.spreadsheetId);
    const opp = table_(book.getSheetByName(DWOS.opportunities));
    const msg = table_(book.getSheetByName(DWOS.messages));
    const now = new Date();
    for (let r = 2; r <= opp.rows.length + 1; r++) ensureId_(opp, r, 'Opportunity ID', 'OP-');
    // Order by actual event time so first-send/first-milestone values are correct
    // for imported conversations. Physical message order is never changed.
    const order = msg.rows.map(function (_, i) { return i + 2; });
    order.sort(function (a, b) {
      return dateValue_(get_(msg, a, 'Timestamp')) - dateValue_(get_(msg, b, 'Timestamp'));
    });
    order.forEach(function (r) { processMessage_(opp, msg, r, now, true); });
    // Let historical message timestamps establish Sent At before filling missing
    // milestones from manually entered opportunity states.
    for (let r = 2; r <= opp.rows.length + 1; r++) processOpportunity_(opp, r, now, true);
    refreshDuplicateWarnings_(opp);
  });
}

function withPipelineLock_(fn) {
  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    throw new Error('Another pipeline update is running. Retry with the Dream Work OS reconcile menu.');
  }
  try { fn(); } finally { lock.releaseLock(); }
}

function table_(sheet) {
  if (!sheet) throw new Error('Expected OPPORTUNITIES and MESSAGES tabs.');
  const data = sheet.getDataRange().getValues();
  const headers = {};
  (data[0] || []).forEach(function (name, i) {
    const key = String(name).trim();
    if (key) {
      if (headers[key] !== undefined) throw new Error('Duplicate header: ' + key);
      headers[key] = i;
    }
  });
  const required = sheet.getName() === DWOS.opportunities
    ? ['Opportunity ID', 'Status', 'Sent At', 'Notes', 'Source URL', 'Company / Person', 'Title / Problem', 'Canonical URL', 'Dedupe Key']
    : ['Message ID', 'Opportunity ID', 'Timestamp', 'Direction', 'Status', 'Notes', 'Message', 'Reply Outcome'];
  required.forEach(function (key) {
    if (headers[key] === undefined) throw new Error(sheet.getName() + ': missing header ' + key);
  });
  return { sheet: sheet, headers: headers, rows: data.slice(1) };
}

function get_(t, r, key) {
  return t.headers[key] === undefined ? '' : (t.rows[r - 2] || [])[t.headers[key]];
}

function put_(t, r, key, value) {
  const col = t.headers[key];
  if (col === undefined) return;
  const old = get_(t, r, key);
  if (String(old) === String(value)) return;
  t.sheet.getRange(r, col + 1).setValue(value);
  t.rows[r - 2][col] = value;
}

function hasData_(t, r) {
  return (t.rows[r - 2] || []).some(function (v, i) {
    // Formula-generated empty strings are empty; IDs alone are valid existing rows.
    return v !== '' && v !== null && v !== undefined;
  });
}

function ensureId_(t, r, header, prefix) {
  if (hasData_(t, r) && !get_(t, r, header)) put_(t, r, header, prefix + Utilities.getUuid());
}

function stampFirst_(t, r, key, timestamp) {
  if (!get_(t, r, key)) put_(t, r, key, timestamp);
}

function processOpportunity_(t, r, now, reconciled) {
  if (!hasData_(t, r)) return;
  ensureId_(t, r, 'Opportunity ID', 'OP-');
  const canonical = canonicalUrl_(get_(t, r, 'Source URL'));
  put_(t, r, 'Canonical URL', canonical);
  const key = [normalize_(get_(t, r, 'Company / Person')), normalize_(get_(t, r, 'Title / Problem'))].join('|');
  put_(t, r, 'Dedupe Key', canonical || (key !== '|' ? key : ''));
  const status = String(get_(t, r, 'Status')).trim().toUpperCase();
  if (status === 'SENT' && !get_(t, r, 'Sent At')) {
    stampFirst_(t, r, 'Sent At', now);
    if (reconciled) appendNote_(t, r, '[DWOS] Missing Sent At set to reconciliation time; verify historical date.');
  }
  const milestone = { 'INTERVIEW / CALL': 'Call At', 'PAID TRIAL': 'Paid Trial At', 'ACCEPTED': 'Accepted At' }[status];
  if (milestone && !get_(t, r, milestone)) {
    stampFirst_(t, r, milestone, now);
    if (reconciled) appendNote_(t, r, '[DWOS] Missing ' + milestone + ' set to reconciliation time; verify historical date.');
  }
}

function processMessage_(opp, msg, r, now, reconciled) {
  if (!hasData_(msg, r)) return;
  ensureId_(msg, r, 'Message ID', 'MSG-');
  const id = String(get_(msg, r, 'Opportunity ID')).trim();
  const matches = [];
  opp.rows.forEach(function (_, i) {
    if (String(get_(opp, i + 2, 'Opportunity ID')).trim() === id && id) matches.push(i + 2);
  });
  const warnings = [];
  const messageId = String(get_(msg, r, 'Message ID')).trim();
  const duplicateMessageId = msg.rows.filter(function (_, i) {
    return String(get_(msg, i + 2, 'Message ID')).trim() === messageId;
  }).length > 1;
  if (duplicateMessageId) warnings.push('Repeated Message ID; review the copied row before reconciliation.');
  if (matches.length !== 1) warnings.push(matches.length ? 'Ambiguous Opportunity ID: ' + id : 'Unlinked message: provide an existing Opportunity ID.');
  const direction = String(get_(msg, r, 'Direction')).trim().toUpperCase();
  const status = String(get_(msg, r, 'Status')).trim().toUpperCase();
  const actual = direction === 'OUTBOUND' && status === 'SENT' || direction === 'INBOUND' && status === 'RECEIVED';
  if ((status === 'SENT' && direction !== 'OUTBOUND') || (status === 'RECEIVED' && direction !== 'INBOUND')) warnings.push('Direction and message status disagree.');
  if (!actual) {
    setWarnings_(msg, r, warnings);
    return; // Drafts and void rows cannot create communication milestones.
  }
  if (!get_(msg, r, 'Timestamp')) {
    put_(msg, r, 'Timestamp', now);
    if (reconciled) appendNote_(msg, r, '[DWOS] Missing Timestamp set to reconciliation time; verify historical date.');
  }
  const timestamp = get_(msg, r, 'Timestamp');
  if (!isFiniteDate_(timestamp)) warnings.push('Invalid Timestamp; use a real date/time.');
  setWarnings_(msg, r, warnings);
  if (matches.length !== 1 || duplicateMessageId || !isFiniteDate_(timestamp)) return;
  const target = matches[0];
  const current = String(get_(opp, target, 'Status')).trim().toUpperCase();
  if (direction === 'OUTBOUND') {
    stampFirst_(opp, target, 'Sent At', timestamp);
    if (['NEW', 'REVIEW', 'APPROVED', 'DRAFTED', ''].includes(current)) put_(opp, target, 'Status', 'SENT');
  } else {
    const last = get_(opp, target, 'Last Reply At');
    const newReply = !last || dateValue_(timestamp) > dateValue_(last);
    if (newReply) put_(opp, target, 'Last Reply At', timestamp);
    if (String(get_(msg, r, 'Reply Outcome')).trim().toUpperCase() === 'POSITIVE') stampFirst_(opp, target, 'Positive Reply At', timestamp);
    // Reprocessing old replies must not rewind later human pipeline stages.
    if (newReply && ['', 'NEW', 'REVIEW', 'APPROVED', 'DRAFTED', 'SENT', 'REPLIED', 'FOLLOW-UP DUE', 'NEEDS RESPONSE'].includes(current)) {
      put_(opp, target, 'Status', 'NEEDS RESPONSE');
    }
  }
}

function refreshDuplicateWarnings_(t) {
  const urlIndex = {}, identityIndex = {}, descriptionIndex = {}, idIndex = {};
  const rowKeys = {};
  function add(index, key, row) { if (key) (index[key] || (index[key] = [])).push(row); }
  t.rows.forEach(function (_, i) {
    const r = i + 2;
    if (!hasData_(t, r)) return;
    const url = canonicalUrl_(get_(t, r, 'Source URL'));
    add(urlIndex, url, r);
    const company = normalize_(get_(t, r, 'Company / Person'));
    const title = normalize_(get_(t, r, 'Title / Problem'));
    const identity = company && title ? company + '|' + title : '';
    if (identity) add(identityIndex, identity, r);
    const source = normalize_(get_(t, r, 'Source'));
    const description = normalize_(get_(t, r, 'Short Description'));
    const descriptionKey = source && description.length >= 40 ? source + '|' + description : '';
    if (descriptionKey) add(descriptionIndex, descriptionKey, r);
    rowKeys[r] = [url, identity, descriptionKey];
    add(idIndex, String(get_(t, r, 'Opportunity ID')).trim(), r);
  });
  t.rows.forEach(function (_, i) {
    const r = i + 2;
    if (!hasData_(t, r)) return;
    const duplicateRows = new Set();
    [urlIndex, identityIndex, descriptionIndex].forEach(function (index, i) {
      const rows = index[rowKeys[r][i]] || [];
      if (rows.length > 1) rows.forEach(function (other) { if (other !== r) duplicateRows.add(other); });
    });
    const warnings = [];
    if (duplicateRows.size) warnings.push('Possible duplicate of opportunity row(s) ' + Array.from(duplicateRows).sort(function (a, b) { return a - b; }).join(', ') + '; review before contacting.');
    const ids = idIndex[String(get_(t, r, 'Opportunity ID')).trim()] || [];
    if (ids.length > 1) warnings.push('Repeated Opportunity ID; message linking is ambiguous. Preserve the original ID and review the copied row.');
    setWarnings_(t, r, warnings);
  });
}

function setWarnings_(t, r, warnings) {
  const clean = String(get_(t, r, 'Notes') || '').split('\n').filter(function (line) {
    return !line.startsWith(DWOS.warningPrefix);
  });
  warnings.forEach(function (warning) { clean.push(DWOS.warningPrefix + warning); });
  put_(t, r, 'Notes', clean.filter(function (line) { return line !== ''; }).join('\n'));
}

function appendNote_(t, r, note) {
  const notes = String(get_(t, r, 'Notes') || '');
  if (!notes.split('\n').includes(note)) put_(t, r, 'Notes', notes ? notes + '\n' + note : note);
}

function normalize_(value) {
  return String(value || '').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function canonicalUrl_(value) {
  // Apps Script has no browser URL API. Parse without fetching anything.
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

function dateValue_(value) {
  if (value === '' || value === null || value === undefined) return Infinity;
  const date = value instanceof Date ? value : new Date(value);
  return date.getTime();
}

function isFiniteDate_(value) { return Number.isFinite(dateValue_(value)); }
