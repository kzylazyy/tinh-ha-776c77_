// src/components/FeaturedSection.js
import { CharacterCard } from './CharacterCard.js';

export function FeaturedSection(topChars) {
  if (!topChars || topChars.length === 0) return '';

  // Chỉ hiển thị tối đa 3 nhân vật
  const chars = topChars.slice(0, 3);

  const layoutHTML = `
    <div class="flex flex-wrap md:flex-nowrap justify-center items-stretch gap-6 max-w-5xl mx-auto">
      ${chars.map(char => `<div class="w-full max-w-[320px]">${CharacterCard(char)}</div>`).join('')}
    </div>
  `;

  return `
    <section id="tinh-tu" class="py-16 relative w-full">
      <div class="text-center mb-12">
        <h2 class="font-serif text-2xl text-[var(--text-main)] flex items-center justify-center gap-2">
            <span class="text-[#776C77]">✦</span> Tinh tú nổi bật
        </h2>
        <p class="text-[var(--text-muted)] text-sm mt-3 tracking-wide">Những vì sao đang được chú ý nhiều nhất.</p>
      </div>
      ${layoutHTML}
    </section>
  `;
}