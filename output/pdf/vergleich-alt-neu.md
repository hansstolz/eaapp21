# PDF-Vergleich alte und neue Software

Verglichen am 19.10.2026. Quelle: `/Users/go/ea_docs/old`.
Die sechs Vergleichsdokumente wurden mit dem vorhandenen neuen PDF-Generator
(`/Users/go/nextjs/templates/dist`) aus der lokalen Datenbank erzeugt,
jeweils deutsch, Standardversion, Kopie. Es wurden die vorhandenen
Dokumentnummern und Daten verwendet. Die App-Endpunkte wurden nicht aufgerufen;
daher wurden keine Print-Protokolle oder Auftragsstatusänderungen ausgelöst.

## Ergebnis pro Dokument

| Dokument | Auftrag-ID | Positionen alt/neu | Netto / Steuer / Brutto alt = neu | Seiten alt/neu | Ergebnis |
|---|---:|---:|---|---|---|
| Kostenvoranschlag 57776 | 56326 | 6 / 6 | 0,00 / 0,00 / 0,00 EUR | 1 / 1 | Inhalt stimmt überein |
| Kostenvoranschlag 57779 | 56329 | 5 / 5 | 375,29 / 71,31 / 446,60 EUR | 2 / 2 | Inhalt stimmt überein; andere Verteilung des Texts auf die Seiten |
| Kostenvoranschlag 57781 | 56331 | 6 / 6 | 237,40 / 45,11 / 282,51 EUR | 1 / 1 | Inhalt stimmt überein |
| Rechnung 88106 | 56222 | 4 / 4 | 217,64 / 41,35 / 258,99 EUR | 1 / 2 | Inhalt stimmt überein; zusätzliche Seite nur für den Schlussgruß |
| Rechnung 88177 | 56329 | 5 / 5 | 375,29 / 71,31 / 446,60 EUR | 2 / 2 | Inhalt stimmt überein; andere Verteilung des Texts auf die Seiten |
| Gewährleistung 86071 | 56222 | 2 / 2 | Keine Summen; Einzelpreise jeweils 0,00 EUR | 1 / 1 | Positionen stimmen überein; Unterschiede im Kopf und in der Tabelle |

Kundenname, Anschrift, Kunden- und Gabelnummer, Dokumentnummer, Datum,
Zahlungsweise (soweit vorhanden), Artikeltexte, Mengen und Preise wurden
zwischen den Dokumentpaaren verglichen. Keine abweichenden Werte festgestellt.
Die Bankverbindung mit IBAN/BIC stimmt überein. In allen fünf Dokumenten mit
Fließtext ist dieser nach Entfernen der Seitenköpfe/-füße und Normalisieren der
Leerzeichen vollständig identisch. Die Gewährleistung enthält in beiden Versionen
keinen zusätzlichen Fließtext.

## Konkrete Unterschiede

1. **Rechnung 88106: zusätzliche Seite.** Alt eine Seite, neu zwei Seiten.
   Auf Seite 2 stehen nur „We wish HAPPY TRAILS .“, der Schlussgruß und die
   Unterschriften. Der Inhalt fehlt nicht, der Umbruch ist aber ungünstig.
2. **Gewährleistung 86071: kurzer Kopftext.** Alt enthält die Zeile über der
   Anschrift Kunden-/Gabelnummer und das gekürzte Gabelmodell.
   Neu stehen dort nur „Kunden-Nr. 18214 | Gabel-Nr. 32615“.
   Das Modell bleibt im rechten Informationsblock vorhanden; es fehlt also nur
   in dieser zusätzlichen Zusammenfassung.
3. **Gewährleistung: rechte Positionssumme entfällt.** Alt steht bei jeder
   Position zusätzlich rechts 0.00, ohne eigene Spaltenüberschrift.
   Neu werden nur Einzelpreis und Menge angezeigt. Keine finanziell abweichende Summe.
4. **Neue USt-Spalte** in Kostenvoranschlägen und Rechnungen: 19 % je Position.
   Alt wurde der Steuersatz nur im Summenblock ausgewiesen. Auch Nullpreispositionen
   zeigen neu 19 %, der Steuerbetrag bleibt null.
5. **Formatierung:** Preise alt etwa 16.04, neu 16,04 €; Mengen alt 1.00,
   neu 1. Die Werte stimmen numerisch überein. „Wheelsize“ heißt neu „Radgröße“;
   „Euro“ heißt „Eur“, „MwSt 19.0 %“ wird zu „19% USt“; die Nettosumme
   hat neu die Beschriftung „Gesamt“.
6. **Seitenfluss:** Bei KV 57779 und Rechnung 88177 beginnt der Fließtext neu
   bereits auf Seite 1; alt begann er auf Seite 2. Neu steht zusätzlich
   „siehe nächste Seite ...“. Gesamtseitenzahl bleibt jeweils zwei.
7. **Folgeköpfe/Fußzeilen:** Dokumentbezogene Beschriftung statt „Num:“;
   Rechnungsnummer auf Folgeseiten enthält neu „Kopie“.
   Seitenzahlen neu „S 1“, „S 2“ statt „P 01 / 02“.
   Die Gesamtseitenzahl wird neu nicht ausgewiesen. Der Bankname wird neu
   vollständiger ausgeschrieben statt mit Auslassungspunkten abgeschnitten.
8. **Geometrie:** Logo, Informationsblock, Tabellen und Textabstände weichen
   sichtbar von den alten PDFs ab. Keine offensichtlichen Überlappungen oder
   abgeschnittenen Artikel-/Fließtexte in den gerenderten Seiten festgestellt.
   Die Gabelmodelle werden im Informationsblock wie zuvor teilweise gekürzt.

## Dateien und Methode

Neue PDFs liegen neben diesem Bericht:

- [KV 57776](costestimate_57776_copy.pdf)
- [KV 57779](costestimate_57779_copy.pdf)
- [KV 57781](costestimate_57781_copy.pdf)
- [Rechnung 88106](invoice_88106_copy.pdf)
- [Rechnung 88177](invoice_88177_copy.pdf)
- [Gewährleistung 86071](warranty_86071_copy.pdf)

Text wurde mit pdfplumber extrahiert; alle alten und neuen Seiten wurden
zusätzlich gerendert und visuell gegenübergestellt. Seitenumbrüche, automatisch
wiederholte Kopf-/Fußzeilen und reine Zahlformatierung wurden bei der inhaltlichen
Bewertung getrennt betrachtet. Dies ist eine Prüfung dieser sechs Beispiele,
keine vollständige Abnahme aller Dokumentvarianten oder Sprachen. Die Vorlagen
und der Anwendungscode wurden im Rahmen dieses Vergleichs nicht geändert.
