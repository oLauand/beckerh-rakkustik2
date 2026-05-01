# BECKER Hörakustik – Website

Modern, responsive landing page für BECKER Hörakustik – inspiriert vom Original-Webauftritt, aber komplett neu designed.

---

## 📁 Ordnerstruktur

```
becker-hoerakustik/
├── index.html                ← HAUPTDATEI (für Web-Hosting empfohlen)
├── index-standalone.html     ← Single-File-Version (alle Bilder embedded)
├── README.md                 ← Diese Datei
└── images/
    ├── logo.png                       ← BECKER Logo
    ├── hero-bg.jpg                    ← Hero-Hintergrund (unscharf)
    ├── team.jpg                       ← Team-Foto (Experten-Sektion)
    ├── testimonial-schenk.jpg         ← Botschafterin Gabriele Schenk
    ├── testimonial-roder.jpg          ← Botschafterin Elke Roder
    ├── testimonial-klein.jpg          ← Botschafterin Lana Emilia Klein
    ├── event-hoertag.jpg              ← Event 1: Tag des Hörens
    ├── event-tinnitus.jpg             ← Event 2: Tinnitus-Workshop
    ├── event-familientag.jpg          ← Event 3: Familientag
    └── partner-*.png                  ← 13 Partner-Logos
```

---

## 🚀 So nutzt du die Dateien

### Variante A: Webhosting (empfohlen)
Lade den **gesamten Ordner** auf deinen Webserver hoch.
`index.html` verwendet relative Pfade (`images/...`) – funktioniert auf jedem Server.

### Variante B: Single-File offline
Doppelklick auf `index-standalone.html` – alles drin (Bilder als Base64 embedded),
funktioniert auch ohne Server. Datei ist größer (~1.2 MB), aber 100% portabel.

### Variante C: Lokal mit Server (für Entwicklung)
```bash
cd becker-hoerakustik
python -m http.server 8000
# dann öffnen: http://localhost:8000
```

---

## 🎨 Design-Stack

- **Pure HTML/CSS/Vanilla JS** – kein Build-Step, keine Dependencies
- **Google Fonts**: Mulish (Body) + Fraunces (kursive Akzente)
- **Inline-SVG-Icons** – funktionieren immer, auch offline
- **Intersection Observer** für sanfte Scroll-Animationen
- **CSS-Variablen** für komplettes Re-Branding in Sekunden

---

## 🎨 Farben anpassen

Alle Markenfarben sind als CSS-Variablen am Anfang der `<style>`-Sektion definiert:

```css
:root {
  --magenta: #A61C73;       /* Primärfarbe */
  --magenta-light: #C94B9B; /* Gradient-Ende */
  --pink-soft: #FDF1F8;     /* Helle Hintergründe */
  --pink-mist: #F9E6F1;     /* Akzent-Hintergründe */
  --text: #1A1A1A;
  --text-soft: #4A4A4A;
}
```

Eine einzige Zeile ändern → komplette Site neu eingefärbt.

---

## 📐 Sektionen

1. **Header/Nav** – Sticky, mit Blur-Effekt beim Scrollen
2. **Hero** – Verschwommener Team-Foto-Hintergrund + weißes Overlay, 3 Feature-Cards rechts
3. **Leistungen** – 8 Service-Cards mit Hover-Animationen
4. **Experten** – Team-Sektion mit Statistiken
5. **Botschafter** – Testimonials der drei Botschafterinnen
6. **CTA** – Magenta-Card mit interaktivem Mini-Kalender
7. **App** – Phone-Mockup mit Feature-Liste
8. **Events** – 3 Event-Cards mit Datum-Badge
9. **Partner** – Endlose Logo-Marquee (13 Partner)
10. **Footer** – Dunkel, mit Social Icons & Sitemap

---

## 📱 Responsive

- **Desktop** (>1024px): volles Grid-Layout
- **Tablet** (720–1024px): 2-Spalten-Grids, Mobile-Menü
- **Mobile** (<720px): 1-Spalte, gestapelte Buttons

---

© 2026 BECKER Hörakustik
