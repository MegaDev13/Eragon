/**
 * Crônica de Aethelgard - Renderizador Visual da Narrativa e Prólogo (ui_story.js)
 * Exibe as cenas dos capítulos com ilustrações, pergaminhos e botões de escolha em estilo visual novel/lore.
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

    // Retrato do jogador se não houver retrato do NPC, ou ilustração
    const playerPortrait = window.flagsManager?.getFlag("player_portrait") || "assets/portraits/lyra.jpg";

    let html = `
      <div class="story-scene-layout">
        <div class="ornate-card story-chapter-header mb-4">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>${chap.title}</h3>
            <span class="badge species-badge" style="font-size:12px;">Modo Crônica Principal</span>
          </div>
          <p class="mt-1" style="font-style:italic; opacity:0.8;">"${chap.subtitle}"</p>
        </div>

        <div class="ornate-card story-scene-card">
          <!-- ILUSTRAÇÃO OU RETRATO DA CENA -->
          <div class="scene-visual-box mb-3" style="position:relative; height:240px; border-radius:8px; overflow:hidden; border:2px solid var(--border-glow); box-shadow:0 10px 30px rgba(0,0,0,0.8);">
            <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(scene.illustration || 'assets/backgrounds/ash_valley.jpg') : (scene.illustration || 'assets/backgrounds/ash_valley.jpg')}" data-orig-src="${scene.illustration || 'assets/backgrounds/ash_valley.jpg'}" onerror="window.handleImageError(this, 'background')" alt="Cena" style="width:100%; height:100%; object-fit:cover;"/>
            ${scene.npcPortrait ? `
              <div class="scene-npc-portrait-floating" style="position:absolute; bottom:12px; right:12px; width:90px; height:90px; border-radius:8px; border:2px solid #facc15; overflow:hidden; box-shadow:0 4px 15px #000;">
                <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(scene.npcPortrait) : scene.npcPortrait}" data-orig-src="${scene.npcPortrait}" onerror="window.handleImageError(this, 'portrait')" alt="NPC" style="width:100%; height:100%; object-fit:cover;"/>
              </div>
            ` : ''}
            <div class="scene-title-overlay" style="position:absolute; bottom:0; left:0; right:${scene.npcPortrait ? '110px' : '0'}; background:linear-gradient(transparent, rgba(17,19,24,0.95)); padding:16px;">
              <h4 style="font-family:var(--font-serif); font-size:20px; color:#facc15;">◈ ${scene.title}</h4>
            </div>
          </div>

          <!-- PERGAMINHO DE TEXTO NARRATIVO -->
          <div class="scene-narrative-parchment p-4 mb-4" style="background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color:#2c1810; border-radius:6px; border:2px solid #b45309; font-size:15px; line-height:1.7; box-shadow:inset 0 0 25px rgba(120,53,15,0.25);">
            ${scene.text.split('\n\n').map(p => `<p class="mb-3" style="text-indent:20px;">${p}</p>`).join('')}
          </div>

          <!-- OPÇÕES DE ESCOLHA DA CENA -->
          <h5 style="color:#facc15; font-family:var(--font-serif); font-size:16px;" class="mb-2">📜 Escolha como moldar o destino de Aethelgard:</h5>
          <div class="scene-choices-box" style="display:flex; flex-direction:column; gap:12px;">
            ${scene.choices.map((ch, idx) => `
              <button class="scroll-choice-btn" style="padding:14px 20px; font-size:14.5px;" onclick="window.narrativeEngine.chooseSceneOption(${idx})" onmouseenter="window.audioManager?.play('hover')">
                <span class="scroll-ribbon">◈</span> ${ch.text}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- MODO SANDBOX LIVRE DIRETAMENTE NA NARRATIVA -->
        <div class="ornate-card mt-4 text-center" style="background:rgba(0,0,0,0.4);">
          <p style="font-size:13px; opacity:0.8;">Deseja pausar a narrativa central e explorar Aethelgard livremente nas outras abas (Mapa, Alquimia, Guildas)?</p>
          <button class="action-btn small primary mt-2" onclick="window.ui.changeTab('map')">🗺️ Ir para o Mapa e Exploração Sandbox</button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
}

    window.storyRenderer = new StoryRenderer();
    if (typeof window !== "undefined" && window.ui) {
      window.ui.renderStoryScene = () => window.storyRenderer.renderStoryScene();
    }
