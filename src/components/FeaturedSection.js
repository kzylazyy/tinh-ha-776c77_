// src/components/FeaturedSection.js
import { CharacterCard } from './CharacterCard.js';

export function FeaturedSection(topChars) {
  if (!topChars || topChars.length === 0) return '';

  let layoutHTML = '';

  // Khi có đủ 3 nhân vật (Xếp hình chòm sao tam giác)
  if (topChars.length === 3) {
    layoutHTML = `
      <div class="relative max-w-4xl mx-auto flex flex-col items-center">
        <!-- Đường nối chòm sao (Background SVG) -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20 text-[#776C77]" style="z-index: 0;">
            <line x1="50%" y1="20%" x2="25%" y2="80%" stroke="currentColor" stroke-width="1" stroke-dasharray="4" />
            <line x1="50%" y1="20%" x2="75%" y2="80%" stroke="currentColor" stroke-width="1" stroke-dasharray="4" />
            <line x1="25%" y1="80%" x2="75%" y2="80%" stroke="currentColor" stroke-width="1" stroke-dasharray="4" />
        </svg>

        <!-- Top 1 (Lớn hơn một chút) -->
        <div class="relative z-10 w-full max-w-[320px] scale-105 mb-8">
            ${CharacterCard(topChars[0])}
        </div>

        <!-- Top 2 & 3 -->
        <div class="relative z-10 w-full flex flex-wrap md:flex-nowrap justify-center gap-8 px-4">
            <div class="w-full max-w-[300px]">
                ${CharacterCard(topChars[1])}
            </div>
            <div class="w-full max-w-[300px]">
                ${CharacterCard(topChars[2])}
            </div>
        </div>
      </div>
    `;
  } else {
    // Khi chỉ có 1 hoặc 2 nhân vật
    layoutHTML = `
      <div class="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
        ${topChars.map(char => `<div class="w-full max-w-[300px]">${CharacterCard(char)}</div>`).join('')}
      </div>
    `;
  }

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