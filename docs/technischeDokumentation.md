# Technische Dokumentation Dobo Daten Visualisierung

## Zweck: Laufender Messebetrieb

Dieses System wurde entwickelt, um während eines Messebetriebs Echtzeit-Daten wie Temperatur und Luftfeuchtigkeit zu erfassen und diese Daten über eine Kette von Geräten und Softwarekomponenten zu verarbeiten und anzuzeigen. Es ermöglicht den Benutzern, diese Daten auf einer benutzerfreundlichen Weboberfläche einzusehen.

## Zielgruppe

Dieses System ist für Mitarbeiter konzipiert, die ein geringes Spezialwissen besitzen. Dazu zählen Fachentwickler und Mitarbeiter mit tieferem technischen Verständnis, die sich einen Überblick über die Echtzeit-Daten ihres Systems verschaffen möchten, ohne sich mit den tieferen Details auseinandersetzen zu müssen um das System einzurichten.

Diese Dokumentation soll Ihnen helfen, das System erfolgreich zu bedienen und mögliche Probleme schnell zu beheben. Bei weiteren Fragen oder Problemen wenden Sie sich bitte an den technischen Support Ihrer IT-Abteilung oder via DM an [https://github.com/Doubl3K].

## Initiale Einrichtung - Geräteaufbau und Inbetriebnahme

### Download

Klonen sie sich die Projekte auf ein Lokales Gerät:

- [: Backend](https://github.com/benjis-organisation/Lernfeld-8-Dobot)
- [: Frontend](https://github.com/Doubl3K/dobo-frontend)

#### Raspberry Pi:

- Schließen Sie den Raspberry Pi an eine Stromversorgung an.
  [BILD]
- Verbinden sie dann das Breadboard mit den Sensoren (Temperatur und Luftfeuchtigkeit) über den 40 Pin Connector mit dem Pi.
  [BILD]
- Stellen Sie sicher, dass der Raspberry Pi mit dem Netzwerk verbunden ist.
  [BILD]
- Führen sie die Datei opcua_server.py aus um die nötigen Daten auszulesen und zu Station 2 zu senden

#### Dobot Roboter: Workstation 1

- Schließen sie den Dobot an eine Stromversorgung an.
  [BILD]
- Verbinden Sie den Dobot mit dem Rechner, der die Steuerung übernimmt.
  [BILD]
- Stellen sie sicher das die Workstation mit dem Netzwerk verbunden ist.
- Starten sie die Date opcua_client.py um die Messdaten des Rasperry Pi zu empfangen.
- Führen sie die positioning.py Datei aus um die Steuerung der Dobots zu starten.
  - Diese führt eine Homing Kalibrierung aus um die Korrekte Steuerung des Dobot zu gewärleisten.

#### Kostenabfrage Workstation 2

- Stellen sie sicher, dass ihr Rechner eine stabaile Internetverbindung besitzt.
- Kommt noch wenn sich der Jobsti was überlegt hat-..

#### Datenbankserver Workstation 2

- Richten sie die MongoDB software auf dem Gerät ein
  - https://www.mongodb.com/docs/manual/installation/
- Führen sie die Datei ... Hier warten wir auch auf den Jobsti

#### Datenanzeige Workstation 3

##### Lokal

- Um das User frontend lokal auf einem Rechner zu starten müssen sie erst Node.js und NPM installieren.
  - https://nodejs.org/en
- Öffnen sie ein Terminal ihrer Wahl und navigieren sie zu der Directory in der sie den Frontend Ordner hinterlegt haben.
- Installieren sie die benötigten packages via dem command npm i.
- Starten sie den Server via npm run dev.
  [BILD]
- Öffnen sie die localhost Adresse in ihrem preffererierten Browser.
  [BILD]
- Navigieren sie zum Dashboard um aktuelle Daten zu Empfangen.

##### Server

- Kopieren sie die Dateien aus dem Build Ordner in die Directory ihres Webservers.
- Navigieren sie zu Dashobard um aktuelle Daten zu Empfangen.

## Funktion

    Datenübertragung:
        Der Raspberry Pi sammelt kontinuierlich Temperatur- und Luftfeuchtigkeitsdaten und sendet diese via TCP an den Dobot-Roboter-Rechner.
        Der Dobot-Roboter-Rechner verarbeitet diese Daten und leitet sie an den Datenspeicherungs-Rechner weiter.
        Der Datenspeicherungs-Rechner speichert die Daten in der Datenbank und führt API-Abfragen zu den aktuellen Stromkosten durch.
        Die gesammelten Daten werden dann an den NextJS Frontend-Rechner gesendet, der diese in einer Weboberfläche anzeigt.

    Anzeige der Daten:
        Öffnen Sie den Webbrowser und greifen Sie auf die NextJS-Webanwendung zu.
        Die Echtzeit-Daten werden auf dem Dashboard angezeigt.

## Was gilt es zu beachten?

Netzwerkstabilität: Stellen Sie sicher, dass alle Geräte über eine stabile Netzwerkverbindung verfügen, um Datenverluste oder Verzögerungen zu vermeiden.
Sensoren: Überprüfen Sie regelmäßig die Sensoren am Raspberry Pi auf ordnungsgemäße Funktion.
Systemüberwachung: Halten Sie ein Auge auf die Systemlogs auf allen Rechnern, um mögliche Fehlfunktionen frühzeitig zu erkennen.
API-Zugriff: Stellen Sie sicher, dass der API-Zugriff auf die aktuellen Stromkosten nicht durch externe Faktoren wie API-Limits oder Netzwerkausfälle beeinträchtigt wird.

# FUA - Fehler und Antworten

- Netzwerkverbindungsfehler:

  - Symptom: Daten werden nicht übertragen oder angezeigt.
  - Lösung: Überprüfen Sie die Netzwerkverbindungen und starten Sie gegebenenfalls die Netzwerkgeräte neu.

- Sensorfehler am Raspberry Pi:

  - Symptom: Keine oder falsche Temperatur- und Luftfeuchtigkeitswerte.
  - Lösung: Überprüfen Sie die Sensoranschlüsse und ersetzen Sie dhohesefekte Sensoren.

- Dobot-Roboterfehler:

  - Symptom: Der Roboter reagiert nicht auf Befehle.
  - Lösung: - Überprüfen Sie die Verbindung des Roboter und versichern sie sich das der Roboter eingeschaltet ist.

- Datenbankverbindungsfehler:

  - Symptom: Daten werden nicht gespeichert oder abgerufen.
  - Lösung: Überprüfen Sie die Datenbankverbindung und stellen Sie sicher, dass die Datenbank läuft.

- API-Abfragefehler:

  - Symptom: Stromkosten werden nicht aktualisiert.
  - Lösung: Überprüfen Sie die API-Verbindung und das API-Kontingent.

- Frontend-Anzeigefehler:
  - Symptom: Daten werden nicht im Webinterface angezeigt.
  - Lösung: Überprüfen Sie den NextJS-Server und nutzen sie den Reconnect Button im MQTT menü.
    Sollte hier weiterhin nichts angezeigt werden können sie zu der Unterseite MQTT Testing um nährer Informationen über ihre Verbindung zu testen.
