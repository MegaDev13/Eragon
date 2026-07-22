/**
 * Crônica de Aethelgard - Sistema Completo de Dragões (dragon_manager.js)
 * Controla o crescimento, temperamento, humor, traumas, doenças, vínculo e habilidades do dragão.
 */

class DragonManager {
  constructor() {
    this.hasDragon = true;
    this.speciesData = null;
    this.name = "Ignis, a Brasa da Alvorada";
    this.speciesId = "dragon_ignis";
    this.stage = "Filhote"; // Filhote, Jovem, Adulto, Titã Ancestral
    this.ageDays = 15;
    this.weight = 45; // Kg atual
    this.speed = 60;
    this.intelligence = 70;

    // Estado Vital e Psicológico
    this.health = 100;
    this.maxHealth = 100;
    this.hunger = 20; // 0 (satisfeito) a 100 (faminto/desesperado)
    this.mood = 80; // 0 (deprimido/rebelde) a 100 (eufórico/leal)
    this.bond = 25; // 0 a 100 (Vínculo com o Jogador)
    this.trauma = 0; // 0 a 100
    this.scars = []; // Lista de cicatrizes de batalhas
    this.isSick = false;
    this.diseaseName = null;

    this.unlockedBondPerks = [];
  }

  init(speciesList, savedData = null) {
    if (speciesList && speciesList.species) {
      this.speciesList = speciesList.species;
      this.speciesData = this.speciesList.find(s => s.id === this.speciesId) || this.speciesList[0];
    }
    if (savedData) {
      this.hasDragon = savedData.hasDragon !== undefined ? savedData.hasDragon : true;
      this.name = savedData.name || "Ignis, a Brasa da Alvorada";
      this.speciesId = savedData.speciesId || "dragon_ignis";
      this.stage = savedData.stage || "Filhote";
      this.ageDays = savedData.ageDays || 15;
      this.weight = savedData.weight || 45;
      this.speed = savedData.speed || 60;
      this.health = savedData.health !== undefined ? savedData.health : 100;
      this.hunger = savedData.hunger !== undefined ? savedData.hunger : 20;
      this.mood = savedData.mood !== undefined ? savedData.mood : 80;
      this.bond = savedData.bond !== undefined ? savedData.bond : 25;
      this.trauma = savedData.trauma || 0;
      this.scars = savedData.scars || [];
      this.isSick = savedData.isSick || false;
      this.diseaseName = savedData.diseaseName || null;

      if (this.speciesList) {
        this.speciesData = this.speciesList.find(s => s.id === this.speciesId) || this.speciesList[0];
      }
    }
    this.checkEvolutionAndPerks();
    this.syncFlags();
  }

  /**
   * Atualização diária do dragão (fome, crescimento, chance de adoecer ou trauma)
   */
  processDailyUpdate(daysPassed) {
    if (!this.hasDragon) return;

    this.ageDays += daysPassed;
    this.hunger = Math.min(100, this.hunger + (daysPassed * 12));

    // Se estiver faminto (fome > 70), humor cai e saúde sofre
    if (this.hunger > 70) {
      this.mood = Math.max(0, this.mood - (daysPassed * 8));
      this.health = Math.max(10, this.health - (daysPassed * 5));
      if (window.ui && this.hunger > 85) {
        window.ui.showToast(`SEU DRAGÃO ESTÁ FAMINTO! Sua saúde e vínculo estão diminuindo.`, "warning");
      }
    }

    // Se estiver doente, perde saúde
    if (this.isSick) {
      this.health = Math.max(5, this.health - (daysPassed * 7));
      this.mood = Math.max(0, this.mood - (daysPassed * 6));
    } else {
      // 5% de chance de adoecer a cada dia se o humor ou saúde estiverem baixos
      if ((this.hunger > 60 || this.trauma > 40) && Math.random() < 0.05) {
        this.isSick = true;
        this.diseaseName = "Febre Cinzenta de Escama";
        if (window.ui) window.ui.showToast(`Seu dragão adoeceu com ${this.diseaseName}! Cure-o no acampamento.`, "error");
      }
    }

    // Crescimento de peso e velocidade com a idade
    this.weight = Math.floor((this.speciesData?.baseWeightKg || 100) * (0.3 + (this.ageDays / 300)));
    this.checkEvolutionAndPerks();
    this.syncFlags();
  }

  feedDragon(itemKey = "ration_food") {
    if (!this.hasDragon) return false;
    let hungerRelief = 35;
    let bondGain = 3;

    if (itemKey === "dragon_elixir" || itemKey === "rare_meat") {
      hungerRelief = 80;
      bondGain = 8;
    }

    if (window.inventoryManager && window.inventoryManager.consumeItem(itemKey, 1)) {
      this.hunger = Math.max(0, this.hunger - hungerRelief);
      this.mood = Math.min(100, this.mood + 15);
      this.modifyBond(bondGain);
      if (window.ui) {
        window.ui.showToast(`${this.name} devorou a refeição com apetite feroz! (Fome -${hungerRelief}, Vínculo +${bondGain})`, "success");
        window.ui.playSound("dragon_roar");
        window.ui.updateAllPanels();
      }
      return true;
    } else {
      if (window.ui) window.ui.showToast("Item de alimentação insuficiente no inventário.", "warning");
      return false;
    }
  }

  cureDisease() {
    if (!this.isSick) return;
    if (window.inventoryManager && (window.inventoryManager.consumeItem("potion_antidote", 1) || window.inventoryManager.consumeItem("dragon_elixir", 1))) {
      this.isSick = false;
      this.diseaseName = null;
      this.mood = Math.min(100, this.mood + 20);
      this.modifyBond(5);
      if (window.ui) {
        window.ui.showToast(`${this.name} foi curado da febre! Suas escamas voltam a brilhar.`, "success");
        window.ui.updateAllPanels();
      }
    } else {
      if (window.ui) window.ui.showToast("Você precisa de um Antídoto ou Elixir Draconiano para curar seu dragão.", "warning");
    }
  }

  modifyBond(delta) {
    const oldBond = this.bond;
    this.bond = Math.max(0, Math.min(100, this.bond + delta));
    
    // Se o vínculo subiu, atualizar perks
    this.checkEvolutionAndPerks();
    this.syncFlags();
  }

  addTrauma(amount, reason = "Batalha Devastadora") {
    this.trauma = Math.min(100, this.trauma + amount);
    this.mood = Math.max(0, this.mood - amount);
    if (window.ui) window.ui.showToast(`${this.name} sofreu um trauma em combate! (${reason})`, "error");
    this.syncFlags();
  }

  addScar(scarName) {
    if (!this.scars.includes(scarName)) {
      this.scars.push(scarName);
      if (window.ui) window.ui.showToast(`${this.name} ganhou uma cicatriz de honra: ${scarName}`, "warning");
    }
  }

  checkEvolutionAndPerks() {
    // Fases de Crescimento
    if (this.ageDays < 30) this.stage = "Filhote";
    else if (this.ageDays < 90) this.stage = "Jovem";
    else if (this.ageDays < 250) this.stage = "Adulto";
    else this.stage = "Titã Ancestral";

    // Checar Desbloqueio de Vínculo (Bond Perks)
    const perks = [];
    if (this.bond >= 20) perks.push({ id: "empathy", name: "Empatia Draconiana", desc: "Percebe as intenções ocultas e emoções dos NPCs em diálogos." });
    if (this.bond >= 40) perks.push({ id: "mount", name: "Montaria Aérea Avançada", desc: "Permite voar pelo mapa, cortando o tempo de viagem à metade e evitando armadilhas de estrada." });
    if (this.bond >= 60) perks.push({ id: "telepathy", name: "Telepatia e Combate Sincronizado", desc: "O dragão ataca sincronizado em todos os turnos de combate e oferece proteção automática contra ataques fatais." });
    if (this.bond >= 80) perks.push({ id: "shared_magic", name: "Magia Compartilhada (Fusão Elemental)", desc: "Suas conjurações arcanas ganham o elemento do dragão, dobrando o dano crítico e zerando a corrupção." });
    if (this.bond >= 100) perks.push({ id: "apotheosis", name: "Apoteose Draconiana - Voo dos Titãs", desc: "A fusão perfeita entre cavaleiro e dragão. Libera o golpe supremo 'Julgamento das Cinzas'." });

    // Notificar novo perk se houver
    if (perks.length > this.unlockedBondPerks.length && window.ui && this.unlockedBondPerks.length > 0) {
      const latest = perks[perks.length - 1];
      window.ui.showModalAlert(
        `NOVO VÍNCULO DRACONIANO DESBLOQUEADO: ${latest.name}`,
        `<p class="bond-alert">Seu vínculo com <strong>${this.name}</strong> atingiu um novo patamar (${this.bond}%).</p>` +
        `<p><strong>Benefício:</strong> ${latest.desc}</p>`,
        "Incrível!"
      );
      window.ui.playSound("dragon_roar");
    }

    this.unlockedBondPerks = perks;
  }

  canFlyMount() {
    return this.hasDragon && this.bond >= 40 && (this.stage === "Adulto" || this.stage === "Titã Ancestral" || this.stage === "Jovem") && !this.isSick && this.hunger < 85;
  }

  hasPerk(perkId) {
    return this.unlockedBondPerks.some(p => p.id === perkId);
  }

  syncFlags() {
    if (window.flagsManager) {
      window.flagsManager.setFlag("flag_dragao_vivo", this.hasDragon, "Dragão");
      window.flagsManager.setFlag("dragon_bond", this.bond, "Dragão");
      window.flagsManager.setFlag("dragon_stage", this.stage, "Dragão");
      window.flagsManager.setFlag("dragon_hunger", this.hunger, "Dragão");
      window.flagsManager.setFlag("dragon_mood", this.mood, "Dragão");
      window.flagsManager.setFlag("dragon_sick", this.isSick, "Dragão");
      window.flagsManager.setFlag("flag_pacto_dragao", this.bond >= 50, "Dragão");
    }
  }

  exportData() {
    return {
      hasDragon: this.hasDragon,
      name: this.name,
      speciesId: this.speciesId,
      stage: this.stage,
      ageDays: this.ageDays,
      weight: this.weight,
      speed: this.speed,
      health: this.health,
      hunger: this.hunger,
      mood: this.mood,
      bond: this.bond,
      trauma: this.trauma,
      scars: [...this.scars],
      isSick: this.isSick,
      diseaseName: this.diseaseName
    };
  }
}

window.dragonManager = new DragonManager();
