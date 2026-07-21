/**
 * Crônica de Aethelgard - Renderizador de Grupo, Companheiros e Sinergia (ui_party.js)
 * Exibe membros ativos da Party, matriz de amizades/intrigas/romance e opções de recrutamento.
 */

class PartyRenderer {
  renderPartyTab() {
    const container = document.getElementById("party-container");
    if (!container || !window.partyManager) return;

    const pm = window.partyManager;
    const active = pm.getActivePartyMembers();
    const all = pm.getAllCompanions();

    let html = `
      <div class="party-layout">
        <div class="ornate-card party-header mb-4">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>👥 Grupo de Aventura, Companheiros e Sinergia (${active.length} / ${pm.maxPartySize})</h3>
            <span class="badge species-badge">Sinergia e Intrigas Ativas</span>
          </div>
          <p class="mt-1">Gerencie quem caminha com você nas cinzas. Amizades aumentam o moral e a sinergia em combate, mas intrigas e rivalidades podem gerar brigas na fogueira ou até mesmo traições e deserções ao acampar!</p>
        </div>

        <!-- GRUPO ATIVO (PARTY MEMBERS) -->
        <h4 class="mb-3" style="font-family:var(--font-serif); color:#facc15;">🛡️ Membros Ativos na Party de Combate:</h4>
        <div class="schools-grid mb-4">
          ${active.map(c => {
            const statusColor = c.loyalty >= 70 ? "#10b981" : (c.loyalty >= 30 ? "#38bdf8" : (c.loyalty >= 0 ? "#facc15" : "#ef4444"));
            
            return `
              <div class="ornate-card active-companion-card" style="border-left:4px solid ${statusColor};">
                <div style="display:flex; gap:14px; align-items:center;">
                  <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(c.portrait || 'assets/portraits/borin.jpg') : (c.portrait || 'assets/portraits/borin.jpg')}" data-orig-src="${c.portrait || 'assets/portraits/borin.jpg'}" onerror="window.handleImageError(this, 'portrait')" alt="${c.name}" style="width:75px; height:75px; border-radius:8px; border:2px solid ${statusColor}; object-fit:cover;"/>
                  <div style="flex:1;">
                    <h4 style="font-size:16px;">${c.name}</h4>
                    <span style="font-size:12px; color:#38bdf8; display:block;">Papel: <strong>${c.role}</strong></span>
                    <span class="badge species-badge mt-1" style="border-color:${statusColor}; color:${statusColor}; display:block; width:fit-content;">Lealdade: ${c.loyalty}% (${c.status})</span>
                  </div>
                </div>

                <div class="p-2 mt-3" style="background:rgba(0,0,0,0.4); border-radius:6px; font-size:12.5px; border:1px solid rgba(255,255,255,0.08);">
                  <strong style="color:#fbbf24;">⚡ Habilidade em Combate:</strong> ${c.combatSkill?.name} <br/>
                  <small style="color:#94a3b8;">${c.combatSkill?.effect} (Recarga: ${c.combatSkill?.maxCd} turnos)</small>
                </div>

                ${c.inLoveWith ? `
                  <div class="p-2 mt-2" style="background:rgba(236,72,153,0.15); border:1px solid #ec4899; border-radius:4px; font-size:12px; color:#f472b6;">
                    <strong>💖 Casal no Grupo:</strong> Apaixonado(a) por ${c.inLoveWith} (+20% Dano de Sinergia)
                  </div>
                ` : ''}

                <div class="mt-3" style="display:flex; gap:8px;">
                  <button class="action-btn small danger w-100" style="width:100%;" onclick="window.partyManager.removeFromParty('${c.id}'); window.ui.renderCurrentTab();">✕ Remover da Party</button>
                </div>
              </div>
            `;
          }).join('')}
          ${Array.from({ length: Math.max(0, pm.maxPartySize - active.length) }).map(() => `
            <div class="ornate-card" style="border:1px dashed var(--border-color); display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:220px; opacity:0.6;">
              <span style="font-size:28px;">➕</span>
              <p class="mt-2" style="font-weight:bold;">Espaço de Companheiro Vazio</p>
              <small>Recrute abaixo para adicionar à Party</small>
            </div>
          `).join('')}
        </div>

        <!-- MATRIZ DE RELAÇÕES E INTRIGAS DO GRUPO -->
        <div class="ornate-card mb-4">
          <h3>🕸️ Matriz Interpessoal e Intrigas do Grupo Ativo</h3>
          <p class="mt-1" style="font-size:13px;">Como seus companheiros se relacionam entre si no acampamento e durante a viagem:</p>
          <div class="inter-relations-list mt-3">
            ${active.length < 2 ? `<p style="opacity:0.8;"><em>Adicione pelo menos 2 companheiros à Party para conferir a matriz de afinidades e intrigas entre eles.</em></p>` : ''}
            ${active.map(cA => {
              const others = active.filter(cB => cB.id !== cA.id);
              if (others.length === 0) return '';
              return `
                <div class="p-3 mb-2" style="background:rgba(0,0,0,0.35); border-radius:6px; border-left:3px solid var(--border-glow);">
                  <strong style="color:#facc15;">${cA.name}</strong> pensa sobre seus aliados:
                  <ul class="mt-1" style="list-style:none; display:flex; flex-direction:column; gap:4px; font-size:13px;">
                    ${others.map(cB => {
                      const rel = cA.relationships?.[cB.id] || 0;
                      const relColor = rel >= 60 ? "#10b981" : (rel >= 20 ? "#38bdf8" : (rel >= -20 ? "#94a3b8" : "#ef4444"));
                      const relText = rel >= 75 ? "Romance / Admiração Suprema" : (rel >= 40 ? "Grande Amizade" : (rel >= 10 ? "Respeito" : (rel >= -25 ? "Neutro / Desconfiado" : "Rivalidade (Risco de Briga no Acampamento)")));
                      return `<li>👉 vs <strong>${cB.name}:</strong> <span style="color:${relColor}; font-weight:bold;">${relText} (${rel}%)</span></li>`;
                    }).join('')}
                  </ul>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- RECRUTAMENTO GERAL DE COMPANHEIROS -->
        <h4 class="mb-3" style="font-family:var(--font-serif); color:#facc15;">🏕️ Todos os Companheiros de Aethelgard (${all.length}):</h4>
        <div class="schools-grid">
          ${all.map(c => {
            const isActive = pm.activePartyIds.includes(c.id);
            return `
              <div class="ornate-card" style="opacity:${isActive ? '0.7' : '1'};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <h4 style="font-size:16px;">${c.name}</h4>
                  <span class="badge species-badge">${c.role}</span>
                </div>
                <p class="mt-2" style="font-size:12.5px;">Lealdade com você: <strong>${c.loyalty}% (${c.status})</strong></p>
                <div class="mt-3">
                  ${!isActive ? `
                    <button class="action-btn small primary w-100" style="width:100%;" onclick="window.partyManager.addToParty('${c.id}'); window.ui.renderCurrentTab();">➕ Adicionar à Party Ativa</button>
                  ` : `
                    <span class="badge danger-level w-100 text-center" style="display:block; background:#059669; color:#fff; border:none; padding:8px;">✔ Já está na sua Party</span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
}

window.partyRenderer = new PartyRenderer();
if (typeof window !== "undefined" && window.ui) {
  window.ui.renderPartyTab = () => window.partyRenderer.renderPartyTab();
}
