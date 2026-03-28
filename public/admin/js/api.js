const API_BASE = '/api';

function getToken() { return localStorage.getItem('admin_token'); }

function getHeaders(isFormData = false) {
  const headers = { Authorization: `Bearer ${getToken()}` };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
}

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      ...options,
      headers: { ...getHeaders(options.body instanceof FormData), ...options.headers }
    });
    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      location.href = '/admin/index.html';
      return null;
    }
    return { ok: res.ok, status: res.status, data };
  } catch {
    showToast('Lỗi kết nối server', 'error');
    return null;
  }
}

const API = {
  login:            (body)          => apiFetch('/auth/login',                  { method: 'POST', body: JSON.stringify(body) }),
  doiMatKhau:       (body)          => apiFetch('/auth/doi-mat-khau',            { method: 'PUT',  body: JSON.stringify(body) }),
  getXe:            ()              => apiFetch('/xe'),
  getXeById:        (id)            => apiFetch('/xe/' + id),
  createXe:         (body)          => apiFetch('/xe',                           { method: 'POST', body: JSON.stringify(body) }),
  updateXe:         (id, body)      => apiFetch('/xe/' + id,                     { method: 'PUT',  body: JSON.stringify(body) }),
  deleteXe:         (id)            => apiFetch('/xe/' + id,                     { method: 'DELETE' }),
  getTinTuc:        ()              => apiFetch('/tin-tuc'),
  getTinTucById:    (id)            => apiFetch('/tin-tuc/' + id),
  createTinTuc:     (body)          => apiFetch('/tin-tuc',                      { method: 'POST', body: JSON.stringify(body) }),
  updateTinTuc:     (id, body)      => apiFetch('/tin-tuc/' + id,                { method: 'PUT',  body: JSON.stringify(body) }),
  deleteTinTuc:     (id)            => apiFetch('/tin-tuc/' + id,                { method: 'DELETE' }),
  getDatLich:       ()              => apiFetch('/dat-lich'),
  getDatLichById:   (id)            => apiFetch('/dat-lich/' + id),
  updateTrangThai:  (id, trang_thai)=> apiFetch(`/dat-lich/${id}/trang-thai`,    { method: 'PUT',  body: JSON.stringify({ trang_thai }) }),
  deleteDatLich:    (id)            => apiFetch('/dat-lich/' + id,               { method: 'DELETE' }),
  getCaiDat:        ()              => apiFetch('/cai-dat'),
  updateCaiDat:     (body)          => apiFetch('/cai-dat',                      { method: 'PUT',  body: JSON.stringify(body) }),
  uploadAnhDaiDien: (xe_id, fd)     => apiFetch('/upload/anh-dai-dien/' + xe_id, { method: 'POST', body: fd }),
  uploadAnhTinTuc:  (id, fd)        => apiFetch('/upload/tin-tuc/' + id,         { method: 'POST', body: fd }),
  createPhienBan:   (xe_id, body)   => apiFetch(`/xe/${xe_id}/phien-ban`,         { method: 'POST',   body: JSON.stringify(body) }),
  updatePhienBan:   (xe_id, id, body) => apiFetch(`/xe/${xe_id}/phien-ban/${id}`, { method: 'PUT',    body: JSON.stringify(body) }),
  deletePhienBan:   (xe_id, id)     => apiFetch(`/xe/${xe_id}/phien-ban/${id}`,   { method: 'DELETE' }),
  uploadAnhSlide:   (fd)            => apiFetch('/anh-slide/upload',               { method: 'POST', body: fd }),
  deleteAnhSlide:   (id)            => apiFetch('/anh-slide/' + id,                { method: 'DELETE' }),
  getAnhSlide:      ()              => apiFetch('/anh-slide'),
};

function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function showConfirm(msg, onConfirm) {
  let overlay = document.getElementById('confirm-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <div class="confirm-icon">🗑️</div>
        <div class="confirm-title">Xác nhận xóa</div>
        <div class="confirm-msg" id="confirm-msg"></div>
        <div class="confirm-btns">
          <button class="btn btn-secondary" id="confirm-cancel">Hủy</button>
          <button class="btn btn-danger" id="confirm-ok">Xóa</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('confirm-cancel').onclick = () => overlay.classList.remove('open');
  }
  document.getElementById('confirm-msg').textContent = msg;
  overlay.classList.add('open');
  document.getElementById('confirm-ok').onclick = () => { overlay.classList.remove('open'); onConfirm(); };
}

function requireAuth() {
  if (!getToken()) {
    location.href = '/admin/index.html';
  }
}

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('vi-VN');
}

function formatDateTime(str) {
  if (!str) return '—';
  return new Date(str).toLocaleString('vi-VN');
}

function formatMoney(n) {
  if (n === null || n === undefined || n === '') return '—';
  return Number(n).toLocaleString('vi-VN') + ' ₫';
}

function imgSrc(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return path;
}

function trangThaiBadge(tt) {
  const map = {
    'Chờ xử lý':   { label: 'Chờ xử lý',   cls: 'badge-yellow' },
    'Đã xác nhận': { label: 'Đã xác nhận',  cls: 'badge-blue'   },
    'Hoàn thành':  { label: 'Hoàn thành',   cls: 'badge-green'  },
    'Đã hủy':      { label: 'Đã hủy',       cls: 'badge-red'    },
  };
  const item = map[tt] || { label: tt || '—', cls: 'badge-gray' };
  return `<span class="badge ${item.cls}">${item.label}</span>`;
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('...');
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  for (let i = lo; i <= hi; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

function renderPaginationBtns(containerId, current, total, onChangePage) {
  const container = document.getElementById(containerId);
  if (total <= 1) { container.innerHTML = ''; return; }
  const pages = getPageNumbers(current, total);
  let html = `<button class="page-btn" onclick="${onChangePage}(${current - 1})" ${current === 1 ? 'disabled' : ''}>‹</button>`;
  pages.forEach(p => {
    if (p === '...') {
      html += `<span style="padding:0 4px;color:var(--muted);display:flex;align-items:center">…</span>`;
    } else {
      html += `<button class="page-btn ${p === current ? 'active' : ''}" onclick="${onChangePage}(${p})">${p}</button>`;
    }
  });
  html += `<button class="page-btn" onclick="${onChangePage}(${current + 1})" ${current === total ? 'disabled' : ''}>›</button>`;
  container.innerHTML = html;
}

function initLayout(activePage) {
  const navItems = [
    { href: 'dashboard.html', icon: '📊', label: 'Tổng quan',  id: 'dashboard' },
    { href: 'xe.html',        icon: '🚗', label: 'Quản lý xe', id: 'xe'        },
    { href: 'tin-tuc.html',   icon: '📰', label: 'Tin tức',    id: 'tin-tuc'   },
    { href: 'dat-lich.html',  icon: '📅', label: 'Đặt lịch',   id: 'dat-lich'  },
    { href: 'anh-slide.html', icon: '🖼️', label: 'Ảnh Slide',  id: 'anh-slide' },
    { href: 'cai-dat.html',   icon: '⚙️', label: 'Cài đặt',    id: 'cai-dat'   },
  ];

  const navHTML = navItems.map(item => `
    <li>
      <a href="${item.href}" class="${item.id === activePage ? 'active' : ''}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    </li>
  `).join('');

  const layoutHTML = `
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" id="menu-toggle">☰</button>
        <a href="dashboard.html" class="logo">KIA<span class="logo-dot">.</span>ADMIN</a>
      </div>
      <div class="topbar-right">
        <span class="admin-badge">Administrator</span>
        <button class="btn-logout" id="btn-logout">Đăng xuất</button>
      </div>
    </header>
    <aside class="sidebar" id="sidebar">
      <nav>
        <ul class="sidebar-nav">${navHTML}</ul>
      </nav>
    </aside>
  `;

  document.body.insertAdjacentHTML('afterbegin', layoutHTML);

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('admin_token');
    location.href = '/admin/index.html';
  });

  const menuToggle = document.getElementById('menu-toggle');
  const sidebar    = document.getElementById('sidebar');
  const overlay    = document.getElementById('sidebar-overlay');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}
