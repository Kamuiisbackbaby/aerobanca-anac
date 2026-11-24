// ============================================================================
// ADMIN — login por token e cadastro de questões via API (Railway)
// ============================================================================
const AdminApi = (() => {
  // Cole aqui a URL pública da API do Railway (sem barra no final).
  // Ex.: 'https://aerobanca-api.up.railway.app'. Vazio = modo local (sem nuvem).
  const API_URL = 'https://zoological-hope-production-6d8c8def.up.railway.app';
  const KEY = 'aerobanca_admin_token';

  const enabled = () => API_URL !== '';
  // sessionStorage: o token vive só nesta aba e some ao fechá-la.
  const getToken = () => sessionStorage.getItem(KEY) || '';
  const setToken = (t) => sessionStorage.setItem(KEY, t);
  const logout = () => sessionStorage.removeItem(KEY);

  async function call(path, options = {}) {
    const res = await fetch(API_URL + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    });
    if (res.status === 401) {
      logout();
      throw new Error('Token inválido ou expirado');
    }
    if (!res.ok) throw new Error('Erro ao falar com a API');
    return res.json();
  }

  return {
    url: API_URL,
    enabled,
    isLoggedIn: () => getToken() !== '',
    async login(token) {
      setToken(token);
      try {
        await call('/admin/check');
      } catch (e) {
        logout();
        throw e;
      }
    },
    logout,
    list: () => call('/admin/questoes'),
    criar: (q) => call('/questoes', { method: 'POST', body: JSON.stringify(q) }),
    remover: (codigo) => call(`/questoes/${encodeURIComponent(codigo)}`, { method: 'DELETE' })
  };
})();

window.AdminApi = AdminApi;

document.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('adminGate');
  const formCard = document.getElementById('adminFormCard');
  const cloudCard = document.getElementById('adminCloudCard');
  const status = document.getElementById('adminGateStatus');
  const tokenInput = document.getElementById('adminTokenInput');
  const loginBtn = document.getElementById('adminLoginBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const listEl = document.getElementById('adminCloudList');
  if (!gate) return;

  function setStatus(msg) {
    status.textContent = msg;
    status.classList.toggle('hidden', !msg);
  }

  async function renderList() {
    listEl.textContent = 'Carregando...';
    try {
      const items = await AdminApi.list();
      listEl.textContent = '';
      if (items.length === 0) listEl.textContent = 'Nenhuma questão na nuvem.';
      items.forEach((q) => {
        const row = document.createElement('div');
        row.className = 'cloud-row';
        const label = document.createElement('span');
        label.textContent = `${q.id} — ${q.stem.slice(0, 70)}${q.stem.length > 70 ? '…' : ''}`;
        const del = document.createElement('button');
        del.className = 'btn btn-secondary btn-sm';
        del.textContent = 'Excluir';
        del.addEventListener('click', async () => {
          if (!confirm(`Excluir ${q.id}?`)) return;
          try {
            await AdminApi.remover(q.id);
            renderList();
            if (window.refreshQuestionsFromApi) window.refreshQuestionsFromApi();
          } catch (e) {
            setStatus(e.message);
            refresh();
          }
        });
        row.append(label, del);
        listEl.appendChild(row);
      });
    } catch (e) {
      listEl.textContent = '';
      setStatus(e.message);
      refresh();
    }
  }

  function refresh() {
    if (!AdminApi.enabled()) {
      // Modo local: sem API configurada, o formulário funciona só neste navegador.
      gate.classList.add('hidden');
      cloudCard.classList.add('hidden');
      formCard.classList.remove('hidden');
      return;
    }
    const logged = AdminApi.isLoggedIn();
    gate.classList.toggle('hidden', logged);
    formCard.classList.toggle('hidden', !logged);
    cloudCard.classList.toggle('hidden', !logged);
    logoutBtn.classList.toggle('hidden', !logged);
    if (logged) renderList();
  }

  loginBtn.addEventListener('click', async () => {
    const t = tokenInput.value.trim();
    if (!t) return setStatus('Digite o token de admin.');
    loginBtn.disabled = true;
    setStatus('Verificando...');
    try {
      await AdminApi.login(t);
      tokenInput.value = '';
      setStatus('');
    } catch (e) {
      setStatus(e.message);
    }
    loginBtn.disabled = false;
    refresh();
  });

  tokenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });

  logoutBtn.addEventListener('click', () => {
    AdminApi.logout();
    setStatus('');
    refresh();
  });

  window.refreshAdminList = renderList;
  refresh();
});
