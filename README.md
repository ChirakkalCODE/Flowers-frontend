# 🌸 Für meine Liebste — Glückwunschwebseite

Eine kleine, interaktive Webseite als Liebesbrief und Glückwunsch zu den
bestandenen schriftlichen Prüfungen.

## ✨ Was drin ist

- **Intro-Screen** – animierter Gradient-Hintergrund mit Glückwunschtext
- **Großer Blumenstrauß** – komplett in SVG, mit Blumen in vielen Farben
- **Interaktiv** – jede Blume reagiert auf Klick und zeigt eine Nachricht
- **Schwebende Blütenblätter** – animierte Partikel im Hintergrund
- **Liebesbrief** – persönlicher Text auf einer Karte
- **Finale-Überraschung** – ein letztes Geschenk hinter dem Button

## 🚀 Öffnen

Einfach `index.html` im Browser öffnen. Keine Build-Tools, keine Abhängigkeiten.

```bash
# Doppelklick auf index.html
# ODER lokalen Server starten:
python3 -m http.server 8000
# danach http://localhost:8000 öffnen
```

## 🎀 Tipps zum Anpassen

- **Name einfügen**: In `index.html` "Meine Liebste" durch ihren Namen ersetzen
- **Blumen-Botschaften**: `data-msg="..."` in `index.html` editieren
- **Liebesbrief**: Den Text im Abschnitt `<section class="letter">` ändern
- **Farben**: In `styles.css` bei den `radialGradient`s in der SVG-Definition

## 💡 Versteckte Goodies

- Klick irgendwo → kleine Herzen
- **Leertaste** drücken → Herzen-Regen
- Klick auf eine Blume → Pop-Animation + Liebesnachricht
- "Ein letztes kleines Geschenk" → großes Herz mit "Ich liebe dich"

Viel Freude beim Verschenken. 💗
