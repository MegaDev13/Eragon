/**
 * Crônica de Aethelgard - Motor de Eventos JSON Orientado a Dados (events_engine.js)
 * Interpreta centenas de eventos em JSON, checa requisitos e aplica escolhas sem alterar código central.
 */

class EventsEngine {
  constructor() {
    this.eventsDB = [];
    this.currentEvent = null;
  }

  init(allEventsArrays, savedData = null) {
    this.eventsDB = [];
    if (Array.isArray(allEventsArrays)) {
      allEventsArrays.forEach(arr => {
        if (arr && arr.events) {
          this.eventsDB = this.eventsDB.concat(arr.events);
        } else if (Array.isArray(arr)) {
          this.eventsDB = this.eventsDB.concat(arr);
        }
      });
    }
    console.log(`[EventsEngine] Inicializado com ${this.eventsDB.length} eventos narrativos no banco de dados.`);
  }

  getAllEvents() {
    return this.eventsDB;
  }

  getEventById(id) {
    return this.eventsDB.find(e => e.id === id);
  }

  /**
   * Avalia se um evento atende a todos os requisitos (flags, localização, nível, dragão, guilda)
   */
  canTriggerEvent(eventObj) {
    if (!eventObj || !eventObj.requirements) return true;
    const req = eventObj.requirements;

    // Checar dragão
    if (req.dragon !== undefined && window.dragonManager) {
      if (req.dragon !== window.dragonManager.hasDragon) return false;
    }

    // Checar localização
    if (req.location && window.mapManager) {
      if (window.mapManager.currentLocationId !== req.location) return false;
    }

    // Checar guilda
    if (req.guild && window.guildsManager) {
      if (!window.guildsManager.playerJoinedGuilds.includes(req.guild)) return false;
    }

    // Checar flags
    if (window.flagsManager) {
      return window.flagsManager.checkRequirements(req);
    }
    return true;
  }

  triggerEventById(eventId) {
    const ev = this.getEventById(eventId);
    if (ev) {
      this.currentEvent = ev;
      if (window.ui) window.ui.showEventModal(ev);
      return true;
    }
    return false;
  }

  /**
   * Aciona um evento de exploração aleatório compatível com a região/flags atuais
   */
  triggerExplorationEvent() {
    const validEvents = this.eventsDB.filter(e => this.canTriggerEvent(e));
    if (validEvents.length > 0) {
      const idx = Math.floor(Math.random() * validEvents.length);
      this.currentEvent = validEvents[idx];
      if (window.ui) window.ui.showEventModal(this.currentEvent);
      return true;
    }
    return false;
  }

  triggerRegionalEvent(locationId) {
    const valid = this.eventsDB.filter(e => e.requirements && e.requirements.location === locationId && this.canTriggerEvent(e));
    if (valid.length > 0) {
      const idx = Math.floor(Math.random() * valid.length);
      this.currentEvent = valid[idx];
      if (window.ui) window.ui.showEventModal(this.currentEvent);
      return true;
    } else {
      return this.triggerExplorationEvent();
    }
  }

  /**
   * Resolve a escolha selecionada no modal do evento
   */
  resolveChoice(choiceIndex) {
    if (!this.currentEvent || !this.currentEvent.choices || !this.currentEvent.choices[choiceIndex]) return false;

    const choice = this.currentEvent.choices[choiceIndex];

    // Checar se exige itens no inventário
    if (choice.reqItems && window.inventoryManager) {
      for (const [itemId, reqCount] of Object.entries(choice.reqItems)) {
        const currentCount = window.inventoryManager.items[itemId] || 0;
        if (currentCount < reqCount) {
          const tmpl = window.inventoryManager.getItemTemplate(itemId);
          if (window.ui) window.ui.showToast(`Itens insuficientes: exige ${reqCount}x ${tmpl ? tmpl.name : itemId}`, "warning");
          return false;
        }
      }
      // Consumir os itens
      for (const [itemId, reqCount] of Object.entries(choice.reqItems)) {
        window.inventoryManager.consumeItem(itemId, reqCount);
      }
    }

    // Aplicar efeitos (Orientado a Dados)
    if (choice.effects) {
      const ef = choice.effects;

      if (ef.gold !== undefined && window.economyManager) {
        window.economyManager.modifyGold(ef.gold);
      }
      if (ef.xp && window.attributesManager) {
        window.attributesManager.gainXP(ef.xp, `Evento: ${this.currentEvent.title}`);
      }
      if (ef.hp && window.attributesManager) {
        if (ef.hp > 0) window.attributesManager.heal(ef.hp);
        else window.attributesManager.takeDamage(-ef.hp, "physical");
      }
      if (ef.willpower && window.attributesManager) {
        if (ef.willpower > 0) window.attributesManager.restoreWillpower(ef.willpower);
        else window.attributesManager.consumeWillpower(-ef.willpower);
      }
      if (ef.attrPoints && window.attributesManager) {
        window.attributesManager.availablePoints += ef.attrPoints;
      }
      if (ef.attrMod && window.attributesManager) {
        window.attributesManager.modifyAttribute(ef.attrMod.key, ef.attrMod.delta);
      }
      if (ef.corruption && window.attributesManager) {
        window.attributesManager.modifyCorruption(ef.corruption);
      }
      if (ef.dragonMood && window.dragonManager) {
        window.dragonManager.mood = Math.max(0, Math.min(100, window.dragonManager.mood + ef.dragonMood));
      }
      if (ef.dragonBond && window.dragonManager) {
        window.dragonManager.modifyBond(ef.dragonBond);
      }
      if (ef.items && window.inventoryManager) {
        for (const [itemId, count] of Object.entries(ef.items)) {
          if (count > 0) window.inventoryManager.addItem(itemId, count);
          else window.inventoryManager.consumeItem(itemId, -count);
        }
      }
      if (ef.hidden && window.hiddenAttributesManager) {
        window.hiddenAttributesManager.modifyTraits(ef.hidden);
      }
      if (ef.flags && window.flagsManager) {
        for (const [key, val] of Object.entries(ef.flags)) {
          window.flagsManager.setFlag(key, val, `Evento (${this.currentEvent.title})`);
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

      // Se houver gatilho de combate
      if (ef.combatTrigger && window.combatManager) {
        window.combatManager.startCombat(ef.combatTrigger);
      }
    }

    // Agendar consequência futura se houver
    if (choice.consequence && window.delayedConsequences) {
      const c = choice.consequence;
      window.delayedConsequences.scheduleConsequence(c.delayDays || 10, c.title, c.desc, { flags: c.flags || {} }, `${this.currentEvent.title}: ${choice.text}`);
    }

    if (window.flagsManager) {
      window.flagsManager.setFlag(`event_seen_${this.currentEvent.id}`, true, "Sistema de Eventos");
    }

    if (window.ui) {
      window.ui.closeEventModal();
      window.ui.showToast(`Decisão tomada em "${this.currentEvent.title}"`, "info");
      window.ui.updateAllPanels();
    }

    this.currentEvent = null;
    return true;
  }
}

window.eventsEngine = new EventsEngine();
