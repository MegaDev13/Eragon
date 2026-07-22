/**
 * Crônica de Aethelgard - Gerenciador de Finais e Epílogo Histórico (endings_manager.js)
 * Avalia milhares de flags e atributos para determinar o desfecho final entre dezenas de arquétipos.
 */

class EndingsManager {
  constructor() {
    this.endings = [
      {
        id: "end_emperor",
        title: "Imperador de Aethelgard e Senhor do Aço-Dragão",
        req: { flag_guerra_eldor_solgard: true, flag_rei_confia: true, dragon_bond: { min: 80 }, player_gold: { min: 1000 } },
        description: "Com o Trono de Eldor e o exército de Solgard curvados diante de sua lâmina e do rugido do seu dragão titânico, você unificou os reinos fragmentados das cinzas no maior império que o continente já viu. Sua coroação foi selada com fogo draconiano e leis inabaláveis."
      },
      {
        id: "end_king",
        title: "Rei de Eldor e Protetor dos Vales Prateados",
        req: { flag_rainha_lyra_viva: false, governante_eldor: "Rei Vane o Usurpador", rep_reino_eldor: { min: 40 } },
        description: "Após liderar a revolução ou destituir a coroa feudal, o conselho da nobreza e o povo o proclamaram Soberano de Eldor. Você governa do Palácio de Pedra, equilibrando a justiça camponesa com a força dos Lâminas de Ferro."
      },
      {
        id: "end_merchant_legend",
        title: "A Lenda Áurea das Cinco Rotas",
        req: { in_guild_guild_aurea: true, player_gold: { min: 3000 } },
        description: "Você percebeu cedo que coroas enferrujam, mas barras de ouro duram para sempre. Como Grão-Moeda do Sindicato Áureo, você comprou as dívidas dos reis, financiou frotas oceânicas e se tornou o verdadeiro governante invisível de Aethelgard."
      },
      {
        id: "end_dragon_god",
        title: "O Dragão Supremo e Senhor das Nuvens",
        req: { dragon_bond: { min: 95 }, dragon_stage: "Titã Ancestral", in_guild_guild_escama: true },
        description: "Abandonando a pequenez das disputas humanas, você e seu dragão alcançaram a Apoteose Draconiana. Juntos, vocês construíram um santuário entre as estrelas nos Picos Nevados, onde magos e feras aladas vivem em harmonia eterna."
      },
      {
        id: "end_archmage",
        title: "Arquimago do Terceiro Círculo de Valen",
        req: { in_guild_guild_valen: true, flag_segredo_reliquia_sombria: true, flag_corrupcao: { max: 30 } },
        description: "Decifrando o obelisco de Aethel-Khaz e dominando as 12 escolas de feitiçaria, você foi eleito Grão-Mestre de Valen. Seus pergaminhos mágicos protegeram o continente dos eclipses sombrios por séculos."
      },
      {
        id: "end_shadow_master",
        title: "Líder Supremo da Irmandade do Corvo e Rei dos Esgotos",
        req: { in_guild_guild_corvo: true, flag_expulso_guild_ferro: true },
        description: "Ninguém sabe seu verdadeiro nome ou rosto, mas toda taverna, palácio e estrada de Aethelgard paga tributo aos seus espiões. Você transformou a Irmandade do Corvo em uma teia letal que dita o destino de reis."
      },
      {
        id: "end_peasant_martyr",
        title: "O Mártir da Revolução Camponesa",
        req: { flag_salvou_camponeses: true, flag_revolta_camponesa: true },
        description: "Você sacrificou suas posses, ouro e segurança para alimentar os órfãos de Eldor e liderar os camponeses contra a tirania. Embora cicatrizes e fumaça marquem seu corpo, estátuas de bronze com seu nome enchem os pátios das aldeias livres."
      },
      {
        id: "end_blood_tyrant",
        title: "O Tirano Sombrio da Magia de Sangue",
        req: { flag_usou_magia_proibida: true, flag_corrupcao: { min: 70 } },
        description: "Consumido pela corrupção negra e pelo poder do sangue fervedor, você usurpou as ruínas de Aethel-Khaz. Seus exércitos de gárgulas e feiticeiros corrompidos espalham o terror, transformando os vales em um pântano sombrio."
      },
      {
        id: "end_hermit",
        title: "O Ermitão do Vale das Cinzas e Druida Sagrado",
        req: { flag_altar_aether_purificado: true, flag_cidade_queimada: false },
        description: "Cansado das guerras e da ambição dos homens, você se retirou para a Floresta de Lúmen com seu dragão e companheiros leais. Lá, vivendo da seiva fosforescente e do ar limpo, você se tornou o guardião místico das terras selvagens."
      },
      {
        id: "end_traitor_banished",
        title: "O Traidor Banido e Esquecido pelas Rotas",
        req: { flag_traiu_guild_ferro: true, flag_agente_duplo: true },
        description: "Após trair caravanas, reis e guildas por moedas rápidas, todas as portas de Aethelgard se fecharam para você. Despojado de aliados, você vagueia como um mercenário solitário pelas estradas geladas do norte, lembrado apenas como uma lição de desonra."
      },
      {
        id: "end_forgotten_wanderer",
        title: "O Viajante Esquecido pelas Crônicas do Tempo",
        req: {}, // Final padrão de sobrevivência
        description: "Você não buscou coroas nem impérios universais. Você sobreviveu à Era das Cinzas com sua lâmina afiada, salvou amigos quando pôde e enfrentou monstros quando foi preciso. Sua história não está escrita em ouro, mas gravada no coração daqueles cujas vidas você tocou nas estradas de Aethelgard."
      }
    ];
  }

  /**
   * Avalia as flags acumuladas para determinar qual epílogo o jogador alcançou
   */
  evaluateEnding() {
    for (const end of this.endings) {
      if (end.id === "end_forgotten_wanderer") continue; // É o fallback
      
      if (window.flagsManager && window.flagsManager.checkRequirements(end.req)) {
        return end;
      }
    }
    return this.endings[this.endings.length - 1]; // Fallback do viajante
  }

  triggerDeathEnding(reason) {
    const epilogueText = `
      <div class="epilogue-chronicle">
        <h3>CRÔNICA DE UMA VIDA INTERROMPIDA</h3>
        <p class="death-reason"><strong>Causa do Destino:</strong> ${reason}</p>
        <p>No Ano ${window.calendarManager ? window.calendarManager.year : 1042} da Era das Cinzas, sua jornada chegou a um fim definitivo. Nas terras cruéis de Aethelgard, onde não existe proteção de roteiro, suas escolhas e batalhas ecoarão na memória dos NPCs que o conheceram e das guildas que o acolheram.</p>
        <div class="epilogue-stats">
          <p><strong>Nível Alcançado:</strong> ${window.attributesManager?.level || 1}</p>
          <p><strong>Ouro Acumulado:</strong> ${window.inventoryManager?.gold || 0}</p>
          <p><strong>Vínculo Draconiano:</strong> ${window.dragonManager?.bond || 0}%</p>
          <p><strong>Título Final:</strong> ${window.hiddenAttributesManager?.playerTitle || 'O Viajante Desconhecido'}</p>
        </div>
      </div>
    `;

    if (window.ui) {
      window.ui.showModalAlert("CRÔNICA ENCERRADA - MORTE PERMANENTE", epilogueText, "Reiniciar Campanha", () => {
        window.Game.resetGame();
      });
      window.ui.playSound("dramatic_chord");
    }
  }

  triggerRetirementEnding() {
    const end = this.evaluateEnding();
    const epilogueText = `
      <div class="epilogue-chronicle">
        <h3>FINAL DESBLOQUEADO: "${end.title.toUpperCase()}"</h3>
        <p class="ending-desc">${end.description}</p>
        <hr/>
        <h4>Sua Marca em Aethelgard:</h4>
        <div class="epilogue-stats">
          <p><strong>Título no Mundo:</strong> ${window.hiddenAttributesManager?.playerTitle || 'O Viajante Desconhecido'}</p>
          <p><strong>Nível / XP:</strong> Nível ${window.attributesManager?.level || 1} (${window.attributesManager?.xp || 0} XP)</p>
          <p><strong>Ouro no Cofre:</strong> ${window.inventoryManager?.gold || 0} moedas</p>
          <p><strong>Dragão Companheiro:</strong> ${window.dragonManager?.name || 'Nenhum'} (${window.dragonManager?.stage || 'Inexistente'} - ${window.dragonManager?.bond || 0}% de Vínculo)</p>
          <p><strong>Guildas Dominadas:</strong> ${window.guildsManager?.playerJoinedGuilds.length || 0} ordens</p>
          <p><strong>Dias Vividos:</strong> ${window.calendarManager?.getTotalDays() || 1} dias de história</p>
        </div>
      </div>
    `;

    if (window.ui) {
      window.ui.showModalAlert("A CRÔNICA DE AETHELGARD - EPÍLOGO FINAL", epilogueText, "Exportar Crônica em JSON", () => {
        if (window.saveManager) window.saveManager.exportSaveFile();
      });
      window.ui.playSound("victory");
    }
  }
}

window.endingsManager = new EndingsManager();
