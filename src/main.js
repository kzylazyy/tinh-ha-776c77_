// src/main.js
import '../style.css';
import { Navbar } from './components/Navbar.js';
import { FeaturedSection } from './components/FeaturedSection.js';
import { SearchFilter } from './components/SearchFilter.js';
import { CharacterCard } from './components/CharacterCard.js';
import initialCharacters from './data/characters.json';
import './utils/tracker.js';
import { inject } from '@vercel/analytics';

inject();

let characters = initialCharacters || [];
let currentTag = 'Tất cả';
let searchQuery = '';
let sortMode = 'default';
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

// Danh sách gợi ý cho ô search: nhân vật (kèm avatar, CHAR-ID) + tag (kể cả tag không nổi bật)
function getSuggestionPool() {
  const pool = [];
  const seenTags = new Set();

  characters.forEach(char => {
    if (char.name) {
      pool.push({ type: 'character', label: char.name, id: char.id, avatar: char.avatar });
    }
    let charTags = [];
    if (Array.isArray(char.tags)) {
      charTags = char.tags;
    } else if (typeof char.tags === 'string') {
      charTags = char.tags.split('#').filter(t => t.trim() !== '');
    }
    charTags.forEach(tag => {
      const clean = tag.trim();
      const key = clean.toLowerCase();
      if (clean && !seenTags.has(key)) {
        seenTags.add(key);
        pool.push({ type: 'tag', label: clean });
      }
    });
  });

  return pool;
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

const MAX_SUGGESTIONS = 7;

window.closeSuggestions = function() {
  const box = document.getElementById('search-suggestions');
  if (box) {
    box.innerHTML = '';
    box.classList.remove('active');
  }
};

window.showAllResults = function() {
  window.closeSuggestions();
  const librarySection = document.getElementById('thu-vien');
  if (librarySection) librarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function renderSuggestions(query) {
  const box = document.getElementById('search-suggestions');
  if (!box) return;

  const q = (query || '').toLowerCase().trim();
  if (!q) {
    window.closeSuggestions();
    return;
  }

  const allMatches = getSuggestionPool().filter(item => item.label.toLowerCase().includes(q));

  if (allMatches.length === 0) {
    box.innerHTML = `
      <div class="search-empty">
        <span class="search-empty-icon">✧</span>
        <span class="search-empty-title">Không tìm thấy vì sao này</span>
        <span class="search-empty-sub">Tín hiệu không tồn tại trong Tinh Hà.</span>
      </div>
    `;
    box.classList.add('active');
    return;
  }

  const shown = allMatches.slice(0, MAX_SUGGESTIONS);

  const itemsHTML = shown.map(item => {
    const safeValue = item.label.replace(/'/g, "\\'");

    if (item.type === 'character') {
      return `
        <div class="search-result-item" onmousedown="window.selectSuggestion('${safeValue}')">
          <div class="search-result-avatar">
            <img src="${item.avatar || '/avatars/default.png'}" alt="${item.label}" />
          </div>
          <div class="search-result-info">
            <span class="search-result-name">${highlightMatch(item.label, q)}</span>
            <span class="search-result-id">${(item.id || '').toUpperCase()}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="search-result-item" onmousedown="window.selectSuggestion('${safeValue}')">
        <div class="search-result-avatar">#</div>
        <div class="search-result-info">
          <span class="search-result-name">${highlightMatch(item.label, q)}</span>
          <span class="search-result-id">Tag</span>
        </div>
      </div>
    `;
  }).join('');

  const viewAllHTML = allMatches.length > MAX_SUGGESTIONS
    ? `<div class="search-view-all" onmousedown="window.showAllResults()">Xem tất cả ${allMatches.length} kết quả →</div>`
    : '';

  box.innerHTML = `
    <div class="search-autocomplete-label">Kết quả tìm kiếm</div>
    ${itemsHTML}
    ${viewAllHTML}
  `;
  box.classList.add('active');
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
  const filtered = characters.filter(char => {
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

  const sorted = [...filtered];
  if (sortMode === 'name-asc') {
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } else if (sortMode === 'name-desc') {
    sorted.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
  }
  return sorted;
}

function renderLibrary() {
  const container = document.getElementById('library-grid');
  const countEl = document.getElementById('star-count');
  const filtered = getFilteredCharacters();

  if (countEl) countEl.textContent = `${filtered.length} vì sao`;

  const statusLabelEl = document.getElementById('search-status-label');
  if (statusLabelEl) {
    statusLabelEl.textContent = `Đang xem: ${currentTag === 'Tất cả' ? 'tất cả nhóm' : currentTag}`;
  }
  const statusCountEl = document.getElementById('search-status-count');
  if (statusCountEl) {
    statusCountEl.textContent = `${filtered.length} / ${characters.length} nhân vật`;
  }

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
    filterContainer.innerHTML = SearchFilter(getUniqueTags(), currentTag, searchQuery, sortMode, characters.length, getFilteredCharacters().length);
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
    filterContainer.innerHTML = SearchFilter(getUniqueTags(), currentTag, searchQuery, sortMode, characters.length, getFilteredCharacters().length);
  }
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = searchQuery;

  renderLibrary();

  const searchSection = document.getElementById('tim-kiem');
  if (searchSection) searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Đổi cách sắp xếp danh sách (chỉ ảnh hưởng thứ tự hiển thị, không đổi logic lọc/tìm kiếm)
window.setSortMode = function(value) {
  sortMode = value;
  renderLibrary();
};

// Đặt lại toàn bộ: tag, từ khóa tìm kiếm, sắp xếp
window.resetSearch = function() {
  currentTag = 'Tất cả';
  searchQuery = '';
  sortMode = 'default';

  const filterContainer = document.getElementById('search-filter-wrapper');
  if (filterContainer) {
    filterContainer.innerHTML = SearchFilter(getUniqueTags(), currentTag, searchQuery, sortMode, characters.length, getFilteredCharacters().length);
  }
  window.closeSuggestions();
  renderLibrary();
};

// Chọn ngẫu nhiên 1 nhân vật trong toàn bộ thư viện và mở đúng theo logic mở nhân vật hiện có
window.pickRandomCharacter = function() {
  if (!characters.length) return;
  const randomChar = characters[Math.floor(Math.random() * characters.length)];

  if (randomChar.prompt_link && randomChar.prompt_link !== '#') {
    window.open(randomChar.prompt_link, '_blank');
  }
  if (typeof window.trackClick === 'function') {
    window.trackClick(randomChar.id);
  }
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
          ${SearchFilter(getUniqueTags(), currentTag, searchQuery, sortMode, characters.length, getFilteredCharacters().length)}
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