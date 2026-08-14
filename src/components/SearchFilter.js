// src/components/SearchFilter.js

export function SearchFilter(availableTags, currentTag = 'Tất cả') {
  const tagsHTML = ['Tất cả', ...availableTags].map(tag => {
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
      <div class="search-box">
        <span class="search-icon">⌕</span>
        <input 
          type="text" 
          id="search-input" 
          placeholder="Tìm kiếm một vì sao, nhân vật, tag..." 
          oninput="window.handleSearch(this.value)"
        />
      </div>
      
      <!-- Filter Tags -->
      <div class="tags-wrapper">
        ${tagsHTML}
      </div>
    </div>
  `;
}