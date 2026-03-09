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
