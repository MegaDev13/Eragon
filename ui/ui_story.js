/**
 * Crônica de Aethelgard - Renderizador Visual da Narrativa e Prólogo (ui_story.js)
 * EXACT mobile narrative design: Top header portrait + stats + full image + parchment text + bottom footer icons
 * Matches the provided screenshot design for mobile-first experience.
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

    // Default / fallback portrait and image
    const playerPortrait = window.flagsManager?.getFlag("player_portrait") || "assets/portraits/lyra.jpg";
    const npcPortrait = scene.npcPortrait || "assets/portraits/vespera.jpg";
    const illustration = scene.illustration || "assets/backgrounds/ash_valley.jpg";

    // Get player data for stats header
    const player = window.player || { name: "Aethel", level: 1, gold: 250 };
    const hp = window.flagsManager?.getFlag("player_hp") || 100;
    const maxHp = 100;
    const will = window.flagsManager?.getFlag("player_will") || 85;
    const gold = window.economyManager?.gold || player.gold || 250;

    // Build 4 hearts for HP display
    const hearts = Array.from({ length: 4 }, (_, i) => 
      i < Math.floor(hp / 25) ? "❤️" : "🖤"
    ).join("");

    // Build the EXACT mobile narrative layout from screenshot
    let html = `
      <div class="story-scene-layout">
        
        <!-- TOP HEADER: Portrait + Name + Stats -->
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
              <!-- Hearts + stats -->
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

        <!-- LARGE ILLUSTRATION (full width) -->
        <img 
          class="story-scene-image" 
          src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(illustration) : illustration}" 
          data-orig-src="${illustration}" 
          onerror="window.handleImageError(this, 'background')" 
          alt="Cena narrativa">

        <!-- PARCHMENT NARRATIVE TEXT -->
        <div class="story-narrative-text">
          ${this._formatNarrativeText(scene.text)}
        </div>

        <!-- BOTTOM FOOTER ICONS (like screenshot: bag, trophy, etc.) -->
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

      <!-- CHOICES (below the layout, as in screenshot) -->
      <div class="story-choices-mobile" style="margin-top:10px;">
        ${scene.choices.map((ch, idx) => `
          <button class="mobile-choice-btn" onclick="window.narrativeEngine.chooseSceneOption(${idx})">
            <span class="choice-icon">◈</span> 
            <span>${ch.text}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;

    // Optional: Attach mobile touch feedback
    setTimeout(() => {
      const choiceBtns = container.querySelectorAll('.mobile-choice-btn');
      choiceBtns.forEach(btn => {
        btn.addEventListener('touchstart', () => {
          btn.style.transform = 'scale(0.97)';
        });
        btn.addEventListener('touchend', () => {
          btn.style.transform = '';
        });
      });
    }, 80);
  }

  // Helper: Format narrative text with nice line breaks and dialogue styling
  _formatNarrativeText(rawText) {
    if (!rawText) return `<p>Você se encontra em um lugar antigo e misterioso...</p>`;

    // Split by double newlines for paragraphs
    const paragraphs = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    return paragraphs.map(paragraph => {
      // Detect dialogue lines (lines starting with quotes or “So you have come”)
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

// Hook into UI
if (typeof window !== "undefined" && window.ui) {
  window.ui.renderStoryScene = () => window.storyRenderer.renderStoryScene();
}

// Also expose directly for core engine
window.renderStoryScene = () => window.storyRenderer.renderStoryScene();