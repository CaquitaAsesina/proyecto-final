const STORAGE_KEYS = {
  clients: 'bank_clients',
  session: 'bank_session',
  transactions: 'bank_transactions',
  theme: 'bank_theme',
  seed: 'bank_seed_v9',
};

function getClients() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.clients) || '[]');
}

function saveClients(clients) {
  localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
}

function getTransactions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) || '{}');
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

function getSession() {
  return localStorage.getItem(STORAGE_KEYS.session);
}

function setSession(account) {
  localStorage.setItem(STORAGE_KEYS.session, account);
}

function getMainAccount() {
  return getSession() || '';
}

function daysAgo(days, hour) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour !== undefined ? hour : 9 + (days % 10), (days * 7) % 60, 0, 0);
  return d.toISOString();
}

function seedData() {
  if (localStorage.getItem(STORAGE_KEYS.seed)) return;

  const clients = [
    {
      id: 'c4',
      firstName: 'Ana',
      lastName: 'Torres',
      email: 'ana.torres@mail.com',
      phone: '+57 300 123 4567',
      country: 'Colombia',
      device: 'iPhone 15 Pro',
      password: 'secret4',
      accounts: [
        { account: '40001', type: 'Corriente', balance: 12000.0 },
        { account: '40002', type: 'Ahorro', balance: 8500.0 },
        { account: '40003', type: 'Corriente', balance: 3200.75 },
        { account: '40004', type: 'Ahorro', balance: 15600.5 },
        { account: '40005', type: 'Nómina', balance: 980.2 },
        { account: '40006', type: 'Ahorro', balance: 25000.0 },
        { account: '40007', type: 'Corriente', balance: 500.0 },
        { account: '40008', type: 'Ahorro', balance: 4300.35 },
      ],
    },
    {
      id: 'c1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@mail.com',
      phone: '+52 55 1234 5678',
      country: 'México',
      device: 'Android Galaxy S24',
      password: 'secret1',
      accounts: [
        { account: '10001', type: 'Corriente', balance: 5240.75 },
        { account: '20001', type: 'Ahorro', balance: 15000.0 },
      ],
    },
    {
      id: 'c2',
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@mail.com',
      phone: '+34 612 345 678',
      country: 'España',
      device: 'iPad Air',
      password: 'secret2',
      accounts: [
        { account: '10002', type: 'Corriente', balance: 3850.5 },
        { account: '20002', type: 'Ahorro', balance: 8700.25 },
      ],
    },
    {
      id: 'c3',
      firstName: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@mail.com',
      phone: '+1 305 555 0199',
      country: 'Estados Unidos',
      device: 'MacBook Pro',
      password: 'secret3',
      accounts: [
        { account: '10003', type: 'Corriente', balance: 1230.4 },
        { account: '20003', type: 'Ahorro', balance: 4100.0 },
      ],
    },
  ];
  saveClients(clients);

  const transactions = {};
  const push = (account, entry) => {
    const base = new Date(entry.date);
    const end = new Date(base.getTime() + Math.floor(Math.random() * 20 + 3) * 60000);
    (transactions[account] = transactions[account] || []).push({ status: 'completado', end: end.toISOString(), ...entry });
  };

  push('10001', { type: 'out', to: '10002', amount: 250, date: daysAgo(2, 10) });
  push('10002', { type: 'in', from: '10001', amount: 250, date: daysAgo(2, 10) });

  push('10001', { type: 'out', to: '10003', amount: 150, date: daysAgo(3, 14) });
  push('10003', { type: 'in', from: '10001', amount: 150, date: daysAgo(3, 14) });

  push('20001', { type: 'out', to: '10001', amount: 400, date: daysAgo(5, 9) });
  push('10001', { type: 'in', from: '20001', amount: 400, date: daysAgo(5, 9) });

  push('10001', { type: 'out', to: '20002', amount: 75.5, date: daysAgo(6, 18) });
  push('20002', { type: 'in', from: '10001', amount: 75.5, date: daysAgo(6, 18) });

  push('10002', { type: 'out', to: '10001', amount: 300, date: daysAgo(8, 11) });
  push('10001', { type: 'in', from: '10002', amount: 300, date: daysAgo(8, 11) });

  push('10003', { type: 'out', to: '10001', amount: 90, date: daysAgo(9, 16) });
  push('10001', { type: 'in', from: '10003', amount: 90, date: daysAgo(9, 16) });

  push('20002', { type: 'out', to: '10002', amount: 220, date: daysAgo(11, 12) });
  push('10002', { type: 'in', from: '20002', amount: 220, date: daysAgo(11, 12) });

  push('20003', { type: 'out', to: '10003', amount: 60, date: daysAgo(13, 15) });
  push('10003', { type: 'in', from: '20003', amount: 60, date: daysAgo(13, 15) });

  push('10002', { type: 'out', to: '20001', amount: 500, date: daysAgo(15, 8) });
  push('20001', { type: 'in', from: '10002', amount: 500, date: daysAgo(15, 8) });

  push('40001', { type: 'out', to: '40006', amount: 2000, date: daysAgo(1, 11), status: 'pendiente' });
  push('40006', { type: 'in', from: '40001', amount: 2000, date: daysAgo(1, 11) });

  push('40001', { type: 'out', to: '10001', amount: 750, date: daysAgo(2, 16) });
  push('10001', { type: 'in', from: '40001', amount: 750, date: daysAgo(2, 16) });

  push('40002', { type: 'out', to: '40003', amount: 300, date: daysAgo(3, 9) });
  push('40003', { type: 'in', from: '40002', amount: 300, date: daysAgo(3, 9) });

  push('40004', { type: 'out', to: '10002', amount: 450, date: daysAgo(4, 13), status: 'pendiente' });
  push('10002', { type: 'in', from: '40004', amount: 450, date: daysAgo(4, 13) });

  push('40006', { type: 'out', to: '40008', amount: 1200, date: daysAgo(5, 10) });
  push('40008', { type: 'in', from: '40006', amount: 1200, date: daysAgo(5, 10) });

  push('40008', { type: 'out', to: '20003', amount: 180, date: daysAgo(7, 17) });
  push('20003', { type: 'in', from: '40008', amount: 180, date: daysAgo(7, 17) });

  const allAccounts = clients.flatMap(c => c.accounts.map(a => a.account));
  const rand = (min, max) => min + Math.random() * (max - min);
  const depTypes = ['Yape', 'Plin', 'Transferencia'];
  allAccounts.forEach(acc => {
    for (let i = 0; i < 2; i++) {
      const from = allAccounts[Math.floor(Math.random() * allAccounts.length)];
      if (from === acc) continue;
      const amount = Math.round(rand(50, 1500) * 100) / 100;
      const date = daysAgo(Math.floor(rand(0, 12)), Math.floor(rand(8, 22)));
      push(acc, { type: 'in', from, amount, date, transferType: depTypes[Math.floor(Math.random() * depTypes.length)] });
    }
  });
  for (let i = 0; i < 500; i++) {
    const from = allAccounts[Math.floor(Math.random() * allAccounts.length)];
    let to = from;
    while (to === from) to = allAccounts[Math.floor(Math.random() * allAccounts.length)];
    const amount = Math.round(rand(25, 950) * 100) / 100;
    const date = daysAgo(Math.floor(rand(0, 30)), Math.floor(rand(0, 23)));
    const status = Math.random() < 0.12 ? 'pendiente' : 'completado';
    push(from, { type: 'out', to, amount, date, status });
    push(to, { type: 'in', from, amount, date, status });
  }

  saveTransactions(transactions);
  localStorage.setItem(STORAGE_KEYS.seed, '1');
}

function getClientById(clientId) {
  return getClients().find(c => c.id === clientId) || null;
}

function getClientByAccount(account) {
  return getClients().find(c => c.accounts.some(a => a.account === account)) || null;
}

function getCurrentClient() {
  const account = getSession();
  if (!account) return null;
  return getClientByAccount(account) || null;
}

function login(account, password) {
  const client = getClientByAccount(account);
  if (!client) return { ok: false, message: 'La cuenta no existe.' };
  if (client.password !== password) return { ok: false, message: 'Contraseña incorrecta.' };
  setSession(account);
  return { ok: true };
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
  window.location.href = 'index.html';
}

function registerClient(data, password) {
  if (!data.firstName || !data.lastName) return { ok: false, message: 'Ingresa nombre y apellido.' };
  if (!data.email || !data.email.includes('@')) return { ok: false, message: 'Ingresa un correo válido.' };
  if (!data.phone) return { ok: false, message: 'Ingresa tu número de teléfono.' };
  if (!data.country) return { ok: false, message: 'Ingresa tu país.' };
  if (!password || password.length < 6) return { ok: false, message: 'La contraseña debe tener al menos 6 caracteres.' };

  const clients = getClients();
  const account = generateAccountNumber(clients);
  const id = 'c' + Date.now();
  clients.push({
    id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    device: 'Navegador web',
    password,
    accounts: [{ account, type: 'Corriente', balance: 100 }],
  });
  saveClients(clients);
  return { ok: true, account };
}

function generateAccountNumber(clients) {
  const used = new Set(clients.flatMap(c => c.accounts.map(a => a.account)));
  let account;
  do {
    account = stringAccount();
  } while (used.has(account));
  return account;
}

function stringAccount() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function maskAccount(account) {
  return '•••• ' + account.slice(-4);
}

function transfer(fromAccount, toAccount, amount, transferType) {
  const client = getCurrentClient();
  if (!client) return { ok: false, message: 'Debes iniciar sesión.' };
  if (!fromAccount) return { ok: false, message: 'Selecciona la cuenta de origen.' };
  if (fromAccount === toAccount) return { ok: false, message: 'La cuenta de origen y destino no pueden ser la misma.' };
  if (!toAccount) return { ok: false, message: 'Indica la cuenta destino.' };
  if (!amount || isNaN(amount) || amount <= 0) return { ok: false, message: 'Monto inválido.' };

  const clients = getClients();
  const me = clients.find(c => c.id === client.id);
  const source = me.accounts.find(a => a.account === fromAccount);
  if (!source) return { ok: false, message: 'La cuenta de origen no te pertenece.' };
  if (source.balance < amount) return { ok: false, message: 'Saldo insuficiente.' };

  const recipientClient = clients.find(c => c.accounts.some(a => a.account === toAccount));
  if (!recipientClient) return { ok: false, message: 'La cuenta destino no existe.' };
  const recipient = recipientClient.accounts.find(a => a.account === toAccount);

  source.balance = round(source.balance - amount);
  recipient.balance = round(recipient.balance + amount);
  saveClients(clients);

  const date = new Date().toISOString();
  const end = new Date(Date.now() + 60000).toISOString();
  const transactions = getTransactions();
  (transactions[fromAccount] = transactions[fromAccount] || []).push({ type: 'out', to: toAccount, amount, date, end, status: 'completado', transferType });
  (transactions[toAccount] = transactions[toAccount] || []).push({ type: 'in', from: fromAccount, amount, date, end, status: 'completado', transferType });
  saveTransactions(transactions);

  return { ok: true, message: 'Transferencia realizada con éxito.' };
}

function getClientTransactions(client) {
  const all = getTransactions();
  return client.accounts
    .flatMap(acc => (all[acc.account] || []).map(tx => ({ account: acc.account, ...tx })))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function currency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getClientNameByAccount(account) {
  const client = getClientByAccount(account);
  return client ? `${client.firstName} ${client.lastName}` : 'Cuenta ' + account;
}

const state = {
  dateFrom: '',
  dateTo: '',
  statusFilter: 'all',
  balanceVisible: true,
};

function initDashboardUI() {
  seedData();
  const client = getCurrentClient();
  if (!client) {
    window.location.href = 'index.html';
    return false;
  }
  initTheme();
  renderAll();
  syncCardHeights();
  const label = document.getElementById('mainAccountLabel');
  if (label) label.textContent = getMainAccount();
  const box = document.getElementById('mainAccountPill');
  if (box) box.textContent = getMainAccount();
  return true;
}

function syncCardHeights() {
  const statsCard = document.getElementById('statsCard');
  const historyCard = document.getElementById('historyCard');
  const list = document.getElementById('transactionList');
  if (!statsCard || !historyCard || !list) return;

  const measure = () => {
    const scrollable = list.closest('.table-responsive');
    const hidden = scrollable.classList.contains('d-none');
    if (!hidden) scrollable.classList.add('d-none');
    const height = statsCard.offsetHeight;
    if (!hidden) scrollable.classList.remove('d-none');
    return height;
  };

  historyCard.style.height = `${measure()}px`;

  if (typeof ResizeObserver !== 'undefined' && !window._cardRO) {
    window._cardRO = new ResizeObserver(() => {
      historyCard.style.height = `${measure()}px`;
    });
    window._cardRO.observe(statsCard);
  }
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  const dark = saved !== null ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  buildThemeToggle(dark);
}

function buildThemeToggle(dark) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  themeToggle.innerHTML = dark
    ? '<i class="bi bi-sun me-2"></i>Cambiar a claro'
    : '<i class="bi bi-moon-stars me-2"></i>Cambiar a oscuro';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  const next = current ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', next);
  localStorage.setItem(STORAGE_KEYS.theme, next);
  buildThemeToggle(next === 'dark');
}

function toggleBalanceVisibility() {
  state.balanceVisible = !state.balanceVisible;
  renderAll();
}

function renderAll() {
  renderClient();
  renderAccounts();
  renderMovimientos();
}

function showModule() {
  return;
}

function renderClient() {
  const client = getCurrentClient();
  if (!client) return;

  document.getElementById('userName').textContent = `${client.firstName} ${client.lastName}`;
  const initials = (client.firstName.charAt(0) + client.lastName.charAt(0)).toUpperCase();
  document.getElementById('avatar').textContent = initials;
  document.getElementById('ddAvatar').textContent = initials;
  document.getElementById('ddName').textContent = `${client.firstName} ${client.lastName}`;
  document.getElementById('cardHolder').textContent = `${client.firstName} ${client.lastName}`;
  document.getElementById('heroAvatar').textContent = initials;
  document.getElementById('heroName').textContent = `${client.firstName} ${client.lastName}`;
  document.getElementById('heroCountry').textContent = client.country;
  document.getElementById('ddEmail').textContent = client.email;
  document.getElementById('ddPhone').textContent = client.phone;
  document.getElementById('ddCountry').textContent = client.country;

  const hidden = state.balanceVisible ? '' : '••••';
  const total = client.accounts.reduce((s, a) => s + a.balance, 0);
  document.getElementById('totalBalance').textContent = state.balanceVisible ? currency(total) : hidden;
  document.getElementById('eyeToggle').innerHTML = state.balanceVisible
    ? '<i class="bi bi-eye-slash"></i>'
    : '<i class="bi bi-eye"></i>';
}

function renderAccounts() {
  const client = getCurrentClient();
  const container = document.getElementById('accountsList');
  container.innerHTML = '';
  const main = getMainAccount();
  document.getElementById('accountCount').textContent = client.accounts.length;

  for (const acc of client.accounts) {
    const isMain = acc.account === main;
    const owner = `${client.firstName} ${client.lastName}`.toUpperCase();
    const last4 = acc.account.slice(-4);
    const expMonth = String((parseInt(acc.account, 10) % 12) + 1).padStart(2, '0');
    const expYear = String((parseInt(acc.account, 10) % 6) + 26);
    const slide = document.createElement('div');
    slide.className = 'account-slide';
    slide.innerHTML = `
      <div class="bank-card${isMain ? ' main-account' : ''}">
        <div class="d-flex justify-content-between align-items-start">
          <span class="bank-brand"><i class="bi bi-bank2"></i> Banco Test</span>
          <span class="d-flex gap-1">
            ${isMain ? '<span class="badge rounded-pill text-bg-warning">Principal</span>' : ''}
            <span class="badge rounded-pill text-bg-primary bg-opacity-75">${acc.type}</span>
          </span>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="chip"></span>
          <i class="bi bi-wifi contactless" aria-hidden="true"></i>
        </div>
        <div class="bank-number">••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;${last4}</div>
        <div class="d-flex justify-content-between align-items-end">
          <div>
            <small class="d-block opacity-75 bank-label">TITULAR</small>
            <span class="fw-semibold bank-owner">${owner}</span>
          </div>
          <div class="text-end">
            <small class="d-block opacity-75 bank-label">VÁLIDA HASTA</small>
            <span class="fw-semibold">${expMonth}/${expYear}</span>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2 bank-card-footer">
        <div class="lh-sm flex-grow-1">
          <small class="text-body-secondary d-block">No. ${acc.account}</small>
          <span class="small fw-semibold">${state.balanceVisible ? currency(acc.balance) : '••••••'}</span>
        </div>
        <button class="btn btn-sm btn-outline-primary fw-semibold select-account" data-account="${acc.account}">
          <i class="bi bi-send me-1"></i>Transferir
        </button>
      </div>
    `;
    container.appendChild(slide);
  }

  Array.from(container.querySelectorAll('.select-account')).forEach(btn => {
    btn.addEventListener('click', () => {
      openTransferModal(btn.dataset.account);
    });
  });
}

function renderMovimientos() {
  const client = getCurrentClient();
  let shown = getClientTransactions(client);

  if (state.dateFrom || state.dateTo) {
    const from = state.dateFrom ? new Date(state.dateFrom + 'T00:00:00') : null;
    const to = state.dateTo ? new Date(state.dateTo + 'T23:59:59') : null;
    shown = shown.filter(t => {
      const d = new Date(t.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }
  if (state.statusFilter !== 'all') {
    shown = shown.filter(t => (t.status || 'completado') === state.statusFilter);
  }

  renderTable(shown);
  renderChart(shown);
}

function renderChart(shown) {
  const client = getCurrentClient();
  const inAmount = shown.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  const outAmount = shown.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0);
  const total = client.accounts.reduce((s, a) => s + a.balance, 0);

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('statBalance', currency(total));
  set('statInAmount', currency(inAmount));
  set('statOutAmount', currency(outAmount));
  set('statInCount', `${shown.filter(t => t.type === 'in').length} movimientos`);
  set('statOutCount', `${shown.filter(t => t.type === 'out').length} movimientos`);

  drawSvg(buildBalanceSeries(client, 15));
}

function keyOf(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function buildBalanceSeries(client, daysCount) {
  const deltas = {};
  getClientTransactions(client).forEach(t => {
    const k = keyOf(new Date(t.date));
    deltas[k] = (deltas[k] || 0) + (t.type === 'in' ? t.amount : -t.amount);
  });

  const total = client.accounts.reduce((s, a) => s + a.balance, 0);
  const days = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const series = new Array(daysCount);
  let bal = total;
  for (let i = daysCount - 1; i >= 0; i--) {
    series[i] = bal;
    bal -= deltas[keyOf(days[i])] || 0;
  }
  return days.map((d, i) => ({ date: d, value: series[i] }));
}

function drawSvg(series) {
  const svg = document.getElementById('chartSvg');
  if (!svg) return;

  const W = 620;
  const H = 220;
  const PAD_X = 6;
  const PAD_Y = 18;
  const n = series.length;

  const values = series.map(s => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const x = i => PAD_X + (i * (W - 2 * PAD_X)) / (n - 1);
  const y = v => PAD_Y + ((max - v) * (H - 2 * PAD_Y)) / span;

  let line = '';
  let area = '';
  series.forEach((s, i) => {
    const point = `${x(i).toFixed(1)},${y(s.value).toFixed(1)}`;
    line += (i ? ' L ' : 'M ') + point;
    area += (i ? ' L ' : 'M ') + point;
  });
  area += ` L ${x(n - 1).toFixed(1)},${(H - PAD_Y).toFixed(1)} L ${x(0).toFixed(1)},${(H - PAD_Y).toFixed(1)} Z`;

  const last = series[n - 1];
  svg.innerHTML = `
    <defs>
      <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0d6efd"/>
        <stop offset="100%" stop-color="#6610f2"/>
      </linearGradient>
      <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0d6efd" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0d6efd" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <path d="${area}" fill="url(#chartAreaGrad)"/>
    <path d="${line}" fill="none" stroke="url(#chartLineGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${x(n - 1).toFixed(1)}" cy="${y(last.value).toFixed(1)}" r="5" fill="#fff" stroke="#0d6efd" stroke-width="3"/>
  `;

  const startLabel = document.getElementById('chartStartLabel');
  if (startLabel) startLabel.textContent = `${pad2(series[0].date.getDate())}/${pad2(series[0].date.getMonth() + 1)}`;
  const endLabel = document.getElementById('chartEndLabel');
  if (endLabel) endLabel.textContent = `${pad2(last.date.getDate())}/${pad2(last.date.getMonth() + 1)}`;
}

function renderTable(transactions) {
  const tbody = document.getElementById('transactionList');
  const emptyState = document.getElementById('emptyState');

  const table = tbody.closest('.table-responsive');
  table.classList.toggle('d-none', transactions.length === 0);
  emptyState.classList.toggle('d-none', transactions.length > 0);

  tbody.innerHTML = '';
  for (const tx of transactions) {
    const isOut = tx.type === 'out';
    const destAccount = isOut ? tx.to : tx.account;
    const destClient = getClientByAccount(destAccount);
    const destName = destClient ? `${destClient.firstName} ${destClient.lastName}` : '—';
    const destCountry = destClient ? destClient.country : '—';
    const destDevice = destClient && destClient.device ? destClient.device : '—';
    const amountClass = isOut ? 'text-danger' : 'text-success';
    const sign = isOut ? '-' : '+';
    const pending = (tx.status || 'completado') === 'pendiente';
    const statusClass = pending ? 'text-bg-warning' : 'text-bg-success';
    const statusLabel = pending ? 'Pendiente' : 'Completado';
    const date = new Date(tx.date);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-body-secondary small text-nowrap">${formatDateOnly(date)}</td>
      <td class="text-nowrap fw-medium">${destAccount}</td>
      <td class="text-center"><span class="badge rounded-pill ${pending ? 'text-bg-warning' : 'text-bg-success'}">${statusLabel}</span></td>
      <td class="text-end">
        <button type="button" class="btn-detail" data-detail title="Ver detalles completos">
          <i class="bi bi-box-arrow-up-right"></i>
          <span>Ver</span>
        </button>
      </td>
    `;
    tr.querySelector('[data-detail]').addEventListener('click', () => openDetailModal(tx));
    tbody.appendChild(tr);
  }
}

function openDetailModal(tx) {
  const isOut = tx.type === 'out';
  const destAccount = isOut ? tx.to : tx.account;
  const destClient = getClientByAccount(destAccount);
  const pending = (tx.status || 'completado') === 'pendiente';
  const destName = destClient ? `${destClient.firstName} ${destClient.lastName}` : '—';
  const destCountry = destClient ? destClient.country : '—';
  const date = new Date(tx.date);
  const end = new Date(tx.end || tx.date);
  const sign = isOut ? '-' : '+';
  const tipoBadge = `<span class="badge rounded-pill ${isOut ? 'text-bg-danger' : 'text-bg-success'}">${isOut ? 'Salida' : 'Entrada'}</span>`;
  const estadoBadge = `<span class="badge rounded-pill ${pending ? 'text-bg-warning' : 'text-bg-success'}">${pending ? 'Pendiente' : 'Completado'}</span>`;

  const last4 = destAccount.slice(-4);
  const expMonth = String((parseInt(destAccount, 10) % 12) + 1).padStart(2, '0');
  const expYear = String((parseInt(destAccount, 10) % 6) + 26);
  const owner = (destName === '—' ? 'Desconocido' : destName).toUpperCase();

  const item = (label, value, mono) => `
    <div class="dex-item">
      <small>${label}</small>
      <strong${mono ? ' class="mono"' : ''}>${value}</strong>
    </div>
  `;
  const section = (title, items, single) => `
    <div class="dex-section">
      <div class="dex-section-title">${title}</div>
      <div class="dex-grid${single ? ' single' : ''}">${items.join('')}</div>
    </div>
  `;

  document.getElementById('detailBody').innerHTML = `
    <div class="detail-exec">
      <div class="detail-top">
        <div class="bank-card bank-card-sm">
          <div class="d-flex justify-content-between align-items-start">
            <span class="bank-brand"><i class="bi bi-bank2"></i>Banco</span>
            <span class="d-flex align-items-center gap-1">
              <span class="badge rounded-pill">Destino</span>
              <button type="button" class="bank-eye" id="detailCardToggle" title="Mostrar / ocultar número">
                <i class="bi bi-eye"></i>
              </button>
            </span>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="chip"></span>
            <i class="bi bi-wifi contactless" aria-hidden="true"></i>
          </div>
          <div class="bank-number" id="detailCardNum">••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••</div>
          <div class="d-flex justify-content-between align-items-end">
            <div>
              <small class="d-block opacity-75 bank-label">TITULAR</small>
              <span class="fw-semibold bank-owner">${owner}</span>
            </div>
          </div>
        </div>
        <div class="detail-side">
          <small class="detail-side-label">Monto total</small>
          <div class="detail-side-amount ${isOut ? 'text-danger' : 'text-success'}">${sign}${currency(tx.amount)}</div>
          <div class="detail-side-badges">
            <span class="d-badge d-badge-secondary"><i class="bi bi-geo-alt"></i>${destCountry}</span>
            <span class="d-badge ${isOut ? 'd-badge-danger' : 'd-badge-success'}"><i class="bi ${isOut ? 'bi-arrow-up-right' : 'bi-arrow-down-left'}"></i>${isOut ? 'Salida' : 'Entrada'}</span>
            <span class="d-badge ${pending ? 'd-badge-warning' : 'd-badge-success'}"><i class="bi ${pending ? 'bi-hourglass-split' : 'bi-check-circle'}"></i>${pending ? 'Pendiente' : 'Completado'}</span>
          </div>
        </div>
      </div>

      ${section('Cronología', [
        item('Fecha inicial', formatDateOnly(date), true),
        item('Hora inicial', formatTime(date), true),
        item('Fecha final', formatDateOnly(end), true),
        item('Hora final', formatTime(end), true),
      ])}
    </div>
  `;

  const cardToggle = document.getElementById('detailCardToggle');
  const cardNum = document.getElementById('detailCardNum');
  if (cardToggle && cardNum) {
    let shown = false;
    cardToggle.addEventListener('click', () => {
      shown = !shown;
      if (shown) {
        cardNum.textContent = destAccount;
        cardToggle.classList.add('active');
        cardToggle.innerHTML = '<i class="bi bi-eye-slash"></i>';
      } else {
        cardNum.textContent = '••••  ••••  ••••  ••••';
        cardToggle.classList.remove('active');
        cardToggle.innerHTML = '<i class="bi bi-eye"></i>';
      }
    });
  }

  bootstrap.Modal.getOrCreateInstance(document.getElementById('detailModal')).show();
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatDateOnly(date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${String(date.getFullYear()).slice(-2)}`;
}

function formatTime(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function deviceIcon(device) {
  const d = (device || '').toLowerCase();
  if (d.includes('iphone') || d.includes('android') || d.includes('ipad') || d.includes('phone')) return 'bi-phone';
  if (d.includes('macbook') || d.includes('laptop') || d.includes('notebook')) return 'bi-laptop';
  if (d.includes('web') || d.includes('navegador') || d.includes('browser')) return 'bi-globe2';
  return 'bi-device-hdd';
}

function openTransferModal(preferredAccount) {
  const client = getCurrentClient();
  const select = document.getElementById('fromAccount');
  select.innerHTML = '<option value="" selected disabled>Selecciona una cuenta</option>';
  client.accounts.forEach(acc => {
    const opt = document.createElement('option');
    opt.value = acc.account;
    opt.textContent = `${acc.account} · ${acc.type} (${currency(acc.balance)})`;
    select.appendChild(opt);
  });
  const source = preferredAccount && client.accounts.some(a => a.account === preferredAccount)
    ? preferredAccount
    : getMainAccount();
  select.value = source;
  const form = document.getElementById('transferForm');
  form.classList.remove('was-validated');
  document.getElementById('toAccount').classList.remove('is-invalid');

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('transferModal'));
  modal.show();
}

window.showToast = function (message, type = 'success') {
  const container = document.querySelector('.toast-container');
  if (!container) return;
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center border-0 text-bg-${type}`;
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
  `;
  container.appendChild(toastEl);
  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 }).show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
};

document.addEventListener('click', (e) => {
  const themeToggle = e.target.closest('#themeToggle');
  if (themeToggle) toggleTheme();
});