/**
 * Crônica de Aethelgard - Economia Dinâmica, Inflação e Comércio (economy_manager.js)
 * Controla os preços de mercado, escassez, inflação em tempo de guerra e mercadores ambulantes.
 */

class EconomyManager {
  constructor() {
    this.inflationRate = 1.0; // Multiplicador global de preços
    this.regionalScarcity = {}; // { locationId: { itemId: multiplier } }
    this.travelingMerchantPresent = true;
    this.travelingMerchantInventory = [
      { id: "potion_health", stock: 5 },
      { id: "ration_food", stock: 15 },
      { id: "potion_willpower", stock: 4 },
      { id: "mat_iron_ingot", stock: 3 },
      { id: "dragon_elixir", stock: 1 },
      { id: "mat_obsidian_crystal", stock: 2 }
    ];
  }

  init(savedData = null) {
    if (savedData) {
      this.inflationRate = savedData.inflationRate || 1.0;
      this.regionalScarcity = savedData.regionalScarcity || {};
      this.travelingMerchantPresent = savedData.travelingMerchantPresent !== undefined ? savedData.travelingMerchantPresent : true;
      if (savedData.travelingMerchantInventory) this.travelingMerchantInventory = savedData.travelingMerchantInventory;
    }
  }

  processDailyMarketShift(daysPassed) {
    // Se há guerra ou revolta, inflação aumenta
    if (window.flagsManager) {
      if (window.flagsManager.getFlag("flag_qualquer_guerra_ativa") || window.flagsManager.getFlag("flag_revolta_camponesa")) {
        this.inflationRate = Math.min(2.5, Number((this.inflationRate + (daysPassed * 0.02)).toFixed(2)));
      } else {
        // Tende a voltar a 1.0 lentamente em tempos de paz
        if (this.inflationRate > 1.0) {
          this.inflationRate = Math.max(1.0, Number((this.inflationRate - (daysPassed * 0.01)).toFixed(2)));
        }
      }

      // Se Alden faliu ou há escassez em Eldor, dobrar o preço de grãos/rações
      if (window.flagsManager.getFlag("flag_cidade_sem_alimentos")) {
        if (!this.regionalScarcity["loc_eldoria"]) this.regionalScarcity["loc_eldoria"] = {};
        this.regionalScarcity["loc_eldoria"]["ration_food"] = 3.0; // 3x o preço
      }
    }

    // O mercador ambulante reabastece e viaja 40% das vezes
    if (Math.random() < 0.4) {
      this.travelingMerchantPresent = !this.travelingMerchantPresent;
      if (this.travelingMerchantPresent && window.ui) {
        window.ui.showToast("Um Mercador Ambulante montou sua tenda na sua região atual!", "info");
      }
    }
  }

  modifyGold(delta) {
    if (window.inventoryManager) {
      window.inventoryManager.gold = Math.max(0, window.inventoryManager.gold + delta);
      if (window.flagsManager) {
        window.flagsManager.setFlag("player_gold", window.inventoryManager.gold, "Economia");
      }
      if (window.ui) {
        window.ui.showToast(`Ouro ${delta >= 0 ? '+' : ''}${delta} (Total: ${window.inventoryManager.gold})`, delta >= 0 ? "gold" : "warning");
        window.ui.updateAllPanels();
      }
    }
  }

  getBuyPrice(itemTemplate) {
    if (!itemTemplate) return 10;
    let base = itemTemplate.price || 15;
    
    // Aplicar inflação
    base *= this.inflationRate;

    // Aplicar escassez regional
    const locId = window.mapManager ? window.mapManager.currentLocationId : "loc_eldoria";
    if (this.regionalScarcity[locId] && this.regionalScarcity[locId][itemTemplate.id]) {
      base *= this.regionalScarcity[locId][itemTemplate.id];
    }

    // Desconto por Carisma/Liderança/Habilidades comerciais
    let discount = window.attributesManager ? window.attributesManager.derived.priceDiscount || 0 : 0;
    if (window.skillsManager && window.skillsManager.hasSkill("sk_merch_1")) {
      discount += 25;
    }

    const finalPrice = Math.max(1, Math.floor(base * (1 - (discount / 100))));
    return finalPrice;
  }

  getSellPrice(itemTemplate) {
    if (!itemTemplate) return 5;
    const buyPrice = this.getBuyPrice(itemTemplate);
    let sellMultiplier = 0.45; // Vende por 45% do valor de compra
    
    if (window.skillsManager && window.skillsManager.hasSkill("sk_merch_1")) {
      sellMultiplier = 0.65;
    }

    return Math.max(1, Math.floor(buyPrice * sellMultiplier));
  }

  buyItem(itemId, count = 1) {
    if (!window.inventoryManager) return false;
    const tmpl = window.inventoryManager.getItemTemplate(itemId);
    if (!tmpl) return false;

    const unitPrice = this.getBuyPrice(tmpl);
    const totalPrice = unitPrice * count;

    if (window.inventoryManager.gold < totalPrice) {
      if (window.ui) window.ui.showToast(`Ouro insuficiente para comprar ${count}x ${tmpl.name} (${window.inventoryManager.gold}/${totalPrice}).`, "warning");
      return false;
    }

    // Deduzir do estoque do mercador se estiver na aba do mercador
    const mItem = this.travelingMerchantInventory.find(i => i.id === itemId);
    if (mItem) {
      if (mItem.stock < count) {
        if (window.ui) window.ui.showToast(`Estoque do mercador insuficiente (${mItem.stock} restantes).`, "warning");
        return false;
      }
      mItem.stock -= count;
    }

    window.inventoryManager.gold -= totalPrice;
    if (tmpl.type === "arma" || tmpl.id?.startsWith("w_")) {
      window.inventoryManager.addWeapon(itemId);
    } else if (tmpl.type === "armadura" || tmpl.id?.startsWith("a_")) {
      window.inventoryManager.addArmor(itemId);
    } else {
      window.inventoryManager.addItem(itemId, count);
    }

    // Bug 2 Fix: Persistir instantaneamente no banco de dados e atualizar UI em tempo real
    if (window.saveManager) {
      window.saveManager.autoSave();
    }
    if (window.ui) {
      window.ui.playSound("gold");
      window.ui.updateAllPanels();
    }
    return true;
  }

  sellItem(itemId, count = 1) {
    if (!window.inventoryManager) return false;
    const tmpl = window.inventoryManager.getItemTemplate(itemId);
    if (!tmpl) return false;

    if (!window.inventoryManager.consumeItem(itemId, count)) {
      if (window.ui) window.ui.showToast("Quantidade insuficiente no inventário para vender.", "warning");
      return false;
    }

    const unitPrice = this.getSellPrice(tmpl);
    const totalEarnings = unitPrice * count;

    window.inventoryManager.gold += totalEarnings;

    // Adicionar de volta ao estoque do mercador
    const mItem = this.travelingMerchantInventory.find(i => i.id === itemId);
    if (mItem) {
      mItem.stock += count;
    } else {
      this.travelingMerchantInventory.push({ id: itemId, stock: count });
    }

    if (window.ui) {
      window.ui.showToast(`Vendido ${count}x ${tmpl.name} por +${totalEarnings} ouro.`, "gold");
      window.ui.playSound("gold");
      window.ui.updateAllPanels();
    }
    return true;
  }

  exportData() {
    return {
      inflationRate: this.inflationRate,
      regionalScarcity: JSON.parse(JSON.stringify(this.regionalScarcity)),
      travelingMerchantPresent: this.travelingMerchantPresent,
      travelingMerchantInventory: JSON.parse(JSON.stringify(this.travelingMerchantInventory))
    };
  }
}

window.economyManager = new EconomyManager();
