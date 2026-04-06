/* =========================================================
   main.js — Shared utilities for KIA Showroom Customer Site
   ========================================================= */

const API_BASE = '/api';

async function apiFetch(path) {
  try {
    const res = await fetch(API_BASE + path);
    if (!res.ok) return null;
    const json = await res.json();
    // Bóc tách mảng dữ liệu từ { message: '...', data: [...] }
    return json.data || (Array.isArray(json) ? json : []);
  } catch (err) {
    console.error('apiFetch error:', err);
    return [];
  }
}

async function apiPost(path, body) {
  try {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch {
    return null;
  }
}

function formatMoney(n) {
  if (!n) return 'Liên hệ';
  return Number(n).toLocaleString('vi-VN') + ' ₫';
}

function formatPriceRange(phienBans) {
  if (!phienBans || phienBans.length === 0) return 'Liên hệ';
  const prices = phienBans.map(p => Number(p.gia)).filter(p => p > 0);
  if (prices.length === 0) return 'Liên hệ';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatMoney(min);
  return `<span class="price-range"><span class="price-label">Từ</span> <strong>${formatMoney(min)}</strong> <span class="price-label">-</span> <strong>${formatMoney(max)}</strong></span>`;
}

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('vi-VN');
}

function validatePhone(phone) {
  const cleaned = phone.trim();
  if (!cleaned) return 'Vui lòng nhập số điện thoại';
  if (!/^\d+$/.test(cleaned)) return 'Số điện thoại chỉ được chứa chữ số';
  if (cleaned[0] !== '0') return 'Số điện thoại phải bắt đầu bằng số 0';
  if (cleaned.length !== 10) return 'Số điện thoại phải có đúng 10 số';
  return null;
}

function imgSrc(path) {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return path;
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

async function loadFooter() {
  const data = await apiFetch('/cai-dat');
  const footer = document.getElementById('footer');
  if (!footer || !data) return;
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">${data.ten_cong_ty || 'KIA Showroom'}</div>
        <p class="footer-tagline">${data.gioi_thieu ? data.gioi_thieu.slice(0, 120) + '...' : 'Showroom xe KIA chính hãng.'}</p>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h4>Thông tin liên hệ</h4>
          <ul>
            ${data.dia_chi        ? `<li><span class="fi">📍</span>${data.dia_chi}</li>` : ''}
            ${data.so_dien_thoai  ? `<li><span class="fi">📞</span><a href="tel:${data.so_dien_thoai}">${data.so_dien_thoai}</a></li>` : ''}
            ${data.email          ? `<li><span class="fi">✉️</span><a href="mailto:${data.email}">${data.email}</a></li>` : ''}
            ${data.gio_lam_viec   ? `<li><span class="fi">🕐</span>${data.gio_lam_viec}</li>` : ''}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Khám phá</h4>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/san-pham">Sản phẩm</a></li>
            <li><a href="/tin-tuc">Tin tức</a></li>
            <li><a href="/dat-lich">Đặt lịch lái thử</a></li>
            <li><a href="/lien-he">Liên hệ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Kết nối</h4>
          <ul>
            ${data.facebook ? `<li><a href="${data.facebook}" target="_blank" rel="noopener">Facebook</a></li>` : ''}
            ${data.zalo     ? `<li><a href="https://zalo.me/${data.zalo}" target="_blank" rel="noopener">Zalo</a></li>` : ''}
          </ul>
        </div>
      </div>
      <div class="footer-copy">© ${new Date().getFullYear()} ${data.ten_cong_ty || 'KIA Showroom'}. All rights reserved.</div>
    </div>`;

  // Render floating buttons (Zalo & Phone) except on specific pages
  const path = window.location.pathname;
  const isExcluded = path.includes('/dat-lich') || path.includes('/lien-he');
  
  if (!isExcluded) {
    const fabs = document.createElement('div');
    fabs.className = 'floating-actions';
    let html = '';
    if (data.zalo) {
      const zaloPhone = data.zalo.replace(/[^0-9]/g, '');
      html += `<a href="https://zalo.me/${zaloPhone}" target="_blank" class="fab btn-zalo">Zalo</a>`;
    }
    if (data.so_dien_thoai) {
      const phone = data.so_dien_thoai.replace(/[^0-9+]/g, '');
      html += `<a href="tel:${phone}" class="fab btn-phone">📞</a>`;
    }
    if (html !== '') {
      fabs.innerHTML = html;
      document.body.appendChild(fabs);
    }
  }
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* navbar scroll shadow + mobile toggle */
function initNav() {
  const nav    = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    /* close on link click (mobile) */
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* mark active link */
  const path = location.pathname;
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '/' && href === '/index.html')) {
        a.classList.add('active');
    } else if (path.startsWith(href) && href !== '/') {
        a.classList.add('active');
    }
  });
}

/* broken image fallback */
function imgTag(src, alt, cls) {
  const url = imgSrc(src);
  return `<img src="${url}" alt="${alt || ''}" class="${cls || ''}" loading="lazy"
    onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
  <div class="img-placeholder" style="display:none">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>`;
}

/* spinner html */
function spinnerHTML() {
  return '<div class="spinner-wrap"><div class="spinner"></div></div>';
}

/* empty state html */
function emptyHTML(msg) {
  return `<div class="empty-state"><p>${msg || 'Không có dữ liệu.'}</p></div>`;
}
