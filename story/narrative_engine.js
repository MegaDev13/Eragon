/**
 * Crônica de Aethelgard - Motor de Narrativa Linear e Ramificada (narrative_engine.js)
 * Gerencia os capítulos do modo história, cenas em pergaminho, retratos e transição para o Sandbox Livre.
 */

class NarrativeEngine {
  constructor() {
    this.chapters = [];
    this.currentChapterId = "chap_1_prologue";
    this.currentSceneId = "scene_1_1";
    this.inStoryMode = false;
    this.storyHistory = [];
  }

  init(storyData, savedData = null) {
    if (storyData && storyData.chapters) {
      this.chapters = storyData.chapters;
    }
    if (savedData) {
      this.currentChapterId = savedData.currentChapterId || "chap_1_prologue";
      this.currentSceneId = savedData.currentSceneId || "scene_1_1";
      this.inStoryMode = savedData.inStoryMode !== undefined ? savedData.inStoryMode : false;
      this.storyHistory = savedData.storyHistory || [];
    }
  }

  getCurrentChapter() {
    return this.chapters.find(c => c.id === this.currentChapterId) || this.chapters[0];
  }

  getCurrentScene() {
    const chap = this.getCurrentChapter();
    if (!chap || !chap.scenes) return null;
    return chap.scenes.find(s => s.id === this.currentSceneId) || chap.scenes[0];
  }

  startPrologue() {
    this.currentChapterId = "chap_1_prologue";
    this.currentSceneId = "scene_1_1";
    this.inStoryMode = true;
    if (window.ui) {
      window.ui.changeTab("story");
      window.ui.playSound("dramatic_chord");
    }
  }

  /**
   * Executa a escolha na cena de história atual e avança a narrativa
   */
  chooseSceneOption(choiceIndex) {
    const scene = this.getCurrentScene();
    if (!scene || !scene.choices || !scene.choices[choiceIndex]) return false;

    const choice = scene.choices[choiceIndex];

    // Registrar no histórico
    this.storyHistory.unshift({
      timestamp: new Date().toISOString(),
      chapter: this.getCurrentChapter()?.title || "",
      scene: scene.title,
      choiceText: choice.text
    });

    // Aplicar Efeitos
    if (choice.effects) {
      const ef = choice.effects;
      if (ef.xp && window.attributesManager) window.attributesManager.gainXP(ef.xp, `História: ${scene.title}`);
      if (ef.gold && window.economyManager) window.economyManager.modifyGold(ef.gold);
      if (ef.dragonBond && window.dragonManager) window.dragonManager.modifyBond(ef.dragonBond);
      if (ef.dragonMood && window.dragonManager) window.dragonManager.mood = Math.max(0, Math.min(100, window.dragonManager.mood + ef.dragonMood));
      if (ef.corruption && window.attributesManager) window.attributesManager.modifyCorruption(ef.corruption);
      if (ef.attrMod && window.attributesManager) window.attributesManager.modifyAttribute(ef.attrMod.key, ef.attrMod.delta);
      if (ef.hidden && window.hiddenAttributesManager) window.hiddenAttributesManager.modifyTraits(ef.hidden);
      if (ef.items && window.inventoryManager) {
        for (const [id, count] of Object.entries(ef.items)) {
          if (count > 0) window.inventoryManager.addItem(id, count);
          else window.inventoryManager.consumeItem(id, -count);
        }
      }
      if (ef.rep && window.kingdomsManager && window.guildsManager) {
        for (const [targetId, delta] of Object.entries(ef.rep)) {
          if (targetId.startsWith("reino_") || targetId.startsWith("imperio_") || targetId.startsWith("confederacao_") || targetId.startsWith("sultanato_")) {
            window.kingdomsManager.modifyReputation(targetId, delta);
          } else if (targetId.startsWith("guild_")) {
            window.guildsManager.modifyReputation(targetId, delta);
          }
        }
      }
      if (ef.flags && window.flagsManager) {
        for (const [k, v] of Object.entries(ef.flags)) {
          window.flagsManager.setFlag(k, v, `Crônica Principal (${scene.title})`);
        }
      }
      if (ef.combatTrigger && window.combatManager) {
        window.combatManager.startCombat(ef.combatTrigger);
      }
    }

    // Avançar para a próxima cena ou transicionar para Sandbox Livre / Epílogo
    if (choice.nextScene === "sandbox_free_explore") {
      this.inStoryMode = false;
      if (window.ui) {
        window.ui.showModalAlert("⚔️ CRÔNICA EM MODO SANDBOX LIVRE", `
          <p>Você tomou sua decisão e as portas de Aethelgard se abriram para a exploração irrestrita!</p>
          <p class="mt-2">Agora você pode viajar pelas 12 regiões no <strong>Mapa</strong>, recrutar aliados nas <strong>Guildas</strong>, conversar na <strong>Fogueira</strong>, aprender no <strong>Grimório</strong> ou clicar na aba <strong>📖 Crônica Principal</strong> sempre que quiser prosseguir para os próximos capítulos da história central.</p>
        `, "Explorar Aethelgard Livremente", () => {
          window.ui.changeTab("map");
          window.ui.updateAllPanels();
        });
      }
    } else if (choice.nextScene === "trigger_endings_manager_now") {
      if (window.endingsManager) {
        window.endingsManager.triggerRetirementEnding();
      } else if (window.ui) {
        window.ui.changeTab("save");
      }
    } else if (choice.nextScene) {
      // Checar se a próxima cena está no capítulo atual ou em outro
      let foundScene = null;
      for (const chap of this.chapters) {
        const sc = chap.scenes?.find(s => s.id === choice.nextScene);
        if (sc) {
          this.currentChapterId = chap.id;
          this.currentSceneId = sc.id;
          foundScene = sc;
          break;
        }
      }
      if (foundScene && window.ui) {
        window.ui.playSound("page_turn");
        window.ui.renderStoryScene();
      }
    }

    if (window.ui) window.ui.updateAllPanels();
    return true;
  }

  exportData() {
    return {
      currentChapterId: this.currentChapterId,
      currentSceneId: this.currentSceneId,
      inStoryMode: this.inStoryMode,
      storyHistory: [...this.storyHistory]
    };
  }
}

window.narrativeEngine = new NarrativeEngine();
