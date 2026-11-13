// src/components/CharacterCard.js

export function CharacterCard(char) {
  const tagsList = Array.isArray(char.tags)
    ? char.tags
    : typeof char.tags === 'string'
      ? char.tags.split('#').filter(tag => tag.trim() !== '')
      : [];

  const tagsHTML = tagsList.map(tag => {
    const cleanTag = tag.trim();
    return `
      <button
        onclick="window.searchByTag('${cleanTag.replace(/'/g, "\\'")}')"
        class="badge badge-btn"
        title="Tìm kiếm theo tag #${cleanTag}"
      >#${cleanTag.toUpperCase()}</button>
    `;
  }).join('');

  const isUpcoming = char.status === 'upcoming';
  const hasPrompt = typeof char.prompt_link === 'string' &&
    char.prompt_link.trim() !== '' && char.prompt_link !== '#';
  const canOpen = !isUpcoming && hasPrompt;
  const openCount = window.characterOpenCounts?.[char.uid] ?? 0;

  const actionHTML = canOpen
    ? `<a href="${char.prompt_link}" target="_blank" rel="noopener noreferrer"
         onclick="window.trackOpen('${char.uid}')" class="btn-explore">Khám phá ↗</a>`
    : `<span class="btn-explore" aria-disabled="true" style="opacity:.55; cursor:not-allowed;">${isUpcoming ? 'Sắp ra mắt' : 'Chưa có prompt'}</span>`;

  return `
    <div class="char-card">
      <div class="card-accent-line"></div>
      <div class="flex items-center gap-4" style="margin-bottom: 0.75rem;">
        <div class="avatar-ring">
          <img src="${char.avatar || '/avatars/default.png'}" alt="${char.name}" />
        </div>
        <div>
          <h3 class="font-serif" style="font-size: 1.125rem; font-weight: 600; color: var(--text-main);">${char.name}</h3>
          <p style="font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.05em;">${(char.id || '').toUpperCase()}</p>
          ${isUpcoming ? '<span style="font-size:.7rem;color:var(--accent);">✦ SẮP RA MẮT</span>' : ''}
        </div>
      </div>
      <div class="flex flex-wrap gap-2" style="margin-bottom: 0.75rem;">${tagsHTML}</div>
      <p style="font-size: 0.875rem; color: var(--text-main); font-style: italic; margin-bottom: 1rem; line-height: 1.4;">"${char.quote || ''}"</p>
      <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.8rem;">✦ ${openCount.toLocaleString('vi-VN')} lượt mở</div>
      <div class="card-footer-single">${actionHTML}</div>
    </div>
  `;
}
