/**
 * StadiumOS AI - Generative AI Simulation Engine
 * Emulates LLM capabilities for multilingual assistance, real-time routing,
 * and operational decision-making during the FIFA World Cup 2026.
 */

// Simulated Knowledge Base for FIFA World Cup 2026 Stadiums
const KNOWLEDGE_BASE = {
  stadium: {
    name: "MetLife Stadium (New York/New Jersey)",
    capacity: 82500,
    gates: {
      A: { location: "North Entrance", status: "Optimal", waitTime: "5 mins", accessibility: "Wheelchair accessible ramp available" },
      B: { location: "East Entrance (NJ Transit Link)", status: "Moderate Congestion", waitTime: "18 mins", accessibility: "Stairs and elevators available" },
      C: { location: "South Entrance (VIP & Media)", status: "Optimal", waitTime: "2 mins", accessibility: "Full accessibility access" },
      D: { location: "West Entrance (Parking Lots E & F)", status: "Heavy Congestion", waitTime: "32 mins", accessibility: "Ramp and escalators (under maintenance)" }
    },
    transport: {
      train: "NJ Transit Meadowlands Rail Line. Trains depart every 10 minutes to Secaucus Junction.",
      bus: "Coach USA Express Bus service directly from Port Authority Terminal, NY.",
      rideshare: "Rideshare Zone is located in Lot K. Walk through Gate C and follow the signs.",
      parking: "Pre-paid parking is required. Lots A-D are standard; E-G are premium/VIP. Charging stations in Lot C.",
      carbon_impact: {
        train: { co2: 0.12, rating: "Eco-Friendly", suggestion: "Reduces your carbon footprint by 85% compared to driving!" },
        bus: { co2: 0.22, rating: "Good", suggestion: "Reduces footprint by 70%. High occupancy lane travel." },
        rideshare: { co2: 0.65, rating: "Moderate", suggestion: "Consider carpooling (UberPool/Lyft Shared) to cut CO2 in half." },
        car: { co2: 1.20, rating: "High Impact", suggestion: "Switch to public transit or standard park-and-ride to save 1.0kg CO2." }
      }
    },
    sustainability: {
      compostable: "All concession packaging is 100% compostable. Look for green bins.",
      energy: "Stadium powered by 100% renewable energy credits and on-site solar ring canopy.",
      water: "Rainwater harvesting system feeds the field irrigation and greywater toilets."
    },
    rules: {
      bag_policy: "Clear bags only. Maximum size is 12\" x 6\" x 12\". Small clutches allowed up to 4.5\" x 6.5\".",
      bottles: "No glass or metal bottles. One factory-sealed plastic water bottle up to 20oz is allowed.",
      banners: "Allowed if under 3' x 4' and not containing commercial or offensive language."
    }
  },
  matches: [
    { id: "M1", teams: "USA vs England", date: "July 13, 2026", time: "20:00", status: "In Progress (Second Half 1-1)" },
    { id: "M2", teams: "Mexico vs Argentina", date: "July 14, 2026", time: "18:00", status: "Scheduled" },
    { id: "M3", teams: "Canada vs France", date: "July 16, 2026", time: "21:00", status: "Scheduled" }
  ]
};

// Multi-language response templates
const RESPONSES_BY_LANG = {
  en: {
    welcome: "Hello! I am your StadiumOS AI assistant. How can I help you navigate the stadium, check transit options, or view match details today?",
    unknown: "I'm sorry, I didn't quite catch that. Could you ask about gates, transportation, bag policy, match schedule, or sustainability options?",
    searching: "Analysing stadium layouts and real-time operations...",
  },
  es: {
    welcome: "¡Hola! Soy tu asistente de IA de StadiumOS. ¿Cómo puedo ayudarte a navegar por el estadio, consultar el transporte o ver los detalles del partido hoy?",
    unknown: "Lo siento, no entendí bien. ¿Podrías preguntar sobre las puertas, el transporte, la política de bolsas, el calendario de partidos o la sostenibilidad?",
    searching: "Analizando la distribución del estadio y las operaciones en tiempo real...",
  },
  fr: {
    welcome: "Bonjour ! Je suis votre assistant IA StadiumOS. Comment puis-je vous aider à naviguer dans le stade, à vérifier les transports ou à voir les détails du match aujourd'hui ?",
    unknown: "Désolé, je n'ai pas bien compris. Pourriez-vous poser des questions sur les portes, le transport, la politique des sacs, le calendrier des matchs ou le développement durable ?",
    searching: "Analyse des plans du stade et des opérations en temps réel...",
  },
  pt: {
    welcome: "Olá! Sou o seu assistente de IA StadiumOS. Como posso ajudar você a navegar no estádio, verificar o transporte ou ver os detalhes do jogo hoje?",
    unknown: "Desculpe, não entendi bem. Você poderia perguntar sobre portões, transporte, política de bolsas, calendário de jogos ou sustentabilidade?",
    searching: "Analisando layouts do estádio e operações em tempo real...",
  },
  de: {
    welcome: "Hallo! Ich bin Ihr StadiumOS KI-Assistent. Wie kann ich Ihnen heute bei der Navigation im Stadion, den Verkehrsverbindungen oder den Spieldetails helfen?",
    unknown: "Entschuldigung, das habe ich nicht ganz verstanden. Könnten Sie nach Toren, Transportmitteln, Taschenrichtlinien, Spielplänen oder Nachhaltigkeit fragen?",
    searching: "Analysiere Stadionlayouts und Echtzeit-Betriebsdaten...",
  },
  ar: {
    welcome: "مرحباً! أنا مساعد الذكاء الاصطناعي StadiumOS. كيف يمكنني مساعدتك في التنقل في الملعب، أو التحقق من خيارات النقل، أو عرض تفاصيل المباراة اليوم؟",
    unknown: "عذراً، لم أفهم ذلك تماماً. هل يمكنك الاستفسار عن البوابات، أو وسائل النقل، أو سياسة الحقائب، أو جدول المباريات، أو خيارات الاستدامة؟",
    searching: "جاري تحليل مخططات الملعب والعمليات في الوقت الفعلي...",
  }
};

/**
 * Normalizes text to help match simple keywords
 */
function containsKeyword(text, keywords) {
  const normalized = text.toLowerCase();
  return keywords.some(keyword => normalized.includes(keyword));
}

/**
 * GenAI Chat Assistant Core logic
 * Synthesizes queries and returns intelligent responses
 */
export function queryAIChat(userText, language = "en") {
  const langResponses = RESPONSES_BY_LANG[language] || RESPONSES_BY_LANG["en"];
  const text = userText.toLowerCase();

  // 1. GATES & ACCESSIBILITY
  if (containsKeyword(text, ["gate", "entrance", "entrada", "porte", "door", "portão", "tor"])) {
    let response = "";
    if (containsKeyword(text, ["accessibility", "disabled", "wheelchair", "ramp", "elevator", "silla de ruedas", "fauteuil roulant", "cadeira de rodas"])) {
      response = `### ♿ Accessible Gate Information\n\n`;
      Object.entries(KNOWLEDGE_BASE.stadium.gates).forEach(([gateName, details]) => {
        response += `* **Gate ${gateName}** (${details.location}): ${details.accessibility}\n`;
      });
      response += `\n**AI Recommendation:** Gate C offers the most direct wheelchair access. If you are entering from parking, Lot C features dedicated blue zone parking spots closest to the ramp.`;
    } else {
      response = `### 🚪 Gate Statuses & Wait Times\n\n`;
      Object.entries(KNOWLEDGE_BASE.stadium.gates).forEach(([gateName, details]) => {
        let statusEmoji = "🟢";
        if (details.status.includes("Heavy")) statusEmoji = "🔴";
        else if (details.status.includes("Moderate")) statusEmoji = "🟡";

        response += `${statusEmoji} **Gate ${gateName}** (${details.location}):\n`;
        response += `  - Wait Time: **${details.waitTime}**\n`;
        response += `  - Status: *${details.status}*\n\n`;
      });
      response += `**AI Routing Tip:** Avoid Gate D due to heavy congestion (32 min wait). Gate A and Gate C are highly optimal.`;
    }
    return response;
  }

  // 2. TRANSPORTATION & PUBLIC TRANSIT & ECO ROUTING
  if (containsKeyword(text, ["transit", "transport", "metro", "train", "bus", "parking", "rideshare", "uber", "co2", "carbon", "eco", "green", "bus", "tren", "estacionamiento"])) {
    let response = `### 🚍 Sustainable Transit & Routes\n\n`;
    response += `Here are the official transit options for MetLife Stadium:\n\n`;
    response += `* **🚆 Train (Best Carbon Rating):** ${KNOWLEDGE_BASE.stadium.transport.train}\n`;
    response += `* **🚌 Express Bus (Excellent):** ${KNOWLEDGE_BASE.stadium.transport.bus}\n`;
    response += `* **🚗 Rideshare (Rideshare Zone):** ${KNOWLEDGE_BASE.stadium.transport.rideshare}\n`;
    response += `* **🅿️ Driving & Parking:** ${KNOWLEDGE_BASE.stadium.transport.parking}\n\n`;

    response += `#### 🌍 Eco-Impact Analytics (AI Estimated):\n`;
    Object.entries(KNOWLEDGE_BASE.stadium.transport.carbon_impact).forEach(([mode, impact]) => {
      const modeCap = mode.charAt(0).toUpperCase() + mode.slice(1);
      response += `- **${modeCap}**: ${impact.co2} kg CO2/person (${impact.rating}) - *${impact.suggestion}*\n`;
    });

    response += `\n**AI Transit Prediction:** Taking the Train saves approximately **1.08 kg of CO2** per traveler. Show your digital match ticket for free boarding on the NJ Transit train!`;
    return response;
  }

  // 3. RULES, SECURITY, BAG POLICY
  if (containsKeyword(text, ["rule", "bag", "policy", "security", "bottle", "water", "banner", "flag", "camera", "food", "mochila", "bolso", "eau", "sac"])) {
    let response = `### 🔒 Stadium Entry Policies (FIFA 2026 Standards)\n\n`;
    response += `To ensure a smooth entrance and avoid delays at security checkpoints, please note:\n\n`;
    response += `- **💼 Bag Policy:** ${KNOWLEDGE_BASE.stadium.rules.bag_policy}\n`;
    response += `- **💧 Liquid Policy:** ${KNOWLEDGE_BASE.stadium.rules.bottles}\n`;
    response += `- **🏁 Banners & Flags:** ${KNOWLEDGE_BASE.stadium.rules.banners}\n\n`;
    response += `**AI Security Tip:** If you have non-compliant items, express lockers are located outside Gate B and Gate D ($10 rental fee). Keep small items in your pockets to speed up screening lines.`;
    return response;
  }

  // 4. MATCHES / SCHEDULE
  if (containsKeyword(text, ["match", "schedule", "game", "play", "calendar", "team", "partido", "juego", "matchs", "scores", "usa", "england", "mexico", "argentina"])) {
    let response = `### ⚽ Tournament Schedule & Scores\n\n`;
    KNOWLEDGE_BASE.matches.forEach(match => {
      response += `* **${match.teams}**\n`;
      response += `  - Date: ${match.date} | Time: ${match.time}\n`;
      response += `  - Status: \`${match.status}\`\n\n`;
    });
    return response;
  }

  // 5. SUSTAINABILITY
  if (containsKeyword(text, ["sustainability", "eco", "recycle", "compost", "solar", "renewable", "green", "sostenible", "recycler"])) {
    let response = `### 🌿 FIFA Green Stadium Initiative\n\n`;
    response += `Our stadium is certified Gold under LEED green building standards:\n\n`;
    response += `- **♻️ Waste Separation:** ${KNOWLEDGE_BASE.stadium.sustainability.compostable}\n`;
    response += `- **☀️ Clean Power:** ${KNOWLEDGE_BASE.stadium.sustainability.energy}\n`;
    response += `- **💧 Conservation:** ${KNOWLEDGE_BASE.stadium.sustainability.water}\n\n`;
    response += `Thank you for sorting your waste! You can find recycling stations near all major concession stands.`;
    return response;
  }

  // 6. DEFAULT AI RESPONSE BASED ON HEURISTICS
  return langResponses.unknown;
}

/**
 * AI incident manager response generator
 * Formulates standard operating procedures (SOPs) based on alert inputs
 */
export function generateIncidentResponse(incidentType, location, severity, countAffected = 0) {
  let response = {
    incident: incidentType,
    location: location,
    severity: severity,
    recommendedSOP: [],
    announcementTemplate: "",
    staffDirections: "",
    resourceAllocations: []
  };

  switch (incidentType) {
    case "crowd_congestion":
      response.recommendedSOP = [
        "Initiate temporary zone restriction at the bottleneck site.",
        "Reroute incoming spectators through alternative, under-utilized gates.",
        "Activate LED message boards with directional signage updates.",
        "Deploy queue management volunteers to assist with orderly line formation."
      ];
      response.announcementTemplate = `Attention Fans near ${location}: To ensure a comfortable experience, please follow directional signs to adjacent corridors. Staff are ready to assist you. Thank you for your cooperation!`;
      response.staffDirections = "Direct incoming flow to Zone C and Gate B. Pause ticket turnstiles at the primary congested archway for 90 seconds to clear internal lobbies.";
      response.resourceAllocations = [
        { role: "Crowd Marshals", count: 8, location: location },
        { role: "Operational Volunteers", count: 12, location: "Adjoining Gates" }
      ];
      break;

    case "medical_emergency":
      response.recommendedSOP = [
        "Dispatch nearest First Aid responder team immediately.",
        "Establish a clear path for emergency medical services (EMS) stretcher access.",
        "Notify the Stadium Command Centre for ambulance escort to the service bay.",
        "Have nearby staff screen off the area to preserve patient privacy."
      ];
      response.announcementTemplate = "[Do not broadcast stadium-wide to avoid panic. Operational staff notified via e-radio.]";
      response.staffDirections = `Go to section ${location}. First aid cart Alpha-1 dispatched from the south tunnel. Clear onlookers.`;
      response.resourceAllocations = [
        { role: "Paramedic Unit", count: 2, location: location },
        { role: "Section Security", count: 3, location: location }
      ];
      break;

    case "transit_disruption":
      response.recommendedSOP = [
        "Coordinate with NJ Transit / Coach operator to request backup shuttles.",
        "Update the fan application UI with alternative route suggestions.",
        "Activate public address audio loops at post-match exit points.",
        "Deploy safety teams to manage larger gatherings at public transport stations."
      ];
      response.announcementTemplate = `Attention guests: The Meadowlands train is experiencing a temporary delay. Additional express buses have been deployed to Port Authority. We appreciate your patience.`;
      response.staffDirections = "Direct exiting crowd toward Bus Loading Zone 2. Set up barriers to prevent platforms from overloading.";
      response.resourceAllocations = [
        { role: "Transit Marshals", count: 10, location: "Meadowlands Rail Station" },
        { role: "Information Desk Staff", count: 4, location: "Grand Plaza Exit" }
      ];
      break;

    case "lost_child":
      response.recommendedSOP = [
        "Gather child's physical description and notify all gate security staff.",
        "Verify CCTV feeds matching the last known location.",
        "Keep the child with designated child services staff at the First Aid station.",
        "Prevent the child from leaving any stadium perimeter without verified parental check."
      ];
      response.announcementTemplate = "Stadium Announcement: We are looking for a young fan wearing a red jersey, blue hat, and white sneakers. If you have any information, please locate the nearest stadium staff member immediately.";
      response.staffDirections = `Secure exits at ${location}. Inform all guards of a child match: Red jersey, white sneakers.`;
      response.resourceAllocations = [
        { role: "CCTV Operators", count: 2, location: "Command Room" },
        { role: "Zone Officers", count: 6, location: "Gates and Exits near " + location }
      ];
      break;

    default:
      response.recommendedSOP = [
        "Assess safety risks at the location immediately.",
        "Establish command contact with zone supervisor.",
        "Log incident details into the tournament registry."
      ];
      response.announcementTemplate = `Please follow directions from stadium staff.`;
      response.staffDirections = "Analyze the issue and report details to stadium operations command.";
      response.resourceAllocations = [
        { role: "General Operations Team", count: 4, location: location }
      ];
      break;
  }

  return response;
}
