/**
 * Crônica de Aethelgard - Sistema de Afinidade e Relações (affinity_manager.js)
 * Progressão baseada em confiança, respeito e laços reais.
 * Ninguém entra na Party sem conquistar o direito.
 */

class AffinityManager {
  constructor() {
    this.affinities = {};          // npcId -> valor
    this.relationshipStages = {};  // npcId -> stage
    this.personalQuests = {};      // npcId -> estado da missão pessoal
    this.reputation = {
      global: 0,
      kingdoms: {},
      guilds: {}
    };
  }

  init(savedData = null) {
    if (savedData) {
      this.affinities = savedData.affinities || {};
      this.relationshipStages = savedData.relationshipStages || {};
      this.personalQuests = savedData.personalQuests || {};
      this.reputation = savedData.reputation || { global: 0, kingdoms: {}, guilds: {} };
    } else {
      // Começa tudo neutro ou desconhecido
      this.affinities = {};
      this.relationshipStages = {};
      this.personalQuests = {};
    }
  }

  // Valor atual de afinidade
  getAffinity(npcId) {
    return this.affinities[npcId] || 0;
  }

  // Estágio atual (0-100)
  getStage(npcId) {
    const affinity = this.getAffinity(npcId);
    if (affinity >= 80) return 'companion';
    if (affinity >= 60) return 'great_ally';
    if (affinity >= 40) return 'friend';
    if (affinity >= 20) return 'known';
    return 'stranger';
  }

  // Modifica afinidade (pode ser positiva ou negativa)
  modifyAffinity(npcId, amount, reason = '') {
    if (!this.affinities[npcId]) this.affinities[npcId] = 0;

    const old = this.affinities[npcId];
    this.affinities[npcId] = Math.max(0, Math.min(100, this.affinities[npcId] + amount));

    const newStage = this.getStage(npcId);

    // Registra evento importante quando muda de estágio
    if (newStage !== this.relationshipStages[npcId]) {
      this.relationshipStages[npcId] = newStage;
      this._triggerRelationshipEvent(npcId, newStage, reason);
    }

    // Feedback
    if (window.ui && Math.abs(amount) >= 5) {
      const sign = amount > 0 ? '+' : '';
      window.ui.showToast(`${sign}${amount} Afinidade com ${this._getNPCName(npcId)}`, amount > 0 ? 'success' : 'warning');
    }

    console.log(`[Affinity] ${npcId}: ${old} → ${this.affinities[npcId]} (${reason})`);
  }

  // Requisito mínimo para entrar na Party
  canRecruit(npcId) {
    const affinity = this.getAffinity(npcId);
    const stage = this.getStage(npcId);

    // Requisitos base
    if (affinity < 65) return false;
    if (stage !== 'great_ally' && stage !== 'companion') return false;

    // Requisitos específicos por NPC (podem ser expandidos)
    const specialReqs = {
      'rom_lyra': () => this.reputation.kingdoms['reino_eldor'] >= 40,
      'npc_thalor': () => this.getAffinity('npc_thalor') >= 75 && window.discoveryManager.isDiscovered('school', 'school_arcane'),
      'npc_borin': () => window.discoveryManager.isDiscovered('location', 'loc_cidadela_ferro'),
      'npc_vorak': () => this.reputation.kingdoms['horda_khaz'] >= 30
    };

    if (specialReqs[npcId]) {
      return specialReqs[npcId]();
    }

    return true;
  }

  // Avança missão pessoal do NPC
  advancePersonalQuest(npcId, newState) {
    if (!this.personalQuests[npcId]) this.personalQuests[npcId] = 'available';

    this.personalQuests[npcId] = newState;

    // Bônus de afinidade ao completar etapas
    if (newState === 'completed') {
      this.modifyAffinity(npcId, 25, 'Completou missão pessoal');
    }

    if (window.ui) window.ui.showToast(`Missão pessoal de ${this._getNPCName(npcId)} atualizada!`);
  }

  getPersonalQuestState(npcId) {
    return this.personalQuests[npcId] || 'available';
  }

  // Reputação com reinos e guildas
  modifyReputation(targetId, amount) {
    if (targetId.startsWith('reino_') || targetId.startsWith('imperio_')) {
      if (!this.reputation.kingdoms[targetId]) this.reputation.kingdoms[targetId] = 0;
      this.reputation.kingdoms[targetId] = Math.max(-100, Math.min(100, this.reputation.kingdoms[targetId] + amount));
    } else if (targetId.startsWith('guild_')) {
      if (!this.reputation.guilds[targetId]) this.reputation.guilds[targetId] = 0;
      this.reputation.guilds[targetId] = Math.max(0, Math.min(100, this.reputation.guilds[targetId] + amount));
    } else {
      this.reputation.global = Math.max(-100, Math.min(100, this.reputation.global + amount));
    }

    // Descoberta de facção
    if (window.discoveryManager && amount > 5) {
      window.discoveryManager.discover('faction', targetId, 'Reputação');
    }
  }

  getReputation(targetId) {
    if (targetId.startsWith('reino_') || targetId.startsWith('imperio_')) {
      return this.reputation.kingdoms[targetId] || 0;
    }
    if (targetId.startsWith('guild_')) {
      return this.reputation.guilds[targetId] || 0;
    }
    return this.reputation.global;
  }

  // Evento de mudança de estágio
  _triggerRelationshipEvent(npcId, stage, reason) {
    const name = this._getNPCName(npcId);

    let message = '';
    switch (stage) {
      case 'known': message = `Você agora conhece melhor ${name}.`; break;
      case 'friend': message = `${name} considera você um amigo.`; break;
      case 'great_ally': message = `${name} tornou-se um grande aliado.`; break;
      case 'companion': message = `${name} está disposto a viajar com você!`; break;
    }

    if (message && window.ui) {
      window.ui.showToast(message, 'success');
    }

    // Dispara evento para narrativa / party
    if (window.eventsEngine) {
      window.eventsEngine.triggerRelationshipEvent(npcId, stage);
    }
  }

  _getNPCName(npcId) {
    if (window.npcsManager) {
      const npc = window.npcsManager.getNPC(npcId);
      if (npc) return npc.name;
    }
    if (window.romanceManager) {
      const rom = window.romanceManager.getRomanceNPC(npcId);
      if (rom) return rom.name;
    }
    return npcId;
  }

  exportData() {
    return {
      affinities: this.affinities,
      relationshipStages: this.relationshipStages,
      personalQuests: this.personalQuests,
      reputation: this.reputation
    };
  }
}

// Registro global
window.affinityManager = new AffinityManager();