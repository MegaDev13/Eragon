/**
 * Crônica de Aethelgard - Gerenciador de Magia, Fadiga e Corrupção Arcana (magic_manager.js)
 * Controla as 12 escolas de magia, feitiços conhecidos, maestria e custos/riscos ao conjurar.
 */

class MagicManager {
  constructor() {
    this.schools = [];
    this.learnedSpells = ["spell_fireball", "spell_ice_lance", "spell_solar_heal", "spell_rune_weapon"];
    this.masteryLevels = {
      school_fire: 1,
      school_water: 1,
      school_earth: 1,
      school_air: 1,
      school_light: 1,
      school_shadow: 1,
      school_nature: 1,
      school_blood: 1,
      school_spirit: 1,
      school_time: 1,
      school_runic: 1,
      school_summon: 1
    };
  }

  init(spellsData, savedData = null) {
    if (spellsData && spellsData.schools) {
      this.schools = spellsData.schools;
    }
    if (savedData) {
      if (savedData.learnedSpells) this.learnedSpells = savedData.learnedSpells;
      if (savedData.masteryLevels) this.masteryLevels = { ...this.masteryLevels, ...savedData.masteryLevels };
    }
  }

  getSchool(id) {
    return this.schools.find(s => s.id === id);
  }

  getAllSchools() {
    return this.schools;
  }

  getSpellById(spellId) {
    for (const school of this.schools) {
      const sp = school.spells.find(s => s.id === spellId);
      if (sp) return { ...sp, schoolId: school.id, schoolName: school.name };
    }
    return null;
  }

  getLearnedSpellsObjects() {
    return this.learnedSpells.map(id => this.getSpellById(id)).filter(Boolean);
  }

  learnSpell(spellId) {
    if (!this.learnedSpells.includes(spellId)) {
      this.learnedSpells.push(spellId);
      const sp = this.getSpellById(spellId);
      if (window.ui) {
        window.ui.showToast(`NOVO FEITIÇO APRENDIDO: ${sp ? sp.name : spellId}`, "success");
        window.ui.playSound("spell_cast");
      }
      return true;
    }
    return false;
  }

  /**
   * Tenta conjurar um feitiço. Verifica Willpower (Mana), HP (se for magia de sangue) e Fadiga Mágica.
   * Retorna objeto com o resultado ou erro.
   */
  castSpell(spellId, isCombat = false) {
    const sp = this.getSpellById(spellId);
    if (!sp) return { success: false, reason: "Feitiço inexistente." };

    if (!window.attributesManager) return { success: false, reason: "Gerenciador de atributos inacessível." };

    const attr = window.attributesManager;

    // Checar fadiga mágica atual (se > 90%, risco severo de sobrecarga/falha)
    if (attr.magicalFatigue >= 95) {
      return { success: false, reason: "Fadiga Mágica no limite máximo (95%+)! Descanse no acampamento antes de conjurar novamente." };
    }

    // Checar custo de HP para magia de sangue
    if (sp.hpCost && attr.currentHP <= sp.hpCost) {
      return { success: false, reason: "HP insuficiente para pagar o sacrifício de sangue!" };
    }

    // Checar custo de Willpower
    let willCost = sp.cost;
    // Se tiver Afinidade Mágica alta ou Vínculo compartilhado, reduz custo
    const affinityBonus = (attr.getAttribute("afinidadeMagica") - 10) * 0.5;
    willCost = Math.max(5, Math.floor(willCost - affinityBonus));

    if (attr.currentWillpower < willCost) {
      return { success: false, reason: `Vontade/Mana insuficiente (${attr.currentWillpower}/${willCost}).` };
    }

    // Consumir custos
    attr.consumeWillpower(willCost);
    if (sp.hpCost) {
      attr.takeDamage(sp.hpCost, "physical");
    }

    // Adicionar Fadiga Mágica e Corrupção
    let fatigueAdded = sp.fatigue || 10;
    if (window.dragonManager && window.dragonManager.hasPerk("shared_magic")) {
      fatigueAdded = Math.floor(fatigueAdded / 2);
    }
    attr.modifyFatigue(fatigueAdded);

    if (sp.corruption) {
      let corrAdded = sp.corruption;
      if (window.dragonManager && window.dragonManager.hasPerk("shared_magic")) {
        corrAdded = 0; // Magia Compartilhada zera a corrupção
      }
      attr.modifyCorruption(corrAdded);
      
      if (sp.schoolId === "school_blood" && window.flagsManager) {
        window.flagsManager.setFlag("flag_usou_magia_proibida", true, "Conjurou Magia de Sangue");
      }
    }

    // Aplicar efeitos curativos ou fora de combate
    if (!isCombat && sp.healAmount) {
      attr.heal(sp.healAmount);
      if (window.ui) window.ui.showToast(`Você conjurou ${sp.name} e recuperou +${sp.healAmount} HP!`, "success");
    }

    // Risco de Sobrecarga Arcana se a fadiga ultrapassar 80%
    if (attr.magicalFatigue > 80 && Math.random() < 0.25) {
      const overloadDamage = Math.floor(attr.derived.maxHP * 0.15);
      attr.takeDamage(overloadDamage, "magical");
      if (window.ui) {
        window.ui.showToast(`SOBRECARGA ARCANA! Sua alta fadiga mágica causou um retorno de energia (-${overloadDamage} HP)!`, "error");
        window.ui.playSound("overload");
      }
    }

    return {
      success: true,
      spell: sp,
      damage: sp.damage || 0,
      healAmount: sp.healAmount || 0,
      willCost: willCost,
      fatigueAdded: fatigueAdded
    };
  }

  exportData() {
    return {
      learnedSpells: [...this.learnedSpells],
      masteryLevels: { ...this.masteryLevels }
    };
  }
}

window.magicManager = new MagicManager();
