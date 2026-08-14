// src/components/CharacterCard.js

export function CharacterCard(char) {
  // Logic xử lý mảng tag
  let tagsList = [];
  if (Array.isArray(char.tags)) {
    tagsList = char.tags;
  } else if (typeof char.tags === 'string') {
    tagsList = char.tags.split('#').filter(t => t.trim() !== '');
  }

  const tagsHTML = tagsList.map(tag => {
    const cleanTag = tag.trim();
    return `
      <button 
        onclick="window.filterByTag('${cleanTag}')" 
        class="badge badge-btn"
        title="Lọc theo tag #${cleanTag}"
      >
        #${cleanTag.toUpperCase()}
      </button>
    `;
  }).join('');

  // BẮT BUỘC DÙNG DẤU NHÁY NGƯỢC ( ` ) ĐỂ BỌC HTML TRONG VANILLA JS
  return `
    <div class="char-card">
      <div class="card-accent-line"></div>

      <!-- Khung viền chứa Avatar -->
      <div class="flex items-center gap-4" style="margin-bottom: 0.75rem;">
        <div class="avatar-ring">
          <img src="${char.avatar || '/avatars/default.png'}" alt="${char.name}" />
        </div>
        <div>
          <h3 class="font-serif" style="font-size: 1.125rem; font-weight: 600; color: var(--text-main);">${char.name}</h3>
          <p style="font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.05em;">${(char.id || '').toUpperCase()}</p>
        </div>
      </div>

      <!-- Phần Tags -->
      <div class="flex flex-wrap gap-2" style="margin-bottom: 0.75rem;">
        ${tagsHTML}
      </div>

      <!-- Câu trích dẫn -->
      <p style="font-size: 0.875rem; color: var(--text-main); font-style: italic; margin-bottom: 1.25rem; line-height: 1.4;">
        "${char.quote || ''}"
      </p>

      <!-- Nút Khám phá -->
      <div class="card-footer-single">
        <a 
          href="${char.prompt_link || '#'}" 
          target="_blank" 
          onclick="window.trackClick('${char.id}')" 
          class="btn-explore"
        >
          Khám phá ↗
        </a>
      </div>
    </div>
  `;
}