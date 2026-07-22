/**
 * Crônica de Aethelgard - Rotinas Diárias dos NPCs (npc_routine_manager.js)
 * NPCs vivem suas vidas. Eles mudam de localização conforme o horário.
 * O jogador encontra apenas quem está disponível no momento.
 */

class NPCRoutineManager {
  constructor() {
    this.npcSchedules = {}; // npcId -> { schedule: [{hour, location, activity}], currentLocation }
    this.npcMemories = {}; // npcId -> array of memory objects
    this.lastHourChecked = -1;
  }

  init(savedData = null) {
    if (savedData) {
      this.npcSchedules = savedData.npcSchedules || {};
      this.npcMemories = savedData.npcMemories || {};
    } else {
      this.seedInitialRoutines();
    }
  }

  seedInitialRoutines() {
    // Only seed for NPCs that may be discovered in the Vale initially
    const humbleNPCs = ['npc_alden', 'npc_borin', 'rom_lyra', 'npc_thalor'];

    humbleNPCs.forEach(npcId => {
      this.npcSchedules[npcId] = this.generateRoutineForProfession(npcId);
      this.npcMemories[npcId] = [];
    });

    // Default routines for later discovered NPCs
    console.log("[NPCRoutine] Rotinas diárias inicializadas para NPCs conhecidos.");
  }

  generateRoutineForProfession(npcId) {
    let schedule = [];
    let profession = "commoner";

    if (npcId.includes("alden") || npcId.includes("merc")) profession = "merchant";
    else if (npcId.includes("borin")) profession = "blacksmith";
    else if (npcId.includes("lyra")) profession = "noble";
    else if (npcId.includes("thalor")) profession = "mage";
    else if (npcId.includes("guard")) profession = "guard";

    const base = {
      "merchant": [
        { hour: 6, location: "loc_vale_cinzas", activity: "Acorda e abre loja" },
        { hour: 8, location: "loc_vale_cinzas", activity: "Comércio com viajantes" },
        { hour: 12, location: "loc_vale_cinzas", activity: "Almoça" },
        { hour: 14, location: "loc_eldoria", activity: "Viaja para negociar grãos" },
        { hour: 18, location: "loc_vale_cinzas", activity: "Retorna à taverna" },
        { hour: 21, location: "loc_vale_cinzas", activity: "Dorme" }
      ],
      "blacksmith": [
        { hour: 6, location: "loc_vale_cinzas", activity: "Acorda e acende forja" },
        { hour: 7, location: "loc_vale_cinzas", activity: "Forja ferramentas" },
        { hour: 12, location: "loc_vale_cinzas", activity: "Almoço" },
        { hour: 13, location: "loc_vale_cinzas", activity: "Repara armas" },
        { hour: 18, location: "loc_vale_cinzas", activity: "Taverna" },
        { hour: 22, location: "loc_vale_cinzas", activity: "Dorme" }
      ],
      "noble": [
        { hour: 7, location: "loc_eldoria", activity: "Acorda no castelo" },
        { hour: 9, location: "loc_eldoria", activity: "Reunião com conselheiros" },
        { hour: 13, location: "loc_eldoria", activity: "Banquete" },
        { hour: 16, location: "loc_eldoria", activity: "Passeio pelo jardim" },
        { hour: 20, location: "loc_eldoria", activity: "Audiência noturna" },
        { hour: 23, location: "loc_eldoria", activity: "Dorme" }
      ],
      "mage": [
        { hour: 5, location: "loc_picos_dragao", activity: "Estudos matutinos" },
        { hour: 9, location: "loc_vale_cinzas", activity: "Ensina ou pesquisa" },
        { hour: 13, location: "loc_vale_cinzas", activity: "Almoço silencioso" },
        { hour: 16, location: "loc_ruinas_khaz", activity: "Explora ruínas" },
        { hour: 21, location: "loc_picos_dragao", activity: "Retorna ao santuário" }
      ],
      "commoner": [
        { hour: 6, location: "loc_vale_cinzas", activity: "Acorda" },
        { hour: 8, location: "loc_vale_cinzas", activity: "Trabalha no campo" },
        { hour: 12, location: "loc_vale_cinzas", activity: "Almoça" },
        { hour: 18, location: "loc_vale_cinzas", activity: "Retorna para casa" },
        { hour: 22, location: "loc_vale_cinzas", activity: "Dorme" }
      ]
    };

    return { schedule: base[profession] || base["commoner"], currentLocation: "loc_vale_cinzas" };
  }

  // Called every hour or when time advances
  advanceTime(hours) {
    const cal = window.calendarManager;
    if (!cal) return;

    const currentHour = cal.hour;

    // Update all NPCs
    Object.keys(this.npcSchedules).forEach(npcId => {
      const sched = this.npcSchedules[npcId];
      if (!sched || !sched.schedule) return;

      // Find the correct slot for current hour
      let activeSlot = sched.schedule[sched.schedule.length - 1];
      for (let i = 0; i < sched.schedule.length; i++) {
        if (currentHour >= sched.schedule[i].hour) {
          activeSlot = sched.schedule[i];
        }
      }

      sched.currentLocation = activeSlot.location;

      // Occasionally record a memory for the NPC (world lives)
      if (Math.random() < 0.04) {
        this.addNPCInternalMemory(npcId, `Viveu ${activeSlot.activity} hoje.`);
      }
    });
  }

  getNPCCurrentLocation(npcId) {
    const sched = this.npcSchedules[npcId];
    return sched ? sched.currentLocation : null;
  }

  isNPCLocationAvailable(npcId, targetLocationId) {
    const current = this.getNPCCurrentLocation(npcId);
    return current === targetLocationId;
  }

  // Memory system
  addMemory(npcId, eventType, details, impact = 0) {
    if (!this.npcMemories[npcId]) this.npcMemories[npcId] = [];

    const mem = {
      timestamp: Date.now(),
      day: window.calendarManager ? window.calendarManager.getTotalDays() : 1,
      type: eventType,
      details,
      impact // positive or negative
    };

    this.npcMemories[npcId].unshift(mem);
    if (this.npcMemories[npcId].length > 12) this.npcMemories[npcId].pop();

    // Also sync to affinity if relevant
    if (window.affinityManager && impact !== 0) {
      window.affinityManager.modifyAffinity(npcId, Math.floor(impact * 0.6), `Memória: ${eventType}`);
    }
  }

  addNPCInternalMemory(npcId, text) {
    if (!this.npcMemories[npcId]) this.npcMemories[npcId] = [];
    this.npcMemories[npcId].unshift({
      timestamp: Date.now(),
      day: window.calendarManager ? window.calendarManager.getTotalDays() : 1,
      type: "autonomous",
      details: text,
      impact: 0
    });
  }

  getMemories(npcId) {
    return this.npcMemories[npcId] || [];
  }

  // Used by dialogue system to alter responses
  getMemoryInfluence(npcId) {
    const mems = this.getMemories(npcId);
    let influence = 0;
    mems.forEach(m => influence += m.impact);
    return Math.max(-40, Math.min(40, influence));
  }

  exportData() {
    return {
      npcSchedules: this.npcSchedules,
      npcMemories: this.npcMemories
    };
  }
}

window.npcRoutineManager = new NPCRoutineManager();