/**
 * Crônica de Aethelgard - Sistema de Consequências Agendadas e Memória de Longo Prazo (delayed_consequences.js)
 * Permite que escolhas feitas no dia X gerem reações em cadeia no dia X+5, X+20, X+50, X+120 e X+300.
 */

class DelayedConsequencesManager {
  constructor() {
    // Array de objetos: { id, targetDay, title, description, effects: {}, triggered: false }
    this.scheduledEvents = [];
    this.pastDecisionsLog = []; // Log narrativo para o diário de memórias
  }

  init(savedData = null) {
    if (savedData) {
      this.scheduledEvents = savedData.scheduledEvents || [];
      this.pastDecisionsLog = savedData.pastDecisionsLog || [];
    } else {
      this.setupDefaultChainExample();
    }
  }

  /**
   * Agenda uma consequência futura com base nos dias a partir de hoje
   */
  scheduleConsequence(delayDays, title, description, effects = {}, sourceDecision = "Ação do Jogador") {
    const currentTotalDays = window.calendarManager ? window.calendarManager.getTotalDays() : 1;
    const targetDay = currentTotalDays + delayDays;

    const consequence = {
      id: "conseq_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      createdOnDay: currentTotalDays,
      targetDay: targetDay,
      title: title,
      description: description,
      effects: effects,
      sourceDecision: sourceDecision,
      triggered: false
    };

    this.scheduledEvents.push(consequence);
    console.log(`[DelayedConsequences] Agendada consequência para o dia total ${targetDay}: "${title}"`);
  }

  /**
   * Registra uma escolha no diário de decisões para auditoria e log do jogador
   */
  recordDecision(title, details) {
    const dayStr = window.calendarManager ? window.calendarManager.getFormattedDate() : "Dia 1";
    this.pastDecisionsLog.unshift({
      timestamp: new Date().toISOString(),
      day: dayStr,
      title: title,
      details: details
    });
  }

  /**
   * Verifica se alguma consequência deve ser acionada hoje
   */
  checkAndTriggerConsequences(currentTotalDay) {
    const pending = this.scheduledEvents.filter(e => !e.triggered && currentTotalDay >= e.targetDay);

    for (const conseq of pending) {
      conseq.triggered = true;
      console.log(`[DelayedConsequences] ACIONANDO CONSEQUÊNCIA: "${conseq.title}"`);

      // Aplicar efeitos nas flags, atributos e mundo
      if (conseq.effects) {
        if (conseq.effects.flags && window.flagsManager) {
          for (const [flagKey, flagVal] of Object.entries(conseq.effects.flags)) {
            window.flagsManager.setFlag(flagKey, flagVal, `Consequência Tardia: ${conseq.title}`);
          }
        }
        if (conseq.effects.gold && window.economyManager) {
          window.economyManager.modifyGold(conseq.effects.gold);
        }
        if (conseq.effects.reputation && window.kingdomsManager) {
          for (const [kId, delta] of Object.entries(conseq.effects.reputation)) {
            window.kingdomsManager.modifyReputation(kId, delta);
          }
        }
      }

      // Adicionar à memória do jogador e notificar visualmente
      this.recordDecision(`[CONSEQUÊNCIA] ${conseq.title}`, conseq.description);

      if (window.ui) {
        window.ui.showModalAlert(
          `Ecos do Passado: ${conseq.title}`,
          `<p class="consequence-source"><strong>Origem:</strong> ${conseq.sourceDecision}</p>` +
          `<p class="consequence-desc">${conseq.description}</p>`,
          "Entendido"
        );
        window.ui.playSound("dramatic_chord");
      }
    }
  }

  /**
   * Prepara um exemplo de reação em cadeia inicial ou quando o jogador executa o evento de roubo da caravana
   */
  setupDefaultChainExample() {
    // Se o jogador ativar o roubo de Alden em algum momento, esta cadeia será agendada.
  }

  /**
   * Agendar a famosa cadeia do mercador Alden (exemplo do prompt)
   */
  triggerMerchantRobberyChain() {
    this.scheduleConsequence(5, "A Falência de Alden o Mercador", 
      "Despojado de sua caravana real de grãos pelo seu roubo, o prestigiado mercador Alden faliu e não pôde pagar seus credores na guilda áurea.", 
      { flags: { flag_mercador_alden_faliu: true, flag_rotas_comerciais_instaveis: true } }, 
      "Roubo da Caravana de Alden");

    this.scheduleConsequence(20, "Crise de Alimentos em Eldoria", 
      "Sem as caravanas de Alden para abastecer os celeiros centrais no meio da estação fria, a capital Eldor entra em escassez severa de grãos.", 
      { flags: { flag_cidade_sem_alimentos: true } }, 
      "Roubo da Caravana de Alden");

    this.scheduleConsequence(50, "Revolta Popular nos Fardos de Ferro", 
      "A fome transformou o desespero dos camponeses em fúria armada. Uma revolta camponesa eclode diante dos portões do palácio da Rainha Lyra!", 
      { flags: { flag_revolta_camponesa: true, flag_cidade_queimada: true } }, 
      "Roubo da Caravana de Alden");

    this.scheduleConsequence(120, "A Queda da Coroa e Novo Rei em Eldor", 
      "Com a capital enfraquecida pelas chamas da revolta popular, o general renegado Vane derruba a Rainha Lyra e se autoproclama o Novo Rei de Aethelgard.", 
      { flags: { flag_rainha_lyra_viva: false, flag_rei_confia: false, governante_eldor: "Rei Vane o Usurpador" } }, 
      "Roubo da Caravana de Alden");

    this.scheduleConsequence(300, "Guerra Civil Continental", 
      "O Império de Solgard recusa reconhecer o Rei Vane e lança uma invasão total sobre Eldor. O continente inteiro mergulha em uma guerra sangrenta e devastadora.", 
      { flags: { flag_guerra_eldor_solgard: true, flag_guerra_civil: true } }, 
      "Roubo da Caravana de Alden");
  }

  exportData() {
    return {
      scheduledEvents: JSON.parse(JSON.stringify(this.scheduledEvents)),
      pastDecisionsLog: JSON.parse(JSON.stringify(this.pastDecisionsLog))
    };
  }
}

window.delayedConsequences = new DelayedConsequencesManager();
