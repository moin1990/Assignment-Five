  const BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
  const CREDENTIALS = { username: 'admin', password: 'admin123' };

  let allIssues    = [];
  let currentTab   = 'all';
  let searchTimeout;

  /* ─────────── Login Page ─────────── */
  function handleLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    let valid = true;

    ['err-user', 'err-pass', 'err-creds'].forEach(id =>
      document.getElementById(id).classList.remove('show'));
    document.getElementById('username').classList.remove('error');
    document.getElementById('password').classList.remove('error');

    if (!u) {
      document.getElementById('err-user').classList.add('show');
      document.getElementById('username').classList.add('error');
      valid = false;
    }
    if (!p) {
      document.getElementById('err-pass').classList.add('show');
      document.getElementById('password').classList.add('error');
      valid = false;
    }
    if (!valid) return;

    if (u !== CREDENTIALS.username || p !== CREDENTIALS.password) {
      document.getElementById('err-creds').classList.add('show');
      document.getElementById('username').classList.add('error');
      document.getElementById('password').classList.add('error');
      return;
    }

    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-page').style.display  = 'block';
    loadIssues();
  }

  ['username', 'password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  });


  /* ─────────── API ─────────── */
  async function fetchIssues() {
    const res = await fetch(`${BASE}/issues`);
    if (!res.ok) throw new Error('Failed to fetch issues');
    return res.json();
  }

  async function fetchSingleIssue(id) {
    const res = await fetch(`${BASE}/issue/${id}`);
    if (!res.ok) throw new Error('Issue not found');
    return res.json();
  }

  async function searchIssues(q) {
    const res = await fetch(`${BASE}/issues/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  }

  /* ─────────── Load & render ─────────── */
  async function loadIssues() {
    showSpinner();
    try {
      const data = await fetchIssues();
      allIssues  = Array.isArray(data) ? data : (data.issues || data.data || []);
      renderIssues(filterIssues(allIssues, currentTab));
    } catch (e) {
      showError('Failed to load issues. Please check your connection.');
    }
  }

  function filterIssues(issues, tab) {
    if (tab === 'all') return issues;
    return issues.filter(i => (i.status || i.state || '').toLowerCase() === tab);
  }

  function renderIssues(issues) {
    const container = document.getElementById('issues-container');
    document.getElementById('issue-count').textContent =
      `${issues.length} Issue${issues.length !== 1 ? 's' : ''}`;

    if (!issues.length) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 16 16">
            <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            <path fill-rule="evenodd" d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1013 0 6.5 6.5 0 00-13 0z"/>
          </svg>
          <h3>No issues found</h3>
          <p>Try a different filter or search term.</p>
        </div>`;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'issues-grid';
    issues.forEach((issue, i) => grid.appendChild(buildCard(issue, i)));
    container.innerHTML = '';
    container.appendChild(grid);
  }

  function buildCard(issue, index) {
    const status   = (issue.status || issue.state || 'open').toLowerCase();
    const isOpen   = status === 'open';
    const priority = (issue.priority || 'LOW').toUpperCase();
    const labels   = issue.labels || [];
    const author   = issue.author || (issue.user && issue.user.login) || issue.assignee || 'unknown';
    const date     = formatDate(issue.createdAt || issue.created_at);
    const num      = issue.number || issue.id || index + 1;

    const card = document.createElement('div');
    card.className = 'issue-card' + (isOpen ? '' : ' closed-card');
    card.style.animationDelay = (index * 0.04) + 's';
    card.onclick = () => openModal(issue.id || issue._id || num);

    card.innerHTML =
      '<div class="card-top">' +
        '<div class="status-dot-icon ' + (isOpen ? 'open' : 'closed') + '">' +
          (isOpen
            ? '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="4"/></svg>'
            : '<svg viewBox="0 0 16 16"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>') +
        '</div>' +
        '<span class="priority-badge ' + priority + '">' + priority + '</span>' +
      '</div>' +
      '<div class="card-title">' + escHtml(issue.title || 'Untitled') + '</div>' +
      '<div class="card-desc">'  + escHtml(issue.description || issue.body || '') + '</div>' +
      '<div class="card-labels">' + renderLabels(labels) + '</div>' +
      '<div class="card-footer">' +
        '<div class="card-author">#' + num + ' by <span>' + escHtml(String(author)) + '</span></div>' +
        '<div class="card-date">' + date + '</div>' +
      '</div>';

    return card;
  }

  function renderLabels(labels) {
    if (!labels || !labels.length) return '';
    return labels.map(function(l) {
      const name = typeof l === 'string' ? l : (l.name || '');
      const cls  = getLabelClass(name);
      const icon = getLabelIcon(name);
      return '<span class="label-tag ' + cls + '">' + icon + escHtml(name.toUpperCase()) + '</span>';
    }).join('');
  }

  function getLabelClass(name) {
    const n = name.toLowerCase();
    if (n.indexOf('bug')         !== -1) return 'bug';
    if (n.indexOf('enhancement') !== -1) return 'enhancement';
    if (n.indexOf('help')        !== -1) return 'help-wanted';
    if (n.indexOf('doc')         !== -1) return 'documentation';
    return 'default';
  }

  function getLabelIcon(name) {
    const n = name.toLowerCase();
    if (n.indexOf('bug') !== -1)
      return '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a3.5 3.5 0 00-3.5 3.5v.5H3a1 1 0 000 2h.5v1H3a1 1 0 000 2h.5v.5a4 4 0 008 0V9H12a1 1 0 000-2h-.5V6H12a1 1 0 000-2h-1.5v-.5A3.5 3.5 0 008 0z"/></svg>';
    if (n.indexOf('help') !== -1)
      return '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 100-2 1 1 0 000 2z"/></svg>';
    return '';
  }
