/**
 * Crônica de Aethelgard - Renderizador de Romance, Matrimônio e Residências (ui_romance.js)
 * Exibe índices de aprovação dos NPCs, opções de cortejo, presentes, cerimônia de casamento e lares.
 */

class RomanceRenderer {
  constructor() {
    this.selectedKingdomFilter = "all";
  }

  renderRomanceTab() {
    const container = document.getElementById("romance-container");
    if (!container || !window.romanceManager) return;

    const rm = window.romanceManager;
    const npcs = rm.getAllRomanceNPCs();
    const residences = rm.getAllResidences();
    const spouse = rm.getSpouseObject();

    let filteredNPCs = npcs;
    if (this.selectedKingdomFilter !== "all") {
      filteredNPCs = npcs.filter(n => n.kingdomId === this.selectedKingdomFilter);
    }

    let html = `
      <div class="romance-layout">
        <div class="ornate-card romance-header mb-4">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>💖 Romance, Cortejo, Matrimônio e Residências</h3>
            <span class="badge species-badge">Cônjuge Atual: ${spouse ? spouse.name : 'Solteiro / Em Cortejo'}</span>
          </div>
          <p class="mt-1">Construa laços de afeto com os NPCs dos 7 reinos, ofereça presentes e celebre o matrimônio sagrado em seu lar seguro.</p>
          
          <div class="myth-filters-bar mt-3" style="display:flex; gap:6px; flex-wrap:wrap; overflow-x:auto; padding-bottom:4px;">
            <button class="action-btn small ${this.selectedKingdomFilter === 'all' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'all'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">✨ Todos os Reinos (${npcs.length})</button>
            <button class="action-btn small ${this.selectedKingdomFilter === 'reino_eldor' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'reino_eldor'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">👑 Eldor</button>
            <button class="action-btn small ${this.selectedKingdomFilter === 'imperio_solgard' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'imperio_solgard'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">🔥 Solgard</button>
            <button class="action-btn small ${this.selectedKingdomFilter === 'confederacao_valdrak' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'confederacao_valdrak'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">🐉 Val-Drak</button>
            <button class="action-btn small ${this.selectedKingdomFilter === 'sultanato_aramis' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'sultanato_aramis'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">🪙 Aramis</button>
            <button class="action-btn small ${this.selectedKingdomFilter === 'teocracia_aethel' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'teocracia_aethel'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">☀️ Aethel-Lúmen</button>
            <button class="action-btn small ${this.selectedKingdomFilter === 'grao_ducado_vaelor' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'grao_ducado_vaelor'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">⚓ Vaelor</button>
            <button class="action-btn small ${this.selectedKingdomFilter === 'horda_khaz' ? 'primary' : 'secondary'}" onclick="window.romanceRenderer.selectedKingdomFilter = 'horda_khaz'; window.audioManager?.play('click'); window.ui.renderCurrentTab();">🐺 Horda Khaz</button>
          </div>
        </div>

        <!-- LISTA DE NPCS ROMÂNTICOS -->
        <h4 class="mb-3" style="font-family:var(--font-serif); color:#facc15;">💌 NPCs Disponíveis para Cortejo (${filteredNPCs.length}):</h4>
        <div class="schools-grid mb-4">
          ${filteredNPCs.map(n => {
            const approvalPercent = Math.max(0, Math.min(100, (n.approval + 100) / 2));
            const statusColor = n.status === "Casamento / Matrimônio" ? "#facc15" : (n.status === "Noivado" ? "#38bdf8" : (n.status === "Namoro" ? "#ec4899" : "#94a3b8"));
            
            return `
              <div class="ornate-card romance-npc-card" style="border-left:4px solid ${statusColor};">
                <div style="display:flex; gap:14px; align-items:center;">
                  <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(n.portrait || 'assets/portraits/lyra.jpg') : (n.portrait || 'assets/portraits/lyra.jpg')}" data-orig-src="${n.portrait || 'assets/portraits/lyra.jpg'}" onerror="window.handleImageError(this, 'portrait')" alt="${n.name}" style="width:75px; height:75px; border-radius:8px; border:2px solid ${statusColor}; object-fit:cover;"/>
                  <div style="flex:1;">
                    <h4 style="font-size:16px;">${n.name} <small style="font-size:12px; opacity:0.8;">(${n.gender === 'feminine' ? 'Dama' : 'Cavalheiro'})</small></h4>
                    <span style="font-size:12px; color:#facc15;">${n.title}</span>
                    <span class="badge species-badge mt-1" style="border-color:${statusColor}; color:${statusColor}; display:block; width:fit-content;">${n.status}</span>
                  </div>
                </div>

                <div class="approval-gauge mt-3">
                  <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold;">
                    <span>Índice de Afeição:</span>
                    <span style="color:#facc15;">${n.approval}% (${n.approval >= 80 ? 'Devoto' : (n.approval >= 50 ? 'Amoroso' : (n.approval >= 20 ? 'Simpático' : 'Neutro'))})</span>
                  </div>
                  <div class="progress-bar mt-1"><div class="progress-fill" style="width: ${approvalPercent}%; background:linear-gradient(90deg, #be185d, #f43f5e, #fbbf24);"></div></div>
                </div>

                <small style="font-size:11.5px; opacity:0.8; display:block;" class="mt-2">🎁 Adora: ${n.favoriteGifts?.map(g => window.inventoryManager?.getItemTemplate(g)?.name || g).join(', ')}</small>

                <div class="romance-actions-grid mt-3" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                  <button class="action-btn small secondary" onclick="window.romanceRenderer.openGiftPicker('${n.id}')">🎁 Dar Presente</button>
                  <button class="action-btn small ${n.approval >= 30 ? 'primary' : 'secondary'}" onclick="window.romanceManager.goOnDate('${n.id}'); window.ui.renderCurrentTab();">🌹 Flertar / Encontro</button>
                  <button class="action-btn small ${n.approval >= 60 ? 'primary' : 'secondary'}" onclick="window.romanceManager.startDating('${n.id}'); window.ui.renderCurrentTab();">💖 Pedir em Namoro</button>
                  <button class="action-btn small ${n.approval >= 80 ? 'primary' : 'secondary'}" onclick="window.romanceManager.proposeEngagement('${n.id}'); window.ui.renderCurrentTab();">💍 Pedir em Noivado</button>
                </div>
                ${n.status === "Noivado" ? `
                  <button class="action-btn primary w-100 mt-2" style="width:100%; padding:10px; font-size:14px; background:linear-gradient(90deg,#d97706,#f59e0b);" onclick="window.romanceManager.celebrateMarriage('${n.id}'); window.ui.renderCurrentTab();">
                    💒 CELEBRAR CERIMÔNIA DE CASAMENTO
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- SEÇÃO DE RESIDÊNCIAS E LAR CONJUGAL -->
        <div class="ornate-card residences-section mt-4">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px;">
            <h3>🏰 Residências e Lar Seguro do Casal</h3>
            ${spouse ? `<button class="action-btn primary" onclick="window.romanceManager.restWithSpouse(); window.ui.renderCurrentTab();">🛏️ Repousar com Cônjuge (${spouse.name})</button>` : `<span class="badge danger-level">Case-se para repousar junto</span>`}
          </div>
          <p class="mt-2">Adquira propriedades nos 7 reinos para desfrutar de bônus regenerativos e econômicos inestimáveis.</p>

          <div class="schools-grid mt-3">
            ${residences.map(res => `
              <div class="ornate-card residence-card ${res.unlocked ? 'unlocked-res' : ''}" style="border:1px solid ${res.unlocked ? '#10b981' : 'var(--border-color)'};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <h4 style="font-size:16px; color:${res.unlocked ? '#10b981' : '#facc15'};">${res.name}</h4>
                  <span class="badge ${res.unlocked ? 'species-badge' : 'danger-level'}" style="${res.unlocked ? 'border-color:#10b981; color:#10b981;' : ''}">${res.unlocked ? '✔ Adquirida' : res.price + ' ouro'}</span>
                </div>
                <p class="mt-2" style="font-size:13px;">${res.desc}</p>
                <div class="p-2 mt-2" style="background:rgba(0,0,0,0.4); border-radius:4px; font-size:12.5px; color:#38bdf8;">
                  <strong>✨ Benefício:</strong> ${res.perk}
                </div>
                ${!res.unlocked ? `
                  <button class="action-btn primary small w-100 mt-3" style="width:100%;" onclick="window.romanceManager.purchaseResidence('${res.id}'); window.ui.renderCurrentTab();">
                    🪙 Comprar Propriedade (${res.price} ouro)
                  </button>
                ` : `<span class="badge species-badge mt-3" style="display:block; text-align:center; border-color:#10b981; color:#10b981;">Lar Ativo do Casal</span>`}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  openGiftPicker(npcId) {
    const npc = window.romanceManager?.getNPCById(npcId);
    if (!npc || !window.inventoryManager) return;

    const items = window.inventoryManager.items;
    const giftsAvailable = Object.keys(items).filter(k => window.inventoryManager.getItemTemplate(k)?.type === "presente_romantico" || window.inventoryManager.getItemTemplate(k)?.type === "consumivel" || window.inventoryManager.getWeaponTemplate(k));

    let choicesHtml = giftsAvailable.map(k => {
      const tmpl = window.inventoryManager.getItemTemplate(k) || window.inventoryManager.getWeaponTemplate(k);
      const isFav = npc.favoriteGifts?.includes(k);
      return `
        <button class="scroll-choice-btn mb-2" onclick="window.romanceManager.giveGift('${npc.id}', '${k}'); document.getElementById('modal-alert').classList.remove('active'); window.ui.renderCurrentTab();">
          <span class="scroll-ribbon">🎁</span> ${tmpl.name} (${items[k] || 1}x) ${isFav ? '✨ [Afeição Favorita]' : ''}
        </button>
      `;
    }).join('');

    if (giftsAvailable.length === 0) {
      choicesHtml = `<p>Você não possui itens de presente ou flores em sua mochila. Visite o bazar de especiarias ou derrote monstros para obter presentes!</p>`;
    }

    window.ui.showModalAlert(
      `🎁 SELECIONE UM PRESENTE PARA ${npc.name.toUpperCase()}`,
      `<p>Dica: Presentes favoritos concedem grandes bônus de aprovação (+25 Afeição).</p><div class="mt-3">${choicesHtml}</div>`,
      "Fechar"
    );
  }
}

window.romanceRenderer = new RomanceRenderer();
if (typeof window !== "undefined" && window.ui) {
  window.ui.renderRomanceTab = () => window.romanceRenderer.renderRomanceTab();
}
