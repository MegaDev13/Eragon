/**
 * Crônica de Aethelgard - Sistema Central de Flags (flags_manager.js)
 * O coração do jogo: todas as decisões, eventos e reações são verificadas e alteradas por flags.
 */

class FlagsManager {
  constructor() {
    this.flags = {};
    this.history = []; // Histórico de alterações de flags para auditoria e log
    this.listeners = {};
  }

  /**
   * Inicializa o gerenciador com um objeto de flags (ex: do flags_db.json ou save)
   */
  init(initialFlags = {}) {
    this.flags = JSON.parse(JSON.stringify(initialFlags));
    console.log("[FlagsManager] Inicializado com " + Object.keys(this.flags).length + " flags fundamentais.");
  }

  /**
   * Define o valor de uma flag e registra no histórico
   */
  setFlag(key, value, reason = "Desconhecido") {
    const oldValue = this.flags[key];
    this.flags[key] = value;
    
    // Registrar alteração se for diferente
    if (oldValue !== value) {
      this.history.push({
        timestamp: new Date().toISOString(),
        key: key,
        oldValue: oldValue,
        newValue: value,
        reason: reason
      });
      
      this.triggerListeners(key, value, oldValue);
    }
  }

  /**
   * Modifica uma flag numérica (adiciona ou subtrai) ou alterna se for booleana
   */
  modifyFlag(key, delta, reason = "Modificação Dinâmica") {
    const current = this.getFlag(key, typeof delta === "number" ? 0 : false);
    if (typeof current === "number" && typeof delta === "number") {
      this.setFlag(key, current + delta, reason);
    } else if (typeof current === "boolean") {
      this.setFlag(key, !current, reason);
    } else {
      this.setFlag(key, delta, reason);
    }
  }

  /**
   * Obtém o valor atual de uma flag, ou retorna defaultValue caso não exista
   */
  getFlag(key, defaultValue = null) {
    if (this.flags.hasOwnProperty(key)) {
      return this.flags[key];
    }
    return defaultValue;
  }

  /**
   * Verifica se os requisitos de um evento, missão ou diálogo são cumpridos.
   * Suporta números (mínimo, máximo, igual), booleanos e strings.
   * Exemplo de reqs:
   * {
   *   "flag_honra": { "min": 10 },
   *   "flag_corrupcao": { "max": 5 },
   *   "flag_rei_confia": true,
   *   "flag_guilda_ladroes": "aliado"
   * }
   */
  checkRequirements(requirements) {
    if (!requirements || Object.keys(requirements).length === 0) {
      return true;
    }

    for (const [key, expected] of Object.entries(requirements)) {
      // Se for verificação especial de guild ou dragon no escopo das flags
      if (key === "guild" || key === "dragon" || key === "level" || key === "location") {
        continue; // Estes são verificados por validadores externos no EventsEngine
      }

      const actualValue = this.getFlag(key);

      // Se o requisito é um objeto de comparação numérica ({ min: 10, max: 50, eq: 20 })
      if (typeof expected === "object" && expected !== null && !Array.isArray(expected)) {
        if (expected.min !== undefined && (typeof actualValue !== "number" || actualValue < expected.min)) {
          return false;
        }
        if (expected.max !== undefined && (typeof actualValue !== "number" || actualValue > expected.max)) {
          return false;
        }
        if (expected.eq !== undefined && actualValue !== expected.eq) {
          return false;
        }
        if (expected.neq !== undefined && actualValue === expected.neq) {
          return false;
        }
      } else if (Array.isArray(expected)) {
        // Se expected é um array, o valor real deve estar dentro do array
        if (!expected.includes(actualValue)) {
          return false;
        }
      } else {
        // Comparação direta de valor (booleano, número exato, string)
        if (actualValue !== expected) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Adiciona um ouvinte para disparar quando certa flag mudar
   */
  addListener(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  triggerListeners(key, newValue, oldValue) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(cb => cb(newValue, oldValue, key));
    }
  }

  /**
   * Retorna um resumo ou todas as flags para salvar/auditar
   */
  exportFlags() {
    return {
      flags: JSON.parse(JSON.stringify(this.flags)),
      history: this.history.slice(-50) // Mantém os 50 registros mais recentes
    };
  }

  importFlags(data) {
    if (data && data.flags) {
      this.flags = data.flags;
      this.history = data.history || [];
    } else if (data) {
      this.flags = data;
    }
  }

  /**
   * Retorna lista formatada de todas as flags para o painel de Auditoria no jogo
   */
  getAuditList(filter = "") {
    const list = [];
    for (const [key, value] of Object.entries(this.flags)) {
      if (!filter || key.toLowerCase().includes(filter.toLowerCase())) {
        list.push({ key, value });
      }
    }
    return list.sort((a, b) => a.key.localeCompare(b.key));
  }
}

// Instância global do gerenciador de flags
window.flagsManager = new FlagsManager();
