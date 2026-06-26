# Order backend — setup (about 5 minutes, free)

This gives your store a real central database so customers can track orders
from any device and you can assign each order its own tracking number.

## 1. Create the Google Sheet
1. Go to **https://sheets.google.com** and create a **Blank** spreadsheet.
2. Name it something like **Peptide Orders**.

## 2. Add the script
1. In the sheet, click **Extensions → Apps Script**.
2. Delete whatever code is in the editor.
3. Open `backend/Code.gs` from this repo, copy ALL of it, and paste it in.
4. Click the **Save** icon.

## 3. Deploy it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear icon → choose **Web app**.
3. Set:
   - **Description:** orders
   - **Execute as:** Me
   - **Who has access:** **Anyone**
4. Click **Deploy**, then **Authorize access** and allow the permissions
   (it's your own script accessing your own sheet).
5. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfy....../exec`

## 4. Connect it to the website
1. Open `index.html`, find this line near the top of the script:
   ```js
   const BACKEND_URL = '';
   ```
2. Paste your Web app URL between the quotes and save:
   ```js
   const BACKEND_URL = 'https://script.google.com/macros/s/AKfy....../exec';
   ```
3. Commit/publish (or send it to me and I'll set it).

## How you use it day to day
- Every order a customer places appears as a new row in the **Orders** tab.
- To give an order tracking: type the tracking number into the **Tracking**
  column (K) for that row. The customer sees it instantly on **Track Order**.
- To update progress: change the **Status** column (J) — e.g. `Shipped`,
  `Delivered`. The customer sees the new status when they look up their order.

## Notes
- The order number the customer enters (e.g. `#1001`) matches column A.
- If you ever redeploy with code changes, use **Deploy → Manage deployments →
  Edit → New version** so the URL stays the same.
