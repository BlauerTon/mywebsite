// Dynamic Case Studies Data Store
const projectsData = {
  "idps": {
    id: "idps",
    title: "Intrusion Detection & Prevention Stack",
    category: "Security / Infrastructure",
    problem: `<p>Small Office/Home Office (SOHO) networks are increasingly exposed to Denial of Service (DoS) attacks, yet the environments where these networks operate often cannot support the resource demands of conventional enterprise-grade intrusion detection systems.</p>
<p>The core problem was therefore not simply detecting DoS attacks. It was building a detection and response system that could operate in real time on inexpensive, resource-constrained edge hardware. Existing approaches examined in the project were heavily dependent on signature-based detection, making them less adaptable to previously unseen attack patterns. Other systems focused on detection without providing meaningful real-time mitigation or an accessible monitoring interface.</p>
<p>The project targeted this gap by developing a lightweight Intrusion Detection and Prevention System (IDPS) for SOHO environments. The objective was to use machine learning, specifically a Random Forest Classifier, alongside signature-based detection to identify suspicious traffic, alert the administrator, record the incident, and automatically block confirmed malicious IP addresses.</p>
<p>The system was specifically designed around a Raspberry Pi 5 with 8 GB RAM, with the network analysis scope focused on IPv4 TCP/UDP traffic.</p>`,
    build: `<p>I built a machine-learning-powered SOHO IDPS that combines network packet analysis, ML-based detection, rule-based verification, automated firewall response, persistent logging, and a real-time web dashboard.</p>
<p>The system follows a pipeline:</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin: 16px 0; font-family: var(--font-mono); font-size: 0.8125rem; border: 1px dashed var(--color-ink-20);">
  <span>Network Traffic</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Packet Capture</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Feature Extraction</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>ML Detection</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Signature Verification</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Alert/Decision</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>IP Blocking</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Logging</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Dashboard</span>
</div>
<p>The Raspberry Pi captures network traffic through its network interface. Relevant packet and flow characteristics are extracted and passed to the Random Forest detection engine. The system combines ML anomaly detection with a signature engine so that both learned traffic patterns and known attack signatures can contribute to the decision. When malicious activity is confirmed, the offending IP is blocked through iptables, while the event is logged and surfaced through the dashboard.</p>

<h4 style="margin-top: 24px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Machine Learning Engine</h4>
<p>The Random Forest model was trained using a combination of <strong>CICIoT23</strong>, <strong>CICIDS2017</strong>, and <strong>UNSW-NB15</strong> datasets. CICIoT23 provided substantial UDP traffic, including both benign and attack traffic, while CICIDS2017 and UNSW-NB15 were used to broaden training and testing coverage.</p>
<p>The data required preprocessing because the datasets differed in feature names, available fields, and metric formats. A Python preprocessing pipeline standardized the datasets, selected relevant features, handled missing values, renamed fields, and calculated traffic-related metrics.</p>
<p>The initial Random Forest configuration used 100 trees, balanced class weights, parallel processing, and an 80/20 stratified train-test split. The trained model was serialized using Joblib, while feature importance was used to identify the most influential features.</p>

<h4 style="margin-top: 24px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Detection and Mitigation</h4>
<p>The system was designed to classify traffic into normal, suspicious, or malicious states. Confirmed malicious traffic triggers an automated response through Linux firewall rules. This was an important distinction from a passive IDS: the system was designed to move beyond <em>"I detected an attack"</em> to <em>"I detected the attack, alerted the administrator, recorded it, and took action against the source."</em></p>

<h4 style="margin-top: 24px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Web Dashboard</h4>
<p>A Flask-based web dashboard provides the human-facing control and monitoring layer. It displays network metrics, alerts, and attack information, allowing an administrator to monitor the network without having to interpret raw packet captures or command-line output. The dashboard also provides visibility into the state of the network during both normal traffic and an active attack. Authentication was also implemented through registration and login modules, with user credentials stored in SQLite.</p>`,
    challenge: `<p>The most interesting part of this project was the constraint: the detection system itself had to run at the network edge on a Raspberry Pi. This created several engineering problems:</p>
<ol style="margin-left: 20px; margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
  <li><strong>Running ML at the Edge:</strong> A conventional approach would be to send traffic to a powerful server for analysis. That would undermine the purpose of having an inexpensive, locally deployed SOHO security appliance. The Random Forest model therefore had to be lightweight enough for edge inference, with the project incorporating model serialization and optimization for Raspberry Pi deployment.</li>
  <li><strong>Turning Raw Packets into ML Features:</strong> The ML model cannot simply consume arbitrary packets. The packet capture layer needed to translate live network traffic into features compatible with the training data. This meant building the packet capture and feature extraction pipeline and ensuring that the features generated during live operation matched the characteristics expected by the trained model.</li>
  <li><strong>Real-Time Detection vs. Limited Resources:</strong> The system needed to continuously monitor traffic while simultaneously running packet capture, feature computation, ML inference, firewall operations, database writes, and Flask dashboard rendering. The project therefore treated CPU, memory, storage, and processing latency as engineering constraints rather than assuming unlimited infrastructure.</li>
  <li><strong>Detection was Not Enough:</strong> A major engineering challenge was connecting the ML decision to an actual security response. The system connected the detection engine to iptables. Once the decision met the required confidence threshold, the firewall controller could execute the blocking action. White-box testing specifically verified this decision path and the blocking behaviour.</li>
  <li><strong>Validating the System Without Attacking Real Networks:</strong> Real-world DoS testing introduces obvious ethical, privacy, and operational problems. The project consequently used a controlled environment and simulated attacks. Black-box testing used controlled UDP flood traffic to determine whether the system could detect the attack, generate an alert, and block the originating IP.</li>
</ol>`,
    result: `<p>The result was a working Raspberry Pi-based IDPS capable of detecting and responding to UDP flood attacks in real time.</p>
<p>The testing demonstrated that:</p>
<ul style="margin-left: 20px; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
  <li>Normal browser traffic was not incorrectly treated as an attack.</li>
  <li>A simulated 5,000 UDP packets/sec flood was detected.</li>
  <li>A critical alert was created and recorded in the database.</li>
  <li>iptables blocking was triggered and the dashboard displayed an attack notification.</li>
  <li>Stored alerts remained available after a Raspberry Pi restart.</li>
</ul>
<p style="margin-top: 16px;">The model evaluation used precision, recall, F1-score, and confusion-matrix analysis. The classifier successfully identified a large proportion of attack traffic, although prediction confidence could decrease in live environments because of bandwidth and hardware limitations.</p>
<p><em><strong>Note:</strong> This project is designed specifically for SOHO environments, IPv4 TCP/UDP traffic, and primarily DoS/UDP flood detection. It is not presented as a general-purpose enterprise IDS or zero-day defense system, which represents a deliberate engineering focus around a defined SOHO threat model.</em></p>

<h4 style="margin-top: 24px; margin-bottom: 12px; font-size: 1rem; color: var(--color-blue);">Detailed Implementation Stack</h4>
<div style="overflow-x: auto; width: 100%; margin-top: 8px; border: 1px solid var(--color-ink-10); border-radius: 6px;">
  <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem; text-align: left;">
    <thead>
      <tr style="background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--color-ink-10);">
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Layer</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Technology</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Hardware</td>
        <td style="padding: 10px 12px;">Raspberry Pi 5, 8 GB RAM</td>
        <td style="padding: 10px 12px;">Edge deployment and real-time traffic processing</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Operating System</td>
        <td style="padding: 10px 12px;">Parrot Security OS IoT Edition 6.3.2</td>
        <td style="padding: 10px 12px;">ARM-based Raspberry Pi operating environment</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Language</td>
        <td style="padding: 10px 12px;">Python 3.11</td>
        <td style="padding: 10px 12px;">Core system, ML pipeline and backend</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Machine Learning</td>
        <td style="padding: 10px 12px;">Scikit-learn 1.7.2, Random Forest Classifier</td>
        <td style="padding: 10px 12px;">DoS/UDP flood classification, training and inference</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Model Serialization</td>
        <td style="padding: 10px 12px;">Joblib</td>
        <td style="padding: 10px 12px;">Model serialization and deployment</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Network Capture</td>
        <td style="padding: 10px 12px;">Scapy 2.6.1, libpcap 1.10.3</td>
        <td style="padding: 10px 12px;">Packet capture and network analysis backend</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Firewall / Mitigation</td>
        <td style="padding: 10px 12px;">iptables 1.8.9</td>
        <td style="padding: 10px 12px;">Automatic malicious-IP blocking</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Backend / Web Server</td>
        <td style="padding: 10px 12px;">Flask 3.1.2, SQLite 3.40.1</td>
        <td style="padding: 10px 12px;">Dashboard server, database logs and user credentials</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Visualization</td>
        <td style="padding: 10px 12px;">Chart.js 4.5.1</td>
        <td style="padding: 10px 12px;">Real-time dashboard charts</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Simulation / Design</td>
        <td style="padding: 10px 12px;">hping3, LOIC, Draw.io</td>
        <td style="padding: 10px 12px;">UDP flood testing and system design architecture diagrams</td>
      </tr>
    </tbody>
  </table>
</div>`,
    metric: "96%",
    role: "Systems Security Engineer",
    tech: ["Raspberry Pi", "Python", "Scikit-learn", "Scapy", "Flask", "SQLite", "iptables"],
    liveUrl: "https://drive.google.com/file/d/1cAw0Yqt6TC12gXcp2UZQXep0Ef7LAvyl/view",
    btnText: "Explore Documentation",
    media: `<div class="modal-carousel" style="position: relative; width: 100%; height: 100%; overflow: hidden; background: #0b0f19; border-radius: 8px;">
  <div class="carousel-slides" style="display: flex; width: 100%; height: 100%; transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);">
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project1/img1.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project1/img2.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project1/img3.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project1/img4.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project1/img5.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  </div>
  <button class="carousel-prev" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); background: rgba(11, 15, 25, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 10; backdrop-filter: blur(4px);">
    <span class="material-symbols-outlined" style="font-size: 24px;">chevron_left</span>
  </button>
  <button class="carousel-next" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: rgba(11, 15, 25, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 10; backdrop-filter: blur(4px);">
    <span class="material-symbols-outlined" style="font-size: 24px;">chevron_right</span>
  </button>
  <div style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10; padding: 6px 12px; background: rgba(11, 15, 25, 0.4); border-radius: 20px; backdrop-filter: blur(4px);">
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
  </div>
</div>`
  },
  "swiftlead": {
    id: "swiftlead",
    title: "SwiftLead Acquisition Engine",
    category: "Web Application / Automation",
    problem: `<p style="text-align: justify;">Many service-oriented businesses (especially in real estate, legal, and consultancy sectors) suffer from a "speed-to-lead" gap. When a prospective client fills out a website form, inquiries are frequently missed, delayed, or routed incorrectly. Traditional systems rely on synchronous database writes or heavy third-party CRM integrations that introduce propagation delays of several minutes, leading to high bounce rates and lost revenue before any sales agent can follow up.</p>`,
    build: `<p style="text-align: justify;">SwiftLead is a high-performance customer conversion and automation engine:</p>
<p style="text-align: justify; margin-top: 8px;"><strong>Frontend:</strong> A highly optimized web interface constructed using semantic HTML5, vanilla CSS3, and lightweight asynchronous JavaScript hooks to capture lead inputs.</p>
<p style="text-align: justify; margin-top: 8px;"><strong>Backend Automation (n8n):</strong> A modular, multi-tier workflow automation system:</p>
<ul style="margin-left: 20px; margin-top: 4px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>Tier 1 (Starter):</strong> Webhook-based lead capture, automated validation, sequential tracking ID generation, Gemini AI classification (intent analysis, summary, and priority routing), Airtable CRM logging, and workload-based agent assignment.</li>
  <li><strong>Tier 2 (Professional):</strong> Real-time Slack notifications, SLA response timers, automated follow-up reminders, and automatic manager escalation.</li>
  <li><strong>Tier 3 (Premium):</strong> Scheduled business intelligence reports and enterprise-level CRM syncing (HubSpot, Salesforce, Zoho).</li>
</ul>`,
    challenge: `<p style="text-align: justify;">The primary engineering challenge was to deliver near-instant customer response times and complex automation pipelines without degrading website performance. Introducing heavy client-side framework libraries or render-blocking script dependencies would add bloat, increase loading times, and lower SEO search rankings. This was solved by offloading the heavy business logic to a decoupled backend using custom JavaScript queue pipelines to safely transmit lead payloads to n8n webhooks asynchronously, allowing the client interface to render and confirm submissions instantly.</p>`,
    result: `<p style="text-align: justify;">The system successfully reduced the average lead processing and automated acknowledgement times to under a minute. By replacing manual inbox monitoring with deterministic, AI-assisted automation, businesses achieved significantly higher lead-to-opportunity conversions. Additionally, the lightweight frontend asset footprint maintained a perfect 100/100 mobile performance rating on Google Lighthouse audits, boosting SEO rankings and organic search visibility.</p>`,
    metric: "< 1m",
    role: "Automation Specialist",
    tech: ["HTML5", "CSS3", "JSON-LD", "Vite", "JavaScript"],
    liveUrl: "https://www.youtube.com/embed/jOwvdEitegA",
    btnText: "View Demo",
    media: `<img src="assets/images/project2/swiftlead-poster.jpg" alt="SwiftLead Acquisition Engine" style="width: 100%; height: 100%; object-fit: cover;" />`
  },
  "automation-stack": {
    id: "automation-stack",
    title: "IoT-Based Home Automation System",
    category: "Mobile App / Enablement / IoT",
    problem: `<p style="text-align: justify; margin-bottom: 12px;">Smart devices are becoming increasingly common in households, but owning connected appliances does not automatically make them easy to manage.</p>
<p style="text-align: justify; margin-bottom: 8px;">The project identified several problems with existing home environments:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Household appliances can be difficult to manage efficiently.</li>
  <li>Users may not have a single interface for controlling multiple devices.</li>
  <li>Energy consumption can be difficult to monitor and understand.</li>
  <li>Safety incidents, including fires or electrical incidents, can occur without immediate awareness.</li>
  <li>Elderly or disabled individuals may benefit from easier access to home controls.</li>
  <li>Existing home automation solutions can be expensive, difficult to integrate, dependent on internet connectivity, or limited by the communication technology they use.</li>
</ul>
<p style="text-align: justify; margin-bottom: 12px;">The problem was therefore broader than simply turning a light on with a phone.</p>
<p style="text-align: justify; margin-bottom: 12px;">The project aimed to create a more accessible system through which a user could interact with connected home devices, monitor their state, receive safety information, and manage aspects of household energy usage.</p>
<p style="text-align: justify; margin-bottom: 12px;">The documented scope included controlling and monitoring lights, a fan, curtains, and fire detection through an Android mobile application.</p>
<p style="text-align: justify;">The project was designed around the idea that the user should not need to interact directly with embedded hardware. Instead, the smartphone would become the primary control interface.</p>`,
    build: `<p style="text-align: justify; margin-bottom: 12px;">I built an IoT-based home automation system consisting of an Android mobile application, an Arduino-based hardware controller, Bluetooth communication, safety sensors, and an administrative platform.</p>
<p style="text-align: justify; margin-bottom: 12px;">At a high level, the system operates as:</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin: 16px 0; font-family: var(--font-mono); font-size: 0.8125rem; border: 1px dashed var(--color-ink-20);">
  <span>Mobile Application</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Bluetooth Communication</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Arduino Controller</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Connected Devices &amp; Sensors</span>
</div>
<p style="text-align: justify; margin-bottom: 20px;">The user interacts with the mobile application to issue commands. These commands are transmitted through the HC-05 Bluetooth module to the Arduino Uno, which acts as the central controller for the connected hardware. The Arduino then controls or monitors the relevant devices and sensors.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Mobile Application</h4>
<p style="text-align: justify; margin-bottom: 8px;">The mobile application acts as the main interface between the user and the smart home environment. The documented functionality includes:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>User registration and authentication</li>
  <li>Bluetooth connection and device pairing</li>
  <li>Adding and controlling home devices</li>
  <li>Monitoring device states</li>
  <li>Notifications for significant device-state changes</li>
  <li>Application locking and access control</li>
  <li>Power consumption monitoring</li>
  <li>Data visualization</li>
</ul>
<p style="text-align: justify; margin-bottom: 20px;">The functional requirements explicitly define registration, authentication, Bluetooth connectivity, appliance control, notifications, and application locking as core system features.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Hardware Control Layer</h4>
<p style="text-align: justify; margin-bottom: 8px;">The physical prototype was built around an Arduino Uno R3, which served as the central command unit for the circuit. The hardware implementation included:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Arduino Uno R3 for central control</li>
  <li>HC-05 Bluetooth module for communication with the smartphone</li>
  <li>LEDs for device-state indication</li>
  <li>Motor for representing automated mechanical controls such as fans or curtains</li>
  <li>Buzzer for physical alerts</li>
  <li>3-pin infrared sensor for fire detection</li>
  <li>Breadboard and jumper wires for circuit construction</li>
</ul>
<p style="text-align: justify; margin-bottom: 20px;">The Arduino receives information from the mobile application and coordinates the connected devices and sensors.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Fire Detection and Safety</h4>
<p style="text-align: justify; margin-bottom: 12px;">The system included a safety component rather than focusing exclusively on convenience. An infrared sensor detects infrared emissions associated with a fire source and passes the signal to the Arduino. When a fire condition is detected, the system can trigger an alert through the connected warning mechanisms. The buzzer provides a physical warning indicator.</p>
<p style="text-align: justify; margin-bottom: 20px;">This gave the project two distinct capabilities: <strong>Automation and control</strong>, allowing users to interact with home devices, and <strong>monitoring and safety</strong>, allowing the system to respond to environmental conditions.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">User and Administrative Systems</h4>
<p style="text-align: justify; margin-bottom: 8px;">The project extended beyond the Arduino prototype. The system included user-facing functionality and an administrator module capable of managing registered users and analysing application usage. The administrator functionality included:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Viewing registered users</li>
  <li>Deleting users</li>
  <li>Editing user information</li>
  <li>Viewing usage-frequency data</li>
</ul>
<p style="text-align: justify;">The testing documentation shows that these administrative features were implemented and successfully tested.</p>`,
    challenge: `<p style="text-align: justify; margin-bottom: 12px;">The most significant engineering challenge was integrating software, mobile communication, embedded hardware, sensors, and user management into one functional system. Building either an Arduino circuit or a mobile application independently would have been relatively straightforward. Making them communicate reliably was the more substantial engineering problem.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">1. Bridging Mobile Software and Physical Hardware</h4>
<p style="text-align: justify; margin-bottom: 12px;">The mobile application needed to communicate with an Arduino-based circuit. This required establishing a Bluetooth communication channel through the HC-05 module and ensuring that commands issued through the application were correctly interpreted by the Arduino. The integration testing specifically combined the mobile application and Arduino setup into a single operational system, with users issuing commands from the application to control the hardware.</p>
<p style="text-align: justify; margin-bottom: 12px;">This creates a real integration boundary:</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin: 16px 0; font-family: var(--font-mono); font-size: 0.8125rem; border: 1px dashed var(--color-ink-20);">
  <span>User Interface</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Bluetooth Protocol</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Embedded Controller</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Physical Output</span>
</div>
<p style="text-align: justify; margin-bottom: 20px;">Each layer needs to work correctly for the complete feature to function.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">2. Hardware and Software Integration</h4>
<p style="text-align: justify; margin-bottom: 8px;">The system involved multiple types of engineering components:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Embedded programming</li>
  <li>Mobile application development</li>
  <li>Bluetooth communication</li>
  <li>Sensor input</li>
  <li>Motor and actuator control</li>
  <li>User authentication</li>
  <li>Cloud-backed user data</li>
  <li>Administrative management</li>
</ul>
<p style="text-align: justify; margin-bottom: 20px;">This made the project a multi-layer system rather than a conventional standalone mobile application. A failure in one layer could affect the entire system. For example, the application could work correctly while the Bluetooth connection fails, or the Bluetooth connection could work while the Arduino fails to interpret the command. The project therefore used unit, integration, white-box, and black-box testing to validate different layers of the system.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">3. Designing Around Real Smart Home Constraints</h4>
<p style="text-align: justify; margin-bottom: 8px;">The research identified several limitations in existing home automation systems, including: high hardware and installation costs, poor interoperability between devices, communication range limitations, internet dependency, security concerns, complex user experiences, and difficulty expanding systems.</p>
<p style="text-align: justify; margin-bottom: 12px;">The project therefore took a relatively lightweight approach using an Arduino and Bluetooth-based local communication for the prototype. This was a practical trade-off. Bluetooth reduces dependency on a permanent internet connection, but it also limits communication range. The project documentation acknowledges that connectivity would not be maintained beyond a certain distance and that the system was not designed for remote control from anywhere in the world. That is an important engineering limitation and is stated honestly in this portfolio.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">4. Building for Both Users and Administrators</h4>
<p style="text-align: justify;">Another engineering challenge was that the project had two different types of users. The household user needed a simple interface for controlling devices. The administrator needed tools for managing users and analysing system usage. This required separate application concerns and contributed to the project's repository structure, which included a master branch for the mobile application and an admin branch for the administrative web application.</p>`,
    result: `<p style="text-align: justify; margin-bottom: 12px;">The result was a functional home automation prototype integrating an Android application with Arduino-controlled hardware. The system successfully demonstrated the ability to connect a smartphone to physical home automation components through Bluetooth and control connected devices through the application.</p>
<p style="text-align: justify; margin-bottom: 8px;">Testing covered individual system components and the complete integrated system using:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Unit testing for individual features</li>
  <li>Integration testing between the mobile application and Arduino</li>
  <li>White-box testing to observe communication and execution paths</li>
  <li>Black-box testing from the perspective of a normal user</li>
</ul>
<p style="text-align: justify; margin-bottom: 12px;">The testing results documented successful functionality for several application features, including power consumption visualization and logout functionality. The administrator module also successfully demonstrated user management and usage analytics, with the documented test cases passing for viewing, editing, deleting users, and visualising application usage frequency.</p>
<p style="text-align: justify; margin-bottom: 12px;">The final project therefore demonstrated an end-to-end IoT workflow:</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin: 16px 0; font-family: var(--font-mono); font-size: 0.8125rem; border: 1px dashed var(--color-ink-20);">
  <span>Control Command</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Mobile Application</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Bluetooth</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Arduino</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Device Response</span>
</div>
<p style="text-align: justify; margin-bottom: 12px;">and a monitoring workflow:</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin: 16px 0; font-family: var(--font-mono); font-size: 0.8125rem; border: 1px dashed var(--color-ink-20);">
  <span>Environmental Sensor</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Arduino</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Alert/Warning</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>User Awareness</span>
</div>
<p style="text-align: justify; margin-bottom: 20px;">The project's conclusion was that the system gave household users greater control over connected appliances while supporting energy management and access security.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Important Limitations</h4>
<p style="text-align: justify; margin-bottom: 8px;">The project should not be positioned as a fully production-ready commercial smart home platform. The documentation identifies several limitations:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Android-only support (no iOS support)</li>
  <li>Bluetooth range limitations (no global remote access)</li>
  <li>Only one user accessing the system at a time</li>
  <li>Certain smart home areas such as HVAC were outside the scope</li>
</ul>
<p style="text-align: justify; margin-bottom: 24px;">These limitations are not weaknesses to hide. For a technical portfolio, they demonstrate that the project had a clearly defined scope and that the engineering decisions involved deliberate trade-offs.</p>

<h4 style="margin-top: 24px; margin-bottom: 12px; font-size: 1rem; color: var(--color-blue);">Detailed Implementation Stack</h4>
<div style="overflow-x: auto; width: 100%; margin-top: 8px; border: 1px solid var(--color-ink-10); border-radius: 6px;">
  <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem; text-align: left;">
    <thead>
      <tr style="background: var(--color-blue); border-bottom: 1px solid var(--color-ink-10);">
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Layer</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Technology</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Mobile Application</td>
        <td style="padding: 10px 12px;">Flutter (Dart)</td>
        <td style="padding: 10px 12px;">Cross-platform application development framework for Android UI and state</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Embedded Controller</td>
        <td style="padding: 10px 12px;">Arduino Uno R3</td>
        <td style="padding: 10px 12px;">Central controller for physical circuit outputs, motors, and sensors</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Embedded Language</td>
        <td style="padding: 10px 12px;">C/C++ (Arduino IDE)</td>
        <td style="padding: 10px 12px;">Hardware control, Bluetooth signal parsing, and safety trigger alerts</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Communication</td>
        <td style="padding: 10px 12px;">HC-05 Bluetooth Module</td>
        <td style="padding: 10px 12px;">Local wireless interface for device pairing and commands transmission</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Backend / Cloud</td>
        <td style="padding: 10px 12px;">Firebase</td>
        <td style="padding: 10px 12px;">Authentication, cloud storage for user database parameters</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Simulation & Design</td>
        <td style="padding: 10px 12px;">Tinkercad, Draw.io</td>
        <td style="padding: 10px 12px;">Circuit prototyping, schema verification, and system topology drawing</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Hardware Cluster</td>
        <td style="padding: 10px 12px;">Buzzer, motor, IR fire sensor, LEDs</td>
        <td style="padding: 10px 12px;">Dynamic environmental alerts, simulated curtains/fans, and states visual</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Admin Platform</td>
        <td style="padding: 10px 12px;">Laravel PHP Framework</td>
        <td style="padding: 10px 12px;">Web application for profile administration and user engagement metrics</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Methodology</td>
        <td style="padding: 10px 12px;">SSADM & Incremental</td>
        <td style="padding: 10px 12px;">Structured system analysis, design, and iterative component build steps</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Version Control</td>
        <td style="padding: 10px 12px;">Git & GitHub</td>
        <td style="padding: 10px 12px;">Branch isolation (master mobile vs. admin web) and version control</td>
      </tr>
    </tbody>
  </table>
</div>`,
    metric: "< 1s",
    role: "IoT Systems Engineer",
    tech: ["Flutter", "Arduino Uno R3", "Bluetooth", "Firebase", "Laravel", "Android"],
    liveUrl: "https://drive.google.com/file/d/1FaUDAQj0RPMQdNI9gn2lRsyhznrSoYgf/view?usp=sharing",
    btnText: "Explore Documentation",
    media: `<div class="modal-carousel" style="position: relative; width: 100%; height: 100%; overflow: hidden; background: #0b0f19; border-radius: 8px;">
  <div class="carousel-slides" style="display: flex; width: 100%; height: 100%; transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);">
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project3/img1.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project3/img2.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project3/img3.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project3/img4.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div class="carousel-slide" style="min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19;">
      <img src="assets/images/project3/img5.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  </div>
  <button class="carousel-prev" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); background: rgba(11, 15, 25, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 10; backdrop-filter: blur(4px);">
    <span class="material-symbols-outlined" style="font-size: 24px;">chevron_left</span>
  </button>
  <button class="carousel-next" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: rgba(11, 15, 25, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 10; backdrop-filter: blur(4px);">
    <span class="material-symbols-outlined" style="font-size: 24px;">chevron_right</span>
  </button>
  <div style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10; padding: 6px 12px; background: rgba(11, 15, 25, 0.4); border-radius: 20px; backdrop-filter: blur(4px);">
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
    <span class="carousel-dot" style="width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.2s;"></span>
  </div>
</div>`
  },
  "topwellness": {
    id: "topwellness",
    title: "Mental Health Journal",
    category: "Mobile Application",
    problem: `<p style="text-align: justify; margin-bottom: 12px;">Mental health reflection and wellness journaling often suffer from high user friction and rapid drop-off rates. Traditional journaling applications frequently present users with open-ended blank canvases or exhausting, multi-screen questionnaires that create significant cognitive fatigue—especially when someone is already emotionally overwhelmed.</p>
<p style="text-align: justify; margin-bottom: 8px;">The core problem was therefore not just capturing text. It was designing and engineering a structured, low-barrier daily check-in that makes emotional awareness effortless:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Users often lack the energy to articulate long journal entries during high-stress periods.</li>
  <li>Existing tools lack structured frameworks (e.g. Cognitive Behavioral Therapy techniques, guided breathing).</li>
  <li>Mental health progress is rarely tracked against standardized psychometric baselines over time.</li>
  <li>Intrusive cloud requirements or mandatory sign-ins create privacy hesitation for sensitive personal reflections.</li>
</ul>
<p style="text-align: justify;">The goal was to build the <strong>Mental Health Journal</strong>—a dedicated Flutter mobile application that guides individuals through a complete, calming 6-step reflection routine in under two minutes while maintaining strict offline privacy and responsive performance.</p>`,
    build: `<p style="text-align: justify; margin-bottom: 12px;">I engineered a cross-platform mobile application built on <strong>Flutter &amp; Dart</strong>, utilizing <strong>Riverpod</strong> for reactive state management, a clean <strong>Feature-First</strong> architecture, and custom Canvas-rendered micro-animations.</p>
<p style="text-align: justify; margin-bottom: 12px;">The daily workflow follows a structured 6-step pipeline designed to guide users from reflection to mindful calm and actionable intention:</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin: 16px 0; font-family: var(--font-mono); font-size: 0.8125rem; border: 1px dashed var(--color-ink-20);">
  <span>Daily Reflection</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Emotional Mood Scale</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Gratitude Anchors</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Circle of Control</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>4-7-8 Breathing Pacer</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Growth Action</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Celebration</span>
</div>
<p style="text-align: justify; margin-bottom: 20px;">Each step is purposefully designed to minimize cognitive strain while building emotional self-regulation and intentionality.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">The 6-Step Mindful Reflection Flow</h4>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px; text-align: justify;">
  <li><strong>1. Daily Reflection:</strong> Prompts the user to capture what worked well, what felt challenging, and general daily observations without overwhelming text barriers.</li>
  <li><strong>2. Emotional Check-In:</strong> An interactive 0–10 Likert slider mapping emotional states (from stressed/low to thriving) with dynamic color transitions and optional mood notes.</li>
  <li><strong>3. Gratitude &amp; Positivity:</strong> Encourages mindfulness by anchoring two positive memories or feelings experienced throughout the day.</li>
  <li><strong>4. Circle of Control:</strong> A CBT-inspired exercise prompting users to differentiate between circumstances within their immediate influence versus external stressors to release.</li>
  <li><strong>5. Mindfulness Breathing Practice:</strong> A guided 4-7-8 calming breath pacer (Inhale 4s, Hold 7s, Exhale 8s) powered by an expanding canvas ring and real-time cycle counter.</li>
  <li><strong>6. Things to Work On &amp; Next Small Step:</strong> Closes the reflection by establishing a concrete micro-goal for tomorrow.</li>
</ul>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Psychometric Assessment Engine</h4>
<p style="text-align: justify; margin-bottom: 8px;">To quantify emotional progress over time, the app incorporates standardized psychometric assessment tools:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>Baseline Assessment:</strong> 28 Likert items spanning 7 psychological domains (Emotional Awareness, Stress, Emotional Regulation, Gratitude, Self-awareness, Coping, Purpose &amp; Hope) with reverse-score handling.</li>
  <li><strong>Mid-Progress &amp; Follow-Up Checkpoints:</strong> Longitudinal assessments comparing subsequent wellbeing metrics against baseline scores to visualize therapeutic growth.</li>
  <li><strong>User Onboarding &amp; Profile:</strong> Captures demographic contexts, life stage parameters, and journaling familiarity to calibrate the user experience.</li>
</ul>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Micro-Interactions &amp; Custom Canvas Rendering</h4>
<p style="text-align: justify; margin-bottom: 8px;">The closure experience (<code>CheckInCompleteScreen</code>) delivers positive reinforcement through bespoke graphics:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>Particle Physics Engine:</strong> A custom <code>_SparklePainter</code> rendering 28 mathematical 4-point stars with sine-wave twinkle phases across device viewports.</li>
  <li><strong>Dynamic Gradient Arcs:</strong> Custom <code>_GradientRingPainter</code> animating sweep-gradient progress tracks with elastic checkmark triggers.</li>
  <li><strong>4-7-8 Breathing Animator:</strong> Synchronized breathing ring expanding smoothly during inhalation, stabilizing during holds, and gently contracting on exhalation.</li>
</ul>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Persistence &amp; Local Notification Service</h4>
<p style="text-align: justify;">The architecture implements an abstracted <code>CheckInRepository</code> backed by <code>SharedPreferences</code> for instant offline JSON serialization and chronological history retrieval. Daily reflection alarms are scheduled using <code>flutter_local_notifications</code> and timezone management, while a global theme controller supports Light, Dark, and System appearance modes.</p>`,
    challenge: `<p style="text-align: justify; margin-bottom: 12px;">Building a wellness mobile application required solving non-trivial engineering trade-offs between complex state lifecycles, silky-smooth 60 FPS graphical rendering, and robust multi-step data persistence:</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">1. Maintaining 60+ FPS Frame Budgets During Micro-Animations</h4>
<p style="text-align: justify; margin-bottom: 12px;">The 4-7-8 breathing exercise and celebratory completion screens run continuous animation tickers, sine-wave particle calculations, and sweep gradients. Standard Flutter widget tree rebuilds caused micro-stutters on budget mobile devices. I resolved this by isolating all continuous procedural math into dedicated <code>CustomPainter</code> canvas layers and using Riverpod's <code>select</code> filtering to prevent unnecessary widget tree re-evaluations.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">2. Multi-Step Flow State Integrity &amp; Session Resumption</h4>
<p style="text-align: justify; margin-bottom: 12px;">Managing sequential multi-screen form state across 6 check-in steps and 7 assessment categories required preventing partial, corrupted, or premature writes to storage. I implemented an immutable state model with <code>.copyWith()</code> patterns managed by a single in-memory <code>CheckInController</code>. The data is only committed to the persistence repository once the user successfully completes all stages and triggers the final completion screen.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">3. Domain-Level Psychometric Reverse Scoring</h4>
<p style="text-align: justify; margin-bottom: 12px;">Standardized mental health scales include negatively worded items (such as <em>"My emotions often control my behaviour"</em> where higher agreement represents lower emotional regulation). Rather than scattering hardcoded subtraction logic across UI views, I embedded <code>reverseScored</code> metadata directly inside the <code>BaselineStatement</code> model, allowing the scoring engine to systematically compute <code>(6 - rawScore)</code> without polluting presentation components.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">4. Offline-First Architecture &amp; Privacy Preservation</h4>
<p style="text-align: justify;">Given the sensitive nature of personal mental health data, the application was engineered to operate completely offline. The repository abstraction decouples local disk operations from the UI layer, enabling instant reads and writes while laying clean foundations for optional encrypted cloud sync.</p>`,
    result: `<p style="text-align: justify; margin-bottom: 12px;">The outcome is a fluid, responsive mental health application that reduces daily check-in friction to under 2 minutes, empowering users to maintain consistent reflection habits without cognitive burnout.</p>
<p style="text-align: justify; margin-bottom: 8px;">Key architectural and performance accomplishments include:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>Sub-2-Minute Daily Check-In:</strong> A frictionless 6-step guided experience eliminating blank-page anxiety.</li>
  <li><strong>Rock-Solid 60 FPS Performance:</strong> Smooth Canvas rendering and isolated repaint boundaries across Android and iOS devices.</li>
  <li><strong>Zero-Latency Offline Persistence:</strong> Fast local repository storage with chronological reflection history browsing.</li>
  <li><strong>Robust Assessment Quantifications:</strong> Comprehensive psychometric tracking across 7 emotional health categories.</li>
  <li><strong>Configurable Engagement:</strong> Timezone-aware local reminder notifications and full Light / Dark mode support.</li>
</ul>

<h4 style="margin-top: 24px; margin-bottom: 12px; font-size: 1rem; color: var(--color-blue);">Detailed Implementation Stack</h4>
<div style="overflow-x: auto; width: 100%; margin-top: 8px; border: 1px solid var(--color-ink-10); border-radius: 6px;">
  <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem; text-align: left;">
    <thead>
      <tr style="background: var(--color-blue); border-bottom: 1px solid var(--color-ink-10);">
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Layer</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Technology</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Mobile Application</td>
        <td style="padding: 10px 12px;">Flutter (Dart SDK 3.3+)</td>
        <td style="padding: 10px 12px;">Cross-platform mobile UI, navigation, and component rendering</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">State Management</td>
        <td style="padding: 10px 12px;">Riverpod 2.5 (Notifier / NotifierProvider)</td>
        <td style="padding: 10px 12px;">Reactive in-memory state controllers and dependency injection</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Local Storage</td>
        <td style="padding: 10px 12px;">SharedPreferences &amp; JSON Serialization</td>
        <td style="padding: 10px 12px;">Offline persistence for daily check-ins, history, and theme settings</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Notifications</td>
        <td style="padding: 10px 12px;">flutter_local_notifications &amp; timezone</td>
        <td style="padding: 10px 12px;">Configurable daily reminder notifications and timezone conversions</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Graphics &amp; Animation</td>
        <td style="padding: 10px 12px;">CustomPainter, Canvas API &amp; Ticker Mixins</td>
        <td style="padding: 10px 12px;">4-7-8 breathing pacer rings and celebratory particle physics</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Psychometrics &amp; Tools</td>
        <td style="padding: 10px 12px;">7-Domain Likert Question Banks &amp; CBT Circle of Control</td>
        <td style="padding: 10px 12px;">Standardized emotional assessment scoring and cognitive journaling</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Architecture</td>
        <td style="padding: 10px 12px;">Feature-First Modular Architecture</td>
        <td style="padding: 10px 12px;">Clean domain separation (checkin, assessments, onboarding, home)</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Version Control</td>
        <td style="padding: 10px 12px;">Git &amp; GitHub</td>
        <td style="padding: 10px 12px;">Feature branch workflows and repository maintenance</td>
      </tr>
    </tbody>
  </table>
</div>`,
    metric: "< 2m",
    role: "Mobile Application Engineer",
    tech: ["Flutter", "Dart", "Riverpod", "SharedPreferences", "Canvas API", "Local Notifications"],
    media: `<img src="assets/images/project4/img1.jpg" alt="Mental Health Journal Mobile App Interface" style="width: 100%; height: 100%; object-fit: cover;" />`
  },
  "docxpress": {
    id: "docxpress",
    title: "DocXpress",
    category: "Automation / Systems Integration",
    problem: `<p style="text-align: justify; margin-bottom: 12px;">In most small to mid-sized businesses, accounts payable still relies on tedious, error-prone manual data entry: staff download email attachments, transcribe numbers into spreadsheets, and manually cross-reference records.</p>
<p style="text-align: justify; margin-bottom: 8px;">The operational friction creates significant business challenges:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>Administrative Bottlenecks:</strong> Finance teams spend 5–8 minutes per invoice manually typing invoice IDs, billing dates, vendor details, and line item totals instead of focusing on cash flow analysis.</li>
  <li><strong>Duplicate Invoices &amp; Overpayments:</strong> Invoices forwarded across multiple departments frequently get entered twice, creating financial discrepancies and awkward vendor reconciliations.</li>
  <li><strong>Inconsistent Document Formats:</strong> Vendors send invoices in varying formats (digital PDFs, scanned image PDFs, Word documents, spreadsheets), causing rigid rule-based parsers to fail.</li>
</ul>
<p style="text-align: justify;">The goal was to build <strong>DocXpress</strong>—an autonomous, self-hosted document processing and invoice automation pipeline on n8n that captures billing documents from email inboxes, extracts structured data via AI and OCR, executes strict schema and mathematical validations, detects duplicates in real time, and logs structured records directly into Airtable while dispatching team notifications via Slack.</p>`,
    build: `<p style="text-align: justify; margin-bottom: 12px;">I engineered an end-to-end document intelligence and automation pipeline using self-hosted <strong>n8n</strong>, integrating the <strong>Gmail API</strong>, <strong>OpenRouter / NVIDIA LLMs</strong>, custom JavaScript validation code, <strong>Airtable</strong>, and <strong>Slack</strong>.</p>
<p style="text-align: justify; margin-bottom: 12px;">The system operates as an autonomous, multi-stage data processing pipeline:</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin: 16px 0; font-family: var(--font-mono); font-size: 0.8125rem; border: 1px dashed var(--color-ink-20);">
  <span>Email Ingestion (Gmail)</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Document Routing &amp; OCR</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>AI Data Structuring</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Schema &amp; Math Validation</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Duplicate Check</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Airtable Sync</span>
  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--color-gold);">arrow_forward</span>
  <span>Slack Team Alerts</span>
</div>
<p style="text-align: justify; margin-bottom: 20px;">The entire pipeline processes incoming documents from arrival to database record in under 15 seconds with built-in financial safeguards.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Multi-Format Ingestion &amp; Dynamic OCR Routing</h4>
<p style="text-align: justify; margin-bottom: 8px;">The workflow automatically monitors incoming email attachments (.pdf, .docx, .xlsx):</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>Native Digital PDFs:</strong> Extracts machine-readable text directly without unnecessary OCR overhead.</li>
  <li><strong>Scanned Image Documents:</strong> Dynamically routes image-based or low-text PDFs through an OCR engine to convert raw pixels into clean text payloads.</li>
  <li><strong>Word &amp; Spreadsheet Documents:</strong> Normalizes tabular and structured data into standard text representations.</li>
</ul>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Model-Agnostic Structured AI Extraction</h4>
<p style="text-align: justify; margin-bottom: 8px;">Document text is passed to an AI extraction model (configured via OpenRouter / NVIDIA NIM) with strict JSON output schemas. The prompt enforces:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li>Extraction of core financial fields: Vendor Name, Invoice Number, Billing Date, Due Date, Subtotal, Tax/VAT, Total Amount, and Currency.</li>
  <li>Strict non-hallucination constraints: Returning <code>null</code> for missing optional fields rather than inventing values.</li>
  <li>Extraction confidence scoring for downstream automated triage.</li>
</ul>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Dual-Stage Schema &amp; Mathematical Validation</h4>
<p style="text-align: justify; margin-bottom: 8px;">To prevent blind reliance on LLMs, n8n Code nodes execute programmatic checks:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>Schema Validation:</strong> Ensures mandatory fields are populated, dates follow ISO formats, and currency amounts are clean numeric types.</li>
  <li><strong>Business Math Reconciliation:</strong> Validates that <code>Subtotal + Tax ≈ Total Amount</code> within rounding tolerances, and confirms that <code>Due Date >= Invoice Date</code>.</li>
  <li><strong>Confidence Threshold Gating:</strong> Extractions with confidence >= 0.90 continue automatically; lower-scoring documents are flagged for human-in-the-loop review.</li>
</ul>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">Real-Time Duplicate Prevention &amp; Airtable Ledger</h4>
<p style="text-align: justify; margin-bottom: 8px;">Before creating a database record, the workflow queries Airtable for existing records matching the composite key of <code>Vendor Name + Invoice Number</code>:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>New Invoices:</strong> Immediately inserted with full structured metadata, source file references, and processing timestamps.</li>
  <li><strong>Duplicate Invoices:</strong> Bypassed from creation and routed to an automated duplicate alert channel to prevent double payment.</li>
  <li><strong>Slack &amp; Email Notifications:</strong> Sends formatted Slack cards summarizing invoice data or detailing required human approvals.</li>
</ul>`,
    challenge: `<p style="text-align: justify; margin-bottom: 12px;">Building a production-grade financial automation required solving key challenges around accuracy, duplicate prevention, and failure resilience:</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">1. Preventing AI Hallucinations in Financial Workflows</h4>
<p style="text-align: justify; margin-bottom: 12px;">Large Language Models are probabilistic and can invent missing dates or numbers. In financial accounting, an inaccurate total is unacceptable. I solved this by treating the AI model strictly as an extraction parser—not a decision maker. Deterministic n8n JavaScript Code nodes execute mathematical reconciliation (<code>Subtotal + Tax == Total</code>) and ISO date validation before any database record is created.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">2. Multi-Format Normalization &amp; Scanned Document Handling</h4>
<p style="text-align: justify; margin-bottom: 12px;">Invoices arrive as vector PDFs, flat scans, Word documents, or spreadsheets. Rather than sending all documents to an expensive OCR or vision API, the workflow inspects character counts and document metadata to apply lightweight text extraction where possible, only escalating to OCR when insufficient native text is detected.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">3. Real-Time Duplicate Prevention Across Distributed Inboxes</h4>
<p style="text-align: justify; margin-bottom: 12px;">Vendors often send invoices to multiple team members, or resend invoices as payment reminders. I implemented real-time database queries against Airtable using composite vendor and invoice identifiers, intercepting re-sent files before they could create duplicate payment obligations.</p>

<h4 style="margin-top: 20px; margin-bottom: 8px; font-size: 1rem; color: var(--color-blue);">4. Graceful Error Handling &amp; Non-Breaking Exceptions</h4>
<p style="text-align: justify;">Corrupted attachments, non-invoice emails, or transient API timeouts could halt an automated queue. I configured comprehensive error-handling branches so that unreadable files or malformed inputs are logged with diagnostic metadata and routed to an exceptions channel on Slack without crashing the workflow.</p>`,
    result: `<p style="text-align: justify; margin-bottom: 12px;">DocXpress successfully transforms a manual 5–8 minute accounts payable workflow into an autonomous 15-second process, delivering zero duplicate payments and consistent financial data hygiene.</p>
<p style="text-align: justify; margin-bottom: 8px;">Key quantitative and operational outcomes include:</p>
<ul style="margin-left: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; text-align: justify;">
  <li><strong>&lt; 15s Processing Time:</strong> Complete ingestion, OCR extraction, schema validation, and database insertion in seconds.</li>
  <li><strong>100% Duplicate Payment Prevention:</strong> Real-time cross-checking stops forwarded or duplicate invoices immediately.</li>
  <li><strong>Complete Audit Trail:</strong> Every record in Airtable stores source file names, sender details, extraction confidence, and raw payloads.</li>
  <li><strong>Zero Pipeline Crashes:</strong> Graceful routing ensures that invalid or unreadable documents trigger alerts without breaking the queue.</li>
</ul>

<h4 style="margin-top: 24px; margin-bottom: 12px; font-size: 1rem; color: var(--color-blue);">Detailed Implementation Stack</h4>
<div style="overflow-x: auto; width: 100%; margin-top: 8px; border: 1px solid var(--color-ink-10); border-radius: 6px;">
  <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem; text-align: left;">
    <thead>
      <tr style="background: var(--color-blue); border-bottom: 1px solid var(--color-ink-10);">
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Layer</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Technology</th>
        <th style="padding: 10px 12px; font-weight: 600; color: #FFFFFF;">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Workflow Orchestration</td>
        <td style="padding: 10px 12px;">n8n (Self-Hosted)</td>
        <td style="padding: 10px 12px;">Central workflow automation, triggers, data flow, and error branches</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Database &amp; Ledger</td>
        <td style="padding: 10px 12px;">Airtable API</td>
        <td style="padding: 10px 12px;">Structured invoice repository, duplicate lookups, and audit logging</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Document Intake</td>
        <td style="padding: 10px 12px;">Gmail API / IMAP Trigger</td>
        <td style="padding: 10px 12px;">Automated email monitoring and attachment downloading</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">AI &amp; Extraction</td>
        <td style="padding: 10px 12px;">OpenRouter / NVIDIA NIM APIs</td>
        <td style="padding: 10px 12px;">Structured JSON information extraction and confidence scoring</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">OCR &amp; Document Parsing</td>
        <td style="padding: 10px 12px;">PDF Parser / OCR Engine</td>
        <td style="padding: 10px 12px;">Multi-format text conversion for digital and scanned attachments</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Validation &amp; Logic</td>
        <td style="padding: 10px 12px;">JavaScript (Node.js in n8n Code Nodes)</td>
        <td style="padding: 10px 12px;">Schema enforcement, mathematical sanity checks, and duplicate filtering</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--color-ink-05);">
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Alerting &amp; Communications</td>
        <td style="padding: 10px 12px;">Slack API</td>
        <td style="padding: 10px 12px;">Real-time finance notifications, approval alerts, and exception warnings</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; font-weight: 500; color: var(--color-blue);">Version Control</td>
        <td style="padding: 10px 12px;">Git &amp; GitHub</td>
        <td style="padding: 10px 12px;">Workflow JSON backups, documentation, and version control</td>
      </tr>
    </tbody>
  </table>
</div>`,
    metric: "< 15s",
    role: "Automation Systems Engineer",
    tech: ["n8n", "Airtable", "OpenRouter API", "Gmail API", "Slack API", "JavaScript"],
    liveUrl: "https://drive.google.com/file/d/1BZsdWS-uDY9ZNj9dNYAL8P2fgW-QoX3t/view?usp=sharing",
    btnText: "Watch Demo",
    media: `<img src="assets/images/project5/img1.jpg" alt="DocXpress Workflow Canvas" style="width: 100%; height: 100%; object-fit: cover;" />`
  }
};

// Global Scroll Navigation Tracking & Mobile Menu
function initHeaderScroll() {
  const header = document.getElementById('global-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'menu';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== toggleBtn) {
        navMenu.classList.remove('open');
        toggleBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
      });
    });
  }
}

// Project Portfolio Category Filters (Builds page)
let activeFilter = 'all';
let filteredProjectIds = Object.keys(projectsData);

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter');
      filteredProjectIds = [];

      cards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        const cardProjId = card.getAttribute('data-project-id');

        if (activeFilter === 'all' || categories.includes(activeFilter)) {
          card.style.display = 'grid';
          if (cardProjId) filteredProjectIds.push(cardProjId);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Project Detail Overlay (FLIP & Routing)
let currentProjectId = null;

function populateOverlay(projId) {
  const data = projectsData[projId];
  if (!data) return;

  document.getElementById('modal-project-eyebrow').textContent = data.category;
  document.getElementById('modal-project-title').textContent = data.title;
  document.getElementById('modal-project-problem').innerHTML = data.problem;
  document.getElementById('modal-project-build').innerHTML = data.build;
  document.getElementById('modal-project-challenge').innerHTML = data.challenge;
  document.getElementById('modal-project-result').innerHTML = data.result;
  document.getElementById('modal-project-metric').textContent = data.metric;
  document.getElementById('modal-project-role').textContent = data.role;

  // Set tech stack tags
  const techContainer = document.getElementById('modal-project-tech');
  techContainer.innerHTML = '';
  data.tech.forEach(t => {
    const span = document.createElement('span');
    span.className = 'project-tech-tag';
    span.textContent = t;
    techContainer.appendChild(span);
  });

  // Set media block
  const mediaContainer = document.getElementById('modal-project-media');
  mediaContainer.innerHTML = data.media;

  // Set live code link URL (conditionally shown if URL exists)
  const liveBtn = document.getElementById('modal-project-live-btn');
  if (liveBtn) {
    if (data.liveUrl) {
      liveBtn.href = data.liveUrl;
      liveBtn.textContent = data.btnText || "View Live Code";
      liveBtn.parentElement.style.display = 'block';
    } else {
      liveBtn.parentElement.style.display = 'none';
    }
  }

  // Set position indicator
  const totalCount = filteredProjectIds.length;
  const currentIdx = filteredProjectIds.indexOf(projId) + 1;
  document.getElementById('modal-position-indicator').textContent = `${currentIdx} / ${totalCount || Object.keys(projectsData).length}`;

  currentProjectId = projId;

  // Initialize dynamic carousel if present
  initModalCarousel();
}

function initModalCarousel() {
  const container = document.querySelector('.modal-carousel');
  if (!container) return;

  const slides = container.querySelector('.carousel-slides');
  const items = container.querySelectorAll('.carousel-slide');
  const prevBtn = container.querySelector('.carousel-prev');
  const nextBtn = container.querySelector('.carousel-next');
  const dots = container.querySelectorAll('.carousel-dot');

  let currentSlide = 0;
  const totalSlides = items.length;

  function showSlide(idx) {
    if (idx < 0) idx = totalSlides - 1;
    if (idx >= totalSlides) idx = 0;
    currentSlide = idx;

    // Slide transition
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    dots.forEach((dot, dIdx) => {
      if (dIdx === currentSlide) {
        dot.classList.add('active');
        dot.style.background = 'rgba(255, 255, 255, 0.9)';
        dot.style.width = '12px';
      } else {
        dot.classList.remove('active');
        dot.style.background = 'rgba(255, 255, 255, 0.4)';
        dot.style.width = '8px';
      }
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide - 1);
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide + 1);
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(idx);
    });
  });

  showSlide(0);
}

function openOverlay(projId, clickEvent = null) {
  const overlay = document.getElementById('case-study-overlay');
  if (!overlay) return;

  populateOverlay(projId);

  // Apply FLIP animation if trigger clicked and not on mobile (reduced motion)
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  if (clickEvent && !isReducedMotion && !isMobile) {
    const triggerCard = clickEvent.target.closest('.project-card');
    if (triggerCard) {
      const cardRect = triggerCard.getBoundingClientRect();
      const container = overlay.querySelector('.overlay-container');

      // Calculate translation scale parameters
      const startX = cardRect.left + cardRect.width / 2;
      const startY = cardRect.top + cardRect.height / 2;
      const endX = window.innerWidth / 2;
      const endY = window.innerHeight / 2;

      const scaleX = cardRect.width / window.innerWidth;
      const scaleY = cardRect.height / window.innerHeight;

      // Temporarily open container transparently to measure end rect
      container.style.transform = 'none';
      container.style.transition = 'none';
      overlay.classList.add('active');

      const endRect = container.getBoundingClientRect();
      overlay.classList.remove('active');

      // Setup initial state
      const deltaX = (cardRect.left + cardRect.width / 2) - (endRect.left + endRect.width / 2);
      const deltaY = (cardRect.top + cardRect.height / 2) - (endRect.top + endRect.height / 2);
      const startScaleX = cardRect.width / endRect.width;
      const startScaleY = cardRect.height / endRect.height;

      container.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${startScaleX}, ${startScaleY})`;

      // Force repaint
      container.offsetHeight;

      // Animate
      container.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      overlay.classList.add('active');
      container.style.transform = 'translate(0, 0) scale(1)';
    } else {
      overlay.classList.add('active');
    }
  } else {
    // Normal fade state for mobile or reduced motion
    overlay.classList.add('active');
  }

  document.body.classList.add('scroll-locked');

  // Update Route
  history.pushState(null, '', `?project=${projId}`);
}

function closeOverlay() {
  const overlay = document.getElementById('case-study-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.classList.remove('scroll-locked');

  // Clear container custom styles
  const container = overlay.querySelector('.overlay-container');
  if (container) {
    container.style.transform = '';
    container.style.transition = '';
  }

  // Clear query routing
  history.pushState(null, '', window.location.pathname);
  currentProjectId = null;
}

function initOverlay() {
  const overlay = document.getElementById('case-study-overlay');
  if (!overlay) return;

  // Delegate project open clicks
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-overlay-trigger');
    if (trigger) {
      const projId = trigger.getAttribute('data-project');
      if (projId) {
        openOverlay(projId, e);
      }
    }
  });

  // Close triggers
  const closeBtn = document.getElementById('modal-close-trigger');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeOverlay);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  // ESC Close handler
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeOverlay();
    }
  });

  // Navigation Prev/Next controls inside modal
  const prevBtn = document.getElementById('modal-prev-btn');
  const nextBtn = document.getElementById('modal-next-btn');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (!currentProjectId || !filteredProjectIds.length) return;
      let idx = filteredProjectIds.indexOf(currentProjectId);
      let prevIdx = (idx - 1 + filteredProjectIds.length) % filteredProjectIds.length;
      populateOverlay(filteredProjectIds[prevIdx]);
      history.replaceState(null, '', `?project=${filteredProjectIds[prevIdx]}`);
    });

    nextBtn.addEventListener('click', () => {
      if (!currentProjectId || !filteredProjectIds.length) return;
      let idx = filteredProjectIds.indexOf(currentProjectId);
      let nextIdx = (idx + 1) % filteredProjectIds.length;
      populateOverlay(filteredProjectIds[nextIdx]);
      history.replaceState(null, '', `?project=${filteredProjectIds[nextIdx]}`);
    });
  }
}

// Contact Form Submit Handler (Delivers directly to inbox)
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback-message');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const subjectVal = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <span class="material-symbols-outlined" style="margin-left: 8px; font-size: 16px; animation: spin 1s linear infinite; display: inline-block;">sync</span>`;

    try {
      const response = await fetch('https://formsubmit.co/ajax/a6c489f9ce6132026e897695e4efb340', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          _subject: `[Portfolio Inquiry] ${subjectVal} - from ${nameVal}`,
          message: messageVal,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true || response.status === 200)) {
        form.reset();
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'var(--color-paper)';
        feedback.style.color = 'var(--color-blue)';
        feedback.style.border = '1px solid var(--color-blue)';
        feedback.innerHTML = '<strong>Message sent!</strong> Thank you for reaching out, I will get back to you shortly.';
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      feedback.style.display = 'block';
      feedback.style.backgroundColor = '#FFF0F0';
      feedback.style.color = '#C53030';
      feedback.style.border = '1px solid #FEB2B2';
      feedback.innerHTML = '<strong>Unable to send message automatically.</strong> Please reach out directly via <a href="mailto:sidneynduti@gmail.com" style="text-decoration: underline; color: inherit;">sidneynduti@gmail.com</a>.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;

      setTimeout(() => {
        if (feedback.style.display === 'block') {
          feedback.style.transition = 'opacity 0.5s ease';
          feedback.style.opacity = '0';
          setTimeout(() => {
            feedback.style.display = 'none';
            feedback.style.opacity = '1';
          }, 500);
        }
      }, 8000);
    }
  });
}

// Deep Linking Routing Handler
function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const projectParam = params.get('project');

  if (projectParam && projectsData[projectParam]) {
    // Timeout ensuring layout rendering finishes before overlay triggers
    setTimeout(() => {
      openOverlay(projectParam);
    }, 150);
  }
}

// Automations Page: Interactive Schema Tab Controller
function initAutomationTabs() {
  const tabContainers = document.querySelectorAll('.schema-tab-box');
  if (!tabContainers.length) return;

  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.schema-tab-btn');
    const contents = container.querySelectorAll('.schema-tab-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetContent = container.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });
}

// Automations Page: Category Filter Controller
function initAutomationFilters() {
  const filterBtns = document.querySelectorAll('.automation-filter-btn');
  const cards = document.querySelectorAll('.automation-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Initialization of all controllers
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initContactForm();
  initFilters();
  initOverlay();
  handleDeepLink();
  initAutomationTabs();
  initAutomationFilters();
});

