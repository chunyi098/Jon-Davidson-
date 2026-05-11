// ============================================================
//  JonDavidson — main.js
// ============================================================

/* ── Favicon set (inject once, works on every page) ── */
(function injectFavicons() {
  const head = document.head;
  document.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());

  const tags = [
    { rel: 'icon', type: 'image/svg+xml', href: 'assets/favicon.svg' },
    { rel: 'icon', type: 'image/png', href: 'assets/JonDavidsonLogo.png' },
    { rel: 'apple-touch-icon', href: 'assets/JonDavidsonLogo.png' },
    { rel: 'manifest', href: 'site.webmanifest' },
  ];
  tags.forEach(({ rel, type, href }) => {
    const link = document.createElement('link');
    link.rel = rel;
    if (type) link.type = type;
    link.href = href;
    head.appendChild(link);
  });

  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#9e0403';
    head.appendChild(meta);
  }
})();

/* ── Navbar scroll shadow ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

/* ── Active nav highlight ── */
(function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-item a, .nav-links a.nav-item').forEach(link => {
    const raw = link.getAttribute('href') || '';
    // Skip hash links — e.g. about.html#our-offices must never be treated as the active page
    if (raw.includes('#')) return;
    const href = raw.split('/').pop();
    if (href && href === page) {
      link.classList.add('nav-active');
      link.closest('.nav-item')?.classList.add('nav-active');
    }
  });
})();

/* ── LocalStorage helpers ── */
function getUser()  { try { return JSON.parse(localStorage.getItem('jd_user') || 'null'); } catch { return null; } }
function getSaved() { try { return JSON.parse(localStorage.getItem('jd_saved_jobs') || '{}'); } catch { return {}; } }
function setSaved(obj) { try { localStorage.setItem('jd_saved_jobs', JSON.stringify(obj)); } catch {} }

function logout() {
  localStorage.removeItem('jd_user');
  window.location.href = 'index.html';
}

/* ── Auth state: swap login icon for user avatar when logged in ── */
(function applyAuthState() {
  const user = getUser();
  const loginBtn = document.querySelector('.btn-login-icon');
  if (!loginBtn) return;

  if (user) {
    const initials = (user.name || user.email || '?')
      .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const displayName = user.name || user.email;

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-user-menu';
    wrapper.innerHTML = `
      <button class="nav-user-btn" title="${displayName}">
        <span class="nav-user-avatar">${initials}</span>
      </button>
      <div class="nav-user-dropdown">
        <p class="nav-user-name">${displayName}</p>
        <a href="jobs.html">&#128190; Saved Jobs</a>
        <button onclick="logout()">Log Out</button>
      </div>`;
    loginBtn.replaceWith(wrapper);

    const btn  = wrapper.querySelector('.nav-user-btn');
    const drop = wrapper.querySelector('.nav-user-dropdown');
    btn.addEventListener('click', e => { e.stopPropagation(); drop.classList.toggle('open'); });
    document.addEventListener('click', () => drop.classList.remove('open'));
  }
})();

/* ── Restore saved-job button states on any page ── */
(function restoreSavedButtons() {
  if (!getUser()) return;
  const saved = getSaved();
  document.querySelectorAll('.btn-save').forEach(btn => {
    const m = (btn.getAttribute('onclick') || '').match(/handleSave\(this,'([^']+)'/);
    if (m && saved[m[1]]) {
      btn.classList.add('saved');
      btn.textContent = '✓ Saved';
    }
  });
})();

/* ── handleSave (callable from any page) ── */
function isLoggedIn() { return !!getUser(); }

function handleSave(btn, id, title) {
  if (!isLoggedIn()) {
    sessionStorage.setItem('jd_save_pending', JSON.stringify({ id, title }));
    showToast('Please log in to save jobs');
    setTimeout(() => {
      window.location.href = 'login.html?from=save&job=' + encodeURIComponent(title);
    }, 900);
    return;
  }
  const saved   = getSaved();
  const isSaved = !!saved[id];
  if (isSaved) {
    delete saved[id];
    btn.classList.remove('saved');
    btn.textContent = '\u{1F4BE} Save';
    showToast('Removed from saved jobs');
  } else {
    saved[id] = { id, title, savedAt: Date.now() };
    btn.classList.add('saved');
    btn.textContent = '✓ Saved';
    showToast('Job saved!');
  }
  setSaved(saved);
}

/* ── Toast notification ── */
function showToast(msg) {
  let t = document.getElementById('save-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'save-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Job search ── */
function searchJobs() {
  const k = document.getElementById('jobKeyword')?.value?.trim() || '';
  const l = document.getElementById('jobLocation')?.value?.trim() || '';
  const c = document.getElementById('jobCategory')?.value || '';
  let u = 'jobs.html?';
  if (k) u += 'q=' + encodeURIComponent(k) + '&';
  if (l) u += 'loc=' + encodeURIComponent(l) + '&';
  if (c) u += 'cat=' + encodeURIComponent(c);
  window.location.href = u;
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('#jobKeyword, #jobLocation').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') searchJobs(); });
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('.news-card, .job-card[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      filterCards.forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.getAttribute('data-category') !== filter);
      });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
});
