// src/components/SearchFilter.js

// Filter pill hiển thị nhanh bên dưới (theo yêu cầu thiết kế mới)
const FEATURED_TAGS = ['Tất cả', 'WLW', 'Hiện đại', 'Cổ trang', 'AOB'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'name-asc', label: 'Tên A–Z' },
  { value: 'likes-desc', label: 'Lượt thích nhiều nhất' },
];

export function SearchFilter(
  availableTags,
  currentTag = 'Tất cả',
  currentQuery = '',
  sortMode = 'default',
  totalCount = 0,
  filteredCount = 0
) {
  // "Tất cả nhóm" gộp toàn bộ tag thật có trong dữ liệu, không chỉ 5 tag nổi bật,
  // để người dùng vẫn có thể lọc theo bất kỳ nhóm nào khác qua dropdown này.
  const otherTags = (availableTags || [])
    .filter(t => t !== 'Tất cả')
    .sort((a, b) => a.localeCompare(b, 'vi'));
  const groupOptions = ['Tất cả', ...otherTags];

  const groupOptionsHTML = groupOptions.map(tag => {
    const label = tag === 'Tất cả' ? 'Tất cả nhóm' : tag;
    const selected = tag === currentTag ? 'selected' : '';
    return `<option value="${tag}" ${selected}>${label}</option>`;
  }).join('');

  const sortOptionsHTML = SORT_OPTIONS.map(opt => {
    const selected = opt.value === sortMode ? 'selected' : '';
    return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
  }).join('');

  const categoriesHTML = FEATURED_TAGS.map(tag => {
    const isActive = tag === currentTag;
    return `
      <button 
        type="button"
        onclick="window.filterByTag('${tag}')" 
        class="search-category ${isActive ? 'active' : ''}"
      >
        ${tag}
      </button>
    `;
  }).join('');

  const statusLabel = currentTag === 'Tất cả' ? 'tất cả nhóm' : currentTag;

  return `
    <div class="search-container">
      <!-- Ô tìm kiếm -->
      <div class="search-input-wrapper">
        <span class="search-icon">⌕</span>
        <input 
          type="text" 
          id="search-input" 
          class="search-input"
          autocomplete="off"
          value="${currentQuery ? currentQuery.replace(/"/g, '&quot;') : ''}"
          placeholder="Tìm nhân vật theo tên, tag, mô tả..." 
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

        <div id="search-suggestions" class="search-autocomplete"></div>
      </div>

      <!-- Hàng điều khiển: nhóm / sắp xếp / ngẫu nhiên / reset -->
      <div class="search-controls">
        <select 
          id="search-group-select" 
          class="search-select" 
          onchange="window.filterByTag(this.value)" 
          aria-label="Lọc theo nhóm"
        >
          ${groupOptionsHTML}
        </select>

        <select 
          id="search-sort-select" 
          class="search-select" 
          onchange="window.setSortMode(this.value)" 
          aria-label="Sắp xếp"
        >
          ${sortOptionsHTML}
        </select>

        <button type="button" class="search-random" onclick="window.pickRandomCharacter()">
          <span aria-hidden="true">🎲</span> Ngẫu nhiên
        </button>

        <button type="button" class="search-reset" onclick="window.resetSearch()">
          <span aria-hidden="true">↻</span> Reset
        </button>
      </div>

      <!-- Hàng filter nhanh -->
      <div class="search-categories">
        ${categoriesHTML}
      </div>

      <!-- Thông tin kết quả -->
      <div class="search-status">
        <span id="search-status-label">Đang xem: ${statusLabel}</span>
        <span id="search-status-count">${filteredCount} / ${totalCount} nhân vật</span>
      </div>
    </div>
  `;
}