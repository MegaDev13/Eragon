/**
 * Crônica de Aethelgard - Sistema de Combate Estratégico Baseado em Escolhas (combat_manager.js)
 * Combate tático em turnos que utiliza atributos, armas, clima, terreno, moral, companheiros e dragão.
 */

class CombatManager {
  constructor() {
    this.inCombat = false;
    this.enemy = null;
    this.turn = 1;
    this.combatLog = [];
    this.terrainBonusUsed = false;
    this.companionCooldown = 0;
    this.dragonCooldown = 0;

    this.enemyTemplates = {
      mercenary_raiders: {
        id: "mercenary_raiders",
        name: "Capitão Mercenário Renegado",
        hp: 120,
        maxHp: 120,
        damage: 28,
        defense: 25,
        magicDefense: 10,
        morale: 80,
        xpReward: 150,
        goldReward: 120,
        itemReward: "w_greataxe",
        desc: "Um veterano fortemente armado que lidera um bando de saqueadores."
      },
      shadow_wolf: {
        id: "shadow_wolf",
        name: "Lobo-Sombrio de Lúmen",
        hp: 85,
        maxHp: 85,
        damage: 32,
        defense: 12,
        magicDefense: 20,
        morale: 90,
        xpReward: 90,
        goldReward: 25,
        itemReward: "rare_meat",
        desc: "Fera corrompida com presas que causam sangramento e esquiva rápida nas trevas."
      },
      obsidian_gargoyle: {
        id: "obsidian_gargoyle",
        name: "Gárgula de Obsidiana de Aethel-Khaz",
        hp: 180,
        maxHp: 180,
        damage: 38,
        defense: 45,
        magicDefense: 40,
        morale: 100,
        xpReward: 220,
        goldReward: 180,
        itemReward: "mat_obsidian_crystal",
        desc: "Guardião ancestral feito de rocha pura e runas antigas. Resistente a ataques cortantes."
      },
      renegade_sorcerer: {
        id: "renegade_sorcerer",
        name: "Feiticeiro Renegado da Magia de Sangue",
        hp: 100,
        maxHp: 100,
        damage: 45,
        defense: 15,
        magicDefense: 50,
        morale: 75,
        xpReward: 200,
        goldReward: 150,
        itemReward: "potion_willpower",
        desc: "Conjurador implacável que absorve vitalidade a cada feitiço."
      },
      iron_titan: {
        id: "iron_titan",
        name: "Titã de Ferro e Aço-Dragão",
        hp: 300,
        maxHp: 300,
        damage: 55,
        defense: 55,
        magicDefense: 30,
        morale: 100,
        xpReward: 450,
        goldReward: 400,
        itemReward: "a_iron_plate",
        desc: "Um colosso mecânico-alquímico construído para esmagar fortalezas."
      },
      wyvern_savage: {
        id: "wyvern_savage",
        name: "Wyvern das Sombras Selvagem",
        hp: 220,
        maxHp: 220,
        damage: 48,
        defense: 30,
        magicDefense: 35,
        morale: 85,
        xpReward: 320,
        goldReward: 250,
        itemReward: "rare_meat",
        desc: "Predador alado venenoso que ataca das alturas com garras afiadas."
      }
    };
  }

  startCombat(enemyIdOrTemplate) {
    let template = typeof enemyIdOrTemplate === "string" ? (this.enemyTemplates[enemyIdOrTemplate] || window.bestiaryManager?.getCreatureById(enemyIdOrTemplate)) : enemyIdOrTemplate;
    if (!template) template = this.enemyTemplates.mercenary_raiders;

    this.inCombat = true;
    this.enemy = JSON.parse(JSON.stringify(template));
    this.turn = 1;
    this.combatLog = [];
    this.terrainBonusUsed = false;
    this.companionCooldown = 0;
    this.dragonCooldown = 0;

    this.addLog(`O COMBATE COMEÇOU! Você enfrenta: <strong>${this.enemy.name}</strong> (${this.enemy.hp} HP).`, "start");

    // Verificar se o dragão tem o perk de combate sincronizado (Telepatia Vínculo >= 60)
    if (window.dragonManager && window.dragonManager.hasPerk("telepathy") && window.dragonManager.canFlyMount()) {
      this.addLog(`Seu dragão <strong>${window.dragonManager.name}</strong> ruge e voa ao seu redor, pronto para lutar em sincronia!`, "dragon");
    }

    if (window.ui) {
      window.ui.showCombatView();
      window.ui.playSound("combat_start");
    }
  }

  triggerRegionalEncounter(regionName) {
    let enemyKey = "mercenary_raiders";
    if (regionName.includes("Eldor")) {
      const pool = ["mercenary_raiders", "greek_cerberus", "vedic_rakshasa"];
      enemyKey = pool[Math.floor(Math.random() * pool.length)];
    } else if (regionName.includes("Druídicas") || regionName.includes("Lúmen")) {
      const pool = ["shadow_wolf", "yokai_kitsune", "brazil_curupira"];
      enemyKey = pool[Math.floor(Math.random() * pool.length)];
    } else if (regionName.includes("Esquecidas") || regionName.includes("Khaz")) {
      const pool = ["obsidian_gargoyle", "nordic_jormungandr", "nordic_draugr", "greek_minotaur", "brazil_capelobo"];
      enemyKey = pool[Math.floor(Math.random() * pool.length)];
    } else if (regionName.includes("Picos") || regionName.includes("Val-Drak")) {
      const pool = ["wyvern_savage", "nordic_fenrir", "nordic_valkyrie", "yokai_tengu", "indig_thunderbird", "indig_wendigo"];
      enemyKey = pool[Math.floor(Math.random() * pool.length)];
    } else if (regionName.includes("Sul") || regionName.includes("Pântano")) {
      const pool = ["renegade_sorcerer", "yokai_jorogumo", "brazil_mapinguari", "brazil_iara", "afro_tokoloshe"];
      enemyKey = pool[Math.floor(Math.random() * pool.length)];
    } else if (regionName.includes("Solgard") || regionName.includes("Aramis")) {
      const pool = ["iron_titan", "egypt_anubis", "egypt_sphinx", "egypt_ammit", "egypt_apophis", "greek_chimera", "afro_grootslang", "afro_anansi", "vedic_asura"];
      enemyKey = pool[Math.floor(Math.random() * pool.length)];
    }

    this.startCombat(enemyKey);
  }

  addLog(message, type = "normal") {
    this.combatLog.unshift({ turn: this.turn, message, type });
    if (this.combatLog.length > 20) this.combatLog.pop();
    if (window.ui) window.ui.updateCombatLog();
  }

  /**
   * Executa a rodada com a ação tática escolhida pelo jogador
   */
  executePlayerTurn(actionType, extraData = null) {
    if (!this.inCombat || !this.enemy) return;

    const attr = window.attributesManager;
    const inv = window.inventoryManager;
    const drak = window.dragonManager;
    const weather = window.calendarManager ? window.calendarManager.currentWeather : { id: "clear" };

    let playerDamage = 0;
    let defenseMultiplier = 1.0;
    let actionSummary = "";

    // Ações do Jogador
    if (actionType === "attack_standard") {
      const weaponDmg = inv && inv.equippedWeapon ? inv.equippedWeapon.dano : 15;
      const strBonus = (attr.getAttribute("forca") - 10) * 1.5;
      const marBonus = (attr.getAttribute("dominioMarcial") - 10) * 1.2;
      playerDamage = Math.max(5, Math.floor(weaponDmg + strBonus + marBonus));

      // Checar crítico
      const rollCrit = Math.random() * 100;
      if (rollCrit < attr.derived.critChance) {
        playerDamage = Math.floor(playerDamage * 2);
        actionSummary = `GOLPE CRÍTICO COM ${inv.equippedWeapon ? inv.equippedWeapon.name : 'PUNHOS'}!`;
        if (window.combatVFX) window.combatVFX.triggerScreenShake("crit");
      } else {
        actionSummary = `Ataque Padrão com ${inv.equippedWeapon ? inv.equippedWeapon.name : 'Punhos'}.`;
        if (window.combatVFX) window.combatVFX.triggerScreenShake("heavy");
      }
      if (inv) inv.degradeWeapon(1);

    } else if (actionType === "attack_heavy") {
      const weaponDmg = inv && inv.equippedWeapon ? inv.equippedWeapon.dano : 15;
      const strBonus = (attr.getAttribute("forca") - 10) * 2.0;
      playerDamage = Math.max(10, Math.floor((weaponDmg * 1.5) + strBonus));

      this.enemy.defense = Math.max(5, Math.floor(this.enemy.defense * 0.85));
      this.enemy.morale = Math.max(0, this.enemy.morale - 15);
      actionSummary = `GOLPE PESADO QUEBRA-ESCUDO! Você abalou a defesa e a moral inimiga.`;
      if (inv) inv.degradeWeapon(2);
      defenseMultiplier = 1.3;
      if (window.combatVFX) window.combatVFX.triggerScreenShake("crit");

    } else if (actionType === "attack_defensive") {
      const weaponDmg = inv && inv.equippedWeapon ? inv.equippedWeapon.dano : 15;
      playerDamage = Math.max(3, Math.floor(weaponDmg * 0.7));
      defenseMultiplier = 0.4;
      actionSummary = `Ataque com Postura Defensiva (Defesa +60%).`;
      if (inv) inv.degradeWeapon(1);
      if (window.combatVFX) window.combatVFX.triggerScreenShake("heavy");

    } else if (actionType === "cast_spell" && extraData) {
      const res = window.magicManager.castSpell(extraData, true);
      if (!res.success) {
        if (window.ui) window.ui.showToast(res.reason, "warning");
        return;
      }
      const spell = res.spell;
      let rawSpellDmg = spell.damage || 0;
      const intBonus = (attr.getAttribute("inteligencia") - 10) * 2.0;
      const elemBonus = (attr.getAttribute("dominioElemental") - 10) * 1.5;
      playerDamage = Math.max(5, Math.floor(rawSpellDmg + intBonus + elemBonus));

      if (spell.element === "Fogo" && weather.id === "rain") playerDamage = Math.floor(playerDamage * 0.75);
      if (spell.element === "Fogo" && weather.id === "clear") playerDamage = Math.floor(playerDamage * 1.15);
      if (spell.element === "Ar" && weather.id === "storm") playerDamage = Math.floor(playerDamage * 1.45);

      actionSummary = `Conjurou Feitiço Arcano: ${spell.name}!`;
      if (spell.healAmount) {
        attr.heal(spell.healAmount);
        actionSummary += ` (+${spell.healAmount} HP recuperados).`;
      }
      if (window.combatVFX) {
        window.combatVFX.spawnSpellVFX(spell.element, window.innerWidth * 0.3, window.innerHeight * 0.6, window.innerWidth * 0.65, window.innerHeight * 0.35);
        window.combatVFX.triggerScreenShake("crit");
      }

    } else if (actionType === "command_dragon") {
      if (!drak || !drak.hasDragon || drak.isSick || this.dragonCooldown > 0) {
        if (window.ui) window.ui.showToast("Seu dragão não está em condições ou está em tempo de recarga (2 turnos).", "warning");
        return;
      }
      const dragonDmg = Math.floor(45 + (drak.weight * 0.2) + (drak.bond * 0.5));
      playerDamage = dragonDmg;
      this.dragonCooldown = 3;
      actionSummary = `COMANDO DO DRAGÃO: ${drak.name} mergulha e dispara seu Sopro Elemental sobre o inimigo!`;
      if (window.combatVFX) {
        window.combatVFX.spawnSpellVFX(drak.speciesData?.elemento || "Fogo", window.innerWidth * 0.2, window.innerHeight * 0.4, window.innerWidth * 0.65, window.innerHeight * 0.35);
        window.combatVFX.triggerScreenShake("crit");
      }

    } else if (actionType === "use_terrain") {
      if (this.terrainBonusUsed) {
        if (window.ui) window.ui.showToast("Você já aproveitou a vantagem do terreno nesta batalha.", "warning");
        return;
      }
      playerDamage = 50 + Math.floor((attr.getAttribute("percepcao") - 10) * 2);
      this.terrainBonusUsed = true;
      this.enemy.morale = Math.max(0, this.enemy.morale - 25);
      actionSummary = `VANTAGEM DO TERRENO! Você derruba pilares de pedra sobre o oponente, atordoando-o!`;

    } else if (actionType === "companion_assist") {
      if (!window.guildsManager || window.guildsManager.activeCompanions.length === 0 || this.companionCooldown > 0) {
        if (window.ui) window.ui.showToast("Sem companheiros de guilda disponíveis ou em recarga (3 turnos).", "warning");
        return;
      }
      const comp = window.guildsManager.activeCompanions[0];
      playerDamage = 35;
      attr.heal(25);
      this.companionCooldown = 3;
      actionSummary = `COBERTURA DO COMPANHEIRO: ${comp.name} ataca o flanco do inimigo e cobre sua retaguarda (+25 HP)!`;

    } else if (actionType === "companion_skill" && extraData) {
      const compObj = window.partyManager ? window.partyManager.getCompanion(extraData) : null;
      if (!compObj || !compObj.combatSkill) {
        if (window.ui) window.ui.showToast("Companheiro não encontrado ou sem habilidade tática disponível.", "warning");
        return;
      }
      if (compObj.combatSkill.cd > 0) {
        if (window.ui) window.ui.showToast(`A habilidade de ${compObj.name} está em recarga (${compObj.combatSkill.cd} turnos).`, "warning");
        return;
      }

      const sk = compObj.combatSkill;
      playerDamage = sk.dmg || 40;
      sk.cd = sk.maxCd || 2;

      // Efeitos especiais de cada companheiro no grupo
      if (sk.name.includes("Quebra")) {
        this.enemy.defense = Math.max(5, Math.floor(this.enemy.defense * 0.7));
      } else if (sk.name.includes("Barreira") || sk.name.includes("Restauração")) {
        attr.restoreWillpower(40);
        defenseMultiplier = 0.6;
      } else if (sk.name.includes("Defesa") || sk.name.includes("Investida")) {
        defenseMultiplier = 0.5;
      } else if (sk.name.includes("Simbiótica") || sk.name.includes("Cura")) {
        attr.heal(60);
      }

      actionSummary = `⚔️ COMANDO DE PARTY (${compObj.name}): ${sk.name}! (${sk.effect})`;
      if (window.combatVFX) {
        window.combatVFX.spawnSpellVFX("Fogo", window.innerWidth * 0.25, window.innerHeight * 0.5, window.innerWidth * 0.65, window.innerHeight * 0.35);
        window.combatVFX.triggerScreenShake("heavy");
      }

    } else if (actionType === "retreat") {
      const fleeChance = Math.min(85, 40 + (attr.getAttribute("destreza") * 2) - (inv.getTotalWeight() * 0.5));
      if (Math.random() * 100 < fleeChance) {
        this.addLog("Você recuou com sucesso para o acampamento seguro!", "success");
        this.endCombat(false, true);
        return;
      } else {
        this.addLog("O inimigo bloqueia sua rota de fuga! O recuo falhou!", "error");
        defenseMultiplier = 1.3;
      }
    }

    // Aplicar dano da ação do jogador ao inimigo
    if (playerDamage > 0) {
      const finalEnemyDmg = Math.max(1, Math.floor(playerDamage - (this.enemy.defense * 0.3)));
      this.enemy.hp = Math.max(0, this.enemy.hp - finalEnemyDmg);
      this.addLog(`${actionSummary} Você causou <strong>${finalEnemyDmg}</strong> de dano ao ${this.enemy.name}. (${this.enemy.hp}/${this.enemy.maxHp} HP restantes)`, "player-action");
      window.ui.playSound("sword_clash");
    } else if (actionType !== "retreat") {
      this.addLog(actionSummary, "player-action");
    }

    // Checar se o inimigo morreu ou se rendeu por moral 0
    if (this.enemy.hp <= 0) {
      this.addLog(`<strong>${this.enemy.name} FOI DERROTADO!</strong>`, "victory");
      this.endCombat(true, false);
      return;
    } else if (this.enemy.morale <= 0 && Math.random() < 0.6) {
      this.addLog(`Sua ferocidade quebrou a vontade de <strong>${this.enemy.name}</strong>! O inimigo larga as armas e se rende!`, "victory");
      this.endCombat(true, false, true);
      return;
    }

    // Ataque do Inimigo
    let enemyRawDmg = Math.floor(this.enemy.damage * defenseMultiplier);
    // Se o dragão tem o perk Telepathy, absorve parte do dano
    if (drak && drak.hasPerk("telepathy") && Math.random() < 0.3) {
      enemyRawDmg = Math.floor(enemyRawDmg * 0.4);
      this.addLog(`Seu dragão ${drak.name} intercepta parte do golpe inimigo com suas escamas!`, "dragon");
    }

    const actualPlayerDamageTaken = attr.takeDamage(enemyRawDmg, "physical");
    this.addLog(`<strong>${this.enemy.name}</strong> contra-ataca com furor! Você recebe <strong>${actualPlayerDamageTaken}</strong> de dano. (${attr.currentHP}/${attr.derived.maxHP} HP restantes)`, "enemy-action");

    // Checar se o jogador morreu
    if (attr.currentHP <= 0) {
      this.addLog(`<strong>VOCÊ CAIU EM BATALHA...</strong>`, "defeat");
      this.endCombat(false, false);
      return;
    }

    // Reduzir cooldowns e avançar turno
    if (this.companionCooldown > 0) this.companionCooldown--;
    if (this.dragonCooldown > 0) this.dragonCooldown--;
    if (window.partyManager) {
      window.partyManager.getActivePartyMembers().forEach(c => {
        if (c.combatSkill && c.combatSkill.cd > 0) c.combatSkill.cd--;
      });
    }
    this.turn++;
    if (window.ui) window.ui.updateCombatView();
  }

  endCombat(victory, fled = false, surrendered = false) {
    this.inCombat = false;
    const attr = window.attributesManager;
    const inv = window.inventoryManager;

    if (victory) {
      const xp = this.enemy.xpReward || 100;
      const gold = this.enemy.goldReward || 50;
      attr.gainXP(xp, `Vitória sobre ${this.enemy.name}`);
      inv.gold += gold;
      
      let itemMsg = "";
      if (this.enemy.itemReward && Math.random() < 0.6) {
        inv.addItem(this.enemy.itemReward, 1);
        const tmpl = inv.getItemTemplate(this.enemy.itemReward);
        itemMsg = ` e espólio: +1x ${tmpl ? tmpl.name : this.enemy.itemReward}`;
      }

      if (surrendered && window.hiddenAttributesManager) {
        window.hiddenAttributesManager.modifyTraits({ compaixão: 5, honra: 5 });
      }

      if (window.flagsManager) {
        window.flagsManager.setFlag(`defeated_${this.enemy.id}`, true, "Vitória de Combate");
      }

      if (window.ui) {
        window.ui.showModalAlert(
          surrendered ? "VITÓRIA POR RENDIÇÃO!" : "VITÓRIA GLORIOSA!",
          `<p class="victory-text">Você superou <strong>${this.enemy.name}</strong> em combate tático!</p>` +
          `<p><strong>Recompensas:</strong> +${xp} XP, +${gold} Ouro${itemMsg}</p>`,
          "Continuar Jornada"
        );
        window.ui.playSound("victory");
        window.ui.closeCombatView();
      }
    } else if (fled) {
      if (window.ui) {
        window.ui.showToast("Você recuou do combate e voltou ao mapa.", "warning");
        window.ui.closeCombatView();
      }
    } else {
      // Jogador Derrotado
      if (window.endingsManager && window.flagsManager && window.flagsManager.getFlag("permadeath_active")) {
        window.endingsManager.triggerDeathEnding("Morto em combate por " + this.enemy.name);
      } else {
        // Renascimento no último acampamento / perda de ouro
        attr.currentHP = Math.floor(attr.derived.maxHP * 0.4);
        attr.currentWillpower = Math.floor(attr.derived.maxWillpower * 0.4);
        const goldLost = Math.floor(inv.gold * 0.3);
        inv.gold = Math.max(0, inv.gold - goldLost);

        if (window.ui) {
          window.ui.showModalAlert(
            "VOCÊ FOI DERROTADO",
            `<p class="defeat-text">Sua visão escurece diante de <strong>${this.enemy.name}</strong>. Por sorte, caçadores amigáveis encontraram seu corpo ferido e o levaram ao acampamento da aldeia.</p>` +
            `<p><strong>Perdas por exaustão e resgate:</strong> -${goldLost} Ouro.</p>`,
            "Levantar-se mais forte"
          );
          window.ui.playSound("overload");
          window.ui.closeCombatView();
        }
      }
    }
    if (window.ui) window.ui.updateAllPanels();
  }
}

window.combatManager = new CombatManager();
