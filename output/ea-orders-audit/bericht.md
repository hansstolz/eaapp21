# Prüfung von ea_orders – 20.10.2026

Geprüft: aktueller Quellcode von eaapp2.1 (`app/`, `lib/`), Templates-Dienst (`/Users/go/nextjs/templates/src`), Prisma-Schema sowie Metadaten und Spaltenbelegung der lokal konfigurierten Datenbank `ef`. Keine Änderungen an Tabellen oder Anwendungslogik vorgenommen.

## Ergebnis

84 Spalten, 39.634 Zeilen. Gemeldete Allokation: ca. 36,6 MiB Daten und 11,2 MiB Indizes. Das ist keine Schätzung der durch einzelne Spalten freisetzbaren Kapazität.

- **7 erste Streichkandidaten:** keine fachliche Verwendung und keine View-Abhängigkeit gefunden; in allen Datensätzen leer/NULL/0.
- **30 weitere Streichkandidaten mit historischen Daten:** keine aktive fachliche Nutzung der entsprechenden ea_orders-Spalte im geprüften Code gefunden. Gleichnamige Felder anderer Tabellen sind teilweise aktiv! Historische Inhalte vor Entfernung archivieren oder fachlich zuordnen.
- **5 Felder nach vorherigem Umbau prüfbar:** noch Schreibzugriffe oder View-Abhängigkeiten.
- **42 Felder vorerst behalten:** aktuelle Verwendung oder bestehende Verknüpfung/Suchstruktur.

„Streichkandidat“ bedeutet nicht, dass ein DROP COLUMN sofort sicher ist. Die Anwendung lädt ea_orders häufig vollständig über Prisma. Für jede Entfernung müssen Prisma-Modell, generierter Client, EaOrder-Typ und gegebenenfalls ORDER_UPDATE_FIELDS gemeinsam angepasst werden. Allgemeine Update-Freigaben sind keine fachliche Nutzung, lassen aber externe Aufrufer zu.

## Grenzen

Die Prüfung gilt für den verfügbaren Code und die lokale Datenbank. Andere Anwendungen, ältere Deployments, die produktive Datenbank und externe SQL-Verbraucher sind nicht erfasst. In den sichtbaren lokalen Metadaten: 21 Views, keine Trigger/Routinen/Events, keine deklarierten Fremdschlüssel für ea_orders (nur Primärschlüssel); logische Beziehungen bestehen dennoch. Keine personenbezogenen Inhalte wurden exportiert, nur Belegungszahlen.

Belegung zählt Werte außer NULL, Leerstring, 0, 0.00 und Null-Datum; sie ist keine semantische Validierung. Referenzsuche dient als Suchindex und enthält auch Typen, Kommentare und Treffer anderer Tabellen; die Gruppen unten berücksichtigen die Tabellenzuordnung. View-Abhängigkeiten sind auf die tatsächliche ea_orders-Quelle eingeschränkt.

## 1. Erste Streichkandidaten

| Spalte | Belegte Zeilen | Views mit Zugriff auf ea_orders-Spalte |
|---|---:|---|
| `notes_invoice_extern` | 0 | – |
| `printstatus_articlesales` | 0 | – |
| `reason_air` | 0 | – |
| `reason_oil` | 0 | – |
| `reason_other` | 0 | – |
| `reason_telescope` | 0 | – |
| `ea_orderscol` | 0 | – |
## 2. Historische Felder ohne ermittelte aktive fachliche Nutzung

| Spalte | Belegte Zeilen | Views mit Zugriff auf ea_orders-Spalte |
|---|---:|---|
| `check_extras` | 947 | – |
| `customer_client_height` | 216 | – |
| `customer_client_weight` | 794 | – |
| `date_modifikation` | 36879 | – |
| `dealers_client_form` | 1007 | – |
| `fork_freight_forwarder` | 2858 | – |
| `fork_freight_no` | 80 | – |
| `fork_invoice_no` | 5111 | – |
| `fork_pickup_time` | 11260 | – |
| `fork_shipped_date` | 13656 | – |
| `notes_intern` | 15992 | – |
| `order_modifikation` | 27323 | – |
| `price_categ1_subtotal` | 20980 | – |
| `price_categ1_total` | 20981 | – |
| `price_categ1_valuetax` | 19574 | – |
| `price_categ2_subtotal` | 20032 | – |
| `price_categ2_total` | 20032 | – |
| `price_categ2_valuetax` | 19447 | – |
| `price_categ3_freight_subtotal` | 4175 | – |
| `price_categ3_labor_subtotal` | 4606 | – |
| `price_categ3_material_subtotal` | 3180 | – |
| `price_categ3_subtotal` | 5086 | – |
| `price_categ3_total` | 5086 | – |
| `price_categ3_valuetax` | 753 | – |
| `price_outstanding_money` | 1987 | – |
| `price_payments_total` | 19942 | – |
| `printstatus_costestimate` | 21241 | – |
| `printstatus_invoice` | 21077 | – |
| `sold_units_reserved` | 18405 | – |
| `worker_invoice_no` | 16890 | – |
## 3. Erst nach Umbau prüfen

| Spalte | Belegte Zeilen | Views mit Zugriff auf ea_orders-Spalte |
|---|---:|---|
| `bank_id` | 11866 | – |
| `bank_name` | 12273 | – |
| `uid_client` | 8898 | – |
| `number` | 0 | ea_ordersnew_overview |
| `notes_costestimate_extern` | 0 | ea_costestimate_view |
## 4. Vorerst behalten

| Spalte | Belegte Zeilen | Views mit Zugriff auf ea_orders-Spalte |
|---|---:|---|
| `uid_order` | 39634 | ea_open_items, ea_orders_customer, ea_orders_forkview, ea_orders_list, ea_orders_overview, ea_ordersnew_overview, ea_warranty_overview, ea_warranty_report, ea_costestimate_view |
| `bank_account` | 11960 | – |
| `bank_payment` | 31621 | ea_costestimate_view |
| `cal_amount_price_categ3` | 9330 | ea_open_items, ea_orders_customer |
| `cal_outstanding_money` | 1165 | ea_open_items |
| `customer_address` | 37728 | ea_open_items, ea_orders_overview, ea_ordersnew_overview, ea_warranty_overview, ea_warranty_report, ea_costestimate_view |
| `customer_address_alt` | 1692 | – |
| `costestimates_numbers` | 31941 | ea_orders_overview, ea_ordersnew_overview, ea_costestimate_view |
| `customer_category_no` | 37724 | – |
| `customer_client_name` | 8875 | ea_orders_forkview, ea_ordersnew_overview |
| `customer_email` | 34992 | ea_costestimate_view |
| `customer_fon` | 33908 | ea_costestimate_view |
| `customer_name` | 37725 | ea_orders_forkview, ea_costestimate_view |
| `customer_no` | 37727 | ea_open_items, ea_orders_customer, ea_orders_forkview, ea_orders_list, ea_orders_overview, ea_ordersnew_overview, ea_warranty_overview, ea_warranty_report, ea_costestimate_view |
| `fork_color` | 28652 | ea_costestimate_view |
| `fork_in_carrier` | 432 | – |
| `fork_in_date` | 31375 | ea_orders_forkview, ea_ordersnew_overview |
| `fork_model` | 32468 | ea_orders_customer, ea_orders_list, ea_orders_overview, ea_ordersnew_overview, ea_warranty_overview, ea_warranty_report, ea_costestimate_view |
| `fork_no` | 32476 | ea_orders_customer, ea_orders_list, ea_ordersnew_overview, ea_warranty_overview, ea_warranty_report, ea_costestimate_view |
| `invoice_date` | 33041 | ea_open_items, ea_orders_customer, ea_orders_list |
| `invoice_no` | 32420 | ea_open_items, ea_ordersnew_overview |
| `order_no` | 37641 | ea_open_items, ea_orders_customer, ea_orders_list, ea_costestimate_view |
| `order_status` | 18090 | ea_open_items, ea_ordersnew_overview, ea_costestimate_view |
| `reminder_date` | 8018 | – |
| `reminder_level` | 111 | – |
| `text_payments` | 133 | – |
| `user_print_language` | 31567 | – |
| `value_tax` | 35810 | ea_costestimate_view |
| `vat_no_customer` | 2944 | ea_costestimate_view |
| `worker_invoice` | 25451 | – |
| `user_group` | 37749 | ea_open_items, ea_orders_customer, ea_orders_overview, ea_ordersnew_overview, ea_warranty_overview, ea_warranty_report, forks_stat |
| `uid_ref_fork` | 34897 | forks_stat |
| `uid_customer` | 37984 | ea_open_items, ea_orders_customer, ea_orders_list |
| `uid_fork` | 34152 | ea_orders_forkview |
| `created_at` | 39634 | ea_orders_forkview, ea_orders_overview, ea_ordersnew_overview, forks_stat, ea_costestimate_view |
| `updated_at` | 39634 | ea_costestimate_view |
| `wheelsize` | 7777 | ea_costestimate_view |
| `value_tax2` | 664 | ea_costestimate_view |
| `no_vat` | 373 | – |
| `ftsearch` | 37728 | ea_ordersnew_overview |
| `diagnosis_no` | 27804 | ea_ordersnew_overview |
| `worksheet_no` | 29861 | ea_ordersnew_overview |

## Einordnung und konkrete Abhängigkeiten

- `price_categ1_*`, `price_categ2_*`, `price_categ3_*`, `price_outstanding_money`, `price_payments_total`: Auftragskopien ohne ermittelten fachlichen Leser. Gleichnamige Werte in **ea_orders_costestimates** und Positionsdaten werden verwendet und bleiben erforderlich. Die neue Auftragskalkulation berechnet aus Positionen (`lib/order-calculation.ts`, `app/(startseite)/orders/detail/[id]/OrderCalc.tsx`). Die View ea_costestimate_view liest diese Preisfelder von Alias **c**, nicht von ea_orders/Alias **o**.
- `cal_amount_price_categ3` und `cal_outstanding_money` dagegen behalten: `lib/statistics-data.ts` liest sie für offene Posten; außerdem Views ea_open_items und ea_orders_customer. Nicht mit den ungenutzten Preisfeldern verwechseln.
- `check_extras` und `notes_intern` werden im Diagnosebereich aus **ea_diagnosis** gelesen; die Kopien auf ea_orders haben keinen ermittelten fachlichen Leser. Historische Inhalte müssen nicht mit den Diagnosewerten übereinstimmen.
- `customer_client_height` / `customer_client_weight`: kein Leser für diese Auftragsspalten; aktuelle Diagnose verwendet customer_height/customer_weight auf ea_diagnosis. Keine automatische Gleichheit unterstellen.
- `printstatus_costestimate`, `printstatus_invoice`, `dealers_client_form`: keine ermittelte aktuelle Verwendung dieser Auftragsspalten. Dokumentversand schreibt heute ea_documents; die Formularauswahl kommt aus dem Dialog. Historische Versandinformationen nicht ungesichert verwerfen.
- `bank_id` und `bank_name`: werden beim Anlegen/Kundenwechsel noch auf ea_orders geschrieben (`app/new-order/create/route.ts`, `app/article-sales/create/route.ts`, `app/customer/update_customer/route.ts`, `app/data_types/orders/order.ts`). Kein fachlicher Leser dieser Auftragskopien gefunden. Schreibzugriffe zuerst entfernen. **bank_account** wird dagegen im Kunden-Dialog über orderCustomerUpdate verwendet.
- `uid_client`: wird beim Anlegen eines Auftrags aus der Gabel übernommen, aber kein fachlicher Leser dieser Auftragsspalte gefunden. Schreibzugriffe und Schema zuerst anpassen; ea_forks.uid_client bleibt davon unabhängig.
- `number`: vollständig leer, aber ea_ordersnew_overview selektiert es. View und Overview-Typ zuerst ändern.
- `notes_costestimate_extern`: auf ea_orders vollständig leer, aber ea_costestimate_view referenziert es in ea_order-JSON und GROUP BY. View zuerst anpassen. Gleichnamiges Feld auf ea_orders_costestimates behalten.
- `costestimates_numbers`: wird über ea_ordersnew_overview gesucht und im Templates-Modul print-requests-query.ts mittels FIND_IN_SET verwendet. Aktuell behalten; später über relationale Zuordnung ersetzbar.
- `diagnosis_no` / `worksheet_no`: werden aus ea_ordersnew_overview für die Suche gelesen. Erst nach JOIN auf die jeweiligen Fachtabellen entfernbar; vorher Kardinalität und historische Abweichungen prüfen.
- `ftsearch`: wird beim Anlegen geschrieben, in ea_ordersnew_overview ausgewählt und ist Bestandteil eines FULLTEXT-Index. Erst nach bewusster Änderung dieser Suchstruktur prüfen.
- `uid_ref_fork`: wird in forks_stat verwendet und bei Auftragserstellung gesetzt. Vorerst behalten.
- Kunden-/Adress-/Steuer-/Gabeldaten: teilweise bewusste Auftragskopien. Nicht einfach durch aktuelle Stammdaten ersetzen, weil sich dadurch historische Dokumente ändern können. Der Templates-Dienst liest insbesondere Adressen, Steuerdaten, bank_payment und Gabeldaten aus ea_orders.

## Empfohlene Reihenfolge

1. Zuerst die sieben leeren Streichkandidaten in einer separaten Migration behandeln; Schema, Typen und Update-Liste vorher bereinigen und den Client neu generieren.
2. Die 30 historischen Kandidaten mit uid_order gesichert auslagern und fachlich entscheiden, welche Inhalte erhalten bleiben müssen. Erst danach entfernen.
3. Die fünf Umbau-Kandidaten über angepasste Schreibzugriffe und Views bereinigen.
4. Anschließend Auftragsanlage, Kunden-/Gabelwechsel, Suche, offene Posten sowie Dokumenterstellung und Rechnungs-E-Mail prüfen. Den Templates-Dienst mit einbeziehen.

Es wurde absichtlich keine Löschmigration erstellt. Die Ergebnisse sind eine Bestandsaufnahme, keine bereits freigegebene Datenbereinigung.
