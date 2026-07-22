/**
 * Crônica de Aethelgard - Gerenciador de Armas, Armaduras e Inventário (weapons_manager.js / inventory_manager)
 * Controla os 10 estilos de armas, desgaste, qualidade, peso, encantamentos e consumo de itens.
 */

class InventoryManager {
  constructor() {
    this.weaponsDB = [];
    this.armorsDB = [];
    this.itemsDB = [];

    // Inventário do jogador
    this.weapons = [];
    this.armors = [];
    this.items = {}; // { id: count }

    // Equipamentos ativos
    this.equippedWeapon = null;
    this.equippedArmor = null;
    this.gold = 250; // Ouro inicial
  }

  init(itemsData, savedData = null) {
    if (itemsData) {
      this.weaponsDB = itemsData.weapons || [];
      this.armorsDB = itemsData.armors || [];
      this.itemsDB = itemsData.items || [];
    }

    if (savedData) {
      this.weapons = savedData.weapons || [];
      this.armors = savedData.armors || [];
      this.items = savedData.items || {};
      this.gold = savedData.gold !== undefined ? savedData.gold : 250;
      
      if (savedData.equippedWeaponId) {
        this.equippedWeapon = this.weapons.find(w => w.id === savedData.equippedWeaponId) || null;
      }
      if (savedData.equippedArmorId) {
        this.equippedArmor = this.armors.find(a => a.id === savedData.equippedArmorId) || null;
      }
    } else {
      // Itens iniciais padrão na primeira jogada
      this.addWeapon("w_longsword");
      this.addArmor("a_iron_plate");
      this.equipWeapon("w_longsword");
      this.equipArmor("a_iron_plate");
      this.addItem("ration_food", 10);
      this.addItem("potion_health", 3);
      this.addItem("potion_willpower", 2);
    }
    this.syncFlags();
  }

  getWeaponTemplate(id) {
    return this.weaponsDB.find(w => w.id === id);
  }

  getArmorTemplate(id) {
    return this.armorsDB.find(a => a.id === id);
  }

  getItemTemplate(id) {
    return this.itemsDB.find(i => i.id === id);
  }

  addWeapon(templateId, customQuality = null) {
    const tmpl = this.getWeaponTemplate(templateId);
    if (!tmpl) return null;
    
    const newWeapon = JSON.parse(JSON.stringify(tmpl));
    newWeapon.instanceId = "w_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    if (customQuality) newWeapon.qualidade = customQuality;
    newWeapon.enchantment = null; // Encantamento rúnico
    
    this.weapons.push(newWeapon);
    if (window.ui) window.ui.showToast(`Adicionada ao inventário: ${newWeapon.name}`, "success");
    this.syncFlags();
    return newWeapon;
  }

  addArmor(templateId) {
    const tmpl = this.getArmorTemplate(templateId);
    if (!tmpl) return null;

    const newArmor = JSON.parse(JSON.stringify(tmpl));
    newArmor.instanceId = "a_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    this.armors.push(newArmor);
    if (window.ui) window.ui.showToast(`Armadura obtida: ${newArmor.name}`, "success");
    this.syncFlags();
    return newArmor;
  }

  addItem(itemId, count = 1) {
    const tmpl = this.getItemTemplate(itemId);
    if (!tmpl) return false;

    this.items[itemId] = (this.items[itemId] || 0) + count;
    if (window.ui && count > 0) window.ui.showToast(`+${count}x ${tmpl.name}`, "info");
    this.syncFlags();
    return true;
  }

  consumeItem(itemId, count = 1) {
    if (this.items[itemId] && this.items[itemId] >= count) {
      this.items[itemId] -= count;
      if (this.items[itemId] <= 0) delete this.items[itemId];
      this.syncFlags();
      return true;
    }
    return false;
  }

  useConsumable(itemId) {
    const tmpl = this.getItemTemplate(itemId);
    if (!tmpl || !this.consumeItem(itemId, 1)) return false;

    if (window.attributesManager) {
      if (tmpl.healAmount) window.attributesManager.heal(tmpl.healAmount);
      if (tmpl.willAmount) window.attributesManager.restoreWillpower(tmpl.willAmount);
      if (tmpl.fatigueRelief) window.attributesManager.modifyFatigue(-tmpl.fatigueRelief);
    }

    if (tmpl.cureDisease && window.dragonManager && window.dragonManager.isSick) {
      window.dragonManager.cureDisease();
    }

    if (window.ui) {
      window.ui.showToast(`Você usou ${tmpl.name}!`, "success");
      window.ui.playSound("potion");
      window.ui.updateAllPanels();
    }
    return true;
  }

  equipWeapon(instanceOrTemplateId) {
    const found = this.weapons.find(w => w.instanceId === instanceOrTemplateId || w.id === instanceOrTemplateId);
    if (found) {
      this.equippedWeapon = found;
      if (window.ui) window.ui.showToast(`Arma Equipada: ${found.name}`, "info");
      this.syncFlags();
      return true;
    }
    return false;
  }

  equipArmor(instanceOrTemplateId) {
    const found = this.armors.find(a => a.instanceId === instanceOrTemplateId || a.id === instanceOrTemplateId);
    if (found) {
      this.equippedArmor = found;
      if (window.ui) window.ui.showToast(`Armadura Equipada: ${found.name}`, "info");
      this.syncFlags();
      return true;
    }
    return false;
  }

  /**
   * Desgasta a arma após um golpe em combate
   */
  degradeWeapon(amount = 1) {
    if (!this.equippedWeapon) return;
    this.equippedWeapon.durabilidade.current = Math.max(0, this.equippedWeapon.durabilidade.current - amount);
    if (this.equippedWeapon.durabilidade.current === 0) {
      if (window.ui) window.ui.showToast(`ALERTA: Sua arma ${this.equippedWeapon.name} está quebrada! Repare-a no ferreiro ou acampamento.`, "error");
    }
  }

  repairWeapon(instanceId, repairAmount = 50) {
    const weapon = this.weapons.find(w => w.instanceId === instanceId || w.id === instanceId);
    if (!weapon) return false;
    
    // Consome 1 barra de ferro ou ouro
    if (this.consumeItem("mat_iron_ingot", 1)) {
      weapon.durabilidade.current = Math.min(weapon.durabilidade.max, weapon.durabilidade.current + repairAmount);
      if (window.ui) window.ui.showToast(`${weapon.name} reparada com sucesso! (${weapon.durabilidade.current}/${weapon.durabilidade.max})`, "success");
      return true;
    } else {
      if (window.ui) window.ui.showToast("Barra de Aço-Ferro necessária para o reparo.", "warning");
      return false;
    }
  }

  enchantWeapon(instanceId, enchantmentName) {
    const weapon = this.weapons.find(w => w.instanceId === instanceId || w.id === instanceId);
    if (!weapon) return false;

    if (this.consumeItem("mat_obsidian_crystal", 1)) {
      weapon.enchantment = enchantmentName;
      weapon.dano = Math.floor(weapon.dano * 1.2);
      if (window.ui) window.ui.showToast(`${weapon.name} agora possui o Encantamento: ${enchantmentName}! (+20% Dano)`, "success");
      return true;
    }
    return false;
  }

  getTotalWeight() {
    let w = 0;
    this.weapons.forEach(wp => w += (wp.peso || 2));
    this.armors.forEach(ar => w += (ar.peso || 5));
    for (const [id, count] of Object.entries(this.items)) {
      const tmpl = this.getItemTemplate(id);
      if (tmpl) w += (tmpl.peso || 0.5) * count;
    }
    return Number(w.toFixed(1));
  }

  syncFlags() {
    if (window.flagsManager) {
      window.flagsManager.setFlag("player_gold", this.gold, "Inventário");
      window.flagsManager.setFlag("equipped_weapon", this.equippedWeapon ? this.equippedWeapon.id : null, "Inventário");
      window.flagsManager.setFlag("equipped_style", this.equippedWeapon ? this.equippedWeapon.style : null, "Inventário");
      window.flagsManager.setFlag("total_weight", this.getTotalWeight(), "Inventário");
      window.flagsManager.setFlag("has_food", (this.items["ration_food"] || 0) > 0, "Inventário");
    }
  }

  exportData() {
    return {
      weapons: JSON.parse(JSON.stringify(this.weapons)),
      armors: JSON.parse(JSON.stringify(this.armors)),
      items: { ...this.items },
      gold: this.gold,
      equippedWeaponId: this.equippedWeapon ? this.equippedWeapon.id : null,
      equippedArmorId: this.equippedArmor ? this.equippedArmor.id : null
    };
  }
}

window.inventoryManager = new InventoryManager();
