import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
const adminJs = fs.readFileSync(path.join(rootDir, 'admin.js'), 'utf8');

function createClassList(initial = []) {
  const set = new Set(initial.filter(Boolean));
  return {
    add: (...cls) => cls.forEach((c) => set.add(c)),
    remove: (...cls) => cls.forEach((c) => set.delete(c)),
    toggle: (c, force) => {
      if (force === undefined) {
        if (set.has(c)) {
          set.delete(c);
          return false;
        }
        set.add(c);
        return true;
      }
      if (force) set.add(c);
      else set.delete(c);
      return Boolean(force);
    },
    contains: (c) => set.has(c),
    toString: () => [...set].join(' '),
  };
}

function createStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
  };
}

function createMockElement(tag = 'div', id = '', classes = [], attrs = {}) {
  const listeners = new Map();
  const attributes = new Map(Object.entries(attrs));
  if (id) attributes.set('id', id);
  const classList = createClassList(classes);

  const el = {
    tagName: tag.toUpperCase(),
    id,
    classList,
    get className() {
      return classList.toString();
    },
    set className(val) {
      const current = classList.toString().split(/\s+/).filter(Boolean);
      current.forEach((c) => classList.remove(c));
      String(val || '')
        .split(/\s+/)
        .filter(Boolean)
        .forEach((c) => classList.add(c));
    },
    style: {},
    dataset: {},
    value: attrs.value ?? '',
    checked: Boolean(attrs.checked),
    disabled: false,
    required: false,
    autocomplete: '',
    innerHTML: '',
    textContent: '',
    children: [],
    parentElement: null,
    scrollIntoView: () => {},
    focus: () => {},
    reset: () => {
      el.value = '';
    },
    appendChild: (child) => {
      child.parentElement = el;
      el.children.push(child);
      return child;
    },
    insertBefore: (newNode, refNode) => {
      newNode.parentElement = el;
      const idx = refNode ? el.children.indexOf(refNode) : -1;
      if (idx === -1) el.children.push(newNode);
      else el.children.splice(idx, 0, newNode);
      return newNode;
    },
    append: (...nodes) => {
      nodes.forEach((n) => {
        if (typeof n === 'object' && n) el.appendChild(n);
      });
    },
    remove: () => {},
    setAttribute: (k, v) => {
      attributes.set(k, String(v));
      if (k.startsWith('data-')) {
        const camel = k.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
        el.dataset[camel] = String(v);
      }
    },
    getAttribute: (k) => (attributes.has(k) ? attributes.get(k) : null),
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    dispatchEvent: async (evt) => {
      const eventObj = typeof evt === 'string' ? { type: evt } : { ...evt };
      eventObj.target ??= el;
      eventObj.currentTarget ??= el;
      eventObj.preventDefault ??= () => {};
      const list = listeners.get(eventObj.type) || [];
      for (const fn of list) {
        await fn(eventObj);
      }
    },
    click: async () => {
      await el.dispatchEvent({ type: 'click', target: el });
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
  };

  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('data-')) {
      const camel = k.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
      el.dataset[camel] = String(v);
    }
  }
  return el;
}

function buildDomHarness({ initialToken = '', innerWidth = 1280, fetchHandler } = {}) {
  const byId = new Map();

  function reg(tag, id, classes = [], attrs = {}) {
    const el = createMockElement(tag, id, classes, attrs);
    if (id) byId.set(id, el);
    return el;
  }

  // Register all elements declared in index.html
  const authScreen = reg('section', 'authScreen', ['auth-screen']);
  reg('button', 'authModeLoginBtn', ['auth-mode-btn', 'active']);
  reg('button', 'authModeRegisterBtn', ['auth-mode-btn']);
  const authForm = reg('form', 'authForm', ['auth-form']);
  reg('div', 'authNameGroup', ['form-group', 'hidden']);
  reg('input', 'authNameInput');
  reg('input', 'authEmailInput');
  reg('input', 'authPasswordInput');
  const authCareerCards = reg('div', 'authCareerCards', ['career-cards']);
  const careerBtns = ['PP', 'PC', 'CMS'].map((c) =>
    createMockElement('button', '', ['career-card'], { 'data-career': c })
  );
  authCareerCards.querySelectorAll = (sel) => (sel.includes('data-career') ? careerBtns : []);
  reg('div', 'authFeedback', ['form-feedback', 'hidden']);
  reg('div', 'authPrivacyGroup', ['form-group', 'hidden']);
  reg('input', 'authPrivacyCheck', [], { type: 'checkbox', checked: false });
  reg('button', 'openPrivacyFromAuthBtn', ['link-btn']);
  reg('button', 'authFooterPrivacyBtn', ['link-btn']);
  reg('button', 'authSubmitBtn', ['btn', 'btn-primary']);
  reg('span', 'authAdminTrigger', ['meta-glyph']);

  reg('div', 'privacyPolicyModal', ['lgpd-modal-overlay', 'hidden']);
  reg('button', 'closePrivacyModalBtn');
  reg('div', 'accountPrivacyModal', ['lgpd-modal-overlay', 'hidden']);
  reg('button', 'openAccountPrivacyBtn');
  reg('button', 'closeAccountModalBtn');
  reg('button', 'openPrivacyFromAccountBtn');
  reg('form', 'accountProfileForm');
  reg('input', 'accountNameInput');
  reg('input', 'accountEmailInput');
  reg('input', 'accountEmailPasswordInput');
  reg('div', 'accountProfileFeedback', ['form-feedback', 'hidden']);
  reg('button', 'saveProfileBtn');
  reg('form', 'accountPasswordForm');
  reg('input', 'accountCurrentPasswordInput');
  reg('input', 'accountNewPasswordInput');
  reg('div', 'accountPasswordFeedback', ['form-feedback', 'hidden']);
  reg('button', 'savePasswordBtn');
  reg('button', 'exportMyDataBtn');
  reg('div', 'accountExportFeedback', ['form-feedback', 'hidden']);
  reg('form', 'deleteAccountForm');
  reg('input', 'deleteAccountPasswordInput');
  reg('div', 'deleteAccountFeedback', ['form-feedback', 'hidden']);
  reg('button', 'deleteAccountBtn');

  reg('div', 'welcomeSplash', ['welcome-splash', 'hidden']);
  reg('h2', 'welcomeSplashTitle', ['welcome-splash-title']);
  reg('p', 'welcomeSplashSub', ['welcome-splash-sub']);

  const appShell = reg('div', 'appShell', ['app-layout', 'hidden']);
  reg('div', 'sidebarBackdrop', ['sidebar-backdrop']);
  const sidebar = reg('aside', 'sidebar', ['sidebar']);
  reg('button', 'closeSidebarBtn', ['mobile-close-btn']);
  reg('select', 'careerQuickSelect', [], { value: 'PP' });
  reg('strong', 'sidebarUserName');
  reg('span', 'sidebarUserEmail');
  reg('button', 'logoutBtn');
  reg('span', 'sysRevNode', ['meta-glyph']);
  reg('header', 'topbar', ['topbar']);
  reg('button', 'toggleSidebarBtn', ['menu-toggle']);
  reg('h1', 'pageTitle');
  reg('p', 'pageSubtitle');
  reg('span', 'topbarCareerBadge');
  reg('button', 'topbarLogoutBtn');

  const navButtons = ['dashboard', 'metrics', 'simulado'].map((v, i) =>
    createMockElement('button', '', i === 0 ? ['nav-item', 'active'] : ['nav-item'], { 'data-view': v })
  );
  const mobileNavButtons = ['dashboard', 'metrics', 'simulado'].map((v, i) =>
    createMockElement('button', '', i === 0 ? ['mobile-nav-item', 'active'] : ['mobile-nav-item'], { 'data-view': v })
  );
  reg('nav', 'mobileBottomNav', ['mobile-bottom-nav']);

  const viewDashboard = reg('main', 'view-dashboard', ['view-section', 'active']);
  const statsGrid = createMockElement('section', '', ['stats-grid']);
  viewDashboard.querySelector = (sel) => (sel === '.stats-grid' ? statsGrid : null);

  reg('strong', 'kpiOverallPct');
  reg('span', 'kpiOverallTag');
  reg('strong', 'kpiPassedSubjects');
  reg('strong', 'kpiCriticalSubject');
  reg('p', 'kpiCriticalHelper');
  reg('section', 'subjectsSection');
  reg('div', 'subjectsGrid');
  reg('section', 'subjectPracticePanel', ['subject-practice-panel', 'hidden']);
  reg('button', 'practiceBackBtn');
  reg('h3', 'practiceSubjectTitle');
  reg('input', 'practiceSearchInput');
  reg('div', 'practiceQuestionsList');

  reg('main', 'view-metrics', ['view-section']);
  reg('button', 'refreshMetricsBtn');
  reg('div', 'metricsContent');

  reg('main', 'view-simulado', ['view-section']);
  const simConfigCard = reg('section', 'simuladoConfigCard', ['card-panel']);
  const simSubjectChecks = ['MET', 'NAV', 'RPA', 'CT', 'TSV'].map((s) =>
    createMockElement('input', '', [], { type: 'checkbox', name: 'simSubject', value: s, checked: true })
  );
  reg('select', 'simCountSelect', [], { value: '15' });
  reg('input', 'simTimerToggle', [], { type: 'checkbox', checked: true });
  reg('button', 'startCustomSimuladoBtn');
  reg('button', 'startLevelingBtn');

  const examActiveContainer = reg('section', 'examActiveContainer', ['exam-active-container', 'hidden']);
  const examLayout = createMockElement('div', '', ['exam-layout']);
  examActiveContainer.appendChild(examLayout);
  examActiveContainer.querySelector = (sel) => (sel === '.exam-layout' ? examLayout : null);
  reg('span', 'examCurrentSubjectBadge');
  reg('span', 'examQuestionCounter');
  reg('div', 'examTimerBox');
  reg('span', 'examTimer');
  reg('button', 'toggleExamMapBtn');
  reg('button', 'finishExamBtn');
  reg('div', 'examProgressBar');
  reg('span', 'examQCode');
  reg('span', 'examQTopic');
  reg('span', 'examQDifficulty');
  reg('p', 'examQuestionStem');
  reg('div', 'examOptionsList');
  reg('button', 'prevQuestionBtn');
  reg('button', 'flagQuestionBtn');
  reg('button', 'nextQuestionBtn');
  reg('aside', 'examMapCard', ['question-map-card']);
  reg('div', 'examMapGroups');
  reg('section', 'examResultScreen', ['diagnostic-result-screen', 'hidden']);

  const viewDatabase = reg('main', 'view-database', ['view-section']);
  reg('button', 'adminBackBtn');
  reg('button', 'adminLogoutBtn', ['hidden']);
  reg('div', 'adminGate');
  reg('input', 'adminTokenInput');
  reg('button', 'adminLoginBtn');
  reg('div', 'adminGateStatus', ['hidden']);
  reg('div', 'adminFormCard', ['hidden']);
  reg('form', 'addQuestionForm');
  reg('select', 'newQSubject', [], { value: 'MET' });
  reg('input', 'newQTopic');
  reg('select', 'newQLicense', [], { value: 'PP' });
  reg('select', 'newQDifficulty', [], { value: 'Banca ANAC' });
  reg('textarea', 'newQStem');
  reg('input', 'newQOptA');
  reg('input', 'newQOptB');
  reg('input', 'newQOptC');
  reg('input', 'newQOptD');
  reg('select', 'newQCorrect', [], { value: '0' });
  reg('input', 'newQExplanation');
  reg('button', 'exportJsonBtn');
  reg('div', 'formFeedback', ['hidden']);
  reg('div', 'adminCloudCard', ['hidden']);
  reg('div', 'adminCloudList');

  // Preserve reset on authForm
  authForm.reset = () => {
    byId.get('authNameInput').value = '';
    byId.get('authEmailInput').value = '';
    byId.get('authPasswordInput').value = '';
  };

  const viewSections = [viewDashboard, byId.get('view-metrics'), byId.get('view-simulado'), viewDatabase];
  const docListeners = new Map();

  const documentMock = {
    body: { classList: createClassList() },
    getElementById: (id) => byId.get(id) || null,
    createElement: (tag) => createMockElement(tag),
    addEventListener: (type, fn) => {
      if (!docListeners.has(type)) docListeners.set(type, []);
      docListeners.get(type).push(fn);
    },
    querySelectorAll: (sel) => {
      if (sel === '.view-section') return viewSections;
      if (sel === '.nav-item') return navButtons;
      if (sel === '.mobile-nav-item') return mobileNavButtons;
      if (sel.includes('#authCareerCards')) return careerBtns;
      if (sel.includes('input[name="simSubject"]:checked')) return simSubjectChecks.filter((c) => c.checked);
      if (sel.includes('input[name="simSubject"]')) return simSubjectChecks;
      return [];
    },
    querySelector: (sel) => {
      const mNav = sel.match(/^\.nav-item\[data-view="([^"]+)"\]$/);
      if (mNav) return navButtons.find((b) => b.getAttribute('data-view') === mNav[1]) || null;
      const mMob = sel.match(/^\.mobile-nav-item\[data-view="([^"]+)"\]$/);
      if (mMob) return mobileNavButtons.find((b) => b.getAttribute('data-view') === mMob[1]) || null;
      if (sel === '.stats-grid') return statsGrid;
      return null;
    },
  };

  const sessionStorage = createStorage();
  const localStorage = createStorage();
  if (initialToken) sessionStorage.setItem('aerobanca_user_token', initialToken);

  const fetchCalls = [];
  const fetchMock = async (url, opts = {}) => {
    fetchCalls.push({ url, opts });
    if (fetchHandler) return fetchHandler(url, opts);
    return { ok: true, status: 200, json: async () => [] };
  };

  const windowObj = {
    innerWidth,
    AdminApi: {
      url: 'https://api.example.test',
      enabled: () => true,
      isLoggedIn: () => false,
    },
  };

  const context = {
    window: windowObj,
    document: documentMock,
    sessionStorage,
    localStorage,
    fetch: fetchMock,
    navigator: { clipboard: { writeText: async () => {} } },
    setTimeout,
    clearTimeout,
    setInterval: () => 1,
    clearInterval: () => {},
    confirm: () => true,
    console,
    encodeURIComponent,
    decodeURIComponent,
    URLSearchParams,
    Error,
    Number,
    String,
    Array,
    Object,
    Map,
    Set,
    Math,
    Date,
    JSON,
    Promise,
  };
  windowObj.window = windowObj;
  context.globalThis = context;

  vm.createContext(context);
  vm.runInContext(appJs, context, { filename: 'app.js' });

  async function boot() {
    const domReady = docListeners.get('DOMContentLoaded') || [];
    for (const fn of domReady) {
      await fn();
    }
  }

  return {
    context,
    window: windowObj,
    document: documentMock,
    byId,
    careerBtns,
    navButtons,
    mobileNavButtons,
    sessionStorage,
    localStorage,
    fetchCalls,
    boot,
    authScreen,
    appShell,
    simConfigCard,
    examActiveContainer,
  };
}

test('index.html loads favicon.svg, auth screen, collapsible sidebar, mobile bottom nav, and exactly 3 modules', () => {
  assert.match(indexHtml, /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="favicon\.svg">/);
  assert.equal(fs.existsSync(path.join(rootDir, 'favicon.svg')), true, 'favicon.svg must exist');

  const requiredIds = [
    'authScreen',
    'authModeLoginBtn',
    'authModeRegisterBtn',
    'authForm',
    'authNameGroup',
    'authNameInput',
    'authEmailInput',
    'authPasswordInput',
    'authCareerCards',
    'authPrivacyGroup',
    'authPrivacyCheck',
    'openPrivacyFromAuthBtn',
    'authFooterPrivacyBtn',
    'authSubmitBtn',
    'authFeedback',
    'authAdminTrigger',
    'privacyPolicyModal',
    'accountPrivacyModal',
    'openAccountPrivacyBtn',
    'accountProfileForm',
    'accountPasswordForm',
    'exportMyDataBtn',
    'deleteAccountForm',
    'welcomeSplash',
    'welcomeSplashTitle',
    'appShell',
    'sidebar',
    'sidebarBackdrop',
    'toggleSidebarBtn',
    'closeSidebarBtn',
    'careerQuickSelect',
    'sidebarUserName',
    'sidebarUserEmail',
    'logoutBtn',
    'topbarCareerBadge',
    'topbarLogoutBtn',
    'sysRevNode',
    'mobileBottomNav',
    'view-dashboard',
    'view-metrics',
    'view-simulado',
    'view-database',
    'subjectsGrid',
    'subjectPracticePanel',
    'practiceBackBtn',
    'practiceSearchInput',
    'practiceQuestionsList',
    'metricsContent',
    'refreshMetricsBtn',
    'simuladoConfigCard',
    'simCountSelect',
    'simTimerToggle',
    'startCustomSimuladoBtn',
    'startLevelingBtn',
    'examActiveContainer',
    'toggleExamMapBtn',
    'examMapCard',
    'finishExamBtn',
    'examResultScreen',
    'adminBackBtn',
  ];

  for (const id of requiredIds) {
    assert.match(indexHtml, new RegExp(`id="${id}"`), `index.html must include #${id}`);
  }

  const sidebarNavItems = indexHtml.match(/class="nav-item[^"]*"/g) || [];
  assert.equal(sidebarNavItems.length, 3, 'Sidebar must have exactly 3 .nav-item modules');

  const mobileNavItems = indexHtml.match(/class="mobile-nav-item[^"]*"/g) || [];
  assert.equal(mobileNavItems.length, 3, 'Mobile bottom nav must have exactly 3 .mobile-nav-item modules');

  for (const career of ['PP', 'PC', 'CMS']) {
    assert.match(indexHtml, new RegExp(`data-career="${career}"`), `Career card ${career} must exist`);
  }

  for (const forbidden of ['view-questions', 'loadSampleResultBtn', 'fillDemoDiagnosticBtn', 'sys RevNode', 'fonts.googleapis.com', 'fonts.gstatic.com']) {
    assert.equal(indexHtml.includes(forbidden), false, `index.html must not contain legacy/external "${forbidden}"`);
  }
});

test('app.js and admin.js parse cleanly without syntax errors', () => {
  assert.doesNotThrow(() => new vm.Script(appJs, { filename: 'app.js' }));
  assert.doesNotThrow(() => new vm.Script(adminJs, { filename: 'admin.js' }));
});

test('app.js implements required API endpoints, state keys, XSS escaping, and removes old 4th tab references', () => {
  const requiredTokens = [
    'aerobanca_user_token',
    'aerobanca_sidebar_collapsed',
    '/auth/login',
    '/auth/register',
    '/auth/me',
    '/auth/career',
    '/simulado',
    '/simulado/personalizado',
    '/simulado/corrigir',
    '/questoes/',
    '/responder',
    '/metricas',
    'nivelamento_concluido',
    'leveling-locked',
    'sidebar-collapsed',
    'admin-standalone',
    'map-collapsed',
    'esc(',
  ];

  for (const token of requiredTokens) {
    assert.equal(appJs.includes(token), true, `app.js must contain "${token}"`);
  }

  const deadReferences = [
    'view-questions',
    'loadSampleResultBtn',
    'fillDemoDiagnosticBtn',
    'simulateDemoDiagnosticAnswers',
    'finishDiagnosticBtn',
    'sys RevNode',
    'openSidebarBtn',
    'bankSubjectPills',
    'bankQuestionsList',
    'bankSearchInput',
    'dashboardDiagnosticReport',
    'kpiTotalQuestions',
  ];

  for (const dead of deadReferences) {
    assert.equal(appJs.includes(dead), false, `app.js must NOT contain dead reference "${dead}"`);
  }

  assert.equal(/\bonclick\s*=/i.test(appJs), false, 'app.js must NOT use inline onclick= handlers');
});

test('runtime: bootstrap without token shows authScreen and blocks submit without career selection', async () => {
  const env = buildDomHarness();
  await env.boot();

  assert.equal(env.authScreen.classList.contains('hidden'), false);
  assert.equal(env.appShell.classList.contains('hidden'), true);
  assert.equal(
    env.fetchCalls.some((c) => c.url.includes('/auth/')),
    false,
    'Should not call /auth/* when no token is stored'
  );

  env.byId.get('authEmailInput').value = 'piloto@anac.br';
  env.byId.get('authPasswordInput').value = 'Senha123';
  const beforeCalls = env.fetchCalls.length;
  await env.byId.get('authForm').dispatchEvent({ type: 'submit' });

  assert.equal(env.fetchCalls.length, beforeCalls, 'Submit without career must NOT call API');
  assert.equal(env.byId.get('authFeedback').classList.contains('hidden'), false);
});

test('runtime: login with nivelamento_concluido=false enforces mandatory leveling lock until all 30 questions answered', async () => {
  let corrigirCalled = 0;
  const mock30 = [];
  const subjects = ['MET', 'NAV', 'RPA', 'CT', 'TSV'];
  for (const s of subjects) {
    for (let i = 1; i <= 6; i++) {
      mock30.push({
        id: `${s}-0${i}`,
        subject: s,
        topic: `Topic <script>xss</script> ${s}-${i}`,
        difficulty: 'Banca ANAC',
        stem: `Questão ${s}-0${i}?`,
        options: ['A', 'B', 'C', 'D'],
      });
    }
  }

  const env = buildDomHarness({
    fetchHandler: async (url, opts) => {
      if (url.endsWith('/auth/login')) {
        const body = JSON.parse(opts.body);
        assert.equal(body.carreira, 'PP');
        return {
          ok: true,
          status: 200,
          json: async () => ({
            token: 'tok.abc',
            user: { id: 1, nome: 'Carlos <Piloto>', email: 'carlos@anac.br', carreira: 'PP', nivelamento_concluido: false },
          }),
        };
      }
      if (url.endsWith('/simulado')) {
        return { ok: true, status: 200, json: async () => mock30 };
      }
      if (url.endsWith('/questoes')) {
        return { ok: true, status: 200, json: async () => mock30 };
      }
      if (url.endsWith('/metricas')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            resumo: { totalSimulados: 0, totalQuestoes: 0, totalAcertos: 0, aproveitamentoGeral: 0, materiasAprovadas: 0, totalMaterias: 5, materiaCritica: null },
            porMateria: {},
            pontosFracos: [],
            historico: [],
          }),
        };
      }
      if (url.endsWith('/simulado/corrigir')) {
        corrigirCalled++;
        const payload = JSON.parse(opts.body);
        assert.equal(payload.tipo, 'nivelamento');
        assert.equal(payload.questoes.length, 30);
        assert.equal(Object.keys(payload.respostas).length, 30);
        return {
          ok: true,
          status: 200,
          json: async () => ({
            tentativaId: 10,
            tipo: 'nivelamento',
            carreira: 'PP',
            total_questoes: 30,
            total_acertos: 25,
            percentual: 83,
            nivelamento_concluido: true,
            porMateria: {
              MET: { total: 6, acertos: 4, percentual: 67, erradas: [{ id: 'MET-01', topic: 'Altimetria <img src=x>', explanation: 'Exp <b>safe</b>' }] },
              NAV: { total: 6, acertos: 6, percentual: 100, erradas: [] },
              RPA: { total: 6, acertos: 5, percentual: 83, erradas: [] },
              CT: { total: 6, acertos: 5, percentual: 83, erradas: [] },
              TSV: { total: 6, acertos: 5, percentual: 83, erradas: [] },
            },
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });

  await env.boot();
  await env.careerBtns[0].click(); // PP
  env.byId.get('authEmailInput').value = 'carlos@anac.br';
  env.byId.get('authPasswordInput').value = 'Senha123';
  await env.byId.get('authForm').dispatchEvent({ type: 'submit' });

  assert.equal(env.sessionStorage.getItem('aerobanca_user_token'), 'tok.abc');
  assert.equal(env.authScreen.classList.contains('hidden'), true);
  assert.equal(env.appShell.classList.contains('hidden'), false);
  assert.equal(env.document.body.classList.contains('leveling-locked'), true);
  assert.equal(env.byId.get('view-simulado').classList.contains('active'), true);
  assert.equal(env.simConfigCard.classList.contains('hidden'), true);
  assert.equal(env.examActiveContainer.classList.contains('hidden'), false);

  // Attempting to switch to dashboard while leveling locked must remain on simulado
  env.context.switchView('dashboard');
  assert.equal(env.byId.get('view-simulado').classList.contains('active'), true);
  assert.equal(env.byId.get('view-dashboard').classList.contains('active'), false);

  // Attempting startCustomSimulado while leveling locked must NOT call /simulado/personalizado
  const callsBeforeCustom = env.fetchCalls.length;
  await env.context.startCustomSimulado();
  assert.equal(env.fetchCalls.length, callsBeforeCustom, 'startCustomSimulado must be blocked while leveling-locked');

  // Submitting before answering all 30 must be blocked and #examFeedback placed BEFORE .exam-layout
  await env.byId.get('finishExamBtn').click();
  assert.equal(corrigirCalled, 0);
  const activeChildren = env.examActiveContainer.children;
  const feedbackIdx = activeChildren.findIndex((c) => c.id === 'examFeedback');
  const layoutIdx = activeChildren.findIndex((c) => c.classList.contains('exam-layout'));
  assert.equal(feedbackIdx >= 0, true, '#examFeedback must be mounted inside #examActiveContainer');
  assert.equal(layoutIdx >= 0, true, '.exam-layout must exist inside #examActiveContainer');
  assert.equal(feedbackIdx < layoutIdx, true, '#examFeedback must appear BEFORE .exam-layout');

  // Answer all 30 questions and submit
  for (let i = 0; i < 30; i++) {
    env.context.jumpToExamQuestion(i);
    env.context.selectExamOption(0);
  }
  await env.byId.get('finishExamBtn').click();

  assert.equal(corrigirCalled, 1);
  assert.equal(env.document.body.classList.contains('leveling-locked'), false);
  const resultHtml = env.byId.get('examResultScreen').innerHTML;
  assert.equal(env.byId.get('examResultScreen').classList.contains('hidden'), false);
  assert.equal(resultHtml.includes('<img src=x>'), false, 'Dynamic topic in result HTML must be escaped');
  assert.equal(resultHtml.includes('&lt;img src=x&gt;'), true);
});

test('runtime: desktop sidebar collapse persists in localStorage and admin trigger opens standalone view', async () => {
  const env = buildDomHarness({ innerWidth: 1280 });
  await env.boot();

  // Desktop sidebar collapse toggle
  await env.byId.get('toggleSidebarBtn').click();
  assert.equal(env.document.body.classList.contains('sidebar-collapsed'), true);
  assert.equal(env.localStorage.getItem('aerobanca_sidebar_collapsed'), 'true');

  await env.byId.get('toggleSidebarBtn').click();
  assert.equal(env.document.body.classList.contains('sidebar-collapsed'), false);
  assert.equal(env.localStorage.getItem('aerobanca_sidebar_collapsed'), 'false');

  // 3-click hidden admin trigger from authScreen
  const adminTrigger = env.byId.get('authAdminTrigger');
  await adminTrigger.click();
  await adminTrigger.click();
  assert.equal(env.document.body.classList.contains('admin-standalone'), false);
  await adminTrigger.click();
  assert.equal(env.document.body.classList.contains('admin-standalone'), true);
  assert.equal(env.byId.get('view-database').classList.contains('active'), true);
  assert.equal(env.authScreen.classList.contains('hidden'), true);
  assert.equal(env.appShell.classList.contains('hidden'), false);

  await env.byId.get('adminBackBtn').click();
  assert.equal(env.document.body.classList.contains('admin-standalone'), false);
  assert.equal(env.authScreen.classList.contains('hidden'), false);
  assert.equal(env.appShell.classList.contains('hidden'), true);
});

test('runtime: register mode, token bootstrap, career switch, Module 1 practice, Module 2 metrics, Module 3 custom exam, and mobile drawer', async () => {
  const sampleMetrics = {
    resumo: {
      totalSimulados: 2,
      totalQuestoes: 40,
      totalAcertos: 30,
      aproveitamentoGeral: 75,
      materiasAprovadas: 4,
      totalMaterias: 5,
      materiaCritica: { sigla: 'NAV', nome: 'Navegação Aérea', ultimoPercentual: 50, mediaAcumulada: 55 },
    },
    porMateria: {
      MET: { sigla: 'MET', nome: 'Meteorologia Aeronáutica', ultimoPercentual: 83, mediaAcumulada: 80, aprovada: true },
      NAV: { sigla: 'NAV', nome: 'Navegação Aérea', ultimoPercentual: 50, mediaAcumulada: 55, aprovada: false },
      RPA: { sigla: 'RPA', nome: 'Regulamentos de Tráfego Aéreo', ultimoPercentual: 83, mediaAcumulada: 83, aprovada: true },
      CT: { sigla: 'CT', nome: 'Conhecimentos Técnicos e Motores', ultimoPercentual: 100, mediaAcumulada: 90, aprovada: true },
      TSV: { sigla: 'TSV', nome: 'Teoria de Voo', ultimoPercentual: 83, mediaAcumulada: 83, aprovada: true },
    },
    pontosFracos: [
      {
        sigla: 'NAV',
        nome: 'Navegação Aérea',
        ultimoPercentual: 50,
        mediaAcumulada: 55,
        subtopicosErrados: ['Proas <script>alert(1)</script>'],
      },
    ],
    historico: [
      { id: 2, tipo: 'personalizado', carreira: 'PC', acertos: 8, total: 10, percentual: 80, data: '2026-11-24T12:00:00Z' },
    ],
  };

  // 1) Registration flow
  const regEnv = buildDomHarness({
    fetchHandler: async (url, opts) => {
      if (url.endsWith('/auth/register')) {
        const body = JSON.parse(opts.body);
        assert.equal(body.nome, 'Piloto Teste');
        assert.equal(body.carreira, 'PC');
        return {
          ok: true,
          status: 201,
          json: async () => ({
            token: 'reg.token.123',
            user: { id: 2, nome: 'Piloto Teste', email: 'novo@anac.br', carreira: 'PC', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/metricas')) return { ok: true, status: 200, json: async () => sampleMetrics };
      if (url.endsWith('/questoes')) {
        return {
          ok: true,
          status: 200,
          json: async () => [
            { id: 'MET-01', subject: 'MET', topic: 'Altimetria', difficulty: 'Banca ANAC', stem: 'Pergunta <b/>?', options: ['A', 'B', 'C', 'D'] },
          ],
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });

  await regEnv.boot();
  await regEnv.byId.get('authModeRegisterBtn').click();
  assert.equal(regEnv.byId.get('authNameGroup').classList.contains('hidden'), false);
  assert.equal(regEnv.byId.get('authPrivacyGroup').classList.contains('hidden'), false);
  regEnv.byId.get('authNameInput').value = 'Piloto Teste';
  regEnv.byId.get('authEmailInput').value = 'novo@anac.br';
  regEnv.byId.get('authPasswordInput').value = 'Senha123';
  await regEnv.careerBtns[1].click(); // PC
  // Deve bloquear cadastro sem aceite LGPD
  const callsBeforeConsent = regEnv.fetchCalls.length;
  await regEnv.byId.get('authForm').dispatchEvent({ type: 'submit' });
  assert.equal(regEnv.fetchCalls.length, callsBeforeConsent, 'Register without LGPD consent must be blocked');
  regEnv.byId.get('authPrivacyCheck').checked = true;
  await regEnv.byId.get('authForm').dispatchEvent({ type: 'submit' });
  assert.equal(regEnv.sessionStorage.getItem('aerobanca_user_token'), 'reg.token.123');
  assert.equal(regEnv.byId.get('view-dashboard').classList.contains('active'), true);
  assert.equal(regEnv.byId.get('welcomeSplash').classList.contains('hidden'), false);
  assert.equal(regEnv.byId.get('welcomeSplashTitle').textContent, 'Parabéns, seja bem vindo à Aerobanca!');
  await regEnv.byId.get('logoutBtn').click();
  assert.equal(regEnv.byId.get('welcomeSplash').classList.contains('hidden'), true);

  // 2) Token hydration + 3 modules + mobile drawer + 401 handling
  let customUrlSeen = '';
  let customSubmitBody = null;
  let force401OnMetrics = false;

  const env = buildDomHarness({
    initialToken: 'saved.token.xyz',
    innerWidth: 390,
    fetchHandler: async (url, opts) => {
      if (url.endsWith('/auth/me')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            user: { id: 3, nome: 'Ana <img src=x>', email: 'ana@anac.br', carreira: 'PP', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/auth/career')) {
        const body = JSON.parse(opts.body);
        assert.equal(body.carreira, 'CMS');
        return {
          ok: true,
          status: 200,
          json: async () => ({
            user: { id: 3, nome: 'Ana <img src=x>', email: 'ana@anac.br', carreira: 'CMS', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/questoes')) {
        return {
          ok: true,
          status: 200,
          json: async () => [
            { id: 'MET-01', subject: 'MET', topic: 'Altimetria', difficulty: 'Banca ANAC', stem: 'Altímetro?', options: ['A', 'B', 'C', 'D'] },
            { id: 'NAV-01', subject: 'NAV', topic: 'Proas', difficulty: 'Banca ANAC', stem: 'Proa?', options: ['A', 'B', 'C', 'D'] },
          ],
        };
      }
      if (url.endsWith('/metricas')) {
        if (force401OnMetrics) return { ok: false, status: 401, json: async () => ({ erro: 'Expirado' }) };
        return { ok: true, status: 200, json: async () => sampleMetrics };
      }
      if (url.endsWith('/questoes/MET-01/responder')) {
        const body = JSON.parse(opts.body);
        assert.equal(body.alternativa, 1);
        return {
          ok: true,
          status: 200,
          json: async () => ({ correta: true, indice_correta: 1, comentario: 'Explicação <script>bad</script>' }),
        };
      }
      if (url.includes('/simulado/personalizado')) {
        customUrlSeen = url;
        return {
          ok: true,
          status: 200,
          json: async () => [
            { id: 'MET-01', subject: 'MET', topic: 'Altimetria', difficulty: 'Banca ANAC', stem: 'Altímetro?', options: ['A', 'B', 'C', 'D'] },
            { id: 'NAV-01', subject: 'NAV', topic: 'Proas', difficulty: 'Banca ANAC', stem: 'Proa?', options: ['A', 'B', 'C', 'D'] },
          ],
        };
      }
      if (url.endsWith('/simulado/corrigir')) {
        customSubmitBody = JSON.parse(opts.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({
            tentativaId: 99,
            tipo: 'personalizado',
            carreira: 'CMS',
            total_questoes: 2,
            total_acertos: 1,
            percentual: 50,
            nivelamento_concluido: true,
            porMateria: {
              MET: { total: 1, acertos: 1, percentual: 100, erradas: [] },
              NAV: { total: 1, acertos: 0, percentual: 0, erradas: [{ id: 'NAV-01', topic: 'Proas' }] },
            },
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });

  await env.boot();
  assert.equal(env.authScreen.classList.contains('hidden'), true);
  assert.equal(env.appShell.classList.contains('hidden'), false);
  assert.equal(env.byId.get('kpiOverallPct').textContent, '75%');
  assert.equal(env.byId.get('kpiPassedSubjects').textContent, '4 / 5');
  assert.equal(env.byId.get('kpiCriticalSubject').textContent, 'NAV (50%)');
  assert.equal(env.byId.get('subjectsGrid').innerHTML.includes('subject-status-pill pass'), true);
  assert.equal(env.byId.get('subjectsGrid').innerHTML.includes('subject-status-pill attention'), true);

  // Mobile sidebar drawer open/close
  await env.byId.get('toggleSidebarBtn').click();
  assert.equal(env.byId.get('sidebar').classList.contains('open'), true);
  assert.equal(env.byId.get('sidebarBackdrop').classList.contains('open'), true);
  await env.byId.get('closeSidebarBtn').click();
  assert.equal(env.byId.get('sidebar').classList.contains('open'), false);

  // Career quick switch
  env.byId.get('careerQuickSelect').value = 'CMS';
  await env.byId.get('careerQuickSelect').dispatchEvent({ type: 'change' });
  assert.equal(env.byId.get('topbarCareerBadge').textContent, 'CMS');

  // Module 1 inline practice + POST /questoes/:codigo/responder + esc()
  env.context.openSubjectPractice('MET');
  assert.equal(env.byId.get('subjectPracticePanel').classList.contains('hidden'), false);
  await env.context.answerPracticeQuestion('MET-01', 1);
  const practiceHtml = env.byId.get('practiceQuestionsList').innerHTML;
  assert.equal(practiceHtml.includes('correct-reveal'), true);
  assert.equal(practiceHtml.includes('<script>bad</script>'), false);
  assert.equal(practiceHtml.includes('&lt;script&gt;bad&lt;/script&gt;'), true);

  // Module 2 metrics + esc() + mobile nav active sync
  await env.mobileNavButtons[1].click();
  assert.equal(env.byId.get('view-metrics').classList.contains('active'), true);
  assert.equal(env.navButtons[1].classList.contains('active'), true);
  assert.equal(env.mobileNavButtons[1].classList.contains('active'), true);
  const metricsHtml = env.byId.get('metricsContent').innerHTML;
  assert.equal(metricsHtml.includes('metrics-summary-grid'), true);
  assert.equal(metricsHtml.includes('subject-bars-container'), true);
  assert.equal(metricsHtml.includes('focus-recommendations'), true);
  assert.equal(metricsHtml.includes('history-list'), true);
  assert.equal(metricsHtml.includes('<script>alert(1)</script>'), false);
  assert.equal(metricsHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt;'), true);

  // Module 3 custom simulado + collapsible mobile map + blanks counted as wrong
  await env.navButtons[2].click();
  await env.byId.get('startCustomSimuladoBtn').click();
  assert.match(customUrlSeen, /\/simulado\/personalizado\?materias=/);
  assert.equal(env.examActiveContainer.classList.contains('hidden'), false);
  assert.equal(env.byId.get('examMapCard').classList.contains('map-collapsed'), true);
  await env.byId.get('toggleExamMapBtn').click();
  assert.equal(env.byId.get('examMapCard').classList.contains('map-collapsed'), false);
  assert.equal(env.byId.get('toggleExamMapBtn').getAttribute('aria-expanded'), 'true');

  // Answer only Q1, leave Q2 blank -> allowed for personalizado
  env.context.selectExamOption(1);
  await env.byId.get('finishExamBtn').click();
  assert.equal(customSubmitBody.tipo, 'personalizado');
  assert.deepEqual(customSubmitBody.questoes, ['MET-01', 'NAV-01']);
  assert.deepEqual(customSubmitBody.respostas, { 'MET-01': 1 });

  // 401 on protected endpoint clears session token and returns to authScreen
  force401OnMetrics = true;
  await env.context.loadAndRenderMetrics(true);
  assert.equal(env.sessionStorage.getItem('aerobanca_user_token'), null);
  assert.equal(env.authScreen.classList.contains('hidden'), false);
  assert.equal(env.appShell.classList.contains('hidden'), true);

  // Logout button also clears token, state, and user DOM containers (shared-device safety)
  regEnv.context.openSubjectPractice('MET');
  await regEnv.context.loadAndRenderMetrics(true);
  regEnv.byId.get('examResultScreen').innerHTML = '<div>User A Result</div>';
  regEnv.byId.get('examResultScreen').classList.remove('hidden');
  regEnv.byId.get('examOptionsList').innerHTML = '<button>Opt</button>';
  regEnv.byId.get('examMapGroups').innerHTML = '<button>1</button>';
  await regEnv.byId.get('logoutBtn').click();
  assert.equal(regEnv.sessionStorage.getItem('aerobanca_user_token'), null);
  assert.equal(regEnv.authScreen.classList.contains('hidden'), false);
  assert.equal(regEnv.appShell.classList.contains('hidden'), true);
  assert.equal(regEnv.byId.get('examResultScreen').innerHTML, '');
  assert.equal(regEnv.byId.get('examResultScreen').classList.contains('hidden'), true);
  assert.equal(regEnv.byId.get('examOptionsList').innerHTML, '');
  assert.equal(regEnv.byId.get('examMapGroups').innerHTML, '');
  assert.equal(regEnv.byId.get('practiceQuestionsList').innerHTML, '');
  assert.equal(regEnv.byId.get('metricsContent').innerHTML, '');
  assert.equal(regEnv.byId.get('subjectsGrid').innerHTML, '');
  assert.equal(regEnv.byId.get('kpiOverallPct').textContent, '--%');
  assert.equal(regEnv.byId.get('careerQuickSelect').value, 'PP');
  assert.equal(regEnv.byId.get('topbarCareerBadge').textContent, 'PP');
});

test('runtime: offline/null-response practice fallback, <30 leveling merge, and in-flight submit button disabling', async () => {
  // 1) Offline mode (AdminApi.url = '') falls back cleanly in answerPracticeQuestion without throwing
  const offlineEnv = buildDomHarness();
  offlineEnv.window.AdminApi = { url: '', enabled: () => false, isLoggedIn: () => false };
  await offlineEnv.boot();
  offlineEnv.context.openSubjectPractice('MET');
  await offlineEnv.context.answerPracticeQuestion('MET-01', 1);
  const offlineHtml = offlineEnv.byId.get('practiceQuestionsList').innerHTML;
  assert.equal(offlineHtml.includes('correct-reveal'), true);
  assert.equal(offlineHtml.includes('Gabarito Comentado (B)'), true);

  // 2) Null fetch response in apiFetch does not crash with Cannot read properties of null ('json')
  const nullRespEnv = buildDomHarness({
    initialToken: 'tok.123',
    fetchHandler: async (url) => {
      if (url.endsWith('/auth/me')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            user: { id: 4, nome: 'Piloto', email: 'p@anac.br', carreira: 'PP', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/questoes/MET-01/responder')) return null;
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });
  await nullRespEnv.boot();
  nullRespEnv.context.openSubjectPractice('MET');
  await nullRespEnv.context.answerPracticeQuestion('MET-01', 0);
  const fallbackHtml = nullRespEnv.byId.get('practiceQuestionsList').innerHTML;
  assert.equal(fallbackHtml.includes('wrong-reveal'), true);
  assert.equal(fallbackHtml.includes('correct-reveal'), true);

  // 3) startLevelingExam pads gracefully to 30 questions when API returns < 30,
  //    #simuladoConfigCard hides immediately during async boot, and buttons disable in-flight
  let resolveLogin;
  let resolveQuestoes;
  let resolveCorrigir;
  const flightEnv = buildDomHarness({
    fetchHandler: (url) => {
      if (url.endsWith('/auth/login')) {
        return new Promise((resolve) => {
          resolveLogin = () =>
            resolve({
              ok: true,
              status: 200,
              json: async () => ({
                token: 'tok.flight',
                user: { id: 5, nome: 'Voo', email: 'v@anac.br', carreira: 'PP', nivelamento_concluido: false },
              }),
            });
        });
      }
      if (url.endsWith('/questoes')) {
        return new Promise((resolve) => {
          resolveQuestoes = () => resolve({ ok: true, status: 200, json: async () => [] });
        });
      }
      if (url.endsWith('/simulado')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => [
            { id: 'MET-01', subject: 'MET', topic: 'T1', difficulty: 'Banca ANAC', stem: 'Q1', options: ['A', 'B', 'C', 'D'] },
            { id: 'NAV-01', subject: 'NAV', topic: 'T2', difficulty: 'Banca ANAC', stem: 'Q2', options: ['A', 'B', 'C', 'D'] },
          ],
        });
      }
      if (url.endsWith('/simulado/corrigir')) {
        return new Promise((resolve) => {
          resolveCorrigir = () =>
            resolve({
              ok: true,
              status: 200,
              json: async () => ({
                tentativaId: 1,
                tipo: 'nivelamento',
                carreira: 'PP',
                total_questoes: 30,
                total_acertos: 30,
                percentual: 100,
                nivelamento_concluido: true,
                porMateria: {},
              }),
            });
        });
      }
      return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
    },
  });

  await flightEnv.boot();
  await flightEnv.careerBtns[0].click();
  flightEnv.byId.get('authEmailInput').value = 'v@anac.br';
  flightEnv.byId.get('authPasswordInput').value = 'Senha123';

  const loginPromise = flightEnv.byId.get('authForm').dispatchEvent({ type: 'submit' });
  await Promise.resolve();
  assert.equal(flightEnv.byId.get('authSubmitBtn').disabled, true, '#authSubmitBtn must be disabled while login is in flight');
  resolveLogin();
  // Let enterAuthenticatedApp run until it awaits /questoes
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(
    flightEnv.simConfigCard.classList.contains('hidden'),
    true,
    '#simuladoConfigCard must be hidden immediately while leveling-locked boot awaits APIs'
  );
  resolveQuestoes();
  await loginPromise;
  assert.equal(flightEnv.byId.get('authSubmitBtn').disabled, false, '#authSubmitBtn must re-enable after login resolves');

  assert.equal(flightEnv.byId.get('examQuestionCounter').textContent, '1 / 30', 'startLevelingExam must pad <30 DB questions to 30');

  for (let i = 0; i < 30; i++) {
    flightEnv.context.jumpToExamQuestion(i);
    flightEnv.context.selectExamOption(0);
  }
  const finishPromise = flightEnv.byId.get('finishExamBtn').click();
  await Promise.resolve();
  assert.equal(flightEnv.byId.get('finishExamBtn').disabled, true, '#finishExamBtn must be disabled while corrigir is in flight');
  resolveCorrigir();
  await finishPromise;
  assert.equal(flightEnv.byId.get('finishExamBtn').disabled, false, '#finishExamBtn must re-enable after corrigir resolves');
});

test('runtime: welcome splash greets by time of day on login and celebrates on register', async () => {
  const env = buildDomHarness({
    fetchHandler: async (url) => {
      if (url.endsWith('/auth/login')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            token: 'tok.greet',
            user: { id: 9, nome: 'Aviador', email: 'a@anac.br', carreira: 'PP', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/questoes')) return { ok: true, status: 200, json: async () => [] };
      if (url.endsWith('/metricas')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            resumo: { totalSimulados: 0, totalQuestoes: 0, totalAcertos: 0, aproveitamentoGeral: 0, materiasAprovadas: 0, totalMaterias: 5, materiaCritica: null },
            porMateria: {},
            pontosFracos: [],
            historico: [],
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });

  await env.boot();

  assert.equal(env.window.getWelcomeGreeting('login', 8), 'Bom dia, seja bem vindo');
  assert.equal(env.window.getWelcomeGreeting('login', 14), 'Boa tarde, seja bem vindo');
  assert.equal(env.window.getWelcomeGreeting('login', 21), 'Boa noite, seja bem vindo');
  assert.equal(env.window.getWelcomeGreeting('login', 2), 'Boa noite, seja bem vindo');
  assert.equal(env.window.getWelcomeGreeting('register', 14), 'Parabéns, seja bem vindo à Aerobanca!');

  await env.careerBtns[0].click();
  env.byId.get('authEmailInput').value = 'a@anac.br';
  env.byId.get('authPasswordInput').value = 'Senha123';
  await env.byId.get('authForm').dispatchEvent({ type: 'submit' });

  assert.equal(env.byId.get('welcomeSplash').classList.contains('hidden'), false);
  assert.match(env.byId.get('welcomeSplashTitle').textContent, /^(Bom dia|Boa tarde|Boa noite), seja bem vindo$/);
  await env.byId.get('logoutBtn').click();
});

test('runtime: LGPD modals allow reading privacy policy, rectifying profile, exporting data, and deleting account', async () => {
  let profilePatched = false;
  let exported = false;
  let deleted = false;

  const env = buildDomHarness({
    initialToken: 'tok.lgpd',
    fetchHandler: async (url, opts = {}) => {
      if (url.endsWith('/auth/me') && (!opts.method || opts.method === 'GET')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            user: { id: 10, nome: 'Piloto Original', email: 'orig@anac.br', carreira: 'PP', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/auth/me') && opts.method === 'PATCH') {
        profilePatched = true;
        const body = JSON.parse(opts.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({
            user: { id: 10, nome: body.nome, email: body.email, carreira: 'PP', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/auth/me/export')) {
        exported = true;
        return {
          ok: true,
          status: 200,
          json: async () => ({ titular: { id: 10, nome: 'Piloto Atualizado' }, tentativas_simulado: [] }),
        };
      }
      if (url.endsWith('/auth/me') && opts.method === 'DELETE') {
        deleted = true;
        return { ok: true, status: 200, json: async () => ({ ok: true }) };
      }
      if (url.endsWith('/questoes')) return { ok: true, status: 200, json: async () => [] };
      if (url.endsWith('/metricas')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            resumo: { totalSimulados: 0, totalQuestoes: 0, totalAcertos: 0, aproveitamentoGeral: 0, materiasAprovadas: 0, totalMaterias: 5, materiaCritica: null },
            porMateria: {},
            pontosFracos: [],
            historico: [],
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });

  await env.boot();

  // Open privacy modal from account modal
  await env.byId.get('openAccountPrivacyBtn').click();
  assert.equal(env.byId.get('accountPrivacyModal').classList.contains('hidden'), false);
  assert.equal(env.byId.get('accountNameInput').value, 'Piloto Original');

  await env.byId.get('openPrivacyFromAccountBtn').click();
  assert.equal(env.byId.get('privacyPolicyModal').classList.contains('hidden'), false);
  await env.byId.get('closePrivacyModalBtn').click();
  assert.equal(env.byId.get('privacyPolicyModal').classList.contains('hidden'), true);

  // Update profile
  env.byId.get('accountNameInput').value = 'Piloto Atualizado';
  await env.byId.get('accountProfileForm').dispatchEvent({ type: 'submit' });
  assert.equal(profilePatched, true);
  assert.equal(env.byId.get('sidebarUserName').textContent, 'Piloto Atualizado');

  // Export data
  await env.byId.get('exportMyDataBtn').click();
  assert.equal(exported, true);

  // Delete account
  env.byId.get('deleteAccountPasswordInput').value = 'SenhaForte123';
  await env.byId.get('deleteAccountForm').dispatchEvent({ type: 'submit' });
  assert.equal(deleted, true);
  assert.equal(env.sessionStorage.getItem('aerobanca_user_token'), null);
  assert.equal(env.authScreen.classList.contains('hidden'), false);
});

test('runtime: post-exam error review renders escaped errors, subject filters, and 100% perfect state', async () => {
  let submitCount = 0;
  const mockQuestions = [
    {
      id: 'MET-01',
      subject: 'MET',
      topic: 'Altimetria <script>xss1</script>',
      difficulty: 'Banca ANAC',
      stem: 'Pergunta MET <img src=x onerror=1>?',
      options: ['Opt A', 'Opt B <b>ok</b>', 'Opt C <svg onload=1>', 'Opt D'],
    },
    {
      id: 'NAV-01',
      subject: 'NAV',
      topic: 'Proas <script>xss2</script>',
      difficulty: 'Banca ANAC',
      stem: 'Pergunta NAV <script>bad</script>?',
      options: ['100', '138', '120', '118'],
    },
    {
      id: 'RPA-01',
      subject: 'RPA',
      topic: 'Mínimos VFR',
      difficulty: 'Banca ANAC',
      stem: 'Pergunta RPA?',
      options: ['A', 'B', 'C', 'D'],
    },
  ];

  const env = buildDomHarness({
    initialToken: 'tok.review',
    fetchHandler: async (url) => {
      if (url.endsWith('/auth/me')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            user: { id: 12, nome: 'Piloto Review', email: 'rev@anac.br', carreira: 'PP', nivelamento_concluido: true },
          }),
        };
      }
      if (url.endsWith('/questoes')) {
        return { ok: true, status: 200, json: async () => mockQuestions };
      }
      if (url.endsWith('/metricas')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            resumo: { totalSimulados: 1, totalQuestoes: 3, totalAcertos: 1, aproveitamentoGeral: 33, materiasAprovadas: 1, totalMaterias: 5, materiaCritica: null },
            porMateria: {},
            pontosFracos: [],
            historico: [],
          }),
        };
      }
      if (url.includes('/simulado/personalizado')) {
        return { ok: true, status: 200, json: async () => mockQuestions };
      }
      if (url.endsWith('/simulado/corrigir')) {
        submitCount += 1;
        if (submitCount === 1) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              tentativaId: 50,
              tipo: 'personalizado',
              carreira: 'PP',
              total_questoes: 3,
              total_acertos: 1,
              percentual: 33,
              nivelamento_concluido: true,
              porMateria: {
                MET: { total: 1, acertos: 0, percentual: 0, erradas: [{ id: 'MET-01', topic: 'Altimetria <script>xss1</script>' }] },
                NAV: { total: 1, acertos: 0, percentual: 0, erradas: [{ id: 'NAV-01', topic: 'Proas <script>xss2</script>' }] },
                RPA: { total: 1, acertos: 1, percentual: 100, erradas: [] },
              },
              gabaritoErros: [
                {
                  numero: 1,
                  id: 'MET-01',
                  subject: 'MET',
                  topic: 'Altimetria <script>xss1</script>',
                  difficulty: 'Banca ANAC',
                  stem: 'Pergunta MET <img src=x onerror=1>?',
                  options: ['Opt A', 'Opt B <b>ok</b>', 'Opt C <svg onload=1>', 'Opt D'],
                  chosen: 2,
                  correct: 1,
                  explanation: 'Explicação MET <script>evil()</script>',
                },
                {
                  numero: 2,
                  id: 'NAV-01',
                  subject: 'NAV',
                  topic: 'Proas <script>xss2</script>',
                  difficulty: 'Banca ANAC',
                  stem: 'Pergunta NAV <script>bad</script>?',
                  options: ['100', '138', '120', '118'],
                  chosen: null,
                  correct: 1,
                  explanation: 'Explicação NAV <img src=y>',
                },
              ],
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            tentativaId: 51,
            tipo: 'personalizado',
            carreira: 'PP',
            total_questoes: 3,
            total_acertos: 3,
            percentual: 100,
            nivelamento_concluido: true,
            porMateria: {
              MET: { total: 1, acertos: 1, percentual: 100, erradas: [] },
              NAV: { total: 1, acertos: 1, percentual: 100, erradas: [] },
              RPA: { total: 1, acertos: 1, percentual: 100, erradas: [] },
            },
            gabaritoErros: [],
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });

  await env.boot();
  await env.navButtons[2].click();
  await env.byId.get('startCustomSimuladoBtn').click();

  // Q1 (MET-01): answer wrong (2); Q2 (NAV-01): leave blank; Q3 (RPA-01): answer right (1)
  env.context.selectExamOption(2);
  env.context.jumpToExamQuestion(2);
  env.context.selectExamOption(1);
  await env.byId.get('finishExamBtn').click();

  const html = env.byId.get('examResultScreen').innerHTML;
  assert.equal(html.includes('error-review-section'), true);
  assert.equal(html.includes('Gabarito dos Seus Erros'), true);
  assert.equal(html.includes('is-wrong'), true);
  assert.equal(html.includes('Sua resposta'), true);
  assert.equal(html.includes('is-correct'), true);
  assert.equal(html.includes('Gabarito'), true);
  assert.equal(html.includes('Em branco'), true);
  assert.equal(html.includes('Explicação MET &lt;script&gt;evil()&lt;/script&gt;'), true);
  assert.equal(html.includes('Explicação NAV &lt;img src=y&gt;'), true);
  assert.equal(html.includes('<script>'), false);
  assert.equal(html.includes('<img '), false);
  assert.equal(html.includes('<svg '), false);
  assert.equal(html.includes('data-error-filter="ALL"'), true);
  assert.equal(html.includes('data-error-filter="MET"'), true);
  assert.equal(html.includes('data-error-filter="NAV"'), true);

  // Filter to MET only
  env.window.applyExamErrorFilter('MET');
  const filteredHtml = env.byId.get('examResultScreen').innerHTML;
  assert.match(
    filteredHtml,
    /<article[\s\S]*?class="error-review-card\s*"[\s\S]*?data-error-subject="MET"/
  );
  assert.match(
    filteredHtml,
    /<article[\s\S]*?class="error-review-card\s+hidden"[\s\S]*?data-error-subject="NAV"/
  );
  assert.match(
    filteredHtml,
    /class="error-filter-pill\s+active"\s+data-error-filter="MET"/
  );

  // Start a new exam with 100% score -> positive zero-error state
  env.context.resetSimuladoToConfig();
  await env.byId.get('startCustomSimuladoBtn').click();
  env.context.selectExamOption(1);
  env.context.jumpToExamQuestion(1);
  env.context.selectExamOption(1);
  env.context.jumpToExamQuestion(2);
  env.context.selectExamOption(1);
  await env.byId.get('finishExamBtn').click();

  const perfectHtml = env.byId.get('examResultScreen').innerHTML;
  assert.equal(perfectHtml.includes('Nenhum erro neste simulado!'), true);
  assert.equal(perfectHtml.includes('data-error-card="true"'), false);
});
