/**
 * Crônica de Aethelgard - Gerenciador de Missões e Narrativa Branching (quest_manager.js)
 * Controla o surgimento procedural de missões, escolhas e consequências agendadas de longo prazo.
 */

class QuestManager {
  constructor() {
    this.quests = [];
    this.completedQuests = [];
    this.activeQuests = [];
  }

  init(questsData, savedData = null) {
    if (questsData && questsData.quests) {
      this.quests = questsData.quests;
    }
    if (savedData) {
      if (savedData.completedQuests) this.completedQuests = savedData.completedQuests;
      if (savedData.activeQuests) this.activeQuests = savedData.activeQuests;
      if (savedData.quests) {
        // Atualiza status local
        savedData.quests.forEach(sq => {
          const found = this.quests.find(q => q.id === sq.id);
          if (found) found.status = sq.status;
        });
      }
    }
    this.checkAvailableQuests();
  }

  getAllQuests() {
    return this.quests;
  }

  getQuestById(id) {
    return this.quests.find(q => q.id === id);
  }

  /**
   * Verifica em tempo real quais missões devem ficar disponíveis com base nas flags atuais e localização
   */
  checkAvailableQuests() {
    const locId = window.mapManager ? window.mapManager.currentLocationId : "loc_eldoria";
    
    for (const q of this.quests) {
      if (q.status === "completed") continue;

      // Se há requisito de localização e o jogador está lá
      let meetsLoc = !q.locationReq || q.locationReq === locId;
      
      // Se há requisito de flags específicas (ex: flag_revolta_camponesa)
      let meetsFlags = true;
      if (q.reqFlags && window.flagsManager) {
        meetsFlags = window.flagsManager.checkRequirements(q.reqFlags);
      }

      if (meetsLoc && meetsFlags) {
        if (q.status === "locked") {
          q.status = "available";
          if (window.ui) window.ui.showToast(`NOVA MISSÃO DISPONÍVEL: ${q.title}`, "info");
        }
      }
    }
  }

  acceptQuest(questId) {
    const q = this.getQuestById(questId);
    if (!q || q.status !== "available") return false;

    q.status = "active";
    if (!this.activeQuests.includes(questId)) {
      this.activeQuests.push(questId);
    }

    if (window.ui) {
      window.ui.showToast(`Missão Aceita: ${q.title}`, "success");
      window.ui.playSound("skill_unlock");
      window.ui.updateAllPanels();
    }
    return true;
  }

  /**
   * Executa a escolha do jogador em uma missão e aplica todos os efeitos imediatos e agendados
   */
  completeQuestChoice(questId, choiceIndex) {
    const q = this.getQuestById(questId);
    if (!q || !q.choices || !q.choices[choiceIndex]) return false;

    const choice = q.choices[choiceIndex];
    q.status = "completed";
    this.activeQuests = this.activeQuests.filter(id => id !== questId);
    if (!this.completedQuests.includes(questId)) {
      this.completedQuests.push(questId);
    }

    // Aplicar efeitos imediatos (Efeitos Orientados a Dados)
    if (choice.effects) {
      if (choice.effects.gold && window.economyManager) {
        window.economyManager.modifyGold(choice.effects.gold);
      }
      if (choice.effects.xp && window.attributesManager) {
        window.attributesManager.gainXP(choice.effects.xp, `Missão: ${q.title}`);
      }
      if (choice.effects.skillPoints && window.attributesManager) {
        window.attributesManager.skillPoints += choice.effects.skillPoints;
      }
      if (choice.effects.dragonBond && window.dragonManager) {
        window.dragonManager.modifyBond(choice.effects.dragonBond);
      }
      if (choice.effects.corruption && window.attributesManager) {
        window.attributesManager.modifyCorruption(choice.effects.corruption);
      }
      if (choice.effects.hidden && window.hiddenAttributesManager) {
        window.hiddenAttributesManager.modifyTraits(choice.effects.hidden);
      }
      if (choice.effects.flags && window.flagsManager) {
        for (const [key, val] of Object.entries(choice.effects.flags)) {
          window.flagsManager.setFlag(key, val, `Missão (${q.title})`);
        }
      }
      if (choice.effects.rep && window.kingdomsManager && window.guildsManager) {
        for (const [targetId, delta] of Object.entries(choice.effects.rep)) {
          if (targetId.startsWith("reino_") || targetId.startsWith("imperio_") || targetId.startsWith("confederacao_") || targetId.startsWith("sultanato_")) {
            window.kingdomsManager.modifyReputation(targetId, delta);
          } else if (targetId.startsWith("guild_")) {
            window.guildsManager.modifyReputation(targetId, delta);
          }
        }
      }
      if (choice.effects.triggerSpecialChain === "merchant_robbery" && window.delayedConsequences) {
        window.delayedConsequences.triggerMerchantRobberyChain();
      }
    }

    // Agendar consequência futura se houver
    if (choice.consequence && window.delayedConsequences) {
      const c = choice.consequence;
      window.delayedConsequences.scheduleConsequence(c.delayDays || 10, c.title, c.desc, { flags: c.flags || {} }, `${q.title}: ${choice.text}`);
    }

    if (window.flagsManager) {
      window.flagsManager.setFlag(`quest_completed_${questId}`, true, "Sistema de Missões");
      window.flagsManager.setFlag(`quest_choice_${questId}`, choiceIndex, "Sistema de Missões");
    }

    if (window.ui) {
      window.ui.showModalAlert(
        `MISSÃO CONCLUÍDA: ${q.title}`,
        `<p class="quest-done-text">Você escolheu: <strong>"${choice.text}"</strong></p>` +
        `<p>Sua decisão ecoará pelas terras de Aethelgard e moldará os eventos dos próximos dias.</p>`,
        "As Cinzas Ouvem"
      );
      window.ui.playSound("dramatic_chord");
      window.ui.updateAllPanels();
    }
    return true;
  }

  exportData() {
    return {
      quests: JSON.parse(JSON.stringify(this.quests)),
      completedQuests: [...this.completedQuests],
      activeQuests: [...this.activeQuests]
    };
  }
}

window.questManager = new QuestManager();
