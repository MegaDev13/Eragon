/**
 * Crônica de Aethelgard - Sistema de Alquimia, Forja e Crafting (crafting_manager.js)
 * Permite confeccionar poções, rações, armaduras, reparar armas e aplicar runas no acampamento ou forjas.
 */

class CraftingManager {
  constructor() {
    this.recipes = [
      {
        id: "craft_health_potion",
        name: "Poção de Cura Rápida",
        category: "alquimia",
        ingredients: { "mat_lumen_herb": 2 },
        output: { "potion_health": 1 },
        reqAttribute: { key: "inteligencia", min: 10 },
        description: "Ferve ervas fosforescentes de Lúmen para extrair seu suco coagulante."
      },
      {
        id: "craft_antidote",
        name: "Antídoto Druídico de Lúmen",
        category: "alquimia",
        ingredients: { "mat_lumen_herb": 3 },
        output: { "potion_antidote": 1 },
        reqAttribute: { key: "sabedoria", min: 12 },
        description: "Prepara um antídoto concentrado capaz de purificar febres de escama em dragões."
      },
      {
        id: "craft_ration",
        name: "Ração de Acampamento (Conservas)",
        category: "cozinha",
        ingredients: { "mat_lumen_herb": 1 },
        goldCost: 3,
        output: { "ration_food": 2 },
        reqAttribute: { key: "constituicao", min: 10 },
        description: "Salga ervas e grãos para estocar comida duradoura para longas viagens entre regiões."
      },
      {
        id: "craft_rune_enchant",
        name: "Encantamento de Lâmina com Obsidiana",
        category: "forja",
        ingredients: { "mat_obsidian_crystal": 1, "mat_iron_ingot": 1 },
        specialAction: "enchant_weapon",
        reqAttribute: { key: "inteligencia", min: 14 },
        description: "Funde um cristal de Aethel-Khaz no fio da sua arma equipada, concedendo +20% de dano mágico permanente."
      },
      {
        id: "craft_repair_weapon",
        name: "Reparo Completo de Arma Equipadada",
        category: "forja",
        ingredients: { "mat_iron_ingot": 1 },
        specialAction: "repair_weapon",
        reqAttribute: { key: "destreza", min: 10 },
        description: "Poli, afia e repara a durabilidade máxima da arma atual."
      }
    ];
  }

  getRecipes() {
    return this.recipes;
  }

  canCraft(recipeId) {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe || !window.inventoryManager || !window.attributesManager) return { can: false, reason: "Receita ou sistemas indisponíveis." };

    // Checar atributo
    if (recipe.reqAttribute) {
      const val = window.attributesManager.getAttribute(recipe.reqAttribute.key);
      if (val < recipe.reqAttribute.min) {
        return { can: false, reason: `Requer ${recipe.reqAttribute.key.toUpperCase()} nível ${recipe.reqAttribute.min}+ (Atual: ${val}).` };
      }
    }

    // Checar ouro
    if (recipe.goldCost && window.inventoryManager.gold < recipe.goldCost) {
      return { can: false, reason: `Ouro insuficiente (${window.inventoryManager.gold}/${recipe.goldCost}).` };
    }

    // Checar ingredientes
    for (const [itemId, reqCount] of Object.entries(recipe.ingredients)) {
      const currentCount = window.inventoryManager.items[itemId] || 0;
      if (currentCount < reqCount) {
        const tmpl = window.inventoryManager.getItemTemplate(itemId);
        return { can: false, reason: `Falta de ingrediente: ${tmpl ? tmpl.name : itemId} (${currentCount}/${reqCount}).` };
      }
    }

    return { can: true };
  }

  craft(recipeId) {
    const check = this.canCraft(recipeId);
    if (!check.can) {
      if (window.ui) window.ui.showToast(check.reason, "warning");
      return false;
    }

    const recipe = this.recipes.find(r => r.id === recipeId);
    const inv = window.inventoryManager;

    // Consumir ouro e ingredientes
    if (recipe.goldCost) inv.gold -= recipe.goldCost;
    for (const [itemId, reqCount] of Object.entries(recipe.ingredients)) {
      inv.consumeItem(itemId, reqCount);
    }

    // Executar ação de saída ou ação especial
    if (recipe.output) {
      for (const [outId, outCount] of Object.entries(recipe.output)) {
        inv.addItem(outId, outCount);
      }
    } else if (recipe.specialAction === "enchant_weapon") {
      if (inv.equippedWeapon) {
        inv.equippedWeapon.enchantment = "Runa de Obsidiana de Aethel-Khaz";
        inv.equippedWeapon.dano = Math.floor(inv.equippedWeapon.dano * 1.25);
        if (window.ui) window.ui.showToast(`Armada encantada com sucesso! Dano aumentado para ${inv.equippedWeapon.dano}.`, "success");
      } else {
        if (window.ui) window.ui.showToast("Nenhuma arma equipada para encantar!", "warning");
        return false;
      }
    } else if (recipe.specialAction === "repair_weapon") {
      if (inv.equippedWeapon) {
        inv.equippedWeapon.durabilidade.current = inv.equippedWeapon.durabilidade.max;
        if (window.ui) window.ui.showToast(`Arma reparada para durabilidade máxima (${inv.equippedWeapon.durabilidade.max})!`, "success");
      } else {
        if (window.ui) window.ui.showToast("Nenhuma arma equipada para reparar!", "warning");
        return false;
      }
    }

    if (window.attributesManager) {
      window.attributesManager.gainXP(25, `Criação: ${recipe.name}`);
    }

    if (window.ui) {
      window.ui.playSound("craft");
      window.ui.updateAllPanels();
    }
    return true;
  }
}

window.craftingManager = new CraftingManager();
