/**
 * Crônica de Aethelgard - Gerenciador do Mapa de Exploração (map_manager.js)
 * Controla a movimentação entre regiões, dias de viagem, consumo de rações de acampamento e encontros no caminho.
 */

class MapManager {
  constructor() {
    this.locations = [];
    this.currentLocationId = "loc_eldoria";
    this.exploredLocations = ["loc_eldoria"];
    this.travelStatus = {
      isTraveling: false,
      destinationId: null,
      daysRemaining: 0
    };
  }

  init(locationsData, savedData = null) {
    if (locationsData && locationsData.locations) {
      this.locations = locationsData.locations;
    }
    if (savedData) {
      this.currentLocationId = savedData.currentLocationId || "loc_eldoria";
      this.exploredLocations = savedData.exploredLocations || ["loc_eldoria"];
      this.travelStatus = savedData.travelStatus || { isTraveling: false, destinationId: null, daysRemaining: 0 };
    }
    this.syncLocationFlags();
  }

  getCurrentLocation() {
    return this.locations.find(l => l.id === this.currentLocationId) || this.locations[0];
  }

  getLocationById(id) {
    return this.locations.find(l => l.id === id);
  }

  getConnectedLocations() {
    const current = this.getCurrentLocation();
    if (!current || !current.connectedTo) return [];
    return current.connectedTo.map(id => this.getLocationById(id)).filter(Boolean);
  }

  /**
   * Inicia a viagem rumo a um novo destino
   */
  travelTo(destinationId) {
    const dest = this.getLocationById(destinationId);
    const current = this.getCurrentLocation();

    if (!dest) return false;
    if (current && !current.connectedTo.includes(destinationId)) {
      if (window.ui) window.ui.showToast("Destino não está conectado diretamente à localização atual.", "error");
      return false;
    }

    let travelDays = dest.travelDays || 1;

    // Se tiver montaria de dragão (Vínculo >= 40) e o dragão estiver adulto/voando
    if (window.dragonManager && window.dragonManager.canFlyMount()) {
      travelDays = Math.max(1, Math.floor(travelDays / 2));
      if (window.ui) window.ui.showToast("Seu Dragão corta os céus, reduzindo o tempo de viagem pela metade!", "info");
    } else if (window.calendarManager && window.calendarManager.currentWeather.id === "snow") {
      travelDays = Math.floor(travelDays * 1.5);
      if (window.ui) window.ui.showToast("A nevasca severa retarda sua viagem pelas estradas.", "warning");
    }

    // Consumir ração de comida (se tiver inventário)
    let foodConsumed = travelDays;
    if (window.inventoryManager) {
      const hasFood = window.inventoryManager.consumeItem("ration_food", foodConsumed);
      if (!hasFood) {
        if (window.ui) window.ui.showToast("Você não possui rações suficientes! Viajar com fome consome HP excessivo.", "warning");
        if (window.attributesManager) {
          window.attributesManager.takeDamage(foodConsumed * 15, "physical");
        }
      }
    }

    // Passar o tempo de viagem
    if (window.calendarManager) {
      window.calendarManager.advanceTime(travelDays * 24, `Viagem para ${dest.name}`);
    }

    this.currentLocationId = destinationId;
    if (!this.exploredLocations.includes(destinationId)) {
      this.exploredLocations.push(destinationId);
      if (window.attributesManager) window.attributesManager.gainXP(50, `Descoberta: ${dest.name}`);
    }

    this.syncLocationFlags();

    if (window.ui) {
      window.ui.showToast(`Você chegou em: ${dest.name}`, "success");
      window.ui.playSound("travel");
      window.ui.updateAllPanels();
    }

    // Checar se há evento de viagem ou combate por perigo da região
    this.checkForTravelEncounter(dest);
    return true;
  }

  checkForTravelEncounter(location) {
    const danger = location.dangerLevel || 1;
    // Quanto maior o perigo, maior a chance de combate ou evento perigoso
    const roll = Math.random() * 10;
    
    // Se o jogador tem atributo Sorte ou Furtividade alto, a chance de emboscada diminui
    const luckBonus = window.attributesManager ? (window.attributesManager.getAttribute("sorte") - 10) * 0.2 : 0;
    const stealthBonus = window.attributesManager ? (window.attributesManager.getAttribute("furtividade") - 10) * 0.2 : 0;

    if (roll < (danger * 1.2) - luckBonus - stealthBonus) {
      // 50% chance de combate, 50% chance de evento narrativo da região
      if (Math.random() < 0.5 && window.combatManager) {
        window.combatManager.triggerRegionalEncounter(location.region);
      } else if (window.eventsEngine) {
        window.eventsEngine.triggerRegionalEvent(location.id);
      }
    } else {
      // Chance de evento pacífico/curioso
      if (Math.random() < 0.35 && window.eventsEngine) {
        window.eventsEngine.triggerExplorationEvent();
      }
    }
  }

  syncLocationFlags() {
    const current = this.getCurrentLocation();
    if (window.flagsManager && current) {
      window.flagsManager.setFlag("current_location", current.id, "Mapa");
      window.flagsManager.setFlag("current_region", current.region, "Mapa");
      window.flagsManager.setFlag(`explored_${current.id}`, true, "Mapa");
      window.flagsManager.setFlag("location_danger", current.dangerLevel, "Mapa");
    }
  }

  exportData() {
    return {
      currentLocationId: this.currentLocationId,
      exploredLocations: [...this.exploredLocations],
      travelStatus: { ...this.travelStatus }
    };
  }
}

window.mapManager = new MapManager();
