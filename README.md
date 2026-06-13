# Quieto Backend – Setup-Anleitung

Dieses kleine Programm (Backend) holt echte Bevölkerungsdaten für Städte
weltweit von GeoNames und stellt sie deiner App zur Verfügung.

## Schritt 1: GeoNames-Account erstellen (kostenlos)

1. Gehe zu https://www.geonames.org/login und erstelle ein Konto
2. Bestätige deine E-Mail
3. Gehe zu https://www.geonames.org/manageaccount
4. Klicke "Click here to enable" bei "Free Web Services"

Damit hast du einen `username`, den du gleich brauchst.

## Schritt 2: Lokal testen

1. Node.js installieren (falls noch nicht da): https://nodejs.org
2. In diesem Ordner ein Terminal öffnen
3. `.env.example` kopieren und in `.env` umbenennen
4. In der `.env`-Datei `your_username_here` durch deinen GeoNames-Benutzernamen ersetzen
5. Im Terminal:
   ```
   npm install
   npm start
   ```
6. Im Browser öffnen: http://localhost:3001/api/search?q=Lisbon
   → Du solltest JSON mit echten Städtedaten sehen

## Schritt 3: Online stellen (kostenlos, Render.com)

1. Lade diesen Ordner in ein GitHub-Repo hoch
2. Gehe zu https://render.com, kostenloses Konto erstellen
3. "New" → "Web Service" → dein GitHub-Repo verbinden
4. Einstellungen:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Unter "Environment" die Variable hinzufügen:
   - Key: `GEONAMES_USERNAME`
   - Value: dein GeoNames-Benutzername
6. "Create Web Service" klicken – nach ein paar Minuten ist es live

Du erhältst eine URL wie `https://quieto-backend.onrender.com`.
Diese URL trägst du dann im Frontend (quieto.jsx) ein, damit die App
echte Daten von überall weltweit abrufen kann.

## Wichtig zu wissen

- Die kostenlose GeoNames-API liefert echte Bevölkerungszahlen für
  praktisch jede Stadt weltweit.
- Die Bevölkerungsdichte (Einw./km²) kann GeoNames nicht direkt liefern –
  dafür sind im Code (`APPROX_CITY_AREA_KM2`) einige Städteflächen
  hinterlegt. Für Städte, die dort nicht gelistet sind, wird `popDensity:
  null` zurückgegeben. Du kannst die Liste nach Bedarf erweitern.
- Render.com's kostenlose Stufe "schläft" nach Inaktivität ein und
  braucht beim ersten Aufruf ~30 Sekunden zum Starten.
