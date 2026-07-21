/**
 * Crônica de Aethelgard - Sistema de Reinos, Política e Diplomacia (kingdoms.js)
 * Gerencia a economia dos reinos, guerras, corrupção, reputação e mudanças históricas autônomas.
 */

class KingdomsManager {
  constructor() {
    this.kingdoms = {};
    this.activeWars = [];
  }

  init(kingdomsData, savedData = null) {
    if (kingdomsData && kingdomsData.kingdoms) {
      kingdomsData.kingdoms.forEach(k => {
        this.kingdoms[k.id] = { ...k };
      });
    }
    if (savedData) {
      if (savedData.kingdoms) this.kingdoms = savedData.kingdoms;
      if (savedData.activeWars) this.activeWars = savedData.activeWars;
    }
    this.syncKingdomFlags();
  }

  getKingdom(id) {
    return this.kingdoms[id] || Object.values(this.kingdoms)[0];
  }

  getAllKingdoms() {
    return Object.values(this.kingdoms);
  }

  modifyReputation(kingdomId, delta) {
    const k = this.getKingdom(kingdomId);
    if (k) {
      k.reputationWithPlayer = Math.max(-100, Math.min(100, k.reputationWithPlayer + delta));
      if (window.flagsManager) {
        window.flagsManager.setFlag(`rep_${k.id}`, k.reputationWithPlayer, "Reputação Diplomática");
      }
      if (window.ui) {
        window.ui.showToast(`Reputação com ${k.name}: ${delta >= 0 ? '+' : ''}${delta} (${k.reputationWithPlayer})`, delta >= 0 ? "reputation" : "warning");
      }
    }
  }

  modifyArmyStrength(kingdomId, delta) {
    const k = this.getKingdom(kingdomId);
    if (k) {
      k.armyStrength = Math.max(0, Math.min(150, k.armyStrength + delta));
      if (window.flagsManager) {
        window.flagsManager.setFlag(`army_${k.id}`, k.armyStrength, "Força Militar");
      }
    }
  }

  modifyCorruption(kingdomId, delta) {
    const k = this.getKingdom(kingdomId);
    if (k) {
      k.corruption = Math.max(0, Math.min(100, k.corruption + delta));
      if (k.corruption > 80 && window.flagsManager) {
        window.flagsManager.setFlag(`flag_corrupcao_alta_${k.id}`, true, "Corrupção Crítica");
      }
    }
  }

  /**
   * Executado quando o tempo passa: simula o mundo vivo agindo sem o jogador
   */
  processWorldSimulation(daysPassed) {
    // A cada ~15 dias acumulados, reinos podem mudar de estado
    for (const k of Object.values(this.kingdoms)) {
      // Variação do exército com base no tesouro e corrupção
      if (k.corruption > 60 && Math.random() < 0.2) {
        k.armyStrength = Math.max(10, k.armyStrength - 2);
      }
      if (k.economyState === "Crise" && Math.random() < 0.25) {
        k.economyGoldPool = Math.max(0, k.economyGoldPool - 5000);
      }

      // Se um reino faliu ou teve revolta, checar se entra em Guerra Total
      if (k.id === "reino_eldor" && window.flagsManager && window.flagsManager.getFlag("flag_revolta_camponesa")) {
        k.economyState = "Falência e Crise Civil";
        k.corruption = Math.min(100, k.corruption + 5);
        k.armyStrength = Math.max(20, k.armyStrength - 5);
      }
    }

    // Checar se deve declarar guerra
    if (window.flagsManager && window.flagsManager.getFlag("flag_guerra_eldor_solgard") && !this.activeWars.includes("eldor_vs_solgard")) {
      this.declareWar("reino_eldor", "imperio_solgard", "A Grande Guerra do Norte");
    }

    this.syncKingdomFlags();
  }

  declareWar(kingdomAId, kingdomBId, warTitle) {
    const kA = this.getKingdom(kingdomAId);
    const kB = this.getKingdom(kingdomBId);
    if (kA && kB) {
      kA.diplomacy[kB.id] = "Guerra Total";
      kB.diplomacy[kA.id] = "Guerra Total";
      this.activeWars.push(`${kA.id}_vs_${kB.id}`);
      
      if (window.flagsManager) {
        window.flagsManager.setFlag(`guerra_${kA.id}_${kB.id}`, true, "Declaração de Guerra");
        window.flagsManager.setFlag("flag_qualquer_guerra_ativa", true, "Guerra Continental");
      }

      if (window.ui) {
        window.ui.showModalAlert(
          `ALERTA DE GUERRA CONTINENTAL: ${warTitle}`,
          `<p class="war-alert">As trombetas de ferro ressoam! O <strong>${kA.name}</strong> declarou <strong>Guerra Total</strong> contra o <strong>${kB.name}</strong>!</p>` +
          `<p>Rotas comerciais foram fechadas, a inflação disparou e soldados marcham pela fronteira.</p>`,
          "Que os Deuses nos protejam"
        );
        window.ui.playSound("war_horns");
      }
    }
  }

  syncKingdomFlags() {
    if (window.flagsManager) {
      for (const k of Object.values(this.kingdoms)) {
        window.flagsManager.setFlag(`rep_${k.id}`, k.reputationWithPlayer, "Sincronização Reinos");
        window.flagsManager.setFlag(`army_${k.id}`, k.armyStrength, "Sincronização Reinos");
        window.flagsManager.setFlag(`corruption_${k.id}`, k.corruption, "Sincronização Reinos");
      }
    }
  }

  exportData() {
    return {
      kingdoms: JSON.parse(JSON.stringify(this.kingdoms)),
      activeWars: [...this.activeWars]
    };
  }
}

window.kingdomsManager = new KingdomsManager();
