/**
 * Crônica de Aethelgard - Sistema de Descoberta e Exploração (discovery_manager.js)
 * O mundo só existe para o jogador quando descoberto organicamente.
 * Tudo começa desconhecido. O jogador conquista o conhecimento.
 */

class DiscoveryManager {
  constructor() {
    this.knownLocations = new Set();      // loc_eldoria, etc.
    this.knownFactions = new Set();       // guild_ferro, reino_eldor, etc.
    this.knownNPCs = new Set();           // npc_alden, rom_lyra, etc.
    this.knownGuilds = new Set();
    this.knownSchools = new Set();
    this.knownDragons = new Set();
    this.knownCreatures = new Set();
    this.knownRumors = new Set();
    this.discoveryLog = [];               // histórico para o Diário de Conhecimento
  }

  init(initialData = null) {
    if (initialData) {
      this.knownLocations = new Set(initialData.knownLocations || []);
      this.knownFactions = new Set(initialData.knownFactions || []);
      this.knownNPCs = new Set(initialData.knownNPCs || []);
      this.knownGuilds = new Set(initialData.knownGuilds || []);
      this.knownSchools = new Set(initialData.knownSchools || []);
      this.knownDragons = new Set(initialData.knownDragons || []);
      this.knownCreatures = new Set(initialData.knownCreatures || []);
      this.knownRumors = new Set(initialData.knownRumors || []);
      this.discoveryLog = initialData.discoveryLog || [];
    } else {
      // Começa completamente desconhecido (apenas a região inicial)
      this.knownLocations.add('loc_vale_cinzas'); // Começa aqui
      this.discover('location', 'loc_vale_cinzas', 'Você acorda no Vale das Cinzas.');
    }
  }

  // Método principal de descoberta
  discover(type, id, source = 'Exploração') {
    let set;
    switch (type) {
      case 'location': set = this.knownLocations; break;
      case 'faction': set = this.knownFactions; break;
      case 'npc': set = this.knownNPCs; break;
      case 'guild': set = this.knownGuilds; break;
      case 'school': set = this.knownSchools; break;
      case 'dragon': set = this.knownDragons; break;
      case 'creature': set = this.knownCreatures; break;
      case 'rumor': set = this.knownRumors; break;
      default: return false;
    }

    if (set.has(id)) return false; // já descoberto

    set.add(id);

    const entry = {
      timestamp: Date.now(),
      type,
      id,
      source,
      discoveredAt: window.calendarManager ? window.calendarManager.getFormattedDate() : 'Dia desconhecido'
    };

    this.discoveryLog.unshift(entry);

    // Dispara evento global (para UI e outros sistemas)
    if (window.eventsEngine) {
      window.eventsEngine.triggerDiscoveryEvent(type, id);
    }

    // === LIVRO DAS CRÔNICAS ===
    if (window.chronicleBook) {
      window.chronicleBook.recordDiscovery(id, source);
    }

    console.log(`[Discovery] Descoberto: ${type} - ${id} (${source})`);

    // Atualiza interface se estiver aberta
    if (window.ui) {
      window.ui.updateAllPanels();
    }

    return true;
  }

  isDiscovered(type, id) {
    switch (type) {
      case 'location': return this.knownLocations.has(id);
      case 'faction': return this.knownFactions.has(id);
      case 'npc': return this.knownNPCs.has(id);
      case 'guild': return this.knownGuilds.has(id);
      case 'school': return this.knownSchools.has(id);
      case 'dragon': return this.knownDragons.has(id);
      case 'creature': return this.knownCreatures.has(id);
      case 'rumor': return this.knownRumors.has(id);
      default: return false;
    }
  }

  // Obtém apenas o que já foi descoberto
  getKnownLocations() {
    return Array.from(this.knownLocations);
  }

  getKnownGuilds() {
    return Array.from(this.knownGuilds);
  }

  getKnownNPCs() {
    return Array.from(this.knownNPCs);
  }

  // Retorna o log completo para o Diário de Conhecimento
  getKnowledgeJournal() {
    return this.discoveryLog.slice(0, 50); // últimos 50
  }

  // Útil para testes e saves
  exportData() {
    return {
      knownLocations: Array.from(this.knownLocations),
      knownFactions: Array.from(this.knownFactions),
      knownNPCs: Array.from(this.knownNPCs),
      knownGuilds: Array.from(this.knownGuilds),
      knownSchools: Array.from(this.knownSchools),
      knownDragons: Array.from(this.knownDragons),
      knownCreatures: Array.from(this.knownCreatures),
      knownRumors: Array.from(this.knownRumors),
      discoveryLog: this.discoveryLog
    };
  }

  // Permite que NPCs e eventos descubram coisas para o jogador
  discoverFromNPC(npcId, discoveryType, discoveryId) {
    const success = this.discover(discoveryType, discoveryId, `Conversa com ${npcId}`);
    if (success && window.affinityManager) {
      window.affinityManager.modifyAffinity(npcId, 8, 'Compartilhou conhecimento');
    }
    return success;
  }
}

// Registro global
window.discoveryManager = new DiscoveryManager();