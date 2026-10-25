-- Include orders that do not have a warranty record yet.
CREATE OR REPLACE ALGORITHM=UNDEFINED SQL SECURITY DEFINER
VIEW ea_ordersnew_overview AS
SELECT
  o.uid_order,
  o.number,
  o.invoice_no,
  o.user_group,
  o.fork_model,
  o.fork_no,
  w.warranty_no,
  w.warranty_request,
  o.created_at,
  o.customer_address,
  o.customer_no,
  o.worksheet_no,
  o.diagnosis_no,
  o.order_status,
  o.fork_in_date,
  o.customer_client_name,
  o.costestimates_numbers,
  o.ftsearch
FROM ea_orders o
LEFT JOIN ea_warranty w ON w.uid_order = o.uid_order;
