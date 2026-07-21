/**
 * Crônica de Aethelgard - Atributos Ocultos e Perfil de Personalidade da IA (hidden_attributes.js)
 * O jogador nunca vê seus números exatos, mas a IA do mundo aprende quem o jogador é,
 * altera reações dos NPCs e desbloqueia eventos exclusivos baseados no comportamento.
 */

class HiddenAttributesManager {
  constructor() {
    // 12 Atributos Ocultos que variam de -100 a +100 ou 0 a 100
    this.traits = {
      coragem: 10,        // Fuga vs Enfrentamento perigoso
      crueldade: 0,       // Piedade vs Execução/Tortura
      ganancia: 5,        // Roubo/Extorsão vs Doação ouro
      honra: 10,          // Cumprir promessas vs Traição/Mentira
      moralidade: 10,     // Ações justas vs Ações nefastas
      orgulho: 5,         // Humildade vs Arrogância diante de reis/deuses
      compaixão: 10,      // Ajudar feridos/desamparados
      ambicao: 10,        // Busca por poder supremo, coroas e impérios
      lealdade: 10,       // Fidelidade às guildas e companheiros
      curiosidade: 10,    // Investigar segredos proibidos, ruínas e feitiços arriscados
      impulsividade: 5,   // Decisões imediatas vs Esperar/Calcular
      altruismo: 10       // Sacrificar recursos/saúde própria pelo bem comum
    };

    this.playerTitle = "O Viajante Desconhecido";
    this.npcReputationComments = [];
  }

  init(savedData = null) {
    if (savedData && savedData.traits) {
      this.traits = { ...this.traits, ...savedData.traits };
      this.playerTitle = savedData.playerTitle || "O Viajante Desconhecido";
      this.npcReputationComments = savedData.npcReputationComments || [];
    }
    this.evaluatePersonalityProfile();
  }

  /**
   * Modifica um ou mais atributos ocultos via escolhas ou ações.
   * Exemplo de chamada: hiddenAttributesManager.modifyTraits({ altruismo: +1, honra: +2, ganancia: -1 });
   */
  modifyTraits(changes = {}) {
    let triggeredComments = [];
    for (const [key, delta] of Object.entries(changes)) {
      const lowerKey = key.toLowerCase();
      if (this.traits.hasOwnProperty(lowerKey)) {
        const oldVal = this.traits[lowerKey];
        this.traits[lowerKey] = Math.max(-100, Math.min(100, this.traits[lowerKey] + delta));
        
        // Sincronizar com flags para requisitos de eventos rápidos (ex: flag_honra, flag_corrupcao)
        if (window.flagsManager) {
          window.flagsManager.setFlag(`hidden_${lowerKey}`, this.traits[lowerKey], `Decisão (${key} ${delta >= 0 ? '+' : ''}${delta})`);
          if (lowerKey === "honra") window.flagsManager.setFlag("flag_honra", Math.max(0, this.traits[lowerKey]), "Sincronização Atributo Oculto");
          if (lowerKey === "crueldade" && delta > 0) window.flagsManager.modifyFlag("flag_medo", delta, "Crueldade do jogador aumentou");
        }
      }
    }
    this.evaluatePersonalityProfile();
  }

  getTrait(key) {
    return this.traits[key.toLowerCase()] || 0;
  }

  /**
   * Avalia a combinação de traços para determinar a percepção que o mundo tem do jogador.
   * Gera comentários dinâmicos que os NPCs farão em diálogos e tabernas.
   */
  evaluatePersonalityProfile() {
    const t = this.traits;
    const oldTitle = this.playerTitle;

    // Determinar título de reputação e comentários
    if (t.altruismo >= 25 && t.compaixão >= 25) {
      this.playerTitle = "O Protetor dos Fracos e Desamparados";
      this.addComment("Você sempre estende a mão a desconhecidos, mesmo quando não há ouro em troca.");
    } else if (t.crueldade >= 30 || (t.moralidade <= -20 && t.ganancia >= 25)) {
      this.playerTitle = "O Carrasco Implacável das Cinzas";
      this.addComment("Dizem que você nunca deixa testemunhas vivas nem pensa no sofrimento alheio.");
    } else if (t.ganancia >= 30 && t.ambicao >= 25) {
      this.playerTitle = "O Oportunista das Rotas Áureas";
      this.addComment("Os mercadores sabem que sua lealdade tem um preço em moedas de ouro.");
    } else if (t.curiosidade >= 30) {
      this.playerTitle = "O Buscador dos Segredos Arcanos";
      this.addComment("Os magos sussurram sobre sua sede incontrolável pelo conhecimento esquecido de Aethel-Khaz.");
    } else if (t.honra >= 35 && t.lealdade >= 25) {
      this.playerTitle = "A Lâmina da Verdade e Honra";
      this.addComment("Sua palavra vale mais que um juramento real selado em sangue.");
    } else if (t.impulsividade >= 30 && t.coragem >= 30) {
      this.playerTitle = "O Furacão Indomável";
      this.addComment("Você avança sem medo para a fauce dos dragões antes mesmo de sacar a lâmina.");
    } else {
      this.playerTitle = "O Aventureiro de Destino Incerto";
    }

    if (oldTitle !== this.playerTitle && window.ui) {
      window.ui.showToast(`O MUNDO RECONHECE SUA NATUREZA: "${this.playerTitle}"`, "reputation");
    }

    if (window.flagsManager) {
      window.flagsManager.setFlag("player_title", this.playerTitle, "Perfil de Personalidade");
    }
  }

  addComment(commentText) {
    if (!this.npcReputationComments.includes(commentText)) {
      this.npcReputationComments.unshift(commentText);
      if (this.npcReputationComments.length > 10) {
        this.npcReputationComments.pop();
      }
    }
  }

  /**
   * Retorna um comentário aleatório ou relevante que um NPC pode dizer ao interagir com o jogador
   */
  getNPCReactionComment() {
    if (this.npcReputationComments.length === 0) {
      return "Um olhar atento recai sobre você. Os cidadãos avaliam seus passos com cautela.";
    }
    const idx = Math.floor(Math.random() * this.npcReputationComments.length);
    return `"${this.npcReputationComments[idx]}"`;
  }

  exportData() {
    return {
      traits: { ...this.traits },
      playerTitle: this.playerTitle,
      npcReputationComments: [...this.npcReputationComments]
    };
  }
}

window.hiddenAttributesManager = new HiddenAttributesManager();
