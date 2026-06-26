/**
 * Peptide store — order backend (Google Apps Script + Google Sheet).
 *
 * What it does:
 *   - Saves every order placed on the website into a Google Sheet (central database).
 *   - Lets customers look up their order from ANY device by order number.
 *   - You add a per-order tracking number in the "Tracking" column and the
 *     customer immediately sees it on the Track Order page.
 *
 * Deploy: see backend/README.md for click-by-click steps.
 *
 * Sheet columns (auto-created, row 1):
 *   A OrderID | B Date | C Name | D Email | E Phone | F Address |
 *   G Items | H Total | I Payment | J Status | K Tracking
 *
 * You edit columns J (Status) and K (Tracking) by hand to update customers.
 */

var SHEET_NAME = 'Orders';

// Save a new order (called by the website when a customer checks out).
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sh = getSheet();
    sh.appendRow([
      data.id || '',
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.addr || '',
      (data.items || []).join(' | '),
      data.total || '',
      data.pay || '',
      data.status || 'Awaiting payment',
      ''                       // Tracking — you fill this in later
    ]);
    return out({ ok: true }, e);
  } catch (err) {
    return out({ ok: false, error: String(err) }, e);
  }
}

// Look up an order by number (called by the Track Order page).
function doGet(e) {
  var order = (e.parameter.order || '').trim().replace('#', '');
  if (!order) return out({ found: false }, e);
  var rows = getSheet().getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).replace('#', '') === order) {
      return out({
        found: true,
        id: rows[i][0],
        date: rows[i][1],
        total: rows[i][7],
        status: rows[i][9] || 'Processing',
        tracking: rows[i][10] || '',
        items: String(rows[i][6] || '').split(' | ')
      }, e);
    }
  }
  return out({ found: false }, e);
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['OrderID','Date','Name','Email','Phone','Address','Items','Total','Payment','Status','Tracking']);
  }
  return sh;
}

// Returns JSON, or JSONP (wrapped) when a ?callback= is supplied — this lets
// the browser read the result without any CORS setup.
function out(obj, e) {
  var body = JSON.stringify(obj);
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + body + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}
