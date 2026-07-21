/**
 * Crônica de Aethelgard - Sistema de Romance, Cortejo, Matrimônio e Residências (romance_manager.js)
 * Gerencia afeição, presentes, namoro, noivado, casamentos e aquisição de lares conjugais em todos os 7 reinos.
 */

class RomanceManager {
  constructor() {
    this.npcs = {};
    this.residences = {};
    this.spouseId = null;
    this.activeDatingIds = [];
    this.activeEngagementId = null;
    this.activeResidenceId = null;
  }

  init(romanceData, savedData = null) {
    if (romanceData) {
      if (romanceData.npcs) {
        romanceData.npcs.forEach(n => {
          this.npcs[n.id] = { ...n };
        });
      }
      if (romanceData.residences) {
        romanceData.residences.forEach(r => {
          this.residences[r.id] = { ...r };
        });
      }
    }

    if (savedData) {
      if (savedData.npcs) {
        for (const [id, data] of Object.entries(savedData.npcs)) {
          if (this.npcs[id]) {
            this.npcs[id].approval = data.approval !== undefined ? data.approval : this.npcs[id].approval;
            this.npcs[id].status = data.status || this.npcs[id].status;
          }
        }
      }
      if (savedData.residences) {
        for (const [id, data] of Object.entries(savedData.residences)) {
          if (this.residences[id]) {
            this.residences[id].unlocked = data.unlocked || false;
          }
        }
      }
      this.spouseId = savedData.spouseId || null;
      this.activeDatingIds = savedData.activeDatingIds || [];
      this.activeEngagementId = savedData.activeEngagementId || null;
      this.activeResidenceId = savedData.activeResidenceId || null;
    }
  }

  getAllRomanceNPCs() {
    return Object.values(this.npcs);
  }

  getNPCById(id) {
    return this.npcs[id] || null;
  }

  getAllResidences() {
    return Object.values(this.residences);
  }

  getResidenceById(id) {
    return this.residences[id] || null;
  }

  getSpouseObject() {
    if (!this.spouseId) return null;
    return this.getNPCById(this.spouseId);
  }

  modifyApproval(npcId, delta) {
    const npc = this.getNPCById(npcId);
    if (!npc) return;
    npc.approval = Math.max(-100, Math.min(100, npc.approval + delta));

    if (window.ui && delta !== 0) {
      window.ui.showToast(`Afeição com ${npc.name}: ${delta >= 0 ? '+' : ''}${delta} (${npc.approval}%)`, delta >= 0 ? "success" : "warning");
    }
    if (window.flagsManager) {
      window.flagsManager.setFlag(`rom_${npc.id}_approval`, npc.approval, "Sistema de Romance");
    }
  }

  giveGift(npcId, itemId) {
    const npc = this.getNPCById(npcId);
    if (!npc || !window.inventoryManager) return false;

    const itemTmpl = window.inventoryManager.getItemTemplate(itemId);
    if (!itemTmpl || !window.inventoryManager.consumeItem(itemId, 1)) {
      if (window.ui) window.ui.showToast("Você não possui este item no inventário para presentear.", "warning");
      return false;
    }

    let boost = itemTmpl.romanceBoost || 12;
    if (npc.favoriteGifts?.includes(itemId)) {
      boost += 15;
      if (window.ui) window.ui.showToast(`${npc.name} adora este presente! (+${boost} Afeição)`, "gold");
    } else if (npc.dislikedGifts?.includes(itemId)) {
      boost = -15;
      if (window.ui) window.ui.showToast(`${npc.name} detestou o seu presente! (${boost} Afeição)`, "error");
    } else {
      if (window.ui) window.ui.showToast(`Você presenteou ${npc.name} com ${itemTmpl.name} (+${boost} Afeição)`, "success");
    }

    this.modifyApproval(npcId, boost);
    if (window.audioManager) window.audioManager.play("potion");
    if (window.ui) window.ui.updateAllPanels();
    return true;
  }

  goOnDate(npcId) {
    const npc = this.getNPCById(npcId);
    if (!npc) return;

    if (npc.approval < 30) {
      if (window.ui) window.ui.showToast("Sua afeição com este NPC ainda é baixa para convidá-lo para um encontro (Requer: 30%+).", "warning");
      return;
    }

    npc.status = "Flerte / Cortejo";
    this.modifyApproval(npcId, 8);

    const dlg = npc.dialogues?.find(d => d.reqApproval <= npc.approval) || npc.dialogues?.[0];
    const text = dlg ? dlg.text : "O tempo que passamos juntos sob as estrelas aquece minha alma.";

    if (window.ui) {
      window.ui.showModalAlert(
        `🌹 ENCONTRO ROMÂNTICO COM ${npc.name.toUpperCase()}`,
        `<div style="display:flex; gap:16px; align-items:center;">
          <img src="${npc.portrait || 'assets/portraits/lyra.jpg'}" alt="${npc.name}" style="width:85px; height:85px; border-radius:8px; border:2px solid #facc15; object-fit:cover;"/>
          <div>
            <p style="font-size:15px; font-style:italic; color:#fef3c7;">"${text}"</p>
            <span class="badge species-badge mt-2">Status: ${npc.status}</span>
          </div>
        </div>`,
        "Maravilhoso"
      );
      window.ui.playSound("levelup");
    }
  }

  startDating(npcId) {
    const npc = this.getNPCById(npcId);
    if (!npc) return;

    if (npc.approval < 60) {
      if (window.ui) window.ui.showToast("Requer afeição 60%+ para pedir em namoro oficial.", "warning");
      return;
    }

    npc.status = "Namoro";
    if (!this.activeDatingIds.includes(npcId)) this.activeDatingIds.push(npcId);
    this.modifyApproval(npcId, 12);

    if (window.attributesManager) {
      window.attributesManager.modifyAttribute("constituicao", 2);
      window.attributesManager.modifyAttribute("vontade", 2);
    }

    if (window.ui) {
      window.ui.showModalAlert(
        `💖 CORTEJO OFICIAL E NAMORO COM ${npc.name.toUpperCase()}`,
        `<p style="font-size:16px;">Sua proposta romântica foi aceita! Agora vocês estão oficialmente em <strong>Namoro</strong>.</p>
        <p class="mt-2">O afeto mútuo fortalece sua alma (+2 Constituição, +2 Vontade).</p>`,
        "Celebrem Juntos"
      );
      window.ui.playSound("victory");
    }
  }

  proposeEngagement(npcId) {
    const npc = this.getNPCById(npcId);
    if (!npc || !window.inventoryManager) return;

    if (npc.approval < 80) {
      if (window.ui) window.ui.showToast("Requer afeição 80%+ para pedir em Noivado.", "warning");
      return;
    }

    if (!window.inventoryManager.consumeItem("item_engagement_ring", 1)) {
      if (window.ui) window.ui.showToast("Você precisa de um 'Anel de Noivado Rúnico de Prata e Ouro' no inventário para fazer o pedido sagrado!", "warning");
      return;
    }

    npc.status = "Noivado";
    this.activeEngagementId = npcId;
    this.modifyApproval(npcId, 18);

    if (window.ui) {
      window.ui.showModalAlert(
        `💍 PEDIDO DE NOIVADO ACEITO POR ${npc.name.toUpperCase()}!`,
        `<p style="font-size:16px; color:#facc15;">Com lágrimas e sorrisos, ${npc.name} aceita o Anel de Noivado Rúnico!</p>
        <p class="mt-2">Sua relação agora subiu para <strong>Noivado</strong>. Prepare a cerimônia sagrada com a Aliança de Casamento quando a afeição atingir 95%+.</p>`,
        "Que os Deuses Abençoem"
      );
      window.ui.playSound("victory");
    }
  }

  celebrateMarriage(npcId) {
    const npc = this.getNPCById(npcId);
    if (!npc || !window.inventoryManager) return;

    if (npc.approval < 95 || npc.status !== "Noivado") {
      if (window.ui) window.ui.showToast("Requer status Noivado e afeição 95%+ para celebrar o casamento.", "warning");
      return;
    }

    if (!window.inventoryManager.consumeItem("item_wedding_ring", 1)) {
      if (window.ui) window.ui.showToast("Você precisa de um par de 'Aliança Sagrada de Casamento' para realizar a cerimônia!", "warning");
      return;
    }

    npc.status = "Casamento / Matrimônio";
    this.spouseId = npcId;
    this.modifyApproval(npcId, 25);

    if (window.flagsManager) {
      window.flagsManager.setFlag("player_married", true, "Sistema de Matrimônio");
      window.flagsManager.setFlag("player_spouse", npc.name, "Sistema de Matrimônio");
    }

    if (window.ui) {
      window.ui.showModalAlert(
        `💒 CERIMÔNIA SAGRADA DE CASAMENTO COM ${npc.name.toUpperCase()}`,
        `<div style="text-align:center;">
          <img src="${npc.portrait || 'assets/portraits/lyra.jpg'}" alt="Spouse" style="width:110px; height:110px; border-radius:50%; border:3px solid #facc15; object-fit:cover; box-shadow:0 0 25px rgba(250,204,21,0.6);"/>
          <h4 class="mt-3" style="font-family:var(--font-serif); color:#facc15;">Votos Matrimoniais Solenes:</h4>
          <p class="mt-2" style="font-size:15px; font-style:italic; line-height:1.6; background:rgba(0,0,0,0.4); padding:16px; border-radius:6px; border-left:3px solid #facc15;">"${npc.weddingVows}"</p>
          <p class="mt-3">Agora vocês são <strong>Cônjuges Eternos</strong>. Acesse a aba de Residências para adquirir uma mansão conjugal e repousar com bônus supremos!</p>
        </div>`,
        "Selar União com um Beijo Sagrado"
      );
      window.ui.playSound("victory");
    }
  }

  purchaseResidence(resId) {
    const res = this.getResidenceById(resId);
    if (!res || !window.inventoryManager) return false;

    if (res.unlocked) {
      if (window.ui) window.ui.showToast("Você já possui esta residência conjugal!", "info");
      return false;
    }

    if (window.inventoryManager.gold < res.price) {
      if (window.ui) window.ui.showToast(`Ouro insuficiente para comprar ${res.name} (${window.inventoryManager.gold}/${res.price}).`, "warning");
      return false;
    }

    window.inventoryManager.gold -= res.price;
    res.unlocked = true;
    this.activeResidenceId = resId;

    if (window.ui) {
      window.ui.showToast(`🏰 Residência Conjugal Adquirida: ${res.name}!`, "gold");
      window.ui.playSound("gold");
      window.ui.updateAllPanels();
    }
    return true;
  }

  restWithSpouse() {
    const res = this.getResidenceById(this.activeResidenceId || "res_eldor_manor") || this.getAllResidences().find(r => r.unlocked);
    if (!res || !this.spouseId) {
      if (window.ui) window.ui.showToast("Requer um cônjuge (Casamento) e pelo menos 1 residência adquirida para repousar juntos no lar conjugal.", "warning");
      return;
    }

    const spouse = this.getSpouseObject();
    if (window.attributesManager) {
      window.attributesManager.heal(100);
      window.attributesManager.restoreWillpower(100);
      window.attributesManager.modifyFatigue(-100);
      window.attributesManager.modifyCorruption(-10);
    }
    this.modifyApproval(this.spouseId, 5);

    if (window.calendarManager) {
      window.calendarManager.advanceTime(10, "Repouso Conjugal no Lar Seguro");
    }

    if (window.ui) {
      window.ui.showModalAlert(
        `🏰 REPOUSO CONJUGAL EM ${res.name.toUpperCase()}`,
        `<div style="display:flex; gap:16px; align-items:center;">
          <img src="${spouse ? spouse.portrait : 'assets/portraits/lyra.jpg'}" alt="Spouse" style="width:85px; height:85px; border-radius:8px; border:2px solid #10b981; object-fit:cover;"/>
          <div>
            <p style="font-size:15px; color:#fef3c7;">Você e <strong>${spouse ? spouse.name : 'seu cônjuge'}</strong> desfrutam da paz e segurança da sua residência.</p>
            <p class="mt-2" style="font-size:13px; color:#10b981;"><strong>Benefício do Lar:</strong> ${res.perk} (+100 HP, +100 Vontade, -100% Fadiga, -10% Corrupção)</p>
          </div>
        </div>`,
        "Acordar Revigorados"
      );
      window.ui.playSound("potion");
      window.ui.updateAllPanels();
    }
  }

  exportData() {
    return {
      npcs: JSON.parse(JSON.stringify(this.npcs)),
      residences: JSON.parse(JSON.stringify(this.residences)),
      spouseId: this.spouseId,
      activeDatingIds: [...this.activeDatingIds],
      activeEngagementId: this.activeEngagementId,
      activeResidenceId: this.activeResidenceId
    };
  }
}

window.romanceManager = new RomanceManager();
