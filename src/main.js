import './style.css';
import { queryAIChat, generateIncidentResponse } from './aiEngine.js';

// ==========================================
// Application State
// ==========================================
const state = {
  activeRole: 'fan', // 'fan' or 'staff'
  chatLanguage: 'en',
  currentSelectedGate: 'C',
  showHeatmap: true,
  showAccessibility: false,
  stadiumDensity: 80, // percentage
  activeIncidents: [
    {
      id: 'INC-101',
      type: 'crowd_congestion',
      title: 'Gate D Congestion Spike',
      location: 'Gate D Entrance',
      severity: 'warning',
      timestamp: '2 mins ago',
      details: 'Sensor telemetry indicates a queue wait of 32 minutes due to ticket scan speed degradation.',
      countAffected: 450,
      active: true,
      resolved: false
    },
    {
      id: 'INC-102',
      type: 'medical_emergency',
      title: 'Medical Alert: Sec 104',
      location: 'Section 104, Row 14',
      severity: 'danger',
      timestamp: '5 mins ago',
      details: 'Fan reported severe heat stroke symptoms. Dispatching immediate medical cart.',
      countAffected: 1,
      active: true,
      resolved: false
    }
  ],
  selectedIncidentId: null,
  dispatchedIncidents: new Set(),
  resources: [
    { id: 'T-1', type: 'Crowd Marshals', assignment: 'Gate Management', location: 'Gate D', status: 'busy' },
    { id: 'T-2', type: 'Paramedic Unit', assignment: 'First Aid Cart Alpha-1', location: 'South Tunnel', status: 'idle' },
    { id: 'T-3', type: 'Transit Marshals', assignment: 'Platform Control', location: 'Rail Station', status: 'idle' },
    { id: 'T-4', type: 'Zone Security', assignment: 'Perimeter Check', location: 'Gate A', status: 'idle' },
    { id: 'T-5', type: 'Operational Volunteers', assignment: 'Fan Guidance', location: 'Gate B', status: 'idle' }
  ],
  gateData: {
    A: { waitTime: 5, status: 'Optimal', location: 'North Entrance' },
    B: { waitTime: 18, status: 'Moderate Congestion', location: 'East Entrance' },
    C: { waitTime: 2, status: 'Optimal', location: 'South Entrance' },
    D: { waitTime: 32, status: 'Heavy Congestion', location: 'West Entrance' }
  }
};

// ==========================================
// DOM Elements
// ==========================================
let els = {};

function initDOMElements() {
  els = {
    // Mode Switchers
    btnFanMode: document.getElementById('btn-fan-mode'),
    btnStaffMode: document.getElementById('btn-staff-mode'),
    fanHubView: document.getElementById('fan-hub-view'),
    staffView: document.getElementById('staff-view'),

    // Fan Chat Elements
    chatMessagesBox: document.getElementById('chat-messages-box'),
    chatUserInput: document.getElementById('chat-user-input'),
    btnChatSend: document.getElementById('btn-chat-send'),
    chatLangSelect: document.getElementById('chat-lang-select'),
    chatChips: document.querySelectorAll('.chip-btn'),

    // Eco Calculator
    transitSelect: document.getElementById('transit-select'),
    carbonCo2Val: document.getElementById('carbon-co2-val'),
    carbonRatingBadge: document.getElementById('carbon-rating-badge'),
    carbonProgress: document.getElementById('carbon-progress'),
    carbonAdvice: document.getElementById('carbon-advice'),

    // Ticket
    ticketAssignedGate: document.getElementById('ticket-assigned-gate'),
    ticketGateSuggestion: document.getElementById('ticket-gate-suggestion'),

    // Map Controls
    btnToggleHeatmap: document.getElementById('btn-toggle-heatmap'),
    btnToggleAccessibility: document.getElementById('btn-toggle-accessibility'),
    stadiumCanvasContainer: document.getElementById('stadium-canvas-container'),
    mapTooltip: document.getElementById('map-tooltip'),

    // Operational Dashboard (Staff)
    opsAttendanceVal: document.getElementById('ops-attendance-val'),
    opsDensityVal: document.getElementById('ops-density-val'),
    opsDensityBar: document.getElementById('ops-density-bar'),
    opsAlertCard: document.getElementById('ops-alert-card'),
    opsAlertCount: document.getElementById('ops-alert-count'),

    // Sim Buttons
    btnSimCrowdSpike: document.getElementById('btn-sim-crowd-spike'),
    btnSimMedical: document.getElementById('btn-sim-medical'),
    btnSimTransit: document.getElementById('btn-sim-transit'),
    btnSimLostChild: document.getElementById('btn-sim-lostchild'),
    sensorDensitySlider: document.getElementById('sensor-density-slider'),
    densitySliderVal: document.getElementById('density-slider-val'),

    // Incident Intelligence Feed
    alertsLogContainer: document.getElementById('alerts-log-container'),
    noActiveIncident: document.getElementById('no-active-incident'),
    activeIncidentDetails: document.getElementById('active-incident-details'),
    activeSeverity: document.getElementById('active-severity'),
    activeIncidentTitle: document.getElementById('active-incident-title'),
    activeLocation: document.getElementById('active-location'),
    activeTime: document.getElementById('active-time'),
    activeSopList: document.getElementById('active-sop-list'),
    activeAnnouncement: document.getElementById('active-announcement'),
    activeStaffDirections: document.getElementById('active-staff-directions'),
    activeResourceList: document.getElementById('active-resource-list'),
    btnBroadcastAnnouncement: document.getElementById('btn-broadcast-announcement'),
    btnDispatchTeams: document.getElementById('btn-dispatch-teams'),

    // Volunteer tracking
    resourceTableBody: document.getElementById('resource-table-body')
  };
}

// ==========================================
// Initialization & Routing
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  initDOMElements();
  setupEventListeners();
  renderStadiumMap();
  updateEcoTracker();
  renderAlertLog();
  renderResourceTable();
  startTelemetrySimulation();
});

function setupEventListeners() {
  // Role switcher
  els.btnFanMode.addEventListener('click', () => switchRole('fan'));
  els.btnStaffMode.addEventListener('click', () => switchRole('staff'));

  // Chat
  els.btnChatSend.addEventListener('click', handleChatSubmit);
  els.chatUserInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
  });
  els.chatLangSelect.addEventListener('change', (e) => {
    state.chatLanguage = e.target.value;
    // Push system welcome message in target language
    const messages = {
      en: "Hello! I am your StadiumOS AI assistant. How can I help you navigate the stadium, check transit options, or view match details today?",
      es: "¡Hola! Soy tu asistente de IA de StadiumOS. ¿Cómo puedo ayudarte a navegar por el estadio, consultar el transporte o ver los detalles del partido hoy?",
      fr: "Bonjour ! Je suis votre assistant IA StadiumOS. Comment puis-je vous aider à naviguer dans le stade, à vérifier les transports ou à voir les détails du match aujourd'hui ?",
      pt: "Olá! Sou o seu assistente de IA StadiumOS. Como posso ajudar você a navegar no estádio, verificar o transporte ou ver os detalhes do jogo hoje?",
      de: "Hallo! Ich bin Ihr StadiumOS KI-Assistent. Wie kann ich Ihnen heute bei der Navigation im Stadion, den Verkehrsverbindungen oder den Spieldetails helfen?",
      ar: "مرحباً! أنا مساعد الذكاء الاصطناعي StadiumOS. كيف يمكنني مساعدتك في التنقل في الملعب، أو التحقق من خيارات النقل، أو عرض تفاصيل المباراة اليوم؟"
    };
    appendMessage('system', messages[state.chatLanguage] || messages['en']);
  });

  // Chat Chip suggestion buttons
  els.chatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query;
      els.chatUserInput.value = query;
      handleChatSubmit();
    });
  });

  // Eco transit calculation
  els.transitSelect.addEventListener('change', updateEcoTracker);

  // Map Controls
  els.btnToggleHeatmap.addEventListener('click', () => {
    state.showHeatmap = !state.showHeatmap;
    els.btnToggleHeatmap.classList.toggle('active', state.showHeatmap);
    renderStadiumMap();
  });

  els.btnToggleAccessibility.addEventListener('click', () => {
    state.showAccessibility = !state.showAccessibility;
    els.btnToggleAccessibility.classList.toggle('active', state.showAccessibility);
    renderStadiumMap();
  });

  // Simulator controls
  els.btnSimCrowdSpike.addEventListener('click', () => simulateIncident('crowd_congestion'));
  els.btnSimMedical.addEventListener('click', () => simulateIncident('medical_emergency'));
  els.btnSimTransit.addEventListener('click', () => simulateIncident('transit_disruption'));
  els.btnSimLostChild.addEventListener('click', () => simulateIncident('lost_child'));

  els.sensorDensitySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.stadiumDensity = val;
    els.densitySliderVal.textContent = val + '%';
    els.opsDensityVal.textContent = val + '% (' + (val > 80 ? 'Heavy' : val > 50 ? 'Moderate' : 'Light') + ')';
    els.opsDensityBar.style.width = val + '%';
    if (val > 80) {
      els.opsDensityBar.style.backgroundColor = 'var(--danger-color)';
    } else if (val > 50) {
      els.opsDensityBar.style.backgroundColor = 'var(--warning-color)';
    } else {
      els.opsDensityBar.style.backgroundColor = 'var(--success-color)';
    }
    renderStadiumMap();
  });

  // Incident Control Actions
  els.btnBroadcastAnnouncement.addEventListener('click', () => {
    if (!state.selectedIncidentId) return;
    const incident = state.activeIncidents.find(i => i.id === state.selectedIncidentId);
    if (!incident) return;

    const responsePlan = generateIncidentResponse(incident.type, incident.location, incident.severity);
    // Push simulated high-priority announcement directly into the Fan chat room!
    appendMessage('system', `🚨 **URGENT BROADCAST:** ${responsePlan.announcementTemplate}`);
    alert(`Announcement broadcasted to all Fans near ${incident.location}!`);
  });

  els.btnDispatchTeams.addEventListener('click', () => {
    if (!state.selectedIncidentId) return;
    const incident = state.activeIncidents.find(i => i.id === state.selectedIncidentId);
    if (!incident) return;

    // Dispatched successfully!
    state.dispatchedIncidents.add(incident.id);
    
    // Assign status to resources
    const responsePlan = generateIncidentResponse(incident.type, incident.location, incident.severity);
    responsePlan.resourceAllocations.forEach(allocation => {
      const matchTeam = state.resources.find(r => r.type === allocation.role && r.status === 'idle');
      if (matchTeam) {
        matchTeam.status = 'dispatched';
        matchTeam.location = allocation.location;
        matchTeam.assignment = `Handling ${incident.title}`;
      }
    });

    renderResourceTable();
    alert(`Tactical dispatch plan approved. Operations staff deployed to ${incident.location}.`);
    
    // Auto-resolve incident after 12 seconds in the background
    setTimeout(() => {
      resolveIncident(incident.id);
    }, 12000);
  });
}

function switchRole(role) {
  state.activeRole = role;
  
  if (role === 'fan') {
    els.btnFanMode.classList.add('active');
    els.btnStaffMode.classList.remove('active');
    els.fanHubView.classList.add('active');
    els.staffView.classList.remove('active');
  } else {
    els.btnFanMode.classList.remove('active');
    els.btnStaffMode.classList.add('active');
    els.fanHubView.classList.remove('active');
    els.staffView.classList.add('active');
    
    // Refresh incident details/logs
    renderAlertLog();
    renderResourceTable();
  }
}

// ==========================================
// Fan AI Chat Logic
// ==========================================
function handleChatSubmit() {
  const text = els.chatUserInput.value.trim();
  if (!text) return;

  // Append user message
  appendMessage('user', text);
  els.chatUserInput.value = '';

  // Simulate typing delay
  const typingMsgId = appendTypingIndicator();
  
  setTimeout(() => {
    removeTypingIndicator(typingMsgId);
    const response = queryAIChat(text, state.chatLanguage);
    appendMessage('system', response);
  }, 1000);
}

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender === 'user' ? 'user-msg' : 'system-msg'}`;
  
  const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
  
  // Format markdown lists and bold text simply
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gim, '<strong>$1</strong>')
    .replace(/^#### (.*$)/gim, '<strong style="color:var(--primary-accent);">$1</strong>')
    .replace(/^- (.*$)/gim, '• $1')
    .replace(/\n/g, '<br>');

  msgDiv.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid ${icon}"></i></div>
    <div class="msg-text">${formattedText}</div>
  `;
  
  els.chatMessagesBox.appendChild(msgDiv);
  els.chatMessagesBox.scrollTop = els.chatMessagesBox.scrollHeight;
}

function appendTypingIndicator() {
  const typingDiv = document.createElement('div');
  const id = 'typing-' + Date.now();
  typingDiv.id = id;
  typingDiv.className = 'message system-msg';
  typingDiv.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="msg-text"><i class="fa-solid fa-ellipsis fa-bounce"></i> Thinking...</div>
  `;
  els.chatMessagesBox.appendChild(typingDiv);
  els.chatMessagesBox.scrollTop = els.chatMessagesBox.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ==========================================
// Eco Transit Logic
// ==========================================
const carbonData = {
  train: { co2: 0.12, rating: 'Eco-Friendly', percent: 10, ratingClass: 'eco-badge', advice: 'Reduces your carbon footprint by 85% compared to driving! Show your digital match ticket for free boarding on the NJ Transit train!' },
  bus: { co2: 0.22, rating: 'Good', percent: 22, ratingClass: 'eco-badge', advice: 'Reduces footprint by 70%. High occupancy lanes enabled for fast access to parking zones.' },
  rideshare: { co2: 0.65, rating: 'Moderate', percent: 55, ratingClass: 'eco-badge warning', advice: 'Consider carpooling (UberPool/Lyft Shared) to cut emissions and ride-share terminal access fees in half.' },
  car: { co2: 1.20, rating: 'High Impact', percent: 100, ratingClass: 'eco-badge danger', advice: 'Avoid stadium gridlock. Park-and-ride lot shuttles save up to 40 minutes of queue time.' }
};

function updateEcoTracker() {
  const mode = els.transitSelect.value;
  const data = carbonData[mode] || carbonData.train;

  els.carbonCo2Val.textContent = data.co2;
  els.carbonRatingBadge.textContent = data.rating;
  els.carbonRatingBadge.className = `stat-badge ${data.ratingClass}`;
  els.carbonProgress.style.width = `${data.percent}%`;
  
  if (mode === 'car') {
    els.carbonProgress.style.background = 'var(--danger-color)';
  } else if (mode === 'rideshare') {
    els.carbonProgress.style.background = 'var(--warning-color)';
  } else {
    els.carbonProgress.style.background = 'linear-gradient(90deg, var(--success-color), var(--primary-accent))';
  }

  els.carbonAdvice.textContent = data.advice;
}

// ==========================================
// Interactive Stadium SVG Map
// ==========================================
function renderStadiumMap() {
  const container = els.stadiumCanvasContainer;
  if (!container) return;

  // Let's create an elegant, responsive inline SVG
  // Grid bounds: 500 x 340

  let gateColorA = 'var(--optimal-color)';
  let gateColorB = 'var(--warning-color)';
  let gateColorC = 'var(--optimal-color)';
  let gateColorD = 'var(--danger-color)';

  // Find wait times from state
  const getGateStateColor = (gate) => {
    const time = state.gateData[gate].waitTime;
    if (time > 25) return 'var(--danger-color)';
    if (time > 10) return 'var(--warning-color)';
    return 'var(--optimal-color)';
  };

  const cA = getGateStateColor('A');
  const cB = getGateStateColor('B');
  const cC = getGateStateColor('C');
  const cD = getGateStateColor('D');

  // Heatmap values based on stadium density
  const getHeatmapColor = (factor) => {
    if (!state.showHeatmap) return 'rgba(25, 28, 50, 0.4)';
    const intensity = Math.min(100, Math.max(10, state.stadiumDensity * factor));
    if (intensity > 85) return 'rgba(239, 68, 68, 0.65)'; // Hot
    if (intensity > 60) return 'rgba(245, 158, 11, 0.55)'; // Warning
    return 'rgba(0, 229, 255, 0.35)'; // Cool
  };

  // Check which routes to render
  let routeOverlay = '';
  if (state.showAccessibility) {
    // Accessible route: Gate C to Section 104 Elevator
    routeOverlay = `
      <!-- Accessible Route Line -->
      <path d="M 250,300 C 250,260 210,220 210,180" class="svg-route-path" stroke="var(--primary-accent)" stroke-width="3" />
      <circle cx="210" cy="180" r="6" fill="#fff" stroke="var(--primary-accent)" stroke-width="2" />
      <text x="210" y="170" fill="var(--primary-accent)" font-size="10" font-weight="bold" text-anchor="middle">♿ Elevator Hub</text>
    `;
  } else if (state.currentSelectedGate) {
    // Standard recommended path from selected gate to center
    const gateCoords = {
      A: { x: 250, y: 40, rx: 250, ry: 90 },
      B: { x: 440, y: 170, rx: 370, ry: 170 },
      C: { x: 250, y: 300, rx: 250, ry: 250 },
      D: { x: 60, y: 170, rx: 130, ry: 170 }
    };
    const coords = gateCoords[state.currentSelectedGate];
    routeOverlay = `
      <!-- Main Selected Route -->
      <path d="M ${coords.x},${coords.y} L ${coords.rx},${coords.ry}" class="svg-route-path" stroke="var(--gold-accent)" stroke-width="3" />
      <circle cx="${coords.rx}" cy="${coords.ry}" r="5" fill="var(--gold-accent)" />
    `;
  }

  // Active alarms flashing on map
  let alarmHighlights = '';
  state.activeIncidents.forEach(inc => {
    if (inc.resolved) return;
    if (inc.type === 'crowd_congestion') {
      alarmHighlights += `
        <circle cx="60" cy="170" r="22" fill="none" stroke="var(--danger-color)" stroke-width="2" class="svg-gate-node">
          <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      `;
    } else if (inc.type === 'medical_emergency') {
      alarmHighlights += `
        <g transform="translate(180, 110)">
          <circle cx="0" cy="0" r="14" fill="rgba(239, 68, 68, 0.4)" stroke="var(--danger-color)" stroke-width="1.5">
            <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="4" fill="#fff" font-size="12" font-family="FontAwesome" text-anchor="middle">✚</text>
        </g>
      `;
    }
  });

  const svgContent = `
    <svg viewBox="0 0 500 340" class="stadium-svg">
      <defs>
        <!-- Gradients -->
        <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1b2a4a" />
          <stop offset="100%" stop-color="#0a1120" />
        </radialGradient>
      </defs>

      <!-- Stadium Blueprint Base Layout -->
      <!-- Outer boundary / perimeter -->
      <rect x="10" y="10" width="480" height="320" rx="20" class="svg-bg" />
      
      <!-- Outer Ring Walkway -->
      <ellipse cx="250" cy="170" rx="210" ry="110" class="svg-ring-outer" />
      
      <!-- Stadium Seating Zones (Heatmap Sectors) -->
      <!-- Sector North-West -->
      <path d="M 120,90 A 180,90 0 0,1 250,70 L 250,110 A 130,60 0 0,0 160,120 Z" 
            class="svg-heatmap-zone" fill="${getHeatmapColor(0.85)}" stroke="rgba(255,255,255,0.08)" />
      <!-- Sector North-East -->
      <path d="M 250,70 A 180,90 0 0,1 380,90 L 340,120 A 130,60 0 0,0 250,110 Z" 
            class="svg-heatmap-zone" fill="${getHeatmapColor(0.7)}" stroke="rgba(255,255,255,0.08)" />
      <!-- Sector South-East -->
      <path d="M 380,250 A 180,90 0 0,1 250,270 L 250,230 A 130,60 0 0,0 340,220 Z" 
            class="svg-heatmap-zone" fill="${getHeatmapColor(0.95)}" stroke="rgba(255,255,255,0.08)" />
      <!-- Sector South-West -->
      <path d="M 250,270 A 180,90 0 0,1 120,250 L 160,220 A 130,60 0 0,0 250,230 Z" 
            class="svg-heatmap-zone" fill="${getHeatmapColor(1.1)}" stroke="rgba(255,255,255,0.08)" />

      <!-- Inner Bowl Ring border -->
      <ellipse cx="250" cy="170" rx="120" ry="60" class="svg-ring-inner" />
      
      <!-- Central Football pitch -->
      <rect x="180" y="130" width="140" height="80" rx="4" class="svg-field" />
      <line x1="250" y1="130" x2="250" y2="210" stroke="rgba(0, 229, 255, 0.2)" stroke-width="1.5" />
      <circle cx="250" cy="170" r="16" fill="none" stroke="rgba(0, 229, 255, 0.2)" stroke-width="1.5" />

      <!-- Route Overlays -->
      ${routeOverlay}
      
      <!-- Alarm indicators -->
      ${alarmHighlights}

      <!-- Gate Nodes -->
      <!-- Gate A (North) -->
      <circle cx="250" cy="40" r="14" fill="${cA}" stroke="#fff" stroke-width="2" class="svg-gate-node" id="map-gate-A" />
      <text x="250" y="44" class="svg-gate-text">A</text>

      <!-- Gate B (East) -->
      <circle cx="440" cy="170" r="14" fill="${cB}" stroke="#fff" stroke-width="2" class="svg-gate-node" id="map-gate-B" />
      <text x="440" y="174" class="svg-gate-text">B</text>

      <!-- Gate C (South) -->
      <circle cx="250" cy="300" r="14" fill="${cC}" stroke="#fff" stroke-width="2" class="svg-gate-node" id="map-gate-C" />
      <text x="250" y="304" class="svg-gate-text">C</text>

      <!-- Gate D (West) -->
      <circle cx="60" cy="170" r="14" fill="${cD}" stroke="#fff" stroke-width="2" class="svg-gate-node" id="map-gate-D" />
      <text x="60" y="174" class="svg-gate-text">D</text>

    </svg>
  `;

  container.innerHTML = svgContent;

  // Bind mouse interactive events to Gate Nodes
  const gates = ['A', 'B', 'C', 'D'];
  gates.forEach(gate => {
    const el = document.getElementById(`map-gate-${gate}`);
    if (!el) return;

    // Click selects gate and updates route
    el.addEventListener('click', () => {
      state.currentSelectedGate = gate;
      els.ticketAssignedGate.textContent = `Gate ${gate}`;
      
      // Update warning tip
      const gateDets = state.gateData[gate];
      els.ticketGateSuggestion.innerHTML = `
        <i class="fa-solid fa-wand-magic-sparkles text-glow"></i>
        <span><strong>AI Optimized Route:</strong> Entrance via ${gateDets.location} - Wait time is currently ${gateDets.waitTime} mins.</span>
      `;
      
      renderStadiumMap();
    });

    // Hover reveals wait time tooltip
    el.addEventListener('mousemove', (e) => {
      const details = state.gateData[gate];
      els.mapTooltip.style.opacity = '1';
      els.mapTooltip.textContent = `Gate ${gate} wait time: ${details.waitTime}m (${details.status})`;
      
      // Keep tooltip near gate
      const wrapperRect = container.getBoundingClientRect();
      const x = e.clientX - wrapperRect.left + 10;
      const y = e.clientY - wrapperRect.top + 10;
      els.mapTooltip.style.left = `${x}px`;
      els.mapTooltip.style.top = `${y}px`;
    });

    el.addEventListener('mouseleave', () => {
      els.mapTooltip.style.opacity = '0';
    });
  });
}

// ==========================================
// Operational Command / Incident Management
// ==========================================
function renderAlertLog() {
  const container = els.alertsLogContainer;
  if (!container) return;

  if (state.activeIncidents.filter(i => !i.resolved).length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 20px;">
        <i class="fa-solid fa-shield-halved text-success"></i>
        <p style="font-size: 0.75rem; color:#64748b;">No active alarms reported from CCTV/IoT</p>
      </div>
    `;
    
    els.opsAlertCard.classList.remove('alert-state');
    els.opsAlertCount.textContent = '0 Active';
    const flash = els.opsAlertCard.querySelector('.flash-indicator');
    if (flash) flash.style.display = 'none';

    els.noActiveIncident.style.display = 'flex';
    els.activeIncidentDetails.style.display = 'none';
    state.selectedIncidentId = null;
    return;
  }

  // Active alerts present
  const activeCount = state.activeIncidents.filter(i => !i.resolved).length;
  els.opsAlertCount.textContent = `${activeCount} Active`;
  els.opsAlertCard.classList.add('alert-state');
  const flash = els.opsAlertCard.querySelector('.flash-indicator');
  if (flash) flash.style.display = 'block';

  let html = '';
  state.activeIncidents.forEach(inc => {
    if (inc.resolved) return;
    const isActiveClass = state.selectedIncidentId === inc.id ? 'active' : '';
    const severityPillClass = inc.severity === 'danger' ? 'danger' : 'warning';
    const icon = inc.type === 'crowd_congestion' ? 'fa-users' : 
                 inc.type === 'medical_emergency' ? 'fa-truck-medical' : 
                 inc.type === 'transit_disruption' ? 'fa-train-slash' : 'fa-triangle-exclamation';

    html += `
      <div class="alert-feed-item ${inc.severity} ${isActiveClass}" data-id="${inc.id}">
        <div class="alert-left">
          <div class="alert-indicator-ring">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="alert-feed-text">
            <h5>${inc.title}</h5>
            <p>${inc.location}</p>
          </div>
        </div>
        <div class="alert-feed-right">
          <span class="badge-pill ${severityPillClass}">${inc.severity}</span>
          <span>${inc.timestamp}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add click handlers
  const items = container.querySelectorAll('.alert-feed-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      state.selectedIncidentId = id;
      renderAlertLog(); // re-render to apply active class
      loadIncidentDetails(id);
    });
  });
}

function loadIncidentDetails(id) {
  const incident = state.activeIncidents.find(i => i.id === id);
  if (!incident) return;

  els.noActiveIncident.style.display = 'none';
  els.activeIncidentDetails.style.display = 'block';

  els.activeIncidentTitle.textContent = incident.title;
  els.activeLocation.textContent = incident.location;
  els.activeTime.textContent = incident.timestamp;
  els.activeSeverity.textContent = incident.severity.toUpperCase();
  els.activeSeverity.className = `severity-tag ${incident.severity === 'danger' ? 'danger' : 'warning'}`;

  // Call AI response engine
  const responsePlan = generateIncidentResponse(incident.type, incident.location, incident.severity);

  // SOP List
  els.activeSopList.innerHTML = responsePlan.recommendedSOP.map(step => `<li>${step}</li>`).join('');

  // Announcement
  els.activeAnnouncement.textContent = responsePlan.announcementTemplate;

  // Staff Directions
  els.activeStaffDirections.textContent = responsePlan.staffDirections;

  // Team allocation chips
  els.activeResourceList.innerHTML = responsePlan.resourceAllocations.map(res => `
    <div class="res-tag">
      <i class="fa-solid fa-users"></i>
      <span>${res.role}</span>
      <span class="res-cnt">${res.count}</span>
    </div>
  `).join('');

  // Update dispatch button text based on status
  if (state.dispatchedIncidents.has(id)) {
    els.btnDispatchTeams.innerHTML = `<i class="fa-solid fa-circle-check"></i> Teams Dispatched (Awaiting Auto-resolve)`;
    els.btnDispatchTeams.disabled = true;
    els.btnDispatchTeams.style.opacity = '0.6';
  } else {
    els.btnDispatchTeams.innerHTML = `<i class="fa-solid fa-bolt"></i> Approve Plan & Dispatch Teams`;
    els.btnDispatchTeams.disabled = false;
    els.btnDispatchTeams.style.opacity = '1';
  }
}

function simulateIncident(type) {
  let incident = {};
  if (type === 'crowd_congestion') {
    incident = {
      id: 'INC-' + Math.floor(Math.random() * 900 + 100),
      type: 'crowd_congestion',
      title: 'Gate D Congestion Spike',
      location: 'Gate D Entrance',
      severity: 'warning',
      timestamp: 'Just now',
      details: 'Gate sensor detects a queue size over 400 people.',
      countAffected: 420
    };
    state.gateData.D.waitTime = 45;
  } else if (type === 'medical_emergency') {
    incident = {
      id: 'INC-' + Math.floor(Math.random() * 900 + 100),
      type: 'medical_emergency',
      title: 'Medical Alert: Sec 104',
      location: 'Section 104, Row 14',
      severity: 'danger',
      timestamp: 'Just now',
      details: 'Panic call from Section 104 describing syncope.',
      countAffected: 1
    };
  } else if (type === 'transit_disruption') {
    incident = {
      id: 'INC-' + Math.floor(Math.random() * 900 + 100),
      type: 'transit_disruption',
      title: 'Meadowlands Train Delay',
      location: 'NJ Transit Station platform',
      severity: 'warning',
      timestamp: 'Just now',
      details: 'Dispatcher reports switch failure between Secaucus and Meadowlands.',
      countAffected: 2500
    };
    state.gateData.B.waitTime = 35; // Transit link gate
  } else if (type === 'lost_child') {
    incident = {
      id: 'INC-' + Math.floor(Math.random() * 900 + 100),
      type: 'lost_child',
      title: 'Lost Child: Gate A Lobby',
      location: 'Gate A North Concourse',
      severity: 'warning',
      timestamp: 'Just now',
      details: 'Parent reported 7-year-old child separated near stadium entrance gates.',
      countAffected: 1
    };
  }

  // Push to start of list
  state.activeIncidents.unshift(incident);
  state.selectedIncidentId = incident.id;
  
  renderAlertLog();
  loadIncidentDetails(incident.id);
  renderStadiumMap();

  // Play audio beacon beep if supported
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    // browser blocked audio Context
  }
}

function resolveIncident(id) {
  const index = state.activeIncidents.findIndex(i => i.id === id);
  if (index === -1) return;

  const incident = state.activeIncidents[index];
  incident.resolved = true;

  // Reset transit times if relevant
  if (incident.type === 'crowd_congestion') {
    state.gateData.D.waitTime = 12;
  } else if (incident.type === 'transit_disruption') {
    state.gateData.B.waitTime = 10;
  }

  // Free resources assigned
  state.resources.forEach(r => {
    if (r.assignment.includes(incident.title)) {
      r.status = 'idle';
      r.assignment = 'Perimeter Control';
    }
  });

  renderAlertLog();
  renderResourceTable();
  renderStadiumMap();
}

function renderResourceTable() {
  const tbody = els.resourceTableBody;
  if (!tbody) return;

  let html = '';
  state.resources.forEach(res => {
    let statusClass = 'idle';
    if (res.status === 'dispatched') statusClass = 'dispatched';
    else if (res.status === 'busy') statusClass = 'busy';

    html += `
      <tr>
        <td><strong>${res.id}</strong></td>
        <td>${res.type}</td>
        <td>${res.assignment}</td>
        <td>${res.location}</td>
        <td><span class="res-status-pill ${statusClass}">${res.status.toUpperCase()}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function startTelemetrySimulation() {
  setInterval(() => {
    // 1. Slightly vary gate wait times
    const gates = ['A', 'B', 'C', 'D'];
    gates.forEach(gate => {
      const waitElement = document.getElementById(`gate-wait-${gate}`);
      if (!waitElement) return;

      // Gate wait time bounds
      const bounds = {
        A: { min: 2, max: 15 },
        B: { min: 8, max: 25 },
        C: { min: 1, max: 8 },
        D: { min: 15, max: 60 }
      };

      const gateBound = bounds[gate];
      // Random delta of -2, -1, 0, 1, 2
      const delta = Math.floor(Math.random() * 5) - 2;
      let newWait = state.gateData[gate].waitTime + delta;
      
      // Keep within bounds
      if (newWait < gateBound.min) newWait = gateBound.min;
      if (newWait > gateBound.max) newWait = gateBound.max;

      // Update state & DOM
      state.gateData[gate].waitTime = newWait;
      waitElement.textContent = `${newWait}m`;

      // Update gate legend status color classes (optimal, warning, danger)
      const legendItem = document.querySelector(`.gate-legend-item[data-gate="${gate}"]`);
      if (legendItem) {
        legendItem.className = 'gate-legend-item';
        if (newWait > 25) {
          legendItem.classList.add('danger');
          state.gateData[gate].status = 'Heavy Congestion';
        } else if (newWait > 10) {
          legendItem.classList.add('warning');
          state.gateData[gate].status = 'Moderate Congestion';
        } else {
          legendItem.classList.add('optimal');
          state.gateData[gate].status = 'Optimal';
        }
      }
    });

    // 2. Slightly fluctuate overall attendance and density
    const densityDelta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
    let newDensity = state.stadiumDensity + densityDelta;
    if (newDensity < 10) newDensity = 10;
    if (newDensity > 100) newDensity = 100;
    state.stadiumDensity = newDensity;

    // Update UI if in staff mode
    const slider = document.getElementById('sensor-density-slider');
    if (slider) {
      slider.value = newDensity;
      const sliderVal = document.getElementById('density-slider-val');
      if (sliderVal) sliderVal.textContent = newDensity + '%';
    }

    const densityVal = document.getElementById('ops-density-val');
    if (densityVal) {
      densityVal.textContent = newDensity + '% (' + (newDensity > 80 ? 'Heavy' : newDensity > 50 ? 'Moderate' : 'Light') + ')';
    }

    const densityBar = document.getElementById('ops-density-bar');
    if (densityBar) {
      densityBar.style.width = newDensity + '%';
      if (newDensity > 80) densityBar.style.backgroundColor = 'var(--danger-color)';
      else if (newDensity > 50) densityBar.style.backgroundColor = 'var(--warning-color)';
      else densityBar.style.backgroundColor = 'var(--success-color)';
    }

    // 3. Re-render the stadium map to show updated heatmap colors
    renderStadiumMap();

  }, 4000);
}

