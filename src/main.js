// src/main.js
import '../style.css';
import { Navbar } from './components/Navbar.js';
import { FeaturedSection } from './components/FeaturedSection.js';
import { SearchFilter } from './components/SearchFilter.js';
import { CharacterCard } from './components/CharacterCard.js';
import initialCharacters from './data/characters.json';
import './utils/tracker.js';

let characters = initialCharacters || [];
let currentTag = 'Tất cả';
let searchQuery = '';
let currentTheme = localStorage.getItem('theme') || 'dark';

function getUniqueTags() {
  const tagsSet = new Set();
  characters.forEach(char => {
    let charTags = [];
    if (Array.isArray(char.tags)) {
      charTags = char.tags;
    } else if (typeof char.tags === 'string') {
      charTags = char.tags.split('#').filter(t => t.trim() !== '');
    }
    charTags.forEach(tag => tagsSet.add(tag.trim()));
  });
  return Array.from(tagsSet);
}

// Danh sách gợi ý cho ô search: tên nhân vật + tất cả các tag (kể cả tag không nổi bật)
function getSuggestionPool() {
  const pool = new Set();
  characters.forEach(char => {
    if (char.name) pool.add(char.name);
    let charTags = [];
    if (Array.isArray(char.tags)) {
      charTags = char.tags;
    } else if (typeof char.tags === 'string') {
      charTags = char.tags.split('#').filter(t => t.trim() !== '');
    }
    charTags.forEach(tag => pool.add(tag.trim()));
  });
  return Array.from(pool);
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return `${before}<u>${match}</u>${after}`;
}

function syncClearButton() {
  const btn = document.getElementById('search-clear');
  if (btn) btn.style.display = searchQuery ? 'flex' : 'none';
}

function toggleSearchOverlay(show) {
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.classList.toggle('active', show);
}

window.closeSuggestions = function() {
  const box = document.getElementById('search-suggestions');
  if (box) {
    box.innerHTML = '';
    box.classList.remove('active');
  }
  toggleSearchOverlay(false);
};

function renderSuggestions(query) {
  const box = document.getElementById('search-suggestions');
  if (!box) return;

  const q = (query || '').toLowerCase().trim();
  if (!q) {
    window.closeSuggestions();
    return;
  }

  const matches = getSuggestionPool()
    .filter(item => item.toLowerCase().includes(q))
    .slice(0, 6);

  if (matches.length === 0) {
    window.closeSuggestions();
    return;
  }

  box.innerHTML = matches.map(item => `
    <div class="suggestion-item" onmousedown="window.selectSuggestion('${item.replace(/'/g, "\\'")}')">
      <span class="suggestion-icon">✦</span>
      <span class="suggestion-text">${highlightMatch(item, q)}</span>
    </div>
  `).join('');
  box.classList.add('active');
  toggleSearchOverlay(true);
}

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }

  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

function initTheme() {
  applyTheme(currentTheme);

  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle')) {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    }
  });
}

function getFilteredCharacters() {
  return characters.filter(char => {
    let charTags = [];
    if (Array.isArray(char.tags)) {
      charTags = char.tags;
    } else if (typeof char.tags === 'string') {
      charTags = char.tags.split('#').filter(t => t.trim() !== '');
    }

    const matchesTag = currentTag === 'Tất cả' || charTags.includes(currentTag);
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      char.name.toLowerCase().includes(query) ||
      (char.quote && char.quote.toLowerCase().includes(query)) ||
      charTags.some(t => t.toLowerCase().includes(query));
    
    return matchesTag && matchesSearch;
  });
}

function renderLibrary() {
  const container = document.getElementById('library-grid');
  const countEl = document.getElementById('star-count');
  const filtered = getFilteredCharacters();

  if (countEl) countEl.textContent = `${filtered.length} vì sao`;

  if (container) {
    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
          <p class="font-serif" style="font-size: 1.125rem;">✦ Không tìm thấy vì sao nào phù hợp...</p>
          <p style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.7;">Thử tìm kiếm từ khóa khác hoặc bỏ chọn lọc tag.</p>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(char => CharacterCard(char)).join('');
    }
  }
}

// Bấm vào tag trên thanh filter (chỉ áp dụng cho các tag nổi bật) -> lọc chính xác
window.filterByTag = function(tag) {
  currentTag = tag;
  const filterContainer = document.getElementById('search-filter-wrapper');
  if (filterContainer) {
    filterContainer.innerHTML = SearchFilter(getUniqueTags(), currentTag, searchQuery);
  }
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = searchQuery;

  renderLibrary();
};

// Bấm vào tag trên card nhân vật -> điền vào ô search và tự tìm kiếm
// (không dùng bộ lọc tag chính xác, vì tag này có thể không nằm trong nhóm "nổi bật")
window.searchByTag = function(tag) {
  currentTag = 'Tất cả';
  searchQuery = tag;

  const filterContainer = document.getElementById('search-filter-wrapper');
  if (filterContainer) {
    filterContainer.innerHTML = SearchFilter(getUniqueTags(), currentTag, searchQuery);
  }
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = searchQuery;

  renderLibrary();

  const searchSection = document.getElementById('tim-kiem');
  if (searchSection) searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.handleSearch = function(value) {
  searchQuery = value;
  renderLibrary();
  renderSuggestions(value);
  syncClearButton();
};

window.showSuggestions = function(value) {
  renderSuggestions(value);
};

window.clearSearch = function() {
  searchQuery = '';
  const input = document.getElementById('search-input');
  if (input) {
    input.value = '';
    input.focus();
  }
  renderLibrary();
  renderSuggestions('');
  syncClearButton();
};

window.hideSuggestionsDelayed = function() {
  // delay để onmousedown của gợi ý kịp chạy trước khi box bị ẩn bởi onblur
  setTimeout(() => {
    window.closeSuggestions();
  }, 150);
};

window.selectSuggestion = function(value) {
  searchQuery = value;
  const input = document.getElementById('search-input');
  if (input) input.value = value;

  renderLibrary();
  syncClearButton();
  window.closeSuggestions();
};

function initApp() {
  const app = document.getElementById('app');
  const topChars = [...characters].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);

  app.innerHTML = `
    ${Navbar()}

    <main>
      <!-- Hero Header (Đã xóa dòng Google AI Studio Archive) -->
      <section class="text-center" style="padding: 2.5rem 0 1rem 0;">
        <h1 class="hero-title font-serif">TINH HÀ 776C77</h1>
        <p class="font-serif" style="color: var(--text-muted); font-style: italic; font-size: 0.95rem; margin-top: 0.35rem;">"Nơi những vì sao được lưu giữ."</p>
      </section>

      <!-- Khu vực Nhân vật tiêu biểu -->
      <section id="nhan-vat" style="scroll-margin-top: 5rem;">
        ${FeaturedSection(topChars)}
      </section>

      <!-- Khu vực Tìm kiếm -->
      <section id="tim-kiem" style="padding-top: 2rem; scroll-margin-top: 5rem;">
        <div id="search-filter-wrapper">
          ${SearchFilter(getUniqueTags(), currentTag, searchQuery)}
        </div>
      </section>

      <!-- Khu vực Thư viện -->
      <section id="thu-vien" class="space-y-6" style="padding-top: 2rem; scroll-margin-top: 5rem;">
        <div class="text-center space-y-2">
          <h2 class="font-serif" style="font-size: 1.5rem;"><span style="color: var(--accent);">✦</span> Thư viện Tinh Hà</h2>
          <span id="star-count" style="display: inline-block; font-size: 0.75rem; padding: 0.2rem 0.75rem; border-radius: 9999px; background: rgba(119, 108, 119, 0.15); color: var(--accent); border: 1px solid var(--border-color);">0 vì sao</span>
        </div>

        <div id="library-grid" class="grid"></div>
      </section>
    </main>

    <footer>
      <p>✦ Tinh Hà 776C77 · Celestial Character Archive ✦</p>
    </footer>
  `;

  initTheme();
  renderLibrary();
}

document.addEventListener('DOMContentLoaded', initApp);