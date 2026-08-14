// src/components/SearchFilter.js

// Chỉ những tag "nổi bật" này được hiện trên thanh filter.
// Các tag khác (Cbiz, Sủng, Tổng Tài, Ngược Luyến...) không hiện ở đây —
// chúng chỉ hiện trên card nhân vật, bấm vào sẽ tự động điền vào ô search.
const FEATURED_TAGS = ['Tất cả', 'Hiện đại', 'Cổ đại', 'Tu tiên', 'ABO', 'Học đường'];

export function SearchFilter(availableTags, currentTag = 'Tất cả', currentQuery = '') {
  const tagsHTML = FEATURED_TAGS.map(tag => {
    const isActive = tag === currentTag;
    return `
      <button 
        onclick="window.filterByTag('${tag}')" 
        class="filter-pill ${isActive ? 'active' : ''}"
      >
        ${tag}
      </button>
    `;
  }).join('');

  return `
    <div class="search-section">
      <div class="search-combo">
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input 
            type="text" 
            id="search-input" 
            class="search-input"
            autocomplete="off"
            value="${currentQuery ? currentQuery.replace(/"/g, '&quot;') : ''}"
            placeholder="Tìm một vì sao..." 
            oninput="window.handleSearch(this.value)"
            onfocus="window.showSuggestions(this.value)"
            onblur="window.hideSuggestionsDelayed()"
          />
          <button 
            type="button" 
            id="search-clear" 
            class="search-clear" 
            onmousedown="window.clearSearch()"
            style="display: ${currentQuery ? 'flex' : 'none'};"
            aria-label="Xoá tìm kiếm"
          >✕</button>
        </div>

        <div id="search-suggestions" class="search-dropdown"></div>
      </div>

      <!-- Filter Tags (chỉ hiện tag nổi bật) -->
      <div class="search-filters">
        ${tagsHTML}
      </div>
    </div>
  `;
}