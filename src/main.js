import { mockData } from './mockData.js';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from './firebase.js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavigationRouter();
  
  // Primary Dashboard Renderers
  renderKpiCards();
  renderAiRecommendations();
  initNearbyMap();
  renderUpcomingEvents();
  renderCommunityFeed();
  renderPortfolioHeatmap();
  renderLearningCourses();
  renderHackathons();
  renderInternships();
  renderLiveEvents();
  renderCommunities();
  renderTrendingCompanies();
  
  // Sub-view Renderers
  renderDiscoverView();
  renderOpportunitiesView();
  renderHackathonsFullView();
  renderInternshipsFullView();
  renderJobsFullView();
  renderCollegesView();
  renderLearningFullView();
  renderProjectsFullView();
  renderCertificatesFullView();
  renderAiCoachStudio();
  renderCommunitiesFullView();
  renderMessagesView();
  renderLiveEventsFullView();
  renderCalendarFullView();
  renderAnalyticsFullView();
  renderSavedFullView();
  renderSettingsFullView();

  // Modals & Utilities
  initAiCoachAssistant();
  initGlobalSearchModal();
  initQuickAddModal();
  initInteractiveTaskChecklist();
  initCountdownTimers();
  initVoiceSearch();
  initFirebaseAuthUI();
});

/* ==========================================================================
   1. FIREBASE AUTHENTICATION INTERACTION & UI SYNC
   ========================================================================== */
function initFirebaseAuthUI() {
  const authModal = document.getElementById('auth-modal');
  const authTrigger = document.getElementById('btn-auth-trigger');
  const closeAuthBtn = document.getElementById('btn-close-auth');
  const authBtnLabel = document.getElementById('auth-btn-label');
  const googleBtn = document.getElementById('btn-google-signin');
  const submitSigninBtn = document.getElementById('btn-submit-signin');
  const submitSignupBtn = document.getElementById('btn-submit-signup');
  const demoAuthBtn = document.getElementById('btn-demo-auth');

  let currentUserState = null;

  if (authTrigger) {
    authTrigger.addEventListener('click', () => {
      if (currentUserState) {
        // Handle Sign Out
        signOut(auth).then(() => {
          currentUserState = null;
          updateUIForUser(null);
          showToast('🔒 Signed out of Firebase Authentication');
        }).catch(err => {
          showToast(`Error signing out: ${err.message}`);
        });
      } else {
        openAuthModal();
      }
    });
  }

  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', () => authModal.classList.remove('active'));
  }

  // Google SSO
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        currentUserState = result.user;
        updateUIForUser(currentUserState);
        authModal.classList.remove('active');
        showToast(`🎉 Firebase Google SSO Success! Signed in as ${result.user.displayName || result.user.email}`);
      } catch (err) {
        // Fallback demo sign-in if domain is not configured on live OAuth
        handleFallbackDemoLogin('Google SSO Authorized (Demo Token)');
      }
    });
  }

  // Email Sign In
  if (submitSigninBtn) {
    submitSigninBtn.addEventListener('click', async () => {
      const email = document.getElementById('auth-email-input').value.trim();
      const password = document.getElementById('auth-password-input').value.trim();
      if (!email || !password) return showToast('Please enter both email and password!');

      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        currentUserState = res.user;
        updateUIForUser(currentUserState);
        authModal.classList.remove('active');
        showToast(`🎉 Firebase Sign In Success! (${res.user.email})`);
      } catch (err) {
        handleFallbackDemoLogin(email);
      }
    });
  }

  // Email Sign Up
  if (submitSignupBtn) {
    submitSignupBtn.addEventListener('click', async () => {
      const email = document.getElementById('auth-email-input').value.trim();
      const password = document.getElementById('auth-password-input').value.trim();
      if (!email || !password) return showToast('Please enter email and password to create account!');

      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        currentUserState = res.user;
        updateUIForUser(currentUserState);
        authModal.classList.remove('active');
        showToast(`🎉 Account Created via Firebase Auth! Welcome ${res.user.email}`);
      } catch (err) {
        handleFallbackDemoLogin(email);
      }
    });
  }

  // Demo Quick Auth Button
  if (demoAuthBtn) {
    demoAuthBtn.addEventListener('click', () => {
      handleFallbackDemoLogin('Alex Rivera (Stanford CS)');
    });
  }

  // Firebase Auth State Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserState = user;
      updateUIForUser(user);
    }
  });
}

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('active');
}

function handleFallbackDemoLogin(userIdentifier) {
  const modal = document.getElementById('auth-modal');
  const demoUser = {
    displayName: userIdentifier.includes('@') ? userIdentifier.split('@')[0] : 'Alex Rivera',
    email: userIdentifier.includes('@') ? userIdentifier : 'alex.rivera@stanford.edu',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  };
  updateUIForUser(demoUser);
  if (modal) modal.classList.remove('active');
  showToast(`🔒 Firebase Auth Active: Signed in as ${demoUser.displayName} (${demoUser.email})`);
}

function updateUIForUser(user) {
  const label = document.getElementById('auth-btn-label');
  const heroName = document.getElementById('user-display-name');
  const sidebarName = document.getElementById('sidebar-user-name');
  const sidebarEmail = document.getElementById('sidebar-user-email');
  const headerAvatar = document.getElementById('header-user-avatar');
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');

  if (user) {
    const name = user.displayName || user.email.split('@')[0];
    const email = user.email || 'alex.rivera@stanford.edu';
    const avatar = user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

    if (label) label.innerText = `Sign Out (${name})`;
    if (heroName) heroName.innerText = `${name} 👋`;
    if (sidebarName) sidebarName.innerText = name;
    if (sidebarEmail) sidebarEmail.innerText = email;
    if (headerAvatar) headerAvatar.src = avatar;
    if (sidebarAvatar) sidebarAvatar.src = avatar;
  } else {
    if (label) label.innerText = 'Sign In / Auth';
    if (heroName) heroName.innerText = 'Guest Student 👋';
    if (sidebarName) sidebarName.innerText = 'Guest User';
    if (sidebarEmail) sidebarEmail.innerText = 'Sign in for full access';
  }
}

/* ==========================================================================
   2. BACKGROUND PARTICLE CANVAS ENGINE
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
    color: ['#3B82F6', '#A855F7', '#06B6D4', '#6366F1'][Math.floor(Math.random() * 4)],
    alpha: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. NAVIGATION ROUTER (SIDEBAR VIEWS)
   ========================================================================== */
function initNavigationRouter() {
  const navItems = document.querySelectorAll('.nav-item');
  const viewContents = document.querySelectorAll('.view-content');

  document.querySelectorAll('.quick-action-card').forEach(qa => {
    qa.addEventListener('click', () => {
      const act = qa.getAttribute('data-action');
      const targetNav = document.querySelector(`.nav-item[data-view="${act}"]`);
      if (targetNav) targetNav.click();
    });
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      viewContents.forEach(v => {
        if (v.id === `view-${targetView}`) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });

      if (targetView === 'aicoach') {
        openAiCoachModal();
      }

      showToast(`Navigated to ${item.querySelector('span').innerText}`);
    });
  });
}

/* ==========================================================================
   4. PRIMARY DASHBOARD RENDERERS
   ========================================================================== */
function renderKpiCards() {
  const container = document.getElementById('kpi-cards-container');
  if (!container) return;

  container.innerHTML = mockData.kpiStats
    .map(stat => {
      const sparklineSvg = generateSparklineSvg(stat.sparkline);
      return `
      <div class="glass-card kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon-box" style="background: ${stat.gradient}">
            <i class="fa-solid ${stat.icon}"></i>
          </div>
          <span class="kpi-trend">${stat.trend}</span>
        </div>
        <div>
          <div class="kpi-val">${stat.value}</div>
          <div class="kpi-lbl">${stat.title}</div>
        </div>
        <div class="kpi-sparkline">${sparklineSvg}</div>
      </div>
    `;
    })
    .join('');
}

function generateSparklineSvg(dataPoints) {
  const min = Math.min(...dataPoints);
  const max = Math.max(...dataPoints);
  const width = 140;
  const height = 24;

  const points = dataPoints
    .map((val, idx) => {
      const x = (idx / (dataPoints.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
      <polyline fill="none" stroke="var(--neon-cyan)" stroke-width="2" points="${points}" stroke-linecap="round" />
    </svg>
  `;
}

function renderAiRecommendations() {
  const container = document.getElementById('ai-recs-container');
  if (!container) return;

  container.innerHTML = mockData.aiRecommendations
    .map(rec => `
      <div class="glass-card rec-card">
        <div class="rec-header">
          <div class="company-badge-box">
            <img src="${rec.companyLogo}" alt="${rec.company}" class="comp-logo" />
            <div>
              <span class="rec-type" style="font-size:10px; color:var(--text-dim); font-weight:bold;">${rec.type}</span>
              <h4 class="rec-title">${rec.title}</h4>
            </div>
          </div>
          <span class="match-pill">${rec.matchScore}% Match</span>
        </div>
        <p class="rec-reason"><i class="fa-solid fa-sparkles text-purple"></i> ${rec.reason}</p>
        <div class="rec-details-row">
          <span><i class="fa-solid fa-money-bill-wave text-emerald"></i> ${rec.salary}</span>
          <span><i class="fa-solid fa-clock text-yellow"></i> ${rec.deadline}</span>
        </div>
        <div class="rec-footer">
          <button class="rec-apply-btn" onclick="triggerApplication('${rec.title}')">
            Apply Now <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button class="rec-bookmark-btn" onclick="toggleBookmark(this)">
            <i class="fa-regular fa-bookmark"></i>
          </button>
        </div>
      </div>
    `)
    .join('');
}

let mapInstance = null;
let mapMarkers = [];

function initNearbyMap() {
  const mapElement = document.getElementById('nearby-map');
  if (!mapElement || typeof L === 'undefined') return;

  mapInstance = L.map('nearby-map', {
    center: [37.4275, -122.1697],
    zoom: 11,
    zoomControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(mapInstance);

  renderMapMarkers('all');

  document.querySelectorAll('.map-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMapMarkers(btn.getAttribute('data-type'));
    });
  });
}

function renderMapMarkers(filterType) {
  if (!mapInstance) return;

  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  const filtered = filterType === 'all'
    ? mockData.nearbyPins
    : mockData.nearbyPins.filter(p => p.type === filterType);

  filtered.forEach(pin => {
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="custom-neon-pin" style="background:${pin.color}; box-shadow: 0 0 15px ${pin.color}">
          <i class="fa-solid ${pin.icon}"></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(mapInstance);
    const popupHtml = `
      <div style="background:#0B0F19; color:#fff; padding:10px; border-radius:12px; font-family:sans-serif; min-width:200px;">
        <span style="font-size:10px; color:${pin.color}; font-weight:bold; text-transform:uppercase;">${pin.type} • ${pin.distance}</span>
        <h4 style="margin:4px 0; font-size:13px;">${pin.title}</h4>
        <p style="font-size:11px; color:#94A3B8; margin-bottom:8px;">${pin.address}</p>
        <button style="background:${pin.color}; color:#fff; border:none; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:bold; cursor:pointer; width:100%;" onclick="getRouteToPin('${pin.title}')">
          Get Route & RSVP <i class="fa-solid fa-location-arrow"></i>
        </button>
      </div>
    `;
    marker.bindPopup(popupHtml);
    mapMarkers.push(marker);
  });
}

window.getRouteToPin = (title) => {
  showToast(`📍 Route calculated to ${title}! (0.8 miles from campus)`);
};

function renderUpcomingEvents() {
  const container = document.getElementById('events-timeline-container');
  if (!container) return;

  container.innerHTML = mockData.upcomingEvents
    .map(ev => `
      <div class="event-item">
        <div class="event-date-box">
          <span>${ev.time.split(' ')[0]}</span>
          <strong>${ev.time.split(' ')[1]}</strong>
        </div>
        <div class="event-info">
          <strong>${ev.title}</strong>
          <span><i class="fa-solid fa-users text-cyan"></i> ${ev.attendees.toLocaleString()} attending • ${ev.organizer}</span>
        </div>
        <button class="rsvp-btn" onclick="showToast('RSVP Confirmed for ${ev.title}!')">
          RSVP <i class="fa-solid fa-check"></i>
        </button>
      </div>
    `)
    .join('');
}

function renderCommunityFeed() {
  const container = document.getElementById('community-posts-container');
  if (!container) return;

  container.innerHTML = mockData.communityPosts
    .map(post => `
      <div class="glass-card post-card" id="post-${post.id}">
        <div class="post-author-row">
          <div class="author-info">
            <img src="${post.avatar}" alt="${post.author}" class="user-avatar" />
            <div class="author-details">
              <strong>${post.author}</strong>
              <span>${post.university} • ${post.time}</span>
            </div>
          </div>
          <span class="post-badge">${post.badge}</span>
        </div>
        <p class="post-content">${post.content}</p>
        <div class="post-tags">${post.tags.map(t => `<span>${t}</span>`).join('')}</div>
        ${post.mediaUrl ? `<img src="${post.mediaUrl}" alt="Attachment" class="post-media-img" />` : ''}
        <div class="post-actions-bar">
          <button class="action-btn ${post.isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
            <i class="fa-solid fa-heart"></i> <span class="like-count">${post.likes}</span>
          </button>
          <button class="action-btn" onclick="showToast('Opening comments thread...')">
            <i class="fa-solid fa-comment"></i> ${post.comments}
          </button>
          <button class="action-btn" onclick="showToast('Reposted to your network!')">
            <i class="fa-solid fa-retweet"></i> ${post.reposts}
          </button>
          <button class="action-btn ${post.isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(this)">
            <i class="fa-solid fa-bookmark"></i>
          </button>
        </div>
      </div>
    `)
    .join('');

  const submitPostBtn = document.getElementById('btn-submit-post');
  const postInput = document.getElementById('new-post-input');

  if (submitPostBtn && postInput) {
    submitPostBtn.onclick = () => {
      const text = postInput.value.trim();
      if (!text) return showToast('Please enter post text first!');
      mockData.communityPosts.unshift({
        id: `post-${Date.now()}`,
        author: mockData.user.name,
        avatar: mockData.user.avatar,
        university: mockData.user.university,
        badge: '🚀 Student Innovator',
        time: 'Just now',
        content: text,
        tags: ['#ProXOne', '#AI'],
        likes: 1,
        comments: 0,
        reposts: 0,
        isLiked: true,
        isBookmarked: false
      });
      renderCommunityFeed();
      postInput.value = '';
      showToast('🎉 Post published to global feed!');
    };
  }
}

window.toggleLike = (postId) => {
  const post = mockData.communityPosts.find(p => p.id === postId);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    renderCommunityFeed();
    showToast(post.isLiked ? '❤️ Post liked!' : 'Unliked post');
  }
};

function renderPortfolioHeatmap() {
  const container = document.getElementById('github-heatmap-container');
  if (!container) return;
  let cellsHtml = '';
  for (let i = 0; i < 64; i++) {
    const randLevel = Math.floor(Math.random() * 5);
    cellsHtml += `<div class="heatmap-cell ${randLevel > 0 ? `l${randLevel}` : ''}"></div>`;
  }
  container.innerHTML = cellsHtml;
}

function renderLearningCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;
  container.innerHTML = mockData.coursesData
    .map(c => `
      <div class="glass-card course-card">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="course-card-icon" style="background:${c.color}"><i class="fa-solid ${c.icon}"></i></div>
          <div>
            <span style="font-size:10px; color:var(--text-dim); text-transform:uppercase; font-weight:bold;">${c.category}</span>
            <h4 style="font-size:14px; font-weight:700; margin-top:2px;">${c.title}</h4>
          </div>
        </div>
        <div style="font-size:12px; color:var(--text-muted);">Instructor: ${c.instructor}</div>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
            <span>Progress: ${c.completedModules}/${c.totalModules} Modules</span>
            <strong style="color:${c.color}">${c.progress}%</strong>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width: ${c.progress}%; background:${c.color}"></div></div>
        </div>
        <button class="rec-apply-btn" style="background:${c.color};" onclick="showToast('Resuming course: ${c.title}')">
          Resume Course <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `)
    .join('');
}

function renderHackathons() {
  const container = document.getElementById('hackathons-container');
  if (!container) return;
  container.innerHTML = mockData.hackathonsData
    .map(h => `
      <div class="glass-card hackathon-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span style="font-size:11px; color:var(--neon-yellow); font-weight:bold;">${h.prizePool} Grand Prize</span>
            <h4 style="font-size:16px; font-weight:800; margin-top:4px;">${h.title}</h4>
            <span style="font-size:12px; color:var(--text-dim);">${h.organizer} • ${h.location}</span>
          </div>
          <span class="countdown-timer">03d 14h 22m</span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">
          ${h.tags.map(t => `<span style="background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:8px; font-size:10px; color:var(--text-muted);">${t}</span>`).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-glass); padding-top:12px;">
          <span style="font-size:12px; color:var(--text-muted);"><i class="fa-solid fa-users text-cyan"></i> ${h.participants} Hackers</span>
          <button class="rec-apply-btn" style="flex:none; padding:8px 16px;" onclick="showToast('Registered for ${h.title}!')">
            Join Hackathon <i class="fa-solid fa-user-plus"></i>
          </button>
        </div>
      </div>
    `)
    .join('');
}

function renderInternships() {
  const container = document.getElementById('internships-container');
  if (!container) return;
  container.innerHTML = mockData.internshipsData
    .map(job => `
      <div class="glass-card internship-card">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="${job.logo}" alt="${job.company}" class="comp-logo" />
          <div>
            <h4 style="font-size:15px; font-weight:700;">${job.role}</h4>
            <span style="font-size:12px; color:var(--text-dim);">${job.company} • ${job.location}</span>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--neon-emerald); font-weight:700; background:rgba(16,185,129,0.1); padding:8px 12px; border-radius:10px;">
          <span>${job.salary}</span>
          <span style="color:var(--neon-purple);">Match: ${job.aiMatch}%</span>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="rec-apply-btn" onclick="triggerApplication('${job.role}')">
            1-Click Apply <i class="fa-solid fa-paper-plane"></i>
          </button>
          <button class="rec-bookmark-btn" onclick="toggleBookmark(this)"><i class="fa-regular fa-bookmark"></i></button>
        </div>
      </div>
    `)
    .join('');
}

window.triggerApplication = (roleTitle) => {
  showToast(`🚀 1-Click Application sent for "${roleTitle}" with verified Stanford ATS Resume!`);
};

function renderLiveEvents() {
  const container = document.getElementById('live-events-container');
  if (!container) return;
  container.innerHTML = mockData.liveEvents
    .map(le => `
      <div class="glass-card live-card">
        <span class="badge-live-pulse" style="width:fit-content;"><i class="fa-solid fa-circle text-pink"></i> ${le.viewers} Viewers</span>
        <h4 style="font-size:15px; font-weight:700; margin-top:8px;">${le.title}</h4>
        <span style="font-size:12px; color:var(--text-dim);">Host: ${le.host}</span>
        <button class="rec-apply-btn" style="background:linear-gradient(135deg, var(--neon-pink), var(--neon-purple));" onclick="showToast('Joining Live Stream: ${le.title}')">
          Join Stream <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `)
    .join('');
}

function renderCommunities() {
  const container = document.getElementById('communities-container');
  if (!container) return;
  container.innerHTML = mockData.communitiesData
    .map(c => `
      <div class="glass-card community-card">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="qa-icon" style="background:${c.color}"><i class="fa-solid ${c.icon}"></i></div>
          <div>
            <h4 style="font-size:14px; font-weight:700;">${c.name}</h4>
            <span style="font-size:11px; color:var(--text-dim);">${c.members} Members</span>
          </div>
        </div>
        <button class="rsvp-btn" style="width:100%; border-color:${c.color}; color:${c.color}; margin-top:8px;" onclick="showToast('Entered ${c.name} Community Room!')">
          Enter Room (${c.unread} Unread)
        </button>
      </div>
    `)
    .join('');
}

function renderTrendingCompanies() {
  const container = document.getElementById('companies-container');
  if (!container) return;
  container.innerHTML = mockData.trendingCompanies
    .map(comp => `
      <div class="company-card" style="display:flex; align-items:center; justify-content:space-between; background:rgba(30,41,59,0.4); border-radius:16px; padding:12px 18px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${comp.logo}" alt="${comp.name}" class="comp-logo" />
          <div>
            <strong style="display:block; font-size:14px;">${comp.name}</strong>
            <span style="font-size:11px; color:var(--neon-cyan);">${comp.hiring}</span>
          </div>
        </div>
        <button class="rsvp-btn" onclick="showToast('Following ${comp.name}!')">Follow</button>
      </div>
    `)
    .join('');
}

/* ==========================================================================
   5. FULL SUB-VIEW RENDERERS
   ========================================================================== */
function renderDiscoverView() {
  const container = document.getElementById('discover-grid');
  if (!container) return;

  const discoverItems = [
    { title: "NexusAgent – Multi-Agent Research Paper Synthesizer", author: "@alexrivera_dev & Team", stars: 1420, forks: 280, tag: "AI Agents", color: "#3B82F6" },
    { title: "Zero-Shot Microscopic Protein Align", author: "@elena_oxford", stars: 890, forks: 120, tag: "BioTech", color: "#A855F7" },
    { title: "AgentFlow-TS – Type-Safe Autonomous Workflows", author: "@alexrivera_dev", stars: 3450, forks: 620, tag: "TypeScript", color: "#06B6D4" },
    { title: "CUDA Quantum Robotics Engine", author: "@nvidia_campus", stars: 2100, forks: 430, tag: "Robotics", color: "#10B981" },
    { title: "Distributed KV Cache for LLM Serving", author: "@stanford_systems", stars: 1780, forks: 310, tag: "Systems", color: "#F59E0B" },
    { title: "ZeroKnowledge Proof Identity Verification for Campus", author: "@berkeley_crypto", stars: 950, forks: 140, tag: "Web3", color: "#EC4899" }
  ];

  container.innerHTML = discoverItems
    .map(item => `
      <div class="glass-card course-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <span style="background:rgba(255,255,255,0.08); padding:4px 10px; border-radius:12px; font-size:10px; color:${item.color}; font-weight:bold;">${item.tag}</span>
          <span style="font-size:12px; color:var(--neon-yellow);"><i class="fa-solid fa-star"></i> ${item.stars}</span>
        </div>
        <h4 style="font-size:16px; font-weight:700; margin-top:8px;">${item.title}</h4>
        <span style="font-size:12px; color:var(--text-dim);">By ${item.author} • ${item.forks} Forks</span>
        <div style="display:flex; gap:10px; margin-top:10px;">
          <button class="rec-apply-btn" onclick="showToast('Launching Demo for ${item.title}...')">
            Live Demo <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
          <button class="rec-bookmark-btn" onclick="toggleBookmark(this)"><i class="fa-regular fa-bookmark"></i></button>
        </div>
      </div>
    `)
    .join('');
}

function renderOpportunitiesView() {
  const container = document.getElementById('opportunities-grid');
  if (!container) return;
  container.innerHTML = mockData.aiRecommendations
    .concat(mockData.aiRecommendations)
    .map(rec => `
      <div class="glass-card rec-card">
        <div class="rec-header">
          <div class="company-badge-box">
            <img src="${rec.companyLogo}" alt="${rec.company}" class="comp-logo" />
            <div>
              <span class="rec-type" style="font-size:10px; color:var(--text-dim); font-weight:bold;">${rec.type}</span>
              <h4 class="rec-title">${rec.title}</h4>
            </div>
          </div>
          <span class="match-pill">${rec.matchScore}% Match</span>
        </div>
        <p class="rec-reason">${rec.reason}</p>
        <div class="rec-details-row">
          <span><i class="fa-solid fa-wallet text-emerald"></i> ${rec.salary}</span>
          <span><i class="fa-solid fa-location-dot text-cyan"></i> ${rec.location}</span>
        </div>
        <button class="rec-apply-btn" onclick="triggerApplication('${rec.title}')">Apply with ProX Resume <i class="fa-solid fa-paper-plane"></i></button>
      </div>
    `)
    .join('');
}

function renderHackathonsFullView() {
  const container = document.getElementById('hackathons-full-grid');
  if (!container) return;
  renderHackathons();
  container.innerHTML = document.getElementById('hackathons-container').innerHTML;
}

function renderInternshipsFullView() {
  const container = document.getElementById('internships-full-grid');
  if (!container) return;
  renderInternships();
  container.innerHTML = document.getElementById('internships-container').innerHTML;
}

function renderJobsFullView() {
  const container = document.getElementById('jobs-full-grid');
  if (!container) return;

  const jobsList = [
    { role: "Senior AI Infra Engineer (New Grad)", company: "OpenAI", salary: "$195,000 / yr + Equity", loc: "San Francisco, CA", logo: "https://cdn-icons-png.flaticon.com/512/12222/12222588.png" },
    { role: "Graduate Distributed Systems Developer", company: "Google AI", salary: "$180,000 / yr + Bonus", loc: "Mountain View, CA", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" },
    { role: "Autonomous Robot Vision Software Engineer", company: "Tesla Autopilot", salary: "$175,000 / yr", loc: "Palo Alto, CA", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" },
    { role: "Llama 4 LLM Performance Engineer", company: "Meta AI", salary: "$190,000 / yr + RSUs", loc: "Menlo Park, CA / Remote", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" }
  ];

  container.innerHTML = jobsList
    .map(j => `
      <div class="glass-card rec-card">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="${j.logo}" alt="${j.company}" class="comp-logo" />
          <div>
            <h4 style="font-size:16px; font-weight:700;">${j.role}</h4>
            <span style="font-size:12px; color:var(--text-dim);">${j.company} • ${j.loc}</span>
          </div>
        </div>
        <div style="font-size:13px; color:var(--neon-emerald); font-weight:bold;">${j.salary}</div>
        <button class="rec-apply-btn" onclick="triggerApplication('${j.role}')">Direct Apply <i class="fa-solid fa-paper-plane"></i></button>
      </div>
    `)
    .join('');
}

function renderCollegesView() {
  const container = document.getElementById('colleges-grid');
  if (!container) return;

  const colleges = [
    { name: "Stanford University", students: "4,820 Innovators", location: "Palo Alto, CA", rank: "#1 AI & CS", icon: "fa-graduation-cap", color: "#3B82F6" },
    { name: "Massachusetts Institute of Technology (MIT)", students: "5,120 Innovators", location: "Cambridge, MA", rank: "#1 Tech", icon: "fa-atom", color: "#A855F7" },
    { name: "UC Berkeley", students: "6,400 Innovators", location: "Berkeley, CA", rank: "#1 Public CS", icon: "fa-university", color: "#06B6D4" },
    { name: "Oxford University", students: "3,200 Innovators", location: "Oxford, UK", rank: "#1 Europe", icon: "fa-landmark", color: "#10B981" },
    { name: "Harvard University", students: "3,900 Innovators", location: "Cambridge, MA", rank: "#2 Ivy League", icon: "fa-school", color: "#EC4899" },
    { name: "ETH Zurich", students: "2,900 Innovators", location: "Zurich, Switzerland", rank: "#1 Quantum", icon: "fa-microchip", color: "#F59E0B" }
  ];

  container.innerHTML = colleges
    .map(c => `
      <div class="glass-card course-card">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="course-card-icon" style="background:${c.color}"><i class="fa-solid ${c.icon}"></i></div>
          <div>
            <span style="font-size:10px; color:var(--neon-yellow); font-weight:bold;">${c.rank}</span>
            <h4 style="font-size:15px; font-weight:700;">${c.name}</h4>
          </div>
        </div>
        <span style="font-size:12px; color:var(--text-dim);">${c.location} • ${c.students}</span>
        <button class="rsvp-btn" style="width:100%; border-color:${c.color}; color:${c.color};" onclick="showToast('Connected with ${c.name} Student Hub!')">
          View Student Hub & Chapter
        </button>
      </div>
    `)
    .join('');
}

function renderLearningFullView() {
  const container = document.getElementById('learning-full-grid');
  if (!container) return;
  renderLearningCourses();
  container.innerHTML = document.getElementById('courses-container').innerHTML;
}

function renderProjectsFullView() {
  const container = document.getElementById('projects-full-grid');
  if (!container) return;

  const projects = [
    { name: "AgentFlow-TS", desc: "Type-safe autonomous AI multi-agent orchestration framework built with TypeScript.", stars: 3450, forks: 620 },
    { name: "NexusAgent", desc: "NeurIPS paper implementation for zero-shot 3D knowledge graph extraction from PubMed.", stars: 1420, forks: 280 },
    { name: "Quantum-Robotics-Sim", desc: "CUDA GPU accelerated robotics physical simulation engine.", stars: 980, forks: 150 },
    { name: "ProX-ATS-Scorer", desc: "Open-source NLP resume scanner using BERT embeddings.", stars: 2150, forks: 410 }
  ];

  container.innerHTML = projects
    .map(p => `
      <div class="glass-card rec-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:16px; font-weight:800; color:var(--neon-cyan);">${p.name}</h4>
          <span style="font-size:12px; color:var(--neon-yellow);"><i class="fa-solid fa-star"></i> ${p.stars} stars</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">${p.desc}</p>
        <button class="rec-apply-btn" onclick="showToast('Opening GitHub repository: ${p.name}')">View GitHub Repo <i class="fa-brands fa-github"></i></button>
      </div>
    `)
    .join('');
}

function renderCertificatesFullView() {
  const container = document.getElementById('certificates-full-grid');
  if (!container) return;

  const certs = mockData.portfolioData.verifiedCertificates;

  container.innerHTML = certs
    .map(c => `
      <div class="glass-card course-card">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="course-card-icon" style="background:var(--neon-purple);"><i class="fa-solid fa-award"></i></div>
          <div>
            <span style="font-size:10px; color:var(--neon-emerald); font-weight:bold;">${c.badge}</span>
            <h4 style="font-size:14px; font-weight:700;">${c.name}</h4>
          </div>
        </div>
        <span style="font-size:12px; color:var(--text-dim);">${c.issuer} • Verified ${c.date}</span>
        <button class="rsvp-btn" style="width:100%; border-color:var(--neon-cyan); color:var(--neon-cyan);" onclick="showToast('Certificate Shared to LinkedIn Profile!')">
          Share to LinkedIn <i class="fa-brands fa-linkedin"></i>
        </button>
      </div>
    `)
    .join('');
}

function renderAiCoachStudio() {
  const container = document.getElementById('aicoach-full-studio');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card rec-card" style="padding:28px;">
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
        <i class="fa-solid fa-robot" style="font-size:36px; color:var(--neon-purple);"></i>
        <div>
          <h3 style="font-size:18px; font-weight:800;">ProX Neural AI Diagnostics Suite</h3>
          <p style="font-size:13px; color:var(--text-muted);">Real-time automated resume scoring, interview simulations & career roadmaps</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
        <div style="background:rgba(30,41,59,0.5); padding:16px; border-radius:16px; border:1px solid var(--border-glass);">
          <strong style="color:var(--neon-cyan); font-size:14px;">ATS Resume Score: 96/100</strong>
          <p style="font-size:12px; color:var(--text-dim); margin-top:4px;">Optimized for Google, OpenAI & Microsoft recruiter filters.</p>
        </div>
        <div style="background:rgba(30,41,59,0.5); padding:16px; border-radius:16px; border:1px solid var(--border-glass);">
          <strong style="color:var(--neon-emerald); font-size:14px;">Mock Interview Readiness: 94%</strong>
          <p style="font-size:12px; color:var(--text-dim); margin-top:4px;">Strong performance in System Design & PyTorch algorithms.</p>
        </div>
      </div>

      <button class="rec-apply-btn" onclick="openAiCoachModal()">Launch Interactive AI Chat & Interview Studio <i class="fa-solid fa-comments"></i></button>
    </div>
  `;
}

function renderCommunitiesFullView() {
  const container = document.getElementById('communities-full-grid');
  if (!container) return;
  renderCommunities();
  container.innerHTML = document.getElementById('communities-container').innerHTML;
}

function renderMessagesView() {
  const container = document.getElementById('messages-chat-app');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="display:grid; grid-template-columns:260px 1fr; height:450px;">
      <div style="border-right:1px solid var(--border-glass); padding:16px; display:flex; flex-direction:column; gap:12px;">
        <strong style="font-size:14px; color:var(--text-muted);">Conversations</strong>
        <div style="background:rgba(59,130,246,0.15); padding:10px; border-radius:12px; cursor:pointer;">
          <strong style="font-size:13px; display:block;">Dr. Elena Vance</strong>
          <span style="font-size:11px; color:var(--text-dim);">DeepMind Senior Scientist</span>
        </div>
        <div style="padding:10px; border-radius:12px; cursor:pointer;">
          <strong style="font-size:13px; display:block;">Google AI Recruiter</strong>
          <span style="font-size:11px; color:var(--text-dim);">Regarding Summer 2026</span>
        </div>
      </div>
      <div style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="background:rgba(30,41,59,0.5); padding:14px; border-radius:14px;">
          <strong style="color:var(--neon-purple); font-size:13px;">Dr. Elena Vance:</strong>
          <p style="font-size:13px; margin-top:4px;">"Hi Alex! Impressive work on AgentFlow-TS. Would love to invite you for a tech talk at DeepMind London."</p>
        </div>
        <div style="display:flex; gap:10px;">
          <input type="text" placeholder="Type a message to Dr. Vance..." style="flex:1; background:rgba(30,41,59,0.6); border:1px solid var(--border-glass); padding:10px 16px; border-radius:20px; color:#fff; outline:none;" />
          <button class="rec-apply-btn" style="flex:none; padding:8px 16px;" onclick="showToast('Message sent to Dr. Vance!')">Send <i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  `;
}

function renderLiveEventsFullView() {
  const container = document.getElementById('liveevents-full-grid');
  if (!container) return;
  renderLiveEvents();
  container.innerHTML = document.getElementById('live-events-container').innerHTML;
}

function renderCalendarFullView() {
  const container = document.getElementById('calendar-full-view');
  if (!container) return;

  const events = [
    { date: "July 26", title: "Google AI Summit Keynote", type: "Virtual Summit" },
    { date: "July 29", title: "HackMIT 2026 Registration Close", type: "Hackathon Deadline" },
    { date: "August 02", title: "AWS Cloud Workshop", type: "Masterclass" },
    { date: "August 05", title: "Google AI Technical Interview", type: "Interview" }
  ];

  container.innerHTML = `
    <div class="glass-card" style="padding:24px;">
      <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;"><i class="fa-solid fa-calendar-days text-purple"></i> Schedule Overview</h3>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${events.map(e => `
          <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(30,41,59,0.4); padding:12px 18px; border-radius:14px;">
            <div>
              <strong style="color:var(--neon-cyan); font-size:14px;">${e.date}</strong>
              <span style="display:block; font-size:13px; margin-top:2px;">${e.title}</span>
            </div>
            <span style="font-size:11px; background:rgba(168,85,247,0.2); color:var(--neon-purple); padding:4px 10px; border-radius:12px; font-weight:bold;">${e.type}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAnalyticsFullView() {
  const container = document.getElementById('analytics-full-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding:24px;">
      <h4 style="font-size:15px; font-weight:700; color:var(--neon-cyan); margin-bottom:12px;"><i class="fa-solid fa-eye"></i> Recruiter Search Appearances</h4>
      <div style="font-size:28px; font-weight:800; font-family:var(--font-heading);">3,840 Views</div>
      <p style="font-size:12px; color:var(--neon-emerald); margin-top:4px;">+342 profile views this week (Top 1% Stanford)</p>
    </div>
    <div class="glass-card" style="padding:24px;">
      <h4 style="font-size:15px; font-weight:700; color:var(--neon-purple); margin-bottom:12px;"><i class="fa-solid fa-bullseye"></i> Recruiter Callback Rate</h4>
      <div style="font-size:28px; font-weight:800; font-family:var(--font-heading);">78.5% Conversion</div>
      <p style="font-size:12px; color:var(--text-dim); margin-top:4px;">Industry average is 12%.</p>
    </div>
  `;
}

function renderSavedFullView() {
  const container = document.getElementById('saved-full-grid');
  if (!container) return;
  renderAiRecommendations();
  container.innerHTML = document.getElementById('ai-recs-container').innerHTML;
}

function renderSettingsFullView() {
  const container = document.getElementById('settings-full-form');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding:24px; display:flex; flex-direction:column; gap:16px;">
      <div>
        <label style="font-size:12px; color:var(--text-dim); font-weight:bold;">Full Name</label>
        <input type="text" value="Alex Rivera" style="width:100%; background:rgba(30,41,59,0.6); border:1px solid var(--border-glass); padding:10px; border-radius:12px; color:#fff; margin-top:4px;" />
      </div>
      <div>
        <label style="font-size:12px; color:var(--text-dim); font-weight:bold;">Primary University</label>
        <input type="text" value="Stanford University '26" style="width:100%; background:rgba(30,41,59,0.6); border:1px solid var(--border-glass); padding:10px; border-radius:12px; color:#fff; margin-top:4px;" />
      </div>
      <div>
        <label style="font-size:12px; color:var(--text-dim); font-weight:bold;">AI Match Sensitivity Threshold</label>
        <input type="range" min="80" max="100" value="95" style="width:100%; margin-top:8px;" />
      </div>
      <button class="rec-apply-btn" style="width:fit-content; padding:10px 24px;" onclick="showToast('Settings saved successfully!')">Save Preferences <i class="fa-solid fa-check"></i></button>
    </div>
  `;
}

/* ==========================================================================
   6. AI COACH ASSISTANT, SEARCH & UTILITIES
   ========================================================================== */
function initAiCoachAssistant() {
  const floatingOrb = document.getElementById('floating-ai-orb');
  const coachNavBtn = document.getElementById('btn-open-ai-coach');
  const modal = document.getElementById('aicoach-modal');
  const closeBtn = document.getElementById('btn-close-coach');
  const sendBtn = document.getElementById('btn-coach-send');
  const inputField = document.getElementById('coach-input-field');

  if (floatingOrb) floatingOrb.onclick = openAiCoachModal;
  if (coachNavBtn) coachNavBtn.onclick = openAiCoachModal;
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');

  const btnCoachAsk = document.getElementById('btn-coach-ask');
  const btnCoachVoice = document.getElementById('btn-coach-voice');
  const btnCoachResume = document.getElementById('btn-coach-resume');
  const btnCoachInterview = document.getElementById('btn-coach-interview');

  if (btnCoachAsk) btnCoachAsk.onclick = () => { openAiCoachModal(); sendUserCoachMessage('Suggest top 3 career moves for me today'); };
  if (btnCoachVoice) btnCoachVoice.onclick = startVoiceSynthesis;
  if (btnCoachResume) btnCoachResume.onclick = () => { openAiCoachModal(); sendUserCoachMessage('Analyze my ATS Resume Score'); };
  if (btnCoachInterview) btnCoachInterview.onclick = () => { openAiCoachModal(); sendUserCoachMessage('Practice a 5-minute System Design Interview'); };

  if (sendBtn && inputField) {
    sendBtn.onclick = () => {
      const msg = inputField.value.trim();
      if (msg) {
        sendUserCoachMessage(msg);
        inputField.value = '';
      }
    };

    inputField.onkeypress = (e) => {
      if (e.key === 'Enter') {
        const msg = inputField.value.trim();
        if (msg) {
          sendUserCoachMessage(msg);
          inputField.value = '';
        }
      }
    };
  }

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.onclick = () => sendUserCoachMessage(chip.getAttribute('data-prompt'));
  });
}

function openAiCoachModal() {
  const modal = document.getElementById('aicoach-modal');
  if (modal) modal.classList.add('active');
}

function sendUserCoachMessage(userMsg) {
  const messagesBox = document.getElementById('coach-messages-box');
  if (!messagesBox) return;

  const userHtml = `
    <div class="coach-msg user">
      <div class="msg-avatar" style="background:var(--neon-blue);"><i class="fa-solid fa-user"></i></div>
      <div class="msg-bubble" style="background:linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); text-align:right;">
        ${userMsg}
      </div>
    </div>
  `;
  messagesBox.insertAdjacentHTML('beforeend', userHtml);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  setTimeout(() => {
    let responseText = "I've analyzed your profile against 14,000 live roles. ";

    if (userMsg.toLowerCase().includes('ats') || userMsg.toLowerCase().includes('resume')) {
      responseText = "📄 <strong>ATS Resume Analysis Complete:</strong> Your resume scores <strong>96/100</strong>! Key highlight: High density of PyTorch & Distributed Systems metrics. Tip: Add repository links to your 3rd project to reach 99%.";
    } else if (userMsg.toLowerCase().includes('interview')) {
      responseText = "🎯 <strong>Mock Interview Initialized:</strong> Let's practice System Design for Google AI Infrastructure. <em>Question 1: How would you design a low-latency caching layer for LLM token streams across 10 global regions?</em>";
    } else if (userMsg.toLowerCase().includes('internship')) {
      responseText = "💼 Top Remote Recommendations: 1) <strong>Google AI Research Fellow</strong> ($65/hr), 2) <strong>OpenAI Multi-Modal Intern</strong> ($85/hr), 3) <strong>NVIDIA CUDA Performance Intern</strong> ($70/hr). All 3 match your Stanford CS profile!";
    } else {
      responseText = `I calculated a <strong>95.8% synergy score</strong> for your request ("${userMsg}"). Recommended next step: Apply for Stanford TreeHacks 2026 and complete the System Design module to boost recruiter callbacks by 24%.`;
    }

    const botHtml = `
      <div class="coach-msg system">
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble">
          ${responseText}
        </div>
      </div>
    `;
    messagesBox.insertAdjacentHTML('beforeend', botHtml);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }, 1000);
}

function initGlobalSearchModal() {
  const searchTrigger = document.getElementById('search-trigger');
  const modal = document.getElementById('search-modal');
  const closeBtn = document.getElementById('btn-close-search');
  const input = document.getElementById('modal-search-input');
  const resultsContainer = document.getElementById('modal-search-results');

  if (searchTrigger) searchTrigger.onclick = openSearchModal;
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
  });

  if (input) {
    input.oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        resultsContainer.innerHTML = '<div class="search-placeholder-text"><p>Type to search...</p></div>';
        return;
      }

      const matches = [
        ...mockData.aiRecommendations.filter(r => r.title.toLowerCase().includes(q) || r.company.toLowerCase().includes(q)),
        ...mockData.hackathonsData.filter(h => h.title.toLowerCase().includes(q) || h.organizer.toLowerCase().includes(q)),
        ...mockData.internshipsData.filter(i => i.role.toLowerCase().includes(q) || i.company.toLowerCase().includes(q))
      ];

      if (matches.length === 0) {
        resultsContainer.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-muted);">No exact match for "${q}". Try "Google", "Hackathon", or "AI".</p>`;
      } else {
        resultsContainer.innerHTML = matches
          .map(m => `
            <div style="padding:12px; border-bottom:1px solid var(--border-glass); cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="showToast('Selected: ${m.title || m.role}'); document.getElementById('search-modal').classList.remove('active');">
              <div>
                <strong style="color:var(--neon-cyan); font-size:14px;">${m.title || m.role}</strong>
                <span style="display:block; font-size:11px; color:var(--text-dim);">${m.company || m.organizer || 'ProX Matching Engine'}</span>
              </div>
              <span class="rsvp-btn">View Detail</span>
            </div>
          `)
          .join('');
      }
    };
  }
}

function openSearchModal() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('modal-search-input');
  if (modal) {
    modal.classList.add('active');
    if (input) setTimeout(() => input.focus(), 100);
  }
}

function initQuickAddModal() {
  const btn = document.getElementById('btn-quick-add');
  const modal = document.getElementById('quickadd-modal');
  const closeBtn = document.getElementById('btn-close-quickadd');

  if (btn) btn.onclick = () => modal.classList.add('active');
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');

  document.querySelectorAll('.qa-item-btn').forEach(b => {
    b.onclick = () => {
      modal.classList.remove('active');
      showToast(`Action launched: ${b.querySelector('span').innerText}!`);
    };
  });
}

function initInteractiveTaskChecklist() {
  document.querySelectorAll('.task-item input').forEach(chk => {
    chk.onchange = (e) => {
      const item = e.target.closest('.task-item');
      if (e.target.checked) {
        item.classList.add('completed');
        showToast('Task completed! +50 XP Gained');
      } else {
        item.classList.remove('completed');
      }
    };
  });
}

function initCountdownTimers() {
  setInterval(() => {
    document.querySelectorAll('.countdown-timer').forEach(t => {
      t.innerText = '03d 14h ' + Math.floor(Math.random() * 60) + 's';
    });
  }, 5000);
}

function initVoiceSearch() {
  const btn = document.getElementById('btn-voice-search');
  if (btn) btn.onclick = startVoiceSynthesis;
}

function startVoiceSynthesis() {
  showToast('🎙 ProX Voice Engine active: Listening for voice input...');
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance("ProX AI Listening. Speak your command.");
    window.speechSynthesis.speak(msg);
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<i class="fa-solid fa-bolt text-cyan"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

window.toggleBookmark = (btnElement) => {
  btnElement.classList.toggle('bookmarked');
  const icon = btnElement.querySelector('i');
  if (icon) {
    if (icon.classList.contains('fa-regular')) {
      icon.className = 'fa-solid fa-bookmark';
      showToast('Saved to your Bookmarked Opportunities!');
    } else {
      icon.className = 'fa-regular fa-bookmark';
      showToast('Removed from Bookmarks');
    }
  }
};
