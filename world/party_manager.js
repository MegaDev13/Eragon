/**
 * Crônica de Aethelgard - Sistema de Grupo (Party), Intrigas, Brigas, Romance e Traição (party_manager.js)
 * Gerencia o grupo ativo de até 4 companheiros, relações interpessoais entre eles, eventos de fogueira e combate em equipe.
 */

class PartyManager {
  constructor() {
    this.maxPartySize = 4;
    this.activePartyIds = []; // Começa sozinho — Party só é conquistada gradualmente

    this.roster = {
      comp_borin: {
        id: "comp_borin",
        name: "Borin o Ferreiro",
        role: "Tanque / Dano Pesado",
        portrait: "assets/portraits/borin.jpg",
        hp: 150, maxHp: 150,
        loyalty: 65,
        status: "Leal",
        combatSkill: { name: "Slam de Martelo e Quebra-Armadura", dmg: 48, effect: "Quebra 30% da Defesa Inimiga", cd: 0, maxCd: 2 },
        relationships: { comp_kaelen: -55, comp_vespera: 40, comp_thalor: 20, comp_morgana: -70 }
      },
      comp_vespera: {
        id: "comp_vespera",
        name: "Capitã Vespera",
        role: "Tanque / Protetora",
        portrait: "assets/portraits/vespera.jpg",
        hp: 140, maxHp: 140,
        loyalty: 70,
        status: "Leal",
        combatSkill: { name: "Investida da Lâmina de Ferro", dmg: 55, effect: "Concede +35 Defesa ao Cavaleiro por 2 turnos", cd: 0, maxCd: 2 },
        relationships: { comp_borin: 40, comp_kaelen: -45, comp_darius: 65, comp_vane: -60 }
      },
      comp_thalor: {
        id: "comp_thalor",
        name: "Arquimago Thalor",
        role: "Mago Arcano / Suporte",
        portrait: "assets/portraits/thalor.jpg",
        hp: 110, maxHp: 110,
        loyalty: 55,
        status: "Amigável",
        combatSkill: { name: "Barreira Arcana e Restauração", dmg: 35, effect: "Restaura +40 Vontade/Mana do Cavaleiro", cd: 0, maxCd: 2 },
        relationships: { comp_orin: 50, comp_morgana: -85, comp_borin: 20, comp_seraphina: 10 }
      },
      comp_kaelen: {
        id: "comp_kaelen",
        name: "Kaelen da Lâmina Sombria",
        role: "Assassino Furtivo / Crítico",
        portrait: "assets/portraits/kaelen.jpg",
        hp: 105, maxHp: 105,
        loyalty: 40,
        status: "Desconfiado",
        combatSkill: { name: "Ataque Furtivo no Ponto Cego", dmg: 72, effect: "Causa Sangramento Letal (+20 Dano/Turno)", cd: 0, maxCd: 2 },
        relationships: { comp_borin: -55, comp_vespera: -45, comp_vane: 70, comp_seraphina: -60 }
      },
      comp_orin: {
        id: "comp_orin",
        name: "Ancião Druida Orin",
        role: "Curandeiro / Natureza",
        portrait: "assets/portraits/orin.jpg",
        hp: 120, maxHp: 120,
        loyalty: 60,
        status: "Leal",
        combatSkill: { name: "Regeneração Simbiótica de Lúmen", dmg: 25, effect: "Cura +60 HP de todo o Grupo no turno", cd: 0, maxCd: 3 },
        relationships: { comp_thalor: 50, comp_borin: 10, comp_morgana: -50, comp_sylas: 60 }
      },
      comp_seraphina: {
        id: "comp_seraphina",
        name: "Oráculo Seraphina",
        role: "Inquisidora Solar / Luz",
        portrait: "assets/portraits/lyra.jpg",
        hp: 115, maxHp: 110,
        loyalty: 45,
        status: "Amigável",
        combatSkill: { name: "Raio Solar Celestial", dmg: 68, effect: "Cega e purifica feitiços inimigos", cd: 0, maxCd: 2 },
        relationships: { comp_darius: 75, comp_morgana: -95, comp_kaelen: -60, comp_thalor: 10 }
      },
      comp_darius: {
        id: "comp_darius",
        name: "Paladino Darius",
        role: "Paladino Solar / Tanque",
        portrait: "assets/portraits/vespera.jpg",
        hp: 145, maxHp: 145,
        loyalty: 65,
        status: "Leal",
        combatSkill: { name: "Escudo Sagrado da Alvorada", dmg: 42, effect: "Absorve 50% de todo dano direcionado ao grupo", cd: 0, maxCd: 2 },
        relationships: { comp_seraphina: 75, comp_vespera: 65, comp_morgana: -80, comp_vane: -40 }
      },
      comp_morgana: {
        id: "comp_morgana",
        name: "Lady Morgana da Corte Sombria",
        role: "Necromante / Sangue",
        portrait: "assets/portraits/vespera.jpg",
        hp: 110, maxHp: 110,
        loyalty: 30,
        status: "Oportunista",
        combatSkill: { name: "Exaurir Alma e Sangue", dmg: 80, effect: "Drena força vital inimiga e cura +50 HP do Cavaleiro", cd: 0, maxCd: 2 },
        relationships: { comp_thalor: -85, comp_seraphina: -95, comp_darius: -80, comp_kaelen: 30 }
      },
      comp_sylas: {
        id: "comp_sylas",
        name: "Mestre Sylas dos Ventos",
        role: "Domador Aéreo / Ar",
        portrait: "assets/portraits/thalor.jpg",
        hp: 125, maxHp: 125,
        loyalty: 70,
        status: "Leal",
        combatSkill: { name: "Asas do Tufão e Relâmpago", dmg: 58, effect: "Concede +30 Iniciativa e Eletrocuta múltiplos alvos", cd: 0, maxCd: 2 },
        relationships: { comp_orin: 60, comp_borin: 30, comp_vespera: 35 }
      },
      comp_vane: {
        id: "comp_vane",
        name: "General Vane o Usurpador",
        role: "Revolucionário / Dano Bruto",
        portrait: "assets/portraits/kaelen.jpg",
        hp: 135, maxHp: 135,
        loyalty: 50,
        status: "Amigável",
        combatSkill: { name: "Golpe da Revolta Camponesa", dmg: 64, effect: "Aumenta o dano em +40% se o HP estiver abaixo de 50%", cd: 0, maxCd: 2 },
        relationships: { comp_kaelen: 70, comp_vespera: -60, comp_seraphina: -40 }
      }
    };
  }

  init(savedData = null) {
    if (savedData) {
      if (savedData.activePartyIds) this.activePartyIds = savedData.activePartyIds;
      if (savedData.roster) {
        for (const [id, data] of Object.entries(savedData.roster)) {
          if (this.roster[id]) {
            this.roster[id].loyalty = data.loyalty !== undefined ? data.loyalty : this.roster[id].loyalty;
            this.roster[id].hp = data.hp !== undefined ? data.hp : this.roster[id].hp;
            this.roster[id].status = data.status || this.roster[id].status;
            if (data.relationships) this.roster[id].relationships = { ...this.roster[id].relationships, ...data.relationships };
          }
        }
      }
    }
  }

  getActivePartyMembers() {
    return this.activePartyIds.map(id => this.roster[id]).filter(Boolean);
  }

  getCompanion(id) {
    return this.roster[id] || null;
  }

  getAllCompanions() {
    return Object.values(this.roster);
  }

  addToParty(compId) {
    const comp = this.getCompanion(compId);
    if (!comp) return false;

    if (this.activePartyIds.includes(compId)) {
      if (window.ui) window.ui.showToast(`${comp.name} já está no seu grupo ativo!`, "info");
      return false;
    }

    if (this.activePartyIds.length >= this.maxPartySize) {
      if (window.ui) window.ui.showToast(`Seu grupo atingiu o limite máximo de ${this.maxPartySize} companheiros! Remova alguém primeiro.`, "warning");
      return false;
    }

    if (comp.loyalty <= -30) {
      if (window.ui) window.ui.showToast(`${comp.name} se recusa a entrar no seu grupo devido a brigas pasadas ou deslealdade!`, "error");
      return false;
    }

    // === REQUISITO DE AFINIDADE (Progressão Orgânica - Nova Regra) ===
    if (window.affinityManager && !window.affinityManager.canRecruit(compId)) {
      const aff = window.affinityManager.getAffinity(compId);
      if (window.ui) {
        window.ui.showToast(`${comp.name} ainda não confia o suficiente em você para viajar ao seu lado. (Afinidade: ${aff}/100)`, "warning");
      }
      return false;
    }

    this.activePartyIds.push(compId);

    // === LIVRO DAS CRÔNICAS ===
    if (window.chronicleBook) {
      window.chronicleBook.recordRecruit(comp.name);
    }

    if (window.ui) {
      window.ui.showToast(`${comp.name} juntou-se à sua Party! (${comp.role})`, "success");
      window.ui.playSound("skill_unlock");
      window.ui.updateAllPanels();
    }
    return true;
  }

  removeFromParty(compId) {
    this.activePartyIds = this.activePartyIds.filter(id => id !== compId);
    if (window.ui) {
      window.ui.showToast("Membro removido do grupo ativo.", "info");
      window.ui.updateAllPanels();
    }
  }

  modifyLoyalty(compId, delta, reason = "") {
    const comp = this.getCompanion(compId);
    if (!comp) return;

    comp.loyalty = Math.max(-100, Math.min(100, comp.loyalty + delta));
    
    // Atualizar status de humor
    if (comp.loyalty >= 80) comp.status = "Eufórico / Devoto";
    else if (comp.loyalty >= 50) comp.status = "Leal";
    else if (comp.loyalty >= 20) comp.status = "Neutro";
    else if (comp.loyalty >= 0) comp.status = "Desconfiado";
    else if (comp.loyalty >= -30) comp.status = "Ressentido";
    else comp.status = "Prestes a Trair / Rebelde";

    if (window.ui && delta !== 0) {
      window.ui.showToast(`Lealdade de ${comp.name}: ${delta >= 0 ? '+' : ''}${delta} (${comp.loyalty}% - ${comp.status})`, delta >= 0 ? "success" : "warning");
    }

    // Checar traição imediata se <= -40
    if (comp.loyalty <= -40 && this.activePartyIds.includes(compId)) {
      this.triggerBetrayalEvent(comp);
    }
  }

  modifyInterCompanionRelation(idA, idB, delta) {
    const compA = this.getCompanion(idA);
    const compB = this.getCompanion(idB);
    if (!compA || !compB || compA.id === compB.id) return;

    compA.relationships[idB] = Math.max(-100, Math.min(100, (compA.relationships[idB] || 0) + delta));
    compB.relationships[idA] = Math.max(-100, Math.min(100, (compB.relationships[idA] || 0) + delta));
  }

  /**
   * Checagem diária ao acampar: pode disparar Brigas no Acampamento, Romance entre NPCs ou Traição.
   */
  processCampfirePartyCheck() {
    const active = this.getActivePartyMembers();
    if (active.length < 2) return;

    // 1. Checar se há dois membros que se odeiam (Relação <= -40) -> BRIGA NO ACAMPAMENTO
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const cA = active[i];
        const cB = active[j];
        const rel = cA.relationships[cB.id] || 0;

        if (rel <= -40 && Math.random() < 0.4) {
          this.triggerCampfireArgument(cA, cB);
          return;
        }

        // 2. Checar se há dois membros com alta afinidade (Relação >= 75) -> ROMANCE ENTRE SI
        if (rel >= 75 && Math.random() < 0.3 && !cA.inLoveWith && !cB.inLoveWith) {
          this.triggerCompanionRomance(cA, cB);
          return;
        }
      }
    }

    // 3. Checar se algum companheiro ativo está ressentido e planeja desertar/trair
    for (const comp of active) {
      if (comp.loyalty <= -25 && Math.random() < 0.35) {
        this.triggerBetrayalEvent(comp);
        return;
      }
    }
  }

  triggerCampfireArgument(compA, compB) {
    if (!window.ui) return;
    window.ui.playSound("dramatic_chord");

    window.ui.showModalAlert(
      `🔥 BRIGA FEROZ NO ACAMPAMENTO: ${compA.name.toUpperCase()} vs ${compB.name.toUpperCase()}`,
      `<div class="argument-box">
        <p style="font-size:15px; color:#facc15;">O silêncio do acampamento é quebrado por gritos e lâminas sendo sacadas!</p>
        <p class="mt-2"><strong>${compA.name}:</strong> "Eu não vou dormir ao lado desse covarde desonrado! Ou ele sai do nosso grupo hoje, ou minha espada falará por mim!"</p>
        <p class="mt-2"><strong>${compB.name}:</strong> "Vem tentar a sorte, velhote arrogante! Minha lâmina vai calar sua boca de uma vez por todas!"</p>
        <p class="mt-3" style="font-size:13px; color:#94a3b8;">Como líder da Party, sua intervenção definirá a lealdade de ambos:</p>
        
        <div class="mt-3" style="display:flex; flex-direction:column; gap:8px;">
          <button class="scroll-choice-btn" onclick="window.partyManager.resolveArgument('${compA.id}', '${compB.id}', 'side_a'); document.getElementById('modal-alert').classList.remove('active'); window.ui.updateAllPanels();">
            <span class="scroll-ribbon">◈</span> Defender ${compA.name} (+15 Lealdade ${compA.name.split(' ')[0]}, -25 Lealdade ${compB.name.split(' ')[0]})
          </button>
          <button class="scroll-choice-btn" onclick="window.partyManager.resolveArgument('${compA.id}', '${compB.id}', 'side_b'); document.getElementById('modal-alert').classList.remove('active'); window.ui.updateAllPanels();">
            <span class="scroll-ribbon">◈</span> Defender ${compB.name} (+15 Lealdade ${compB.name.split(' ')[0]}, -25 Lealdade ${compA.name.split(' ')[0]})
          </button>
          <button class="scroll-choice-btn" onclick="window.partyManager.resolveArgument('${compA.id}', '${compB.id}', 'leadership'); document.getElementById('modal-alert').classList.remove('active'); window.ui.updateAllPanels();">
            <span class="scroll-ribbon">◈</span> Usar sua Liderança e Carisma para impor disciplina severa a ambos (+5 Lealdade em ambos se Liderança >= 14)
          </button>
        </div>
      </div>`,
      "Fechar e Mediar"
    );
  }

  resolveArgument(idA, idB, choice) {
    const compA = this.getCompanion(idA);
    const compB = this.getCompanion(idB);
    if (!compA || !compB) return;

    if (choice === "side_a") {
      this.modifyLoyalty(idA, 15, "Defendido na briga");
      this.modifyLoyalty(idB, -25, "Repreendido na briga");
      this.modifyInterCompanionRelation(idA, idB, -10);
    } else if (choice === "side_b") {
      this.modifyLoyalty(idB, 15, "Defendido na briga");
      this.modifyLoyalty(idA, -25, "Repreendido na briga");
      this.modifyInterCompanionRelation(idA, idB, -10);
    } else if (choice === "leadership") {
      const leaderVal = window.attributesManager ? window.attributesManager.getAttribute("lideranca") : 10;
      if (leaderVal >= 14) {
        this.modifyLoyalty(idA, 8, "Respeito à Liderança");
        this.modifyLoyalty(idB, 8, "Respeito à Liderança");
        this.modifyInterCompanionRelation(idA, idB, 15);
        if (window.ui) window.ui.showToast("Sua liderança implacável acalmou a briga e gerou respeito mútuo!", "success");
      } else {
        this.modifyLoyalty(idA, -10, "Liderança fraca na briga");
        this.modifyLoyalty(idB, -10, "Liderança fraca na briga");
        if (window.ui) window.ui.showToast("Sua liderança não foi forte o bastante! Ambos saíram ressentidos.", "warning");
      }
    }
  }

  triggerCompanionRomance(compA, compB) {
    compA.inLoveWith = compB.name;
    compB.inLoveWith = compA.name;
    this.modifyInterCompanionRelation(compA.id, compB.id, 20);

    if (window.ui) {
      window.ui.playSound("victory");
      window.ui.showModalAlert(
        `💖 ROMANCE ENTRE COMPANHEIROS DO GRUPO: ${compA.name.toUpperCase()} & ${compB.name.toUpperCase()}`,
        `<p style="font-size:15px; color:#facc15;">Viajando e lutando lado a lado nas cinzas, ${compA.name} e ${compB.name} se apaixonaram!</p>
        <p class="mt-2">Agora eles formam um <strong>Casal de Batalha</strong> no seu grupo, recebendo +20% de dano sinérgico sempre que lutarem juntos.</p>`,
        "Saudar os Apaixonados"
      );
    }
  }

  triggerBetrayalEvent(comp) {
    if (!window.ui) return;
    this.removeFromParty(comp.id);
    window.ui.playSound("overload");

    // Traição: pode roubar ouro ou atacar
    const stolenGold = Math.min(400, Math.floor((window.inventoryManager?.gold || 0) * 0.4));
    if (window.inventoryManager) window.inventoryManager.gold -= stolenGold;

    window.ui.showModalAlert(
      `⚠️ TRAIÇÃO NO GRUPO: A DESERÇÃO DE ${comp.name.toUpperCase()}`,
      `<div style="display:flex; gap:16px; align-items:center;">
        <img src="${comp.portrait || 'assets/portraits/borin.jpg'}" alt="${comp.name}" style="width:90px; height:90px; border-radius:8px; border:2px solid #ef4444; object-fit:cover;"/>
        <div>
          <p style="font-size:15px; color:#f87171;"><strong>"${comp.name}"</strong> não suportou mais sua liderança, suas decisões ou o tratamento desonroso do grupo!</p>
          <p class="mt-2">Na calada da noite, ${comp.name} desertou do acampamento e levou <strong>-${stolenGold} moedas de ouro</strong> do cofre da Party!</p>
          <p class="mt-2" style="font-size:13px; color:#fbbf24;">Atenção: Você poderá encontrá-lo como adversário hostil em futuras batalhas ou missões.</p>
        </div>
      </div>`,
      "Maldito Traidor!"
    );
  }

  exportData() {
    return {
      activePartyIds: [...this.activePartyIds],
      roster: JSON.parse(JSON.stringify(this.roster))
    };
  }
}

window.partyManager = new PartyManager();
