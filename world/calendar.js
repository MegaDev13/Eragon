/**
 * Crônica de Aethelgard - Calendário do Mundo Vivo e Clima (calendar.js)
 * Controla dias, meses da Era das Cinzas, estações, clima dinâmico e fases da lua.
 */

class CalendarManager {
  constructor() {
    this.day = 1;
    this.month = 1; // 1 a 12
    this.year = 1042; // Ano 1042 da Era das Cinzas
    this.hour = 8; // 0 a 23

    this.monthsNames = [
      "Mês da Geada Branca",      // 1 (Inverno)
      "Mês do Despertar da Terra", // 2 (Primavera)
      "Mês do Vento Esmeralda",    // 3 (Primavera)
      "Mês das Sementes de Prata", // 4 (Primavera)
      "Mês do Sol Implacável",     // 5 (Verão)
      "Mês das Cinzas Douradas",   // 6 (Verão)
      "Mês da Colheita de Sangue", // 7 (Verão)
      "Mês das Folhas de Cobre",   // 8 (Outono)
      "Mês da Névoa Sombria",      // 9 (Outono)
      "Mês do Eclipse Rúnico",     // 10 (Outono)
      "Mês do Uivo Congelante",    // 11 (Inverno)
      "Mês da Noite Eterna"        // 12 (Inverno)
    ];

    this.seasons = {
      1: "Inverno", 11: "Inverno", 12: "Inverno",
      2: "Primavera", 3: "Primavera", 4: "Primavera",
      5: "Verão", 6: "Verão", 7: "Verão",
      8: "Outono", 9: "Outono", 10: "Outono"
    };

    this.weatherTypes = [
      { id: "clear", name: "Céu Limpo e Ensolarado", modifier: "Visibilidade máxima nas estradas. Magias de Fogo +10% de eficácia." },
      { id: "rain", name: "Chuva Forte e Vento", modifier: "Estradas escorregadias. Furtividade +15%, Magias de Fogo -25%, Magias de Água/Ar +20%." },
      { id: "storm", name: "Tempestade Elétrica e Trovões", modifier: "Perigo de raios. Voar com dragão consome +50% fadiga. Magias Elétricas/Ar +40%." },
      { id: "fog", name: "Neblina Densa do Pântano", modifier: "Dificuldade de pontaria à distância (-20% Precisão). Alta chance de emboscadas surpresa." },
      { id: "snow", name: "Nevasca dos Picos Congelados", modifier: "Velocidade de viagem reduzida à metade. Custo de fadiga física +30%." }
    ];

    this.moonPhases = [
      { id: "new", name: "Lua Nova (Escuridão)" },
      { id: "crescent", name: "Lua Crescente de Prata" },
      { id: "full", name: "Lua Cheia Radiante" },
      { id: "blood", name: "Lua de Sangue (Eclipse Sombrio - Magia Escura +50%)" }
    ];

    this.currentWeather = this.weatherTypes[0];
    this.currentMoon = this.moonPhases[1];
  }

  init(savedData = null) {
    if (savedData) {
      this.day = savedData.day || 1;
      this.month = savedData.month || 1;
      this.year = savedData.year || 1042;
      this.hour = savedData.hour !== undefined ? savedData.hour : 8;
      if (savedData.currentWeatherId) {
        this.currentWeather = this.weatherTypes.find(w => w.id === savedData.currentWeatherId) || this.weatherTypes[0];
      }
      if (savedData.currentMoonId) {
        this.currentMoon = this.moonPhases.find(m => m.id === savedData.currentMoonId) || this.moonPhases[1];
      }
    }
    this.syncFlags();
  }

  getSeason() {
    return this.seasons[this.month] || "Primavera";
  }

  getMonthName() {
    return this.monthsNames[this.month - 1] || "Mês Desconhecido";
  }

  getFormattedDate() {
    return `Dia ${this.day} do ${this.getMonthName()}, ${this.year} EC (${this.getSeason()})`;
  }

  getFormattedTime() {
    const timeStr = `${String(this.hour).padStart(2, '0')}:00`;
    let period = "Manhã";
    if (this.hour >= 12 && this.hour < 18) period = "Tarde";
    else if (this.hour >= 18 && this.hour < 22) period = "Noite";
    else if (this.hour >= 22 || this.hour < 6) period = "Madrugada";
    return `${timeStr} (${period})`;
  }

  /**
   * Avança horas ou dias no tempo.
   * Aciona a recuperação de status, verificação de consequências agendadas e eventos dinâmicos do mundo vivo.
   */
  advanceTime(hours = 1, reason = "Passagem do Tempo") {
    let oldDay = this.day;
    this.hour += hours;
    let daysPassed = 0;

    while (this.hour >= 24) {
      this.hour -= 24;
      this.day++;
      daysPassed++;
      if (this.day > 30) {
        this.day = 1;
        this.month++;
        if (this.month > 12) {
          this.month = 1;
          this.year++;
        }
      }
    }

    // Se passou ao menos 1 dia completo
    if (daysPassed > 0) {
      this.updateDynamicWeatherAndMoon();
      
      // Recuperação diária do jogador (se não estiver morrendo de fome)
      if (window.attributesManager) {
        const recoveryRate = window.attributesManager.derived.fatigueRecoveryRate || 25;
        window.attributesManager.modifyFatigue(-recoveryRate);
        window.attributesManager.heal(Math.floor(window.attributesManager.derived.maxHP * 0.15));
        window.attributesManager.restoreWillpower(Math.floor(window.attributesManager.derived.maxWillpower * 0.25));
      }

      // Crescimento e checagem diária do Dragão
      if (window.dragonManager) {
        window.dragonManager.processDailyUpdate(daysPassed);
      }

      // Checagem de relações e intrigas no grupo ao acampar
      if (window.partyManager) {
        window.partyManager.processCampfirePartyCheck();
      }

      // Variação Econômica do Mundo
      if (window.economyManager) {
        window.economyManager.processDailyMarketShift(daysPassed);
      }

      // Execução de Consequências Agendadas (Sistema de Memória de Longo Prazo)
      if (window.delayedConsequences) {
        window.delayedConsequences.checkAndTriggerConsequences(this.getTotalDays());
      }

      // O Mundo Vivo não espera o jogador: Reis, Guerras e Vilas evoluem
      if (window.kingdomsManager) {
        window.kingdomsManager.processWorldSimulation(daysPassed);
      }
    }

    this.syncFlags();
    if (window.ui) {
      window.ui.updateHeader();
    }
  }

  getTotalDays() {
    return ((this.year - 1042) * 360) + ((this.month - 1) * 30) + this.day;
  }

  updateDynamicWeatherAndMoon() {
    // 35% de chance do clima mudar a cada dia
    if (Math.random() < 0.35) {
      const idx = Math.floor(Math.random() * this.weatherTypes.length);
      this.currentWeather = this.weatherTypes[idx];
    }

    // Ciclo da Lua a cada 7 dias
    const moonIdx = Math.floor((this.day % 28) / 7);
    this.currentMoon = this.moonPhases[moonIdx] || this.moonPhases[0];
  }

  syncFlags() {
    if (window.flagsManager) {
      window.flagsManager.setFlag("world_day", this.day, "Calendário");
      window.flagsManager.setFlag("world_month", this.month, "Calendário");
      window.flagsManager.setFlag("world_year", this.year, "Calendário");
      window.flagsManager.setFlag("world_season", this.getSeason(), "Calendário");
      window.flagsManager.setFlag("world_weather", this.currentWeather.id, "Calendário");
      window.flagsManager.setFlag("world_moon", this.currentMoon.id, "Calendário");
      window.flagsManager.setFlag("total_days_elapsed", this.getTotalDays(), "Calendário");
    }
  }

  exportData() {
    return {
      day: this.day,
      month: this.month,
      year: this.year,
      hour: this.hour,
      currentWeatherId: this.currentWeather.id,
      currentMoonId: this.currentMoon.id
    };
  }
}

window.calendarManager = new CalendarManager();
