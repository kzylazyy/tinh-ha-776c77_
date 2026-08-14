// src/components/SearchFilter.js

// Chỉ những tag "nổi bật" này được hiện trên thanh filter.
// Các tag khác (Cbiz, Sủng, Tổng Tài, Ngược Luyến...) không hiện ở đây —
// chúng chỉ hiện trên card nhân vật, bấm vào sẽ tự động điền vào ô search.
const FEATURED_TAGS = ['Tất cả', 'Hiện đại', 'Cổ đại', 'Tu tiên', 'ABO', 'Học đường'];

export function SearchFilter(availableTags, currentTag = 'Tất cả') {
  const tagsHTML = FEATURED_TAGS.map(tag => {
    const isActive = tag === currentTag;
    return `
      <button 
        onclick="window.filterByTag('${tag}')" 
        class="filter-tag-btn ${isActive ? 'active' : ''}"
      >
        ${tag}
      </button>
    `;
  }).join('');

  return `
    <div class="search-filter-container">
      <!-- Search Input Box -->
      <div class="search-box" style="position: relative;">
        <span class="search-icon">⌕</span>
        <input 
          type="text" 
          id="search-input" 
          autocomplete="off"
          placeholder="Tìm kiếm một vì sao, nhân vật, tag..." 
          oninput="window.handleSearch(this.value)"
          onfocus="window.showSuggestions(this.value)"
          onblur="window.hideSuggestionsDelayed()"
        />
        <div id="search-suggestions" class="search-suggestions"></div>
      </div>
      
      <!-- Filter Tags (chỉ hiện tag nổi bật) -->
      <div class="tags-wrapper">
        ${tagsHTML}
      </div>
    </div>
  `;
}