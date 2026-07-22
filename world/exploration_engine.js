/**
 * Crônica de Aethelgard - Motor de Exploração e Desbloqueio (exploration_engine.js)
 * O mundo é descoberto gradualmente. Nada é dado de graça.
 */

class ExplorationEngine {
  constructor() {
    this.currentRegion = 'loc_vale_cinzas';
    this.exploredPoints = new Set(); // pontos específicos explorados
  }

  init() {
    // Nada é descoberto no início além da região inicial
    if (window.discoveryManager) {
      window.discoveryManager.discover('location', 'loc_vale_cinzas', 'Início da jornada');
    }
  }

  // Exploração de um ponto no mapa
  exploreLocation(locationId, playerLevel = 1) {
    if (!window.mapManager) return;

    const loc = window.mapManager.getLocationById(locationId);
    if (!loc) return;

    const discovered = window.discoveryManager.discover('location', locationId, 'Exploração');

    if (discovered) {
      // Recompensas de exploração
      if (window.economyManager) {
        window.economyManager.modifyGold(15 + Math.floor(playerLevel * 1.5));
      }
      if (window.attributesManager) {
        window.attributesManager.gainXP(30 + playerLevel * 8, `Explorou ${loc.name}`);
      }

      // Descobertas aleatórias / orgânicas
      this._triggerRandomDiscovery(locationId);

      // Atualiza mapa
      if (window.ui) window.ui.renderMap();
    }

    return discovered;
  }

  // Exploração de ruínas, templos, etc.
  exploreSpecialPoint(pointType, locationId) {
    const key = `${locationId}_${pointType}`;
    if (this.exploredPoints.has(key)) {
      if (window.ui) window.ui.showToast('Você já explorou este lugar.');
      return false;
    }

    this.exploredPoints.add(key);

    let rewardText = '';
    let xp = 40;

    switch (pointType) {
      case 'ruins':
        rewardText = 'Encontrou relíquias antigas.';
        if (window.inventoryManager) window.inventoryManager.addItem('mat_obsidian_crystal', 2);
        window.discoveryManager.discover('rumor', 'ancient_ruins', 'Ruínas antigas');
        xp = 65;
        break;

      case 'temple':
        rewardText = 'Descobriu um templo esquecido.';
        window.discoveryManager.discover('school', 'school_light', 'Templo da Luz');
        xp = 80;
        break;

      case 'cave':
        rewardText = 'Encontrou uma caverna com ossos de dragão.';
        window.discoveryManager.discover('rumor', 'dragon_bones', 'Ossos de dragão');
        xp = 55;
        break;

      case 'village':
        rewardText = 'Descobriu uma vila isolada.';
        window.discoveryManager.discover('location', locationId, 'Vila descoberta');
        break;
    }

    if (window.attributesManager) window.attributesManager.gainXP(xp, rewardText);
    if (window.ui) window.ui.showToast(rewardText, 'success');

    return true;
  }

  // Descobertas aleatórias ao explorar
  _triggerRandomDiscovery(locationId) {
    const roll = Math.random();

    if (roll < 0.18 && !window.discoveryManager.isDiscovered('creature', 'shadow_wolf')) {
      window.discoveryManager.discover('creature', 'shadow_wolf', 'Exploração');
      if (window.ui) window.ui.showToast('Você encontrou pegadas de uma criatura desconhecida.');
    }

    if (roll < 0.09 && !window.discoveryManager.isDiscovered('rumor', 'lost_temple')) {
      window.discoveryManager.discover('rumor', 'lost_temple', 'Exploração');
      if (window.ui) window.ui.showToast('Um mercador falou sobre um templo perdido nas montanhas.');
    }

    if (roll < 0.06 && locationId.includes('picos') && !window.discoveryManager.isDiscovered('dragon', 'dragon_zephyr')) {
      window.discoveryManager.discover('dragon', 'dragon_zephyr', 'Avistamento');
      if (window.ui) window.ui.showToast('Você avistou uma silhueta colossal cortando as nuvens...');
    }
  }

  // Requisitos para viajar para uma região
  canTravelTo(locationId) {
    const loc = window.mapManager?.getLocationById(locationId);
    if (!loc) return false;

    // Requisitos progressivos
    const reqs = {
      'loc_picos_dragao': () => this._hasSupplies() && window.affinityManager.getReputation('reino_eldor') >= 5,
      'loc_deserto_solgard': () => this._hasSupplies(3) && window.discoveryManager.isDiscovered('location', 'loc_porto_valen'),
      'loc_santuario_flutuante': () => window.discoveryManager.isDiscovered('guild', 'guild_escama') && window.affinityManager.getAffinity('npc_thalor') >= 35,
      'loc_ruinas_khaz': () => window.affinityManager.getReputation('reino_eldor') >= 15 || window.discoveryManager.isDiscovered('rumor', 'khaz_secret'),
      'loc_cidade_solgard': () => window.discoveryManager.isDiscovered('location', 'loc_deserto_solgard') && this._hasSupplies(4)
    };

    if (reqs[locationId]) {
      return reqs[locationId]();
    }

    // Regiões iniciais são sempre permitidas
    return true;
  }

  _hasSupplies(min = 2) {
    if (!window.inventoryManager) return false;
    const rations = window.inventoryManager.getItemCount('ration_food') || 0;
    return rations >= min;
  }

  // Quando o jogador descobre uma guilda ou escola
  discoverGuild(guildId) {
    return window.discoveryManager.discover('guild', guildId, 'Exploração');
  }

  discoverSchool(schoolId) {
    return window.discoveryManager.discover('school', schoolId, 'Exploração');
  }

  exportData() {
    return {
      currentRegion: this.currentRegion,
      exploredPoints: Array.from(this.exploredPoints)
    };
  }
}

window.explorationEngine = new ExplorationEngine();