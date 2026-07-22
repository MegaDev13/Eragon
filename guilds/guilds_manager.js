/**
 * Crônica de Aethelgard - Gerenciador de Guildas, Política Interna e Lojas (guilds_manager.js)
 * Controla reputação, cargos na hierarquia, traição, golpes internos, eleições e companheiros.
 */

class GuildsManager {
  constructor() {
    this.guilds = {};
    this.activeCompanions = []; // Lista de IDs de companheiros recrutados
    this.playerJoinedGuilds = ["guild_ferro", "guild_escama"]; // Guildas em que é membro ativo
  }

  init(guildsData, savedData = null) {
    if (guildsData && guildsData.guilds) {
      guildsData.guilds.forEach(g => {
        this.guilds[g.id] = { ...g };
      });
    }
    if (savedData) {
      if (savedData.guilds) this.guilds = savedData.guilds;
      if (savedData.activeCompanions) this.activeCompanions = savedData.activeCompanions;
      if (savedData.playerJoinedGuilds) this.playerJoinedGuilds = savedData.playerJoinedGuilds;
    }
    this.syncGuildFlags();
  }

  getGuild(id) {
    return this.guilds[id] || Object.values(this.guilds)[0];
  }

  getAllGuilds() {
    return Object.values(this.guilds);
  }

  joinGuild(guildId) {
    const g = this.getGuild(guildId);
    if (!g) return false;

    if (this.playerJoinedGuilds.includes(guildId)) {
      if (window.ui) window.ui.showToast(`Você já é membro de: ${g.name}`, "warning");
      return false;
    }

    // Checar se foi expulso antes
    if (window.flagsManager && window.flagsManager.getFlag(`flag_expulso_${guildId}`)) {
      if (window.ui) window.ui.showToast(`Sua entrada foi negada! Você foi expulso/banido de: ${g.name}`, "error");
      return false;
    }

    this.playerJoinedGuilds.push(guildId);
    g.currentRankIndex = 0;
    this.modifyReputation(guildId, 10);

    if (window.ui) {
      window.ui.showToast(`BEM-VINDO À GUILDA: ${g.name} (${g.hierarchy[0]})`, "success");
      window.ui.playSound("levelup");
      window.ui.updateAllPanels();
    }
    this.syncGuildFlags();
    return true;
  }

  modifyReputation(guildId, delta) {
    const g = this.getGuild(guildId);
    if (g) {
      g.reputation = Math.max(-100, Math.min(100, g.reputation + delta));
      if (window.flagsManager) {
        window.flagsManager.setFlag(`guild_rep_${g.id}`, g.reputation, "Reputação Guilda");
      }
      
      // Checar se subiu de cargo ou deve ser expulso
      if (g.reputation >= (g.currentRankIndex + 1) * 25 && g.currentRankIndex < g.hierarchy.length - 1) {
        this.promoteRank(guildId);
      } else if (g.reputation <= -40 && this.playerJoinedGuilds.includes(guildId)) {
        this.expelPlayer(guildId);
      }
    }
  }

  promoteRank(guildId) {
    const g = this.getGuild(guildId);
    if (!g || g.currentRankIndex >= g.hierarchy.length - 1) return false;

    g.currentRankIndex++;
    const newTitle = g.hierarchy[g.currentRankIndex];

    if (window.ui) {
      window.ui.showModalAlert(
        `PROMOÇÃO NA GUILDA: ${g.name}`,
        `<p class="rank-alert">Sua lealdade e feitos foram recompensados! Você subiu para o cargo de <strong>${newTitle}</strong>!</p>` +
        `<p>Novos itens foram liberados na loja exclusiva da guilda.</p>`,
        "Honra e Glória"
      );
      window.ui.playSound("levelup");
      window.ui.updateAllPanels();
    }
    this.syncGuildFlags();
    return true;
  }

  expelPlayer(guildId) {
    const g = this.getGuild(guildId);
    if (!g) return;

    this.playerJoinedGuilds = this.playerJoinedGuilds.filter(id => id !== guildId);
    if (window.flagsManager) {
      window.flagsManager.setFlag(`flag_expulso_${guildId}`, true, "Expulsão de Guilda");
    }

    if (window.ui) {
      window.ui.showModalAlert(
        `EXPULSO E BANIDO: ${g.name}`,
        `<p class="expel-alert">Sua reputação negativa e desonra fizeram o conselho votar por sua expulsão imediata da <strong>${g.name}</strong>!</p>` +
        `<p>Você não tem mais acesso ao quartel-general, lojas ou missões internas.</p>`,
        "Saia e não volte"
      );
      window.ui.playSound("overload");
      window.ui.updateAllPanels();
    }
    this.syncGuildFlags();
  }

  recruitCompanion(guildId) {
    const g = this.getGuild(guildId);
    if (!g || !g.companion) return false;

    if (!this.playerJoinedGuilds.includes(guildId)) {
      if (window.ui) window.ui.showToast("Entre na guilda primeiro para recrutar companheiros.", "warning");
      return false;
    }

    if (g.currentRankIndex < 1) {
      if (window.ui) window.ui.showToast("Suba para o posto de Membro (Nível 1+) para recrutar este companheiro.", "warning");
      return false;
    }

    if (this.activeCompanions.some(c => c.id === g.companion.id)) {
      if (window.ui) window.ui.showToast(`${g.companion.name} já viaja ao seu lado!`, "info");
      return false;
    }

    this.activeCompanions.push(g.companion);
    if (window.ui) {
      window.ui.showToast(`Companheiro Recrutado: ${g.companion.name} (${g.companion.bonus})`, "success");
      window.ui.playSound("skill_unlock");
      window.ui.updateAllPanels();
    }
    this.syncGuildFlags();
    return true;
  }

  /**
   * Tentar Golpe Interno para tomar o comando de uma guilda
   */
  attemptCoup(guildId) {
    const g = this.getGuild(guildId);
    if (!g) return false;

    if (!this.playerJoinedGuilds.includes(guildId)) {
      if (window.ui) window.ui.showToast("Você não é membro desta guilda para tentar um golpe.", "warning");
      return false;
    }

    // Requer Liderança ou Crueldade/Força altas
    const leaderVal = window.attributesManager ? window.attributesManager.getAttribute("lideranca") : 10;
    const crueltyVal = window.hiddenAttributesManager ? window.hiddenAttributesManager.getTrait("crueldade") : 0;

    if (g.currentRankIndex < g.hierarchy.length - 2) {
      if (window.ui) window.ui.showToast("Você precisa ser ao menos Conselheiro/Oficial superior para tentar destituir o líder em um golpe interno.", "warning");
      return false;
    }

    if (leaderVal >= 16 || crueltyVal >= 30) {
      g.currentRankIndex = g.hierarchy.length - 1; // Grão-Mestre
      this.modifyReputation(guildId, 25);
      if (window.flagsManager) {
        window.flagsManager.setFlag(`lider_${guildId}`, true, "Golpe Interno Bem-Sucedido");
      }
      if (window.ui) {
        window.ui.showModalAlert(
          `GOLPE INTERNO BEM-SUCEDIDO: ${g.name}`,
          `<p class="coup-alert">Com astúcia e lâmina firme, você destituiu o antigo líder e agora ocupa o cargo de <strong>${g.hierarchy[g.currentRankIndex]}</strong>!</p>` +
          `<p>A guilda inteira agora responde apenas aos seus comandos.</p>`,
          "Eu sou o Líder agora"
        );
        window.ui.playSound("dramatic_chord");
        window.ui.updateAllPanels();
      }
      return true;
    } else {
      this.modifyReputation(guildId, -35);
      if (window.ui) {
        window.ui.showToast("O golpe falhou! Os membros permaneceram leais ao líder e sua reputação caiu drasticamente.", "error");
        window.ui.playSound("overload");
      }
      return false;
    }
  }

  /**
   * Trair a Guilda (repassando segredos ou assassinando membros)
   */
  betrayGuild(guildId) {
    const g = this.getGuild(guildId);
    if (!g || !this.playerJoinedGuilds.includes(guildId)) return;

    if (window.flagsManager) {
      window.flagsManager.setFlag(`flag_traiu_${guildId}`, true, "Traição da Guilda");
    }
    if (window.hiddenAttributesManager) {
      window.hiddenAttributesManager.modifyTraits({ honra: -20, lealdade: -30, ganancia: 15 });
    }
    if (window.inventoryManager) {
      window.inventoryManager.gold += 350; // Pagamento da traição por guilda rival
    }

    this.expelPlayer(guildId);
  }

  buyFromExclusiveShop(guildId, itemId) {
    const g = this.getGuild(guildId);
    if (!g || !this.playerJoinedGuilds.includes(guildId)) return false;

    const shopItem = g.exclusiveShop.find(i => i.id === itemId);
    if (!shopItem) return false;

    if (g.currentRankIndex < shopItem.reqRank) {
      if (window.ui) window.ui.showToast(`Requer cargo: ${g.hierarchy[shopItem.reqRank]} para comprar este item.`, "warning");
      return false;
    }

    if (window.inventoryManager.gold < shopItem.price) {
      if (window.ui) window.ui.showToast(`Ouro insuficiente (${window.inventoryManager.gold}/${shopItem.price}).`, "warning");
      return false;
    }

    window.inventoryManager.gold -= shopItem.price;
    window.inventoryManager.addItem(itemId, 1);
    if (window.ui) window.ui.updateAllPanels();
    return true;
  }

  syncGuildFlags() {
    if (window.flagsManager) {
      for (const g of Object.values(this.guilds)) {
        window.flagsManager.setFlag(`guild_rep_${g.id}`, g.reputation, "Sincronização Guildas");
        window.flagsManager.setFlag(`guild_rank_${g.id}`, g.currentRankIndex, "Sincronização Guildas");
        window.flagsManager.setFlag(`in_guild_${g.id}`, this.playerJoinedGuilds.includes(g.id), "Sincronização Guildas");
      }
    }
  }

  exportData() {
    return {
      guilds: JSON.parse(JSON.stringify(this.guilds)),
      activeCompanions: JSON.parse(JSON.stringify(this.activeCompanions)),
      playerJoinedGuilds: [...this.playerJoinedGuilds]
    };
  }
}

window.guildsManager = new GuildsManager();
