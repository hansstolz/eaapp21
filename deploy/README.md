# Deployment auf srv2120280.hstgr.cloud

Der Workflow `.github/workflows/deploy.yml` deployt Pushes auf `main` und kann
manuell unter GitHub → Actions gestartet werden. Er überträgt ausschließlich
Git-Dateien, baut auf dem Server und startet `eaapp.service` neu. Vor einem
erfolgreichen Build bleibt die laufende Version erhalten. Bei fehlgeschlagener
Startprüfung wird auf die vorherige Version zurückgeschaltet. Beim Neustart
entsteht eine kurze Unterbrechung. Alte Releases bleiben zur Wiederherstellung
erhalten und müssen bei Bedarf manuell aufgeräumt werden.

## 1. Server einmalig vorbereiten

Voraussetzung: Node.js **24 LTS** einschließlich npm ist systemweit installiert
(`node --version`, `npm --version`). Der Dienst erwartet Node unter
`/usr/bin/node`; bei anderem Installationspfad `ExecStart` anpassen. Node muss
auch in nicht interaktiven SSH-Sitzungen im PATH verfügbar sein; eine reine
interaktive nvm-Konfiguration reicht nicht.

Als Administrator auf dem Server:

```bash
sudo apt update
sudo apt install nginx rsync curl util-linux
sudo adduser --disabled-password --gecos '' deploy
sudo install -d -o deploy -g deploy /srv/eaapp/releases /srv/eaapp/shared
sudo chown deploy:deploy /srv/eaapp
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo -u deploy touch /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Wenn `deploy` bereits existiert, dessen Anlage überspringen.
Auf deinem Mac ein eigenes Schlüsselpaar für GitHub Actions erstellen:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/eaapp_actions -C github-actions-eaapp
```

Für den automatisierten Workflow eine leere Passphrase verwenden. Den Inhalt
von `~/.ssh/eaapp_actions.pub` auf dem Server als eigene Zeile in
`/home/deploy/.ssh/authorized_keys` eintragen. Der private Schlüssel bleibt geheim.

## 2. Produktionskonfiguration

Auf dem Server `/srv/eaapp/shared/.env` anlegen:

```dotenv
DATABASE_URL="mysql://eaapp:URL_KODIERTES_PASSWORT@127.0.0.1:3306/ee"
JWT_SECRET="EIN_LANGES_ZUFAELLIGES_GEHEIMNIS"
TEMPLATES_API_URL="http://127.0.0.1:3001"
TEMPLATES_API_KEY="SCHLUESSEL_DES_DOKUMENTENDIENSTES"
```

JWT-Geheimnis beispielsweise mit `openssl rand -hex 32` erzeugen. Sonderzeichen
im Datenbankpasswort für die URL kodieren. Das MySQL-Konto muss für lokale
TCP-Verbindungen und die Datenbank `ee` berechtigt sein. Der Dokumentendienst
ist eine separate Anwendung; dieser Workflow deployt ihn nicht. Seine URL und
gegebenenfalls seinen API-Schlüssel passend eintragen.

```bash
sudo chown deploy:deploy /srv/eaapp/shared/.env
sudo chmod 600 /srv/eaapp/shared/.env
```

Die Konfiguration wird beim Build und zur Laufzeit über Next.js geladen.
Datenbankmigrationen, `db push` oder Datenbankimporte werden nicht ausgeführt.
Hochgeladene Logos in `public/_images` bleiben in `/srv/eaapp/shared/_images`
erhalten. Bei einer bestehenden Installation deren Logos vor dem ersten Deploy
dorthin kopieren. Gleichnamige Git-Logos ersetzen vorhandene Logos nicht.

## 3. systemd und Nginx

Die mitgelieferte Datei `deploy/eaapp.service` auf den Server nach
`/etc/systemd/system/eaapp.service` kopieren. Danach:

```bash
sudo systemctl daemon-reload
sudo systemctl enable eaapp.service
sudo visudo -f /etc/sudoers.d/eaapp-deploy
```

Folgende einzelne Zeile in die sudoers-Datei eintragen:

```sudoers
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart eaapp.service, /usr/bin/systemctl stop eaapp.service
```

Den Dienst noch nicht starten: `current` wird erst beim ersten Deploy angelegt.

`deploy/nginx.conf` als `/etc/nginx/sites-available/eaapp` installieren. Bei
Verwendung einer eigenen Domain dort `server_name` ändern und den DNS-Eintrag
auf diesen Server setzen.

```bash
sudo ln -s /etc/nginx/sites-available/eaapp /etc/nginx/sites-enabled/eaapp
sudo nginx -t
sudo systemctl reload nginx
```

Bei aktiver UFW `sudo ufw allow 'Nginx Full'` ausführen und im Hoster-Firewall
TCP 80/443 erlauben. Port 3000 bleibt intern.

**HTTPS vor der Nutzung des Logins einrichten:** Die Anwendung setzt in
Produktion sichere Cookies. Sobald die verwendete Domain auf den Server zeigt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d srv2120280.hstgr.cloud
```

Bei eigener Domain diese statt des Servernamens verwenden.

## 4. GitHub konfigurieren

Im Repository unter Settings → Environments das Environment `production`
anlegen. Dort folgende Secrets setzen:

| Secret | Inhalt |
| --- | --- |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_SSH_KEY` | Vollständiger Inhalt von `~/.ssh/eaapp_actions` einschließlich BEGIN/END-Zeilen |
| `DEPLOY_KNOWN_HOSTS` | Verifizierter SSH-Hostkey-Eintrag des Servers |

Den Hostkey-Eintrag auf dem Mac ermitteln:

```bash
ssh-keyscan -H srv2120280.hstgr.cloud
```

Vor dem Hinterlegen den Fingerabdruck mit dem Hostkey auf der vertrauenswürdigen
Serverkonsole vergleichen (`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`).
Nicht ungeprüft den Scan übernehmen. Bei anderem SSH-Port die Environment-Variable
`DEPLOY_PORT` setzen und auch beim Scan `-p PORT` ergänzen.

Nach Commit und Push auf `main` startet der erste Deploy. Manuelle Deploys im
Actions-Dialog ebenfalls für `main` starten. Auf dem Server kann der Start mit
`sudo journalctl -u eaapp.service -n 100 --no-pager` geprüft werden.
Die automatische HTTP-Prüfung testet den lokalen Webserver, nicht alle
Datenbank- und Dokumentenfunktionen. Diese nach dem ersten Deploy im Browser
prüfen. Der Server benötigt für npm und gegebenenfalls Next.js-Fonts Internetzugang. 
