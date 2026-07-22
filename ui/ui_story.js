/**
 * Crônica de Aethelgard - Renderizador Visual da Narrativa (ui_story.js)
 * 
 * - Desktop: Beautiful open ancient book / tome layout (matches the provided reference image)
 * - Mobile: Compact narrative header + illustration + parchment text
 */

class StoryRenderer {
  renderStoryScene() {
    const container = document.getElementById("story-container");
    if (!container || !window.narrativeEngine) return;

    const ne = window.narrativeEngine;
    const chap = ne.getCurrentChapter();
    const scene = ne.getCurrentScene();

    if (!scene) {
      container.innerHTML = `<div class="ornate-card"><p>Capítulo ou cena não encontrados.</p></div>`;
      return;
    }

    const illustration = scene.illustration || "assets/backgrounds/ash_valley.jpg";
    const text = scene.text || "A antiga história continua...";

    // Desktop vs Mobile detection
    const isDesktop = window.innerWidth >= 851;

    let html = "";

    if (isDesktop) {
      // ========================================================
      // 📖 DESKTOP: OPEN ANCIENT BOOK / TOME LAYOUT
      // Matches the exact style of the provided reference image
      // ========================================================
      html = `
        <div class="story-book-layout">
          <div class="story-book-pages">
            
            <!-- LEFT PAGE: TEXT -->
            <div class="story-book-left-page">
              <h2 class="story-book-title">${scene.title || chap.title || "THE LOT OF SUFFERING"}</h2>
              
              <div class="story-book-text">
                ${this._formatNarrativeText(text)}
              </div>
            </div>

            <!-- RIGHT PAGE: ILLUSTRATION -->
            <div class="story-book-right-page">
              <img 
                class="story-book-illustration" 
                src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(illustration) : illustration}" 
                data-orig-src="${illustration}" 
                onerror="window.handleImageError(this, 'background')" 
                alt="Ilustração da Crônica">
            </div>
          </div>

          <!-- Bottom decorative trim -->
          <div class="book-bottom-trim"></div>
        </div>

        <!-- Choices below the book -->
        <div class="story-choices-desktop" style="max-width: 1100px; margin: 22px auto 0;">
          ${scene.choices.map((ch, idx) => `
            <button class="scroll-choice-btn" style="margin-bottom: 9px;" onclick="window.narrativeEngine.chooseSceneOption(${idx})">
              <span class="scroll-ribbon">◈</span> ${ch.text}
            </button>
          `).join('')}
        </div>
      `;
    } else {
      // ========================================================
      // 📱 MOBILE: Compact narrative layout
      // ========================================================
      const npcPortrait = scene.npcPortrait || "assets/portraits/vespera.jpg";
      const player = window.player || { name: "Aethel", level: 1, gold: 250 };
      const hp = window.flagsManager?.getFlag("player_hp") || 100;
      const gold = window.economyManager?.gold || player.gold || 250;

      const hearts = Array.from({ length: 4 }, (_, i) => 
        i < Math.floor(hp / 25) ? "❤️" : "🖤"
      ).join("");

      html = `
        <div class="story-scene-layout">
          
          <!-- TOP HEADER -->
          <div class="story-narrative-header">
            <div class="story-narrative-portrait">
              <img 
                src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(npcPortrait) : npcPortrait}" 
                data-orig-src="${npcPortrait}" 
                onerror="window.handleImageError(this, 'portrait')" 
                alt="NPC Portrait">
            </div>
            
            <div class="story-narrative-info">
              <div class="story-narrative-name">
                ${scene.npcName || "Lau Niscor Harnas"}
              </div>
              
              <div class="story-narrative-stats">
                <div class="story-stat">${hearts}</div>
                <span style="color:#facc15; font-weight:700;">${gold}</span>
                <span style="color:#e0d3a5;">•</span>
                <span>12</span>
                <span>7</span>
                <span>3</span>
              </div>
              
              <div style="margin-top:2px; display:flex; gap:6px; font-size:10.5px; color:#c9b88a;">
                <span style="background:rgba(0,0,0,0.45); padding:1px 5px; border-radius:3px;">10</span>
                <span style="background:rgba(0,0,0,0.45); padding:1px 5px; border-radius:3px;">5</span>
                <span style="background:rgba(0,0,0,0.45); padding:1px 5px; border-radius:3px;">5</span>
                <span style="background:rgba(0,0,0,0.45); padding:1px 5px; border-radius:3px;">14</span>
              </div>
            </div>
          </div>

          <!-- ILLUSTRATION -->
          <img 
            class="story-scene-image" 
            src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(illustration) : illustration}" 
            data-orig-src="${illustration}" 
            onerror="window.handleImageError(this, 'background')" 
            alt="Cena narrativa">

          <!-- PARCHMENT TEXT -->
          <div class="story-narrative-text">
            ${this._formatNarrativeText(text)}
          </div>

          <!-- FOOTER -->
          <div class="story-narrative-footer">
            <div style="font-size:11px; color:#a38f6a;">Crônica Principal • Capítulo ${chap.id ? chap.id.split('_')[1] : '1'}</div>
            <div class="footer-icons">
              <span title="Inventário">🎒</span>
              <span title="Troféus">🏆</span>
              <span title="Diálogo">💬</span>
              <span title="Opções">⚔️</span>
            </div>
          </div>
        </div>

        <!-- CHOICES -->
        <div class="story-choices-mobile" style="margin-top:10px;">
          ${scene.choices.map((ch, idx) => `
            <button class="mobile-choice-btn" onclick="window.narrativeEngine.chooseSceneOption(${idx})">
              <span class="choice-icon">◈</span> 
              <span>${ch.text}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // Helper: Format narrative text
  _formatNarrativeText(rawText) {
    if (!rawText) return `<p>Você se encontra em um lugar antigo e misterioso...</p>`;

    const paragraphs = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    return paragraphs.map(paragraph => {
      if (paragraph.startsWith('"') || paragraph.startsWith('“') || 
          paragraph.includes('"') || paragraph.includes('“')) {
        return `<p class="dialogue">${paragraph}</p>`;
      }
      return `<p>${paragraph}</p>`;
    }).join('');
  }
}

// Register globally
window.storyRenderer = new StoryRenderer();

if (typeof window !== "undefined" && window.ui) {
  window.ui.renderStoryScene = () => window.storyRenderer.renderStoryScene();
}

window.renderStoryScene = () => window.storyRenderer.renderStoryScene();