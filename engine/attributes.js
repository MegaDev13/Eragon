/**
 * Crônica de Aethelgard - Sistema de Atributos Visíveis e Derivados (attributes.js)
 * Contém os 18 atributos principais e o cálculo de todas as estatísticas de combate e exploração.
 */

class AttributesManager {
  constructor() {
    this.level = 1;
    this.xp = 0;
    this.xpNext = 100;
    this.availablePoints = 25; // Pontos iniciais para distribuir na criação
    this.skillPoints = 3;

    // Os 18 Atributos Visíveis solicitados
    this.baseAttributes = {
      forca: 10,             // Força física, dano corpo a corpo, capacidade de carga
      destreza: 10,          // Agilidade, esquiva, velocidade de ataque
      inteligencia: 10,      // Potência mágica arcana, resolução de enigmas, alquimia
      sabedoria: 10,         // Percepção mística, magia de natureza/espiritual, resistência a feitiços
      carisma: 10,           // Persuasão, preços comerciais, lealdade de companheiros
      constituicao: 10,      // Saúde máxima (HP), tolerância a venenos e cansaço
      vontade: 10,           // Energia mágica (Willpower/Mana), resistência a controle mental
      percepcao: 10,         // Detecção de armadilhas, emboscadas e segredos no mapa
      sorte: 10,             // Chance de acertos críticos, achados raros de itens e eventos felizes
      afinidadeMagica: 10,   // Velocidade de canalização e redução de fadiga mágica
      dominioElemental: 10,  // Eficácia de magias de Fogo, Água, Ar e Terra
      dominioMarcial: 10,    // Maestria com armas brancas, contra-ataques e posturas
      lideranca: 10,         // Moral de exércitos, tropas e companheiros em batalha
      empatia: 10,           // Vínculo inicial com dragões e leitura emocional de NPCs
      furtividade: 10,       // Capacidade de se mover em silêncio, roubos e acertos surpresa
      precisao: 10,          // Acerto com arcos, bestas e pontos fracos inimigos
      resistenciaMental: 10, // Defesa direta contra terror, corrupção arcana e ilusões
      resistenciaFisica: 10  // Redução de dano cortante, contundente e perfurante
    };

    // Estatísticas Derivadas (calculadas em tempo real)
    this.derived = {};
    this.currentHP = 100;
    this.currentWillpower = 100;
    this.magicalFatigue = 0; // 0% a 100%
    this.arcaneCorruption = 0; // 0% a 100%
  }

  init(savedData = null) {
    if (savedData) {
      this.level = savedData.level || 1;
      this.xp = savedData.xp || 0;
      this.xpNext = savedData.xpNext || 100;
      this.availablePoints = savedData.availablePoints || 0;
      this.skillPoints = savedData.skillPoints || 0;
      this.baseAttributes = { ...this.baseAttributes, ...savedData.baseAttributes };
      this.currentHP = savedData.currentHP !== undefined ? savedData.currentHP : this.getMaxHP();
      this.currentWillpower = savedData.currentWillpower !== undefined ? savedData.currentWillpower : this.getMaxWillpower();
      this.magicalFatigue = savedData.magicalFatigue || 0;
      this.arcaneCorruption = savedData.arcaneCorruption || 0;
    }
    this.recalculateDerived();
  }

  /**
   * Recalcula todos os atributos derivados com base nos atributos principais
   */
  recalculateDerived() {
    const b = this.baseAttributes;
    
    // HP Máximo: 50 + (Constituição * 5) + (Força * 2) + (Level * 10)
    const maxHP = Math.floor(50 + (b.constituicao * 5) + (b.forca * 2) + (this.level * 10));
    
    // Vontade Máxima (Mana): 50 + (Vontade * 5) + (Inteligência * 3) + (Level * 8)
    const maxWillpower = Math.floor(50 + (b.vontade * 5) + (b.inteligencia * 3) + (this.level * 8));

    // Capacidade de Carga (kg): 20 + (Força * 3.5) + (Constituição * 1.5)
    const maxCarryWeight = Math.floor(20 + (b.forca * 3.5) + (b.constituicao * 1.5));

    // Chance de Crítico (%): 5% + (Sorte * 0.5) + (Precisão * 0.4) + (Destreza * 0.3)
    const critChance = Math.min(75, Number((5 + (b.sorte * 0.5) + (b.precisao * 0.4) + (b.destreza * 0.3)).toFixed(1)));

    // Velocidade de Ação / Iniciativa: 10 + Destreza + Furtividade * 0.5
    const initiative = Math.floor(10 + b.destreza + (b.furtividade * 0.5));

    // Defesa Física Base: Resistência Física + (Constituição * 0.5) + (Domínio Marcial * 0.3)
    const physicalDefense = Math.floor(b.resistenciaFisica + (b.constituicao * 0.5) + (b.dominioMarcial * 0.3));

    // Defesa Mágica Base: Resistência Mental + Sabedoria + (Vontade * 0.5)
    const magicalDefense = Math.floor(b.resistenciaMental + b.sabedoria + (b.vontade * 0.5));

    // Redução de Fadiga Mágica (% de recuperação diária): Afinidade Mágica * 1.5 + Vontade
    const fatigueRecoveryRate = Math.min(80, Math.floor(b.afinidadeMagica * 1.5 + b.vontade));

    // Multiplicador de Preços (%): 100 - (Carisma * 0.8) - (Liderança * 0.2)
    const priceDiscount = Math.min(50, Math.floor((b.carisma * 0.8) + (b.lideranca * 0.2)));

    this.derived = {
      maxHP,
      maxWillpower,
      maxCarryWeight,
      critChance,
      initiative,
      physicalDefense,
      magicalDefense,
      fatigueRecoveryRate,
      priceDiscount
    };

    // Ajustar HP e Willpower para não ultrapassar o novo máximo se tiver alterado
    if (this.currentHP > maxHP) this.currentHP = maxHP;
    if (this.currentWillpower > maxWillpower) this.currentWillpower = maxWillpower;
  }

  getMaxHP() {
    this.recalculateDerived();
    return this.derived.maxHP;
  }

  getMaxWillpower() {
    this.recalculateDerived();
    return this.derived.maxWillpower;
  }

  getAttribute(key) {
    return this.baseAttributes[key] || 10;
  }

  setAttribute(key, value) {
    if (this.baseAttributes.hasOwnProperty(key)) {
      this.baseAttributes[key] = Math.max(1, value);
      this.recalculateDerived();
    }
  }

  /**
   * Modifica um atributo visível temporal ou permanentemente e recalcula derivados
   */
  modifyAttribute(key, delta) {
    if (this.baseAttributes.hasOwnProperty(key)) {
      this.baseAttributes[key] = Math.max(1, this.baseAttributes[key] + delta);
      this.recalculateDerived();
      if (window.flagsManager) {
        window.flagsManager.setFlag(`attr_${key}`, this.baseAttributes[key], "Atualização de Atributo");
      }
    }
  }

  /**
   * Gastar ponto de atributo na criação ou subida de nível
   */
  allocatePoint(key) {
    if (this.availablePoints > 0 && this.baseAttributes.hasOwnProperty(key)) {
      this.baseAttributes[key]++;
      this.availablePoints--;
      this.recalculateDerived();
      return true;
    }
    return false;
  }

  /**
   * Ganhar experiência e checar subida de nível
   */
  gainXP(amount, reason = "") {
    this.xp += amount;
    if (window.ui) {
      window.ui.showToast(`XP +${amount} ${reason ? `(${reason})` : ''}`, "info");
    }
    while (this.xp >= this.xpNext) {
      this.levelUp();
    }
  }

  levelUp() {
    this.xp -= this.xpNext;
    this.level++;
    this.xpNext = Math.floor(this.xpNext * 1.4 + 50);
    this.availablePoints += 3;
    this.skillPoints += 2;
    
    this.recalculateDerived();
    this.currentHP = this.derived.maxHP;
    this.currentWillpower = this.derived.maxWillpower;

    if (window.ui) {
      window.ui.showToast(`NÍVEL ALCANÇADO: Nível ${this.level}! (+3 Ptos Atributo, +2 Ptos Habilidade)`, "level-up");
      window.ui.playSound("levelup");
    }

    if (window.flagsManager) {
      window.flagsManager.setFlag("player_level", this.level, "Level Up");
    }
  }

  heal(amount) {
    this.currentHP = Math.min(this.derived.maxHP, this.currentHP + amount);
  }

  takeDamage(amount, damageType = "physical") {
    let finalDamage = amount;
    if (damageType === "physical") {
      finalDamage = Math.max(1, Math.floor(amount - (this.derived.physicalDefense * 0.4)));
    } else if (damageType === "magical") {
      finalDamage = Math.max(1, Math.floor(amount - (this.derived.magicalDefense * 0.4)));
    }
    
    this.currentHP = Math.max(0, this.currentHP - finalDamage);
    return finalDamage;
  }

  restoreWillpower(amount) {
    this.currentWillpower = Math.min(this.derived.maxWillpower, this.currentWillpower + amount);
  }

  consumeWillpower(amount) {
    if (this.currentWillpower >= amount) {
      this.currentWillpower -= amount;
      return true;
    }
    return false;
  }

  modifyFatigue(delta) {
    this.magicalFatigue = Math.max(0, Math.min(100, this.magicalFatigue + delta));
  }

  modifyCorruption(delta) {
    this.arcaneCorruption = Math.max(0, Math.min(100, this.arcaneCorruption + delta));
    if (window.flagsManager) {
      window.flagsManager.setFlag("flag_corrupcao", this.arcaneCorruption, "Efeito de Magia/Decisão");
    }
  }

  exportData() {
    return {
      level: this.level,
      xp: this.xp,
      xpNext: this.xpNext,
      availablePoints: this.availablePoints,
      skillPoints: this.skillPoints,
      baseAttributes: { ...this.baseAttributes },
      currentHP: this.currentHP,
      currentWillpower: this.currentWillpower,
      magicalFatigue: this.magicalFatigue,
      arcaneCorruption: this.arcaneCorruption
    };
  }
}

window.attributesManager = new AttributesManager();
