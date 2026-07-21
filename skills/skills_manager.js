/**
 * Crônica de Aethelgard - Gerenciador de Árvores de Habilidades (skills_manager.js)
 * Controla os 17 arquétipos e o desbloqueio de vantagens passivas/ativas usando pontos de habilidade.
 */

class SkillsManager {
  constructor() {
    this.archetypes = [];
    this.unlockedSkills = [];
  }

  init(skillsData, savedData = null) {
    if (skillsData && skillsData.archetypes) {
      this.archetypes = skillsData.archetypes;
    }
    if (savedData && savedData.unlockedSkills) {
      this.unlockedSkills = savedData.unlockedSkills;
    }
    this.applySkillPerksToAttributes();
  }

  getAllArchetypes() {
    return this.archetypes;
  }

  getSkillById(skillId) {
    for (const tree of this.archetypes) {
      const sk = tree.skills.find(s => s.id === skillId);
      if (sk) return { ...sk, treeId: tree.id, treeName: tree.name };
    }
    return null;
  }

  hasSkill(skillId) {
    return this.unlockedSkills.includes(skillId);
  }

  unlockSkill(skillId) {
    const sk = this.getSkillById(skillId);
    if (!sk) return false;

    if (this.hasSkill(skillId)) {
      if (window.ui) window.ui.showToast("Você já possui esta habilidade desbloqueada.", "warning");
      return false;
    }

    // Checar pré-requisito da árvore
    if (sk.reqSkill && !this.hasSkill(sk.reqSkill)) {
      const reqObj = this.getSkillById(sk.reqSkill);
      if (window.ui) window.ui.showToast(`Requer a habilidade anterior: ${reqObj ? reqObj.name : sk.reqSkill}`, "warning");
      return false;
    }

    if (!window.attributesManager || window.attributesManager.skillPoints < sk.cost) {
      if (window.ui) window.ui.showToast(`Pontos de habilidade insuficientes (${window.attributesManager?.skillPoints || 0}/${sk.cost}).`, "warning");
      return false;
    }

    // Deduzir pontos e desbloquear
    window.attributesManager.skillPoints -= sk.cost;
    this.unlockedSkills.push(skillId);

    this.applySkillPerksToAttributes();

    if (window.flagsManager) {
      window.flagsManager.setFlag(`skill_${skillId}`, true, "Árvore de Habilidade");
    }

    if (window.ui) {
      window.ui.showToast(`HABILIDADE DESBLOQUEADA: ${sk.name}`, "success");
      window.ui.playSound("skill_unlock");
      window.ui.updateAllPanels();
    }
    return true;
  }

  applySkillPerksToAttributes() {
    if (!window.attributesManager) return;
    const attr = window.attributesManager;

    if (this.hasSkill("sk_dip_1")) {
      // Bônus diplomata
      if (!this._dipBonusApplied) {
        attr.modifyAttribute("carisma", 4);
        attr.modifyAttribute("lideranca", 4);
        this._dipBonusApplied = true;
      }
    }
    if (this.hasSkill("sk_ass_1")) {
      if (!this._assBonusApplied) {
        attr.modifyAttribute("furtividade", 5);
        this._assBonusApplied = true;
      }
    }
    attr.recalculateDerived();
  }

  exportData() {
    return {
      unlockedSkills: [...this.unlockedSkills]
    };
  }
}

window.skillsManager = new SkillsManager();
