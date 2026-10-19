# Lokale Datenbank auf externen Server übertragen

Konfiguration in `.env` (Passwortbestandteile URL-kodieren):

```dotenv
DATABASE_URL=mysql://LOCAL_USER:LOCAL_PASSWORD@localhost:3306/LOCAL_DATABASE
TARGET_DATABASE_URL=mysql://REMOTE_USER:REMOTE_PASSWORD@REMOTE_HOST:3306/REMOTE_DATABASE
# Falls vom Hoster bereitgestellt:
TARGET_DB_SSL_CA=/absolute/path/to/ca.pem
```

Vorschau ohne Verbindung oder Änderungen:

```sh
npm run db:replace-remote
```

Vollständiges Ersetzen inklusive automatischer Sicherung des Ziels:

```sh
npm run db:replace-remote -- --execute
```

Vor dem Ausführen Schreibzugriffe und Schemaänderungen auf Quelle und Ziel
pausieren, einschließlich Hintergrundjobs und Datenbank-Events. Erst nach
erfolgreicher Prüfung wieder freigeben. Das Ziel ist während des Imports nicht
benutzbar. Die Übertragung ist nicht atomar; bei Fehlern erfolgt kein automatischer
Rollback. Backups enthalten sensible Daten und bleiben lokal unter
`backups/database/` (von Git ausgeschlossen, Dateien nur für den Besitzer lesbar).

Voraussetzungen: Node und MySQL-8-Clients `mysql`/`mysqldump` im PATH
(alternativ `MYSQL_BIN`/`MYSQLDUMP_BIN`). Der Zielserver muss über TCP erreichbar
sein und ein gültiges TLS-Zertifikat für seinen Hostnamen anbieten. Quelle und
Ziel müssen hinsichtlich Version, SQL-Funktionen und Kollationen kompatibel
sein; MySQL/MariaDB-Mischbetrieb vorab auf einem Testziel prüfen.

Der Zielbenutzer benötigt DROP/CREATE DATABASE sowie alle für den Import
erforderlichen Objektberechtigungen. Manche Shared-Hosting-Angebote erlauben
DROP/CREATE DATABASE nicht. Dann muss zuerst das Verfahren mit dem Hoster
abgestimmt werden. Vor dem Löschen müssen beide Dumps erfolgreich erstellt sein.

Tabellen, Daten, Views, Trigger, Routinen und Events werden exportiert;
Datenbankbenutzer und globale Servereinstellungen nicht. DEFINER-Konten sowie
explizite Datenbankverweise in Views/Routinen müssen auf dem Ziel passen;
idealerweise denselben Datenbanknamen verwenden. Das Skript schreibt sie nicht um.
Für konsistente Dumps müssen die Tabellen InnoDB verwenden oder alle
Schreibzugriffe während der gesamten Übertragung gestoppt sein.

Die Abschlussprüfung vergleicht Tabellen-/Viewnamen und exakte Zeilenzahlen;
sie ist kein Vergleich sämtlicher Feldwerte oder Objektdefinitionen.

Wiederherstellung nach einem Fehler: Ziel weiterhin gesperrt lassen,
Zieldatenbank leeren/neu anlegen und `target-before.sql` mit `mysql` importieren.
Zugangsdaten über eine geschützte MySQL-Optionsdatei oder Passwortabfrage
übergeben, niemals im Shell-Aufruf. Der Dump enthält keine CREATE DATABASE-Anweisung.

Referenz: https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html
