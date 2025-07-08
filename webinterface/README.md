# NanoMDM Web Interface

Dieses Verzeichnis enthält ein einfaches Node.js basiertes Webinterface für NanoMDM.
Das Interface ermöglicht das Hochladen des Push-Zertifikats, das Senden von Push-Benachrichtigungen und das Einreihen von MDM-Kommandos.

## Starten

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Server starten:
   ```bash
   API_BASE=http://localhost:9000 node server.js
   ```
   *`API_BASE`* muss auf die URL einer laufenden NanoMDM-Instanz zeigen.

## Docker

Mit dem beiliegenden `Dockerfile` lässt sich das Webinterface containerisieren:

```bash
docker build -t nanomdm-web .
docker run -e API_BASE=http://nanomdm:9000 -p 3000:3000 nanomdm-web
```

In einem `docker-compose.yml` kann NanoMDM gemeinsam mit dem Webinterface gestartet werden.

### SCEP Server

Dieses Verzeichnis enthält zudem einen einfachen Docker-Build für einen SCEP-Server auf Basis des [micromdm/scep](https://github.com/micromdm/scep) Projekts. Der Docker-Container kann innerhalb von `docker-compose` gestartet werden und stellt auf Port 8080 einen SCEP-Endpunkt bereit.

Mit `docker-compose up` werden NanoMDM, der SCEP-Server und das Webinterface zusammen gestartet. Die SCEP-Daten werden im Volume `scepdata` persistent gespeichert.
