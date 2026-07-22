/**
 * Crônica de Aethelgard - Sistema de Companheiros e Diálogos ao Redor da Fogueira (companions_manager.js)
 * Permite conversar ao redor da fogueira, subir lealdade, liberar histórias de fundo e missões exclusivas.
 */

class CompanionsManager {
  constructor() {
    this.companionsDB = {
      comp_borin: {
        id: "comp_borin",
        name: "Borin o Ferreiro",
        title: "Mestre Forjador dos Lâminas de Ferro",
        portrait: "assets/portraits/borin.jpg",
        guildId: "guild_ferro",
        bonus: "+30% durabilidade de armas em combate",
        loyalty: 50,
        unlockedLoreLevel: 0,
        dialogues: [
          {
            reqLoyalty: 0,
            prompt: "Borin afia sua machadinha com força ao lado do fogo. As faíscas iluminam sua barba trançada.",
            question: "Guerreiro, o aço dessas terras está cada vez mais corrompido pelas cinzas. O que faz uma lâmina durar em sua opinião: o minério ou o braço que o empunha?",
            choices: [
              { text: "O minério e as runas sagradas. Sem uma boa forja, até o herói cai no primeiro golpe (+10 Lealdade)", loyaltyMod: 10, reply: "Falou como um verdadeiro forjador! A pedra de Aethel-Khaz não mente." },
              { text: "Apenas o braço do guerreiro. Uma espada ruim nas mãos de um mestre ainda mata (+5 Lealdade)", loyaltyMod: 5, reply: "Hmph. Tem verdade nisso, mas não quebre meus machados por descuido!" },
              { text: "Não importa, desde que corte o pescoço de quem se opõe ao meu ouro (-10 Lealdade)", loyaltyMod: -10, reply: "Ganância e sangue desonram o ferro. Cuidado com o que deseja." }
            ]
          },
          {
            reqLoyalty: 65,
            prompt: "Borin olha para as chamas da fogueira com uma expressão incomum de melancolia.",
            question: "Meu avô morreu defendendo o grande portão de Aethel-Khaz na Grande Ruptura. Você acha que um dia recuperaremos as grandes forjas subterrâneas?",
            choices: [
              { text: "Juntos marcharemos até Khaz e reacenderemos o fogo ancestral com nosso dragão! (+15 Lealdade)", loyaltyMod: 15, reply: "Por Aethel! Se você liderar essa marcha, meu martelo estará na vanguarda!" },
              { text: "O passado está morto, Borin. O ouro e as guerras de hoje são tudo o que importa (-5 Lealdade)", loyaltyMod: -5, reply: "Uma lâmina sem raízes quebra fácil no inverno." }
            ]
          }
        ]
      },
      comp_thalor: {
        id: "comp_thalor",
        name: "Arquimago Thalor",
        title: "Grão-Mestre do Círculo Arcano de Valen",
        portrait: "assets/portraits/thalor.jpg",
        guildId: "guild_valen",
        bonus: "-15% custo de mana nas feitiçarias",
        loyalty: 40,
        unlockedLoreLevel: 0,
        dialogues: [
          {
            reqLoyalty: 0,
            prompt: "Thalor lê um pergaminho flutuante sob a luz azulada de uma esfera arcana.",
            question: "Sua afinidade mágica cresceu. Diga-me, jovem cavaleiro: você teme a corrupção que a magia deixa na alma humana?",
            choices: [
              { text: "Temo a corrupção e busco a disciplina das escolas solares para manter a pureza (+12 Lealdade)", loyaltyMod: 12, reply: "A sabedoria é o escudo do arcanista. Você honra o Círculo de Valen." },
              { text: "O poder supremo vale qualquer sacrifício de sangue ou alma (-15 Lealdade)", loyaltyMod: -15, reply: "Esse é o sussurro que destruiu Aethel-Khaz. Não me obrigue a selar seus poderes." }
            ]
          }
        ]
      },
      comp_kaelen: {
        id: "comp_kaelen",
        name: "Kaelen da Lâmina Sombria",
        title: "Mestre dos Espiões do Corvo",
        portrait: "assets/portraits/kaelen.jpg",
        guildId: "guild_corvo",
        bonus: "+25% furtividade e roubo nas estradas",
        loyalty: 45,
        unlockedLoreLevel: 0,
        dialogues: [
          {
            reqLoyalty: 0,
            prompt: "Kaelen senta-se na sombra, fora do alcance da luz da fogueira, polindo uma adaga escura.",
            question: "A nobreza de Eldor dorme em lençóis de seda enquanto os órfãos do porto comem cinzas. Você hesitaria em apunhalar um rei para alimentar a favela?",
            choices: [
              { text: "A justiça das sombras é a única justiça real. Os reis corruptos pagarão (+15 Lealdade)", loyaltyMod: 15, reply: "Nossos olhos veem a mesma verdade. O Corvo vigia sua retaguarda." },
              { text: "A ordem e as leis do trono precisam ser mantidas contra a anarquia (-12 Lealdade)", loyaltyMod: -12, reply: "Você fala como um cão de guarda com coleira de ouro." }
            ]
          }
        ]
      }
    };
  }

  init(savedData = null) {
    if (savedData) {
      for (const [id, data] of Object.entries(savedData)) {
        if (this.companionsDB[id]) {
          this.companionsDB[id].loyalty = data.loyalty !== undefined ? data.loyalty : this.companionsDB[id].loyalty;
          this.companionsDB[id].unlockedLoreLevel = data.unlockedLoreLevel || 0;
        }
      }
    }
  }

  getActiveCompanionObjects() {
    if (!window.guildsManager || !window.guildsManager.activeCompanions) return [];
    return window.guildsManager.activeCompanions.map(c => this.companionsDB[c.id] || c).filter(Boolean);
  }

  getCompanionById(id) {
    return this.companionsDB[id] || null;
  }

  modifyLoyalty(id, delta) {
    const comp = this.companionsDB[id];
    if (comp) {
      comp.loyalty = Math.max(0, Math.min(100, comp.loyalty + delta));
      if (window.ui) {
        window.ui.showToast(`Lealdade de ${comp.name}: ${delta >= 0 ? '+' : ''}${delta} (${comp.loyalty}%)`, delta >= 0 ? "success" : "warning");
      }
    }
  }

  exportData() {
    return JSON.parse(JSON.stringify(this.companionsDB));
  }
}

window.companionsManager = new CompanionsManager();
