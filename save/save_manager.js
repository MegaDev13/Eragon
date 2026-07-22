/**
 * Crônica de Aethelgard - Gerenciador de Save, Load, Export e Import JSON (save_manager.js)
 * Permite salvar automaticamente ou em slots manuais, além de exportar/importar arquivos JSON.
 */

class SaveManager {
  constructor() {
    this.currentSlot = "slot_1";
    this.autoSaveEnabled = true;
  }

  gatherFullGameState() {
    return {
      timestamp: new Date().toISOString(),
      version: "1.0.42",
      flags: window.flagsManager ? window.flagsManager.exportFlags() : {},
      attributes: window.attributesManager ? window.attributesManager.exportData() : {},
      hiddenAttributes: window.hiddenAttributesManager ? window.hiddenAttributesManager.exportData() : {},
      calendar: window.calendarManager ? window.calendarManager.exportData() : {},
      map: window.mapManager ? window.mapManager.exportData() : {},
      kingdoms: window.kingdomsManager ? window.kingdomsManager.exportData() : {},
      npcs: window.npcsManager ? window.npcsManager.exportData() : {},
      delayedConsequences: window.delayedConsequences ? window.delayedConsequences.exportData() : {},
      dragon: window.dragonManager ? window.dragonManager.exportData() : {},
      magic: window.magicManager ? window.magicManager.exportData() : {},
      inventory: window.inventoryManager ? window.inventoryManager.exportData() : {},
      skills: window.skillsManager ? window.skillsManager.exportData() : {},
      guilds: window.guildsManager ? window.guildsManager.exportData() : {},
      economy: window.economyManager ? window.economyManager.exportData() : {},
      quests: window.questManager ? window.questManager.exportData() : {},
      // NOVOS SISTEMAS DE MUNDO VIVO
      discovery: window.discoveryManager ? window.discoveryManager.exportData() : {},
      affinity: window.affinityManager ? window.affinityManager.exportData() : {},
      exploration: window.explorationEngine ? window.explorationEngine.exportData() : {},
      worldSim: window.worldSimulationManager ? window.worldSimulationManager.exportData() : {},
      npcRoutines: window.npcRoutineManager ? window.npcRoutineManager.exportData() : {},
      adventurers: window.adventurersManager ? window.adventurersManager.exportData() : {},
      chronicle: window.chronicleBook ? window.chronicleBook.exportData() : {}
    };
  }

  restoreFullGameState(saveData) {
    if (!saveData || !saveData.version) {
      if (window.ui) window.ui.showToast("Arquivo de save inválido ou corrompido.", "error");
      return false;
    }

    console.log("[SaveManager] Restaurando estado do save datado de:", saveData.timestamp);

    if (window.flagsManager) window.flagsManager.importFlags(saveData.flags);
    if (window.attributesManager) window.attributesManager.init(saveData.attributes);
    if (window.hiddenAttributesManager) window.hiddenAttributesManager.init(saveData.hiddenAttributes);
    if (window.calendarManager) window.calendarManager.init(saveData.calendar);
    if (window.mapManager) window.mapManager.init(null, saveData.map);
    if (window.kingdomsManager) window.kingdomsManager.init(null, saveData.kingdoms);
    if (window.npcsManager) window.npcsManager.init(null, saveData.npcs);
    if (window.delayedConsequences) window.delayedConsequences.init(saveData.delayedConsequences);
    if (window.dragonManager) window.dragonManager.init(null, saveData.dragon);
    if (window.magicManager) window.magicManager.init(null, saveData.magic);
    if (window.inventoryManager) window.inventoryManager.init(null, saveData.inventory);
    if (window.skillsManager) window.skillsManager.init(null, saveData.skills);
    if (window.guildsManager) window.guildsManager.init(null, saveData.guilds);
    if (window.economyManager) window.economyManager.init(saveData.economy);
    if (window.questManager) window.questManager.init(null, saveData.quests);

    // RESTORE MUNDO VIVO
    if (window.discoveryManager) window.discoveryManager.init(saveData.discovery);
    if (window.affinityManager) window.affinityManager.init(saveData.affinity);
    if (window.explorationEngine) window.explorationEngine.init(saveData.exploration);
    if (window.worldSimulationManager) window.worldSimulationManager.init(saveData.worldSim);
    if (window.npcRoutineManager) window.npcRoutineManager.init(saveData.npcRoutines);
    if (window.adventurersManager) window.adventurersManager.init(saveData.adventurers);
    if (window.chronicleBook) window.chronicleBook.init(saveData.chronicle);

    if (window.ui) {
      window.ui.showToast("Jogo carregado com sucesso!", "success");
      window.ui.playSound("levelup");
      window.ui.updateAllPanels();
    }
    return true;
  }

  saveGameToSlot(slotId = this.currentSlot) {
    try {
      const state = this.gatherFullGameState();
      localStorage.setItem("aethelgard_" + slotId, JSON.stringify(state));
      if (window.ui && slotId !== "auto") {
        window.ui.showToast(`Campanha salva no slot: ${slotId.replace('_', ' ').toUpperCase()}`, "success");
      }
      return true;
    } catch (err) {
      console.error("[SaveManager] Erro ao salvar no localStorage:", err);
      if (window.ui) window.ui.showToast("Erro ao salvar jogo no navegador. Verifique o armazenamento.", "error");
      return false;
    }
  }

  loadGameFromSlot(slotId = this.currentSlot) {
    try {
      const raw = localStorage.getItem("aethelgard_" + slotId);
      if (!raw) {
        if (window.ui) window.ui.showToast(`Nenhum save encontrado no slot ${slotId}.`, "warning");
        return false;
      }
      const data = JSON.parse(raw);
      return this.restoreFullGameState(data);
    } catch (err) {
      console.error("[SaveManager] Erro ao carregar do localStorage:", err);
      if (window.ui) window.ui.showToast("Erro ao carregar o jogo.", "error");
      return false;
    }
  }

  autoSave() {
    if (this.autoSaveEnabled) {
      this.saveGameToSlot("auto");
    }
  }

  exportSaveFile() {
    const state = this.gatherFullGameState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const dateStr = window.calendarManager ? `ano_${window.calendarManager.year}_dia_${window.calendarManager.day}` : "save";
    downloadAnchor.setAttribute("download", `aethelgard_cronica_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (window.ui) window.ui.showToast("Arquivo JSON da sua campanha exportado com sucesso!", "success");
  }

  importSaveFile(fileInputElement) {
    const file = fileInputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.restoreFullGameState(data);
      } catch (err) {
        console.error("[SaveManager] Erro ao ler arquivo JSON:", err);
        if (window.ui) window.ui.showToast("Arquivo de save inválido.", "error");
      }
    };
    reader.readAsText(file);
  }

  getSavedSlotsInfo() {
    const slots = ["slot_1", "slot_2", "slot_3", "auto"];
    const info = [];
    slots.forEach(s => {
      const raw = localStorage.getItem("aethelgard_" + s);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          info.push({
            slot: s,
            exists: true,
            timestamp: parsed.timestamp || "Desconhecido",
            level: parsed.attributes?.level || 1,
            gold: parsed.inventory?.gold || 0,
            title: parsed.hiddenAttributes?.playerTitle || "Aventureiro"
          });
        } catch (e) {
          info.push({ slot: s, exists: false });
        }
      } else {
        info.push({ slot: s, exists: false });
      }
    });
    return info;
  }
}

window.saveManager = new SaveManager();
