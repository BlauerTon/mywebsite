# Sidney Nduti — Portfolio Website

A high-performance, responsive personal portfolio website showcasing software engineering, automated workflow pipelines, and systems architecture projects by **Sidney Nduti**.

---

## 🌟 Overview

This portfolio serves as a live exhibition of custom software builds, edge security implementations, IoT architectures, and enterprise automation pipelines. Built with semantic HTML5, a custom vanilla CSS design system, and modular JavaScript with deep-linkable case study overlays.

### Live Pages
- **Home (`index.html`)**: Hero overview, selected project highlights, and engineering philosophy (*Behind the Builder*).
- **Builds (`build.html`)**: Complete editorial project catalog with category filtering, deep linking, and dynamic FLIP-animated modal case studies.
- **Contact (`contact.html`)**: Direct communication channels and an asynchronous FormSubmit-powered inquiry form.

---

## 🛠️ Featured Builds & Case Studies

1. **Intrusion Detection & Prevention Stack (IDPS)**
   - *Category*: Security / Infrastructure
   - *Stack*: Python, Scikit-learn (Random Forest), Scapy, Flask, iptables, SQLite, Raspberry Pi 5
   - *Description*: Edge-deployed ML intrusion detection system that classifies IPv4 DoS/UDP traffic in real time and automatically executes iptables firewall mitigation.

2. **SwiftLead Acquisition Engine**
   - *Category*: Web Application / Automation
   - *Stack*: HTML5, TailwindCSS, Vite, JSON-LD, Async JavaScript
   - *Description*: High-speed lead capture and routing frontend engineered to eliminate response latency (< 1 minute pipeline time).

3. **IoT-Based Home Automation System**
   - *Category*: Mobile App / Enablement / IoT
   - *Stack*: Flutter, Dart, Arduino Uno R3, Bluetooth (HC-05), Firebase, Laravel
   - *Description*: Smart home controller bridging an Android mobile dashboard to Arduino hardware for local appliance control and fire detection with < 1s latency.

4. **Mental Health Journal**
   - *Category*: Mobile Application
   - *Stack*: Flutter, Dart, Riverpod, SharedPreferences, Local Notifications
   - *Description*: Daily guided reflection flow featuring an interactive 4-7-8 breathing pacer, psychometric tracking, and reactive Riverpod state architecture.

5. **DocXpress Invoice Processing Pipeline**
   - *Category*: Automation / Systems Integration
   - *Stack*: n8n, Airtable, OpenRouter API, Gmail API, Slack API, JavaScript
   - *Description*: Autonomous accounts payable workflow that extracts structured data from multi-format email invoice attachments and validates schemas before syncing.

---

## 🎨 Design System & Highlights

- **Custom CSS Design Tokens**: Curated palette utilizing Soft Ice Blue (`--color-paper`), Cards (`--color-surface`), Midnight Navy (`--color-ink`), Royal Blue (`--color-blue`), and Gold accents (`--color-gold`).
- **Interactive Floating Nav**: Glassmorphism navbar that smoothly compresses into a floating pill upon scrolling.
- **FLIP Motion Case Study Modal**: Smooth transition animations expanding from clicked cards to fullscreen case study views.
- **Deep Linking**: Direct URL parameter routing (`build.html?project=idps`) for bookmarkable and shareable case studies.
- **SEO & AI-Discoverability**: Full Schema.org JSON-LD structured data, Open Graph / Twitter cards, and `llms.txt` specification for AI agent discovery.

---

## 🚀 Running Locally

No heavy build steps or npm installations are required. You can serve the static files with any standard HTTP server:

### Python 3:
```bash
python -m http.server 8000
```

### Node / npx:
```bash
npx serve .
# or
npx http-server . -p 8000
```

Open your browser at `http://localhost:8000` to view the website.

---

## 📬 Contact & Connect

- **Email**: [sidneynduti@gmail.com](mailto:sidneynduti@gmail.com)
- **LinkedIn**: [linkedin.com/in/sidney-nduti](https://www.linkedin.com/in/sidney-nduti/)
- **GitHub**: [github.com/BlauerTon](https://github.com/BlauerTon)
