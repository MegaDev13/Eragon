/**
 * Crônica de Aethelgard - Gerenciador de NPCs e Memória Persistente (npcs.js)
 * Cada NPC lembra se conhece o jogador, confia, odeia, tem medo, ama, já foi salvo ou traído.
 */

class NPCsManager {
  constructor() {
    this.npcs = {};
  }

  init(npcsData, savedData = null) {
    if (npcsData && npcsData.npcs) {
      npcsData.npcs.forEach(n => {
        this.npcs[n.id] = { ...n };
      });
    }
    if (savedData) {
      this.npcs = savedData;
    }
    this.syncNPCFlags();
  }

  getNPC(id) {
    return this.npcs[id] || Object.values(this.npcs)[0];
  }

  getAllNPCs() {
    return Object.values(this.npcs);
  }

  getNPCsByLocation(locationId) {
    return Object.values(this.npcs).filter(n => n.locationId === locationId && n.esta_vivo);
  }

  /**
   * Modifica a relação do jogador com um NPC e registra na memória e nas flags
   */
  modifyRelationship(npcId, changes = {}, reason = "") {
    const npc = this.getNPC(npcId);
    if (!npc) return;

    if (changes.confia !== undefined) npc.confia = Math.max(-100, Math.min(100, npc.confia + changes.confia));
    if (changes.odeia !== undefined) npc.odeia = Math.max(0, Math.min(100, npc.odeia + changes.odeia));
    if (changes.tem_medo !== undefined) npc.tem_medo = Math.max(0, Math.min(100, npc.tem_medo + changes.tem_medo));
    if (changes.ama !== undefined) npc.ama = Math.max(-100, Math.min(100, npc.ama + changes.ama));
    if (changes.conhece_jogador !== undefined) npc.conhece_jogador = changes.conhece_jogador;
    if (changes.ja_foi_salvo !== undefined) npc.ja_foi_salvo = changes.ja_foi_salvo;
    if (changes.ja_foi_traido !== undefined) npc.ja_foi_traido = changes.ja_foi_traido;
    if (changes.esta_vivo !== undefined) npc.esta_vivo = changes.esta_vivo;

    npc.conhece_jogador = true;

    // === INTEGRAÇÃO COM NOVO SISTEMA DE AFINIDADE ===
    if (window.affinityManager && changes.confia !== undefined) {
      window.affinityManager.modifyAffinity(npcId, changes.confia * 0.8, reason);
    }

    // NPC MEMORY: record the interaction
    if (window.npcRoutineManager) {
      window.npcRoutineManager.addMemory(npcId, "player_interaction", reason || "Interação com o jogador", changes.confia || 0);
    }

    // Sincronizar com flags para checagem por eventos
    if (window.flagsManager) {
      window.flagsManager.setFlag(`npc_${npc.id}_confia`, npc.confia, `Relação NPC (${reason})`);
      window.flagsManager.setFlag(`npc_${npc.id}_odeia`, npc.odeia, `Relação NPC (${reason})`);
      window.flagsManager.setFlag(`npc_${npc.id}_vivo`, npc.esta_vivo, `Status NPC`);
      window.flagsManager.setFlag(`npc_${npc.id}_salvo`, npc.ja_foi_salvo, `Status NPC`);
      window.flagsManager.setFlag(`npc_${npc.id}_traido`, npc.ja_foi_traido, `Status NPC`);
    }

    if (window.ui && reason) {
      window.ui.showToast(`Relação com ${npc.name} alterada (${reason})`, "info");
    }
  }

  getDynamicDialogue(npcId) {
    const npc = this.getNPC(npcId);
    if (!npc || !npc.esta_vivo) return "Este personagem não está mais entre nós.";

    // Se odeia ou foi traído, diálogo hostil
    if (npc.ja_foi_traido || npc.odeia >= 50 || npc.confia <= -40) {
      return npc.dialogueHostile;
    }
    // Se confia muito ou foi salvo ou ama
    if (npc.ja_foi_salvo || npc.confia >= 40 || npc.ama >= 30) {
      return npc.dialogueFriendly;
    }
    return npc.dialogueNeutral;
  }

  syncNPCFlags() {
    if (window.flagsManager) {
      for (const npc of Object.values(this.npcs)) {
        window.flagsManager.setFlag(`npc_${npc.id}_confia`, npc.confia, "Sincronização NPC");
        window.flagsManager.setFlag(`npc_${npc.id}_odeia`, npc.odeia, "Sincronização NPC");
        window.flagsManager.setFlag(`npc_${npc.id}_vivo`, npc.esta_vivo, "Sincronização NPC");
        window.flagsManager.setFlag(`npc_${npc.id}_salvo`, npc.ja_foi_salvo, "Sincronização NPC");
        window.flagsManager.setFlag(`npc_${npc.id}_traido`, npc.ja_foi_traido, "Sincronização NPC");
      }
    }
  }

  exportData() {
    return JSON.parse(JSON.stringify(this.npcs));
  }
}

window.npcsManager = new NPCsManager();
