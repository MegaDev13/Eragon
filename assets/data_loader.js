/**
 * Crônica de Aethelgard - Carregador Universal de Dados Offline (data_loader.js)
 * Contém o registro completo atualizado dos arquivos JSON no escopo global para garantir execução
 * 100% offline em qualquer navegador ou iframe sem erros de CORS ou fetch local.
 */

window.DATA_REGISTRY = {
  "flags_db": {
    "description": "Banco de dados central de Flags iniciais para Crônica de Aethelgard",
    "initial_flags": {
      "flag_magia": 10,
      "flag_rei_confia": false,
      "flag_dragao_vivo": true,
      "flag_guilda_ladroes": "neutro",
      "flag_cidade_queimada": false,
      "flag_medo": 0,
      "flag_honra": 10,
      "flag_corrupcao": 0,
      "flag_paz_norte": true,
      "flag_guerra_eldor_solgard": false,
      "flag_revolta_camponesa": false,
      "flag_mercador_alden_faliu": false,
      "flag_cidade_sem_alimentos": false,
      "flag_usou_magia_proibida": false,
      "flag_peste_valen": false,
      "flag_traiu_ordem_ferro": false,
      "flag_pacto_dragao_antigo": false,
      "flag_acesso_cidadela_real": false,
      "flag_segredo_reliquia_sombria": false,
      "flag_explorou_ruinas_khaz": false,
      "flag_rainha_lyra_viva": true,
      "flag_imperador_kaelen_vivo": true,
      "flag_arquimago_thalor_aliado": false,
      "flag_roubou_caravana_real": false,
      "flag_impostos_altos": true,
      "flag_culto_abismo_ativo": false,
      "flag_ponte_norte_destruida": false,
      "flag_salvou_aldeia_lumen": false,
      "flag_sacrificou_companheiro": false,
      "flag_reputacao_global": 0
    }
  },
  "locations_db": {
    "locations": [
      {
        "id": "loc_eldoria",
        "name": "Eldoria - A Capital Feudal",
        "region": "Reino de Eldor",
        "type": "cidade",
        "dangerLevel": 1,
        "description": "Baluarte de pedras ancestrais onde a Rainha Lyra governa com braço firme. Suas ruas empedradas cheiram a pão fresco, fuligem de ferreiros e intrigas palacianas.",
        "connectedTo": [
          "loc_vale_cinzas",
          "loc_floresta_lumen",
          "loc_porto_valen"
        ],
        "travelDays": 1,
        "canCamp": true,
        "hasMarket": true,
        "hasGuildHub": true,
        "regionalFlag": "reino_eldor"
      },
      {
        "id": "loc_vale_cinzas",
        "name": "Vale das Cinzas Prateadas",
        "region": "Terras Neutras",
        "type": "ermo",
        "dangerLevel": 2,
        "description": "Um vale silencioso coberto pelo pó prateado de antigos obeliscos destruídos na Grande Ruptura. Onde a magia se manifesta como miragens cintilantes.",
        "connectedTo": [
          "loc_eldoria",
          "loc_picos_dragao",
          "loc_ruinas_khaz"
        ],
        "travelDays": 2,
        "canCamp": true,
        "hasMarket": false,
        "hasGuildHub": false,
        "regionalFlag": "vale_cinzas"
      },
      {
        "id": "loc_picos_dragao",
        "name": "Picos Nevados dos Dragões",
        "region": "Confederação de Val-Drak",
        "type": "montanha",
        "dangerLevel": 4,
        "description": "Montanhas imponentes rasgando as nuvens frias do norte. Nas cavernas vulcânicas mais altas, dragões ancestrais constroem seus ninhos sobre ouro e obsidiana.",
        "connectedTo": [
          "loc_vale_cinzas",
          "loc_cidadela_ferro",
          "loc_santuario_flutuante"
        ],
        "travelDays": 3,
        "canCamp": true,
        "hasMarket": false,
        "hasGuildHub": true,
        "regionalFlag": "picos_dragao"
      },
      {
        "id": "loc_floresta_lumen",
        "name": "Floresta Élfica de Lúmen",
        "region": "Terras Druídicas",
        "type": "floresta",
        "dangerLevel": 3,
        "description": "Árvores milenares cujas folhas brilham com energia fosforescente à noite. Lar do Círculo Druídico e de feras mágicas que não toleram invasores com machados de ferro.",
        "connectedTo": [
          "loc_eldoria",
          "loc_pantano_almas",
          "loc_ruinas_khaz"
        ],
        "travelDays": 2,
        "canCamp": true,
        "hasMarket": false,
        "hasGuildHub": false,
        "regionalFlag": "floresta_lumen"
      },
      {
        "id": "loc_ruinas_khaz",
        "name": "Ruínas Subterrâneas de Aethel-Khaz",
        "region": "Terras Esquecidas",
        "type": "ruinas",
        "dangerLevel": 5,
        "description": "Labirintos colossais cavados por uma civilização anã extinta há milênios. Gárgulas de pedra animada por magias rúnicas guardam cofres selados a sete chaves.",
        "connectedTo": [
          "loc_vale_cinzas",
          "loc_floresta_lumen",
          "loc_deserto_solgard"
        ],
        "travelDays": 3,
        "canCamp": true,
        "hasMarket": false,
        "hasGuildHub": false,
        "regionalFlag": "ruinas_khaz"
      },
      {
        "id": "loc_porto_valen",
        "name": "Porto Livre de Valen",
        "region": "Costa Ocidental",
        "type": "cidade",
        "dangerLevel": 2,
        "description": "O porto mais movimentado do continente, onde navios mercantes trazem especiarias, contrabandistas negociam relíquias proibidas e a Irmandade do Corvo opera nas sombras.",
        "connectedTo": [
          "loc_eldoria",
          "loc_ilhas_névoa",
          "loc_deserto_solgard"
        ],
        "travelDays": 2,
        "canCamp": true,
        "hasMarket": true,
        "hasGuildHub": true,
        "regionalFlag": "porto_valen"
      },
      {
        "id": "loc_deserto_solgard",
        "name": "Dunas de Obsidiana de Solgard",
        "region": "Império de Solgard",
        "type": "deserto",
        "dangerLevel": 4,
        "description": "Areias escuras e escaldantes que escondem poços de petróleo alquímico e ruínas solares do Império de Solgard. O calor drena a força de qualquer viajante despreparado.",
        "connectedTo": [
          "loc_ruinas_khaz",
          "loc_porto_valen",
          "loc_cidade_solgard"
        ],
        "travelDays": 4,
        "canCamp": true,
        "hasMarket": false,
        "hasGuildHub": false,
        "regionalFlag": "deserto_solgard"
      },
      {
        "id": "loc_cidade_solgard",
        "name": "Cidadela de Solgard - O Trono Imperial",
        "region": "Império de Solgard",
        "type": "cidade",
        "dangerLevel": 2,
        "description": "Muralhas de bronze polido refletem a luz do sol de forma cegante. O Imperador Kaelen VII governa com legiões disciplinadas e engenheiros alquímicos.",
        "connectedTo": [
          "loc_deserto_solgard",
          "loc_oasís_ouro"
        ],
        "travelDays": 2,
        "canCamp": true,
        "hasMarket": true,
        "hasGuildHub": true,
        "regionalFlag": "imperio_solgard"
      },
      {
        "id": "loc_pantano_almas",
        "name": "Pântano das Almas Perdidas",
        "region": "Sul Sombrio",
        "type": "pantano",
        "dangerLevel": 5,
        "description": "Lodaçais tóxicos e nevoeiros impenetráveis onde feitiços de necromancia ecoam sem aviso. Apenas feiticeiros renegados e bestas mutantes ousam chamar este pântano de lar.",
        "connectedTo": [
          "loc_floresta_lumen",
          "loc_torre_negra"
        ],
        "travelDays": 3,
        "canCamp": true,
        "hasMarket": false,
        "hasGuildHub": false,
        "regionalFlag": "pantano_almas"
      },
      {
        "id": "loc_santuario_flutuante",
        "name": "Santuário Flutuante de Aether",
        "region": "Picos Nevados",
        "type": "templo",
        "dangerLevel": 3,
        "description": "Suspenso por cristais de gravitação ancestral, este templo no céu é a sede dos Grão-Mestres da Ordem Arcana e o berçário sagrado dos Dragões do Ar.",
        "connectedTo": [
          "loc_picos_dragao"
        ],
        "travelDays": 2,
        "canCamp": true,
        "hasMarket": false,
        "hasGuildHub": true,
        "regionalFlag": "santuario_flutuante"
      },
      {
        "id": "loc_cidadela_ferro",
        "name": "Cidadela da Lâmina de Ferro",
        "region": "Fronteira Norte",
        "type": "fortaleza",
        "dangerLevel": 3,
        "description": "Uma fortaleza militar encravada no rochedo, sede dos Lâminas de Ferro. Mercenários, cavaleiros veteranos e ferreiros lendários treinam incansavelmente em seus pátios.",
        "connectedTo": [
          "loc_picos_dragao"
        ],
        "travelDays": 2,
        "canCamp": true,
        "hasMarket": true,
        "hasGuildHub": true,
        "regionalFlag": "cidadela_ferro"
      },
      {
        "id": "loc_oasís_ouro",
        "name": "Sultanato das Areias de Ouro (Aramis)",
        "region": "Sultanato de Aramis",
        "type": "cidade",
        "dangerLevel": 2,
        "description": "Um oásis suntuoso repleto de palácios com cúpulas de ouro, bazares exuberantes de tapeçarias e especiarias de terras distantes.",
        "connectedTo": [
          "loc_cidade_solgard"
        ],
        "travelDays": 3,
        "canCamp": true,
        "hasMarket": true,
        "hasGuildHub": true,
        "regionalFlag": "oasis_ouro"
      }
    ]
  },
  "kingdoms_db": {
    "kingdoms": [
      {
        "id": "reino_eldor",
        "name": "Reino de Eldor",
        "ruler": "Rainha Lyra de Eldor",
        "politics": "Monarquia Feudal",
        "economyState": "Próspera",
        "economyGoldPool": 120000,
        "armyStrength": 85,
        "corruption": 25,
        "religion": "Culto à Luz Solar de Aethel",
        "technology": "Ferro e Escudos Pesados",
        "magicLevel": "Baixo (Desconfiança Arcana)",
        "reputationWithPlayer": 10,
        "diplomacy": {
          "imperio_solgard": "Tensão Fronteiriça",
          "confederacao_valdrak": "Paz e Comércio",
          "sultanato_aramis": "Acordo Comercial",
          "teocracia_aethel": "Aliança Sagrada",
          "grao_ducado_vaelor": "Acordo Comercial",
          "horda_khaz": "Guerra Defensiva"
        },
        "description": "O mais antigo reino feudal das cinzas, sustentado pela agricultura dos vales e pela cavalaria pesada de Eldoria."
      },
      {
        "id": "imperio_solgard",
        "name": "Império de Solgard",
        "ruler": "Imperador Kaelen VII",
        "politics": "Império Militar e Alquímico",
        "economyState": "Estável",
        "economyGoldPool": 250000,
        "armyStrength": 95,
        "corruption": 40,
        "religion": "A Ordem da Chama Eterna",
        "technology": "Pólvora Alquímica e Bestas Mecânicas",
        "magicLevel": "Médio (Magia de Fogo e Runas)",
        "reputationWithPlayer": 0,
        "diplomacy": {
          "reino_eldor": "Tensão Fronteiriça",
          "confederacao_valdrak": "Tensão Arrojada",
          "sultanato_aramis": "Aliança Econômica",
          "teocracia_aethel": "Tensão Arrojada",
          "grao_ducado_vaelor": "Tratado de Pólvora",
          "horda_khaz": "Guerra Total"
        },
        "description": "Uma potência imperial implacável nascida no deserto de obsidiana, obcecada por ordem, conquista e armas alquímicas."
      },
      {
        "id": "confederacao_valdrak",
        "name": "Confederação de Val-Drak",
        "ruler": "Conselho dos Quatro Picos e Arquimago Thalor",
        "politics": "Conselho Merito-Arcano",
        "economyState": "Estável",
        "economyGoldPool": 90000,
        "armyStrength": 70,
        "corruption": 15,
        "religion": "Veneração aos Dragões e Aether",
        "technology": "Cristais Flutuantes e Forja Rúnica",
        "magicLevel": "Supremo (Todas as Escolas Arcanas)",
        "reputationWithPlayer": 15,
        "diplomacy": {
          "reino_eldor": "Paz e Comércio",
          "imperio_solgard": "Tensão Arrojada",
          "sultanato_aramis": "Paz e Comércio",
          "teocracia_aethel": "Guerra Fria Mística",
          "grao_ducado_vaelor": "Paz e Comércio",
          "horda_khaz": "Tensão Fronteiriça"
        },
        "description": "Cidades livres situadas nas alturas dos picos nevados, onde dragões e magos convivem em simbiose mística."
      },
      {
        "id": "sultanato_aramis",
        "name": "Sultanato das Areias de Ouro (Aramis)",
        "ruler": "Sultão Harun Al-Dajir",
        "politics": "Oligarquia Mercantil",
        "economyState": "Próspera",
        "economyGoldPool": 400000,
        "armyStrength": 60,
        "corruption": 55,
        "religion": "O Grande Moeda-Sol",
        "technology": "Navegação Oceânica e Especiarias",
        "magicLevel": "Médio (Ilusões e Magia de Sangue Oculta)",
        "reputationWithPlayer": 5,
        "diplomacy": {
          "reino_eldor": "Acordo Comercial",
          "imperio_solgard": "Aliança Econômica",
          "confederacao_valdrak": "Paz e Comércio",
          "teocracia_aethel": "Acordo Comercial",
          "grao_ducado_vaelor": "Tensão Naval",
          "horda_khaz": "Tratado de Contrabando"
        },
        "description": "O centro nervoso do comércio continental, onde tudo e todos têm um preço em barras de ouro purificado."
      },
      {
        "id": "teocracia_aethel",
        "name": "Teocracia Solar de Aethel-Lúmen",
        "ruler": "Oráculo Seraphina a Alta Sacerdotisa",
        "politics": "Teocracia Dogmática",
        "economyState": "Estável",
        "economyGoldPool": 160000,
        "armyStrength": 80,
        "corruption": 10,
        "religion": "A Inquisição da Luz Celestial",
        "technology": "Armaduras Douradas e Espelhos Solares",
        "magicLevel": "Alto (Apenas Magia de Luz e Espiritual)",
        "reputationWithPlayer": 0,
        "diplomacy": {
          "reino_eldor": "Aliança Sagrada",
          "imperio_solgard": "Tensão Arrojada",
          "confederacao_valdrak": "Guerra Fria Mística",
          "sultanato_aramis": "Acordo Comercial",
          "grao_ducado_vaelor": "Paz e Comércio",
          "horda_khaz": "Cruzada Santa"
        },
        "description": "Baluarte sagrado nas montanhas orientais. Seus inquisidores perseguem implacavelmente necromantes e praticantes da Magia de Sangue."
      },
      {
        "id": "grao_ducado_vaelor",
        "name": "Grão-Ducado de Vaelor (Fardos do Oeste)",
        "ruler": "Grão-Duque Roderick de Braço de Ferro",
        "politics": "Militarismo Feudal Costeiro",
        "economyState": "Estável",
        "economyGoldPool": 140000,
        "armyStrength": 88,
        "corruption": 30,
        "religion": "Veneração ao Mar e Lâminas",
        "technology": "Frotas Galeões e Aço Prateado",
        "magicLevel": "Baixo (Uso Pragmático de Runas)",
        "reputationWithPlayer": 5,
        "diplomacy": {
          "reino_eldor": "Acordo Comercial",
          "imperio_solgard": "Tratado de Pólvora",
          "confederacao_valdrak": "Paz e Comércio",
          "sultanato_aramis": "Tensão Naval",
          "teocracia_aethel": "Paz e Comércio",
          "horda_khaz": "Guerra Marítima"
        },
        "description": "Potência naval do ocidente. Suas frotas de guerra controlam as saídas oceânicas e exigem pedágio dos navios mercantes."
      },
      {
        "id": "horda_khaz",
        "name": "Horda Nômade de Khaz-Dûm (Herdeiros do Abismo)",
        "ruler": "Khã Vorak o Esmaga-Pedras",
        "politics": "Confederação Nômade de Clãs",
        "economyState": "Crise",
        "economyGoldPool": 75000,
        "armyStrength": 92,
        "corruption": 5,
        "religion": "Espíritos da Terra e Feras",
        "technology": "Machados Pesados e Montarias Selvagens",
        "magicLevel": "Médio (Xamanismo e Invocação)",
        "reputationWithPlayer": -5,
        "diplomacy": {
          "reino_eldor": "Guerra Defensiva",
          "imperio_solgard": "Guerra Total",
          "confederacao_valdrak": "Tensão Fronteiriça",
          "sultanato_aramis": "Tratado de Contrabando",
          "teocracia_aethel": "Cruzada Santa",
          "grao_ducado_vaelor": "Guerra Marítima"
        },
        "description": "Clãs guerreiros indomáveis que habitam as fendas subterrâneas e cânions de Aethel-Khaz. Não curvam a cabeça a nenhum rei."
      }
    ]
  },
  "npcs_db": {
    "npcs": [
      {
        "id": "npc_alden",
        "name": "Alden o Mercador",
        "title": "Mestre da Guilda Áurea das Rotas",
        "locationId": "loc_eldoria",
        "profissao": "Comerciante de Grãos e Especiarias",
        "familia": "Esposa e dois filhos em Eldoria",
        "objetivo": "Manter o monopólio de grãos do norte e obter o título de nobreza real.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 0,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Se tiver ouro tilintando no bolso, temos negócios a tratar, viajante.",
        "dialogueFriendly": "Ah, meu amigo confiável! Para você, separei minhas mercadorias mais raras de Solgard.",
        "dialogueHostile": "Afaste-se das minhas carroças! Já reforcei a guarda com mercenários de ferro!"
      },
      {
        "id": "npc_vespera",
        "name": "Capitã Vespera",
        "title": "Comandante da Guarda Real de Eldor",
        "locationId": "loc_eldoria",
        "profissao": "Militar e Protetora da Coroa",
        "familia": "Irmão mais novo servindo na fronteira do deserto",
        "objetivo": "Sufocar a rebelião camponesa e proteger a Rainha Lyra a todo custo.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 10,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Mantenha a lâmina na bainha enquanto caminhar pelas ruas de Eldoria.",
        "dialogueFriendly": "O Reino tem uma dívida de honra com você. Meus cavaleiros estão ao seu dispor.",
        "dialogueHostile": "Traidor da coroa! Rendição ou morte diante da Lâmina de Ferro!"
      },
      {
        "id": "npc_thalor",
        "name": "Arquimago Thalor",
        "title": "Grão-Mestre do Círculo Arcano de Valen",
        "locationId": "loc_porto_valen",
        "profissao": "Estudioso das Escolas Arcanas e Guardião de Relíquias",
        "familia": "Nenhuma (dedicou 120 anos de vida aos pergaminhos)",
        "objetivo": "Decifrar o selo do Abismo antes que o eclipse sangrento acorde os antigos.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 0,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "A magia não é um brinquedo para mercenários imprudentes. O que busca na torre?",
        "dialogueFriendly": "Sua afinidade arcana é admirável. Compartilharei com você os segredos da Quinta Escola.",
        "dialogueHostile": "Sua alma exala corrupção e desonra. Não teste minha paciência temporal!"
      },
      {
        "id": "npc_rainha_lyra",
        "name": "Rainha Lyra de Eldor",
        "title": "Soberana de Aethelgard Ocidental",
        "locationId": "loc_eldoria",
        "profissao": "Rainha e Diplomata",
        "familia": "Dinastia Real dos Eldor (última herdeira direta)",
        "objetivo": "Evitar a invasão do Império de Solgard sem falir o tesouro real.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 0,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Fale com clareza na presença do Trono de Prata, viajante.",
        "dialogueFriendly": "Você provou ser o herói que Aethelgard precisava em tempos de cinzas.",
        "dialogueHostile": "Guardas! Levem este conspirador para as masmorras de pedra!"
      },
      {
        "id": "npc_borin",
        "name": "Borin o Mestre Ferreiro",
        "title": "Forjador de Runas e Aço-Dragão",
        "locationId": "loc_cidadela_ferro",
        "profissao": "Ferreiro e Encantador de Lâminas",
        "familia": "Clã dos Forjadores de Pedra",
        "objetivo": "Forjar a lendária Espada do Eclipse antes de se aposentar.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 15,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Aço não mente. Se quiser uma boa lâmina, traga minério digno ou ouro puro.",
        "dialogueFriendly": "Para um guerreiro como você, meu martelo trabalhará dia e noite sem cobrar juros!",
        "dialogueHostile": "Saia de perto da minha forja antes que eu te marque com ferro em brasa!"
      },
      {
        "id": "npc_kaelen_sombras",
        "name": "Kaelen da Lâmina Sombria",
        "title": "Mestre da Irmandade do Corvo",
        "locationId": "loc_porto_valen",
        "profissao": "Mestre dos Espiões e Contrabando",
        "familia": "Desconhecida (cresceu nos esgotos do Porto)",
        "objetivo": "Controlar todas as rotas de informação e derrubar a nobreza arrogante.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": -5,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Sombra por sombra, informação por informação. O que você tem a oferecer?",
        "dialogueFriendly": "Nossos olhos em cada taverna são seus olhos agora, irmão.",
        "dialogueHostile": "Um contrato com seu nome já foi assinado pela Guilda. Durma com um olho aberto."
      },
      {
        "id": "npc_orin_druida",
        "name": "Ancião Druida Orin",
        "title": "Guardião da Floresta de Lúmen",
        "locationId": "loc_floresta_lumen",
        "profissao": "Sacerdote da Natureza e Curandeiro",
        "familia": "As árvores ancestrais e os animais de Lúmen",
        "objetivo": "Impedir que os lenhadores de Eldoria cortem as árvores sagradas da floresta.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 5,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "A floresta ouve seus passos. Caminhe sem perturbar o equilíbrio sagrado.",
        "dialogueFriendly": "A seiva da vida flui em harmonia com sua alma. Que os espíritos te guiem.",
        "dialogueHostile": "As raízes e feras de Lúmen despedaçarão os inimigos da floresta sagrada!"
      },
      {
        "id": "npc_seraphina",
        "name": "Oráculo Seraphina",
        "title": "Alta Sacerdotisa de Aethel-Lúmen",
        "locationId": "loc_santuario_flutuante",
        "profissao": "Inquisidora Solar e Oráculo",
        "familia": "A Ordem da Luz Celestial",
        "objetivo": "Purificar o continente de qualquer praticante da Magia de Sangue.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 0,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "A luz solar expõe todas as sombras e intenções ocultas de sua alma.",
        "dialogueFriendly": "Sua pureza brilha como uma tocha sagrada nas trevas de Aethelgard.",
        "dialogueHostile": "Sua aura está corrompida! Os inquisidores celestiais o queimarão!"
      },
      {
        "id": "npc_roderick",
        "name": "Grão-Duque Roderick",
        "title": "Soberano dos Fardos do Oeste",
        "locationId": "loc_cidadela_ferro",
        "profissao": "General Naval e Duque Feudal",
        "familia": "Dinastia dos Vaelor do Oeste",
        "objetivo": "Anexar o Porto de Valen sob a autoridade naval do Ducado.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 5,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Nossas frotas controlam os mares. Se você tiver barcos ou espadas, podemos negociar.",
        "dialogueFriendly": "As portas do palácio de Vaelor estarão sempre abertas para o nosso almirante honorário.",
        "dialogueHostile": "Nossos canhões e marujos afundarão qualquer frota que ousar desafiar Vaelor!"
      },
      {
        "id": "npc_vorak",
        "name": "Khã Vorak o Esmaga-Pedras",
        "title": "Senhor da Horda Nômade de Khaz-Dûm",
        "locationId": "loc_ruinas_khaz",
        "profissao": "Chefe Guerreiro Nômade",
        "familia": "Os 12 Clãs da Horda do Abismo",
        "objetivo": "Manter os reis feudais longe das relíquias subterrâneas e viver em liberdade.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": -10,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Coroas e títulos de pergaminho não significan nada nos cânions. Mostre sua força na lâmina.",
        "dialogueFriendly": "Você luta como um verdadeiro leão das cinzas! Beberemos hidromel nas tendas do Khã!",
        "dialogueHostile": "Minha machadinha partirá seus ossos e jogará sua carcaça aos lobos-sombrios!"
      },
      {
        "id": "npc_vane",
        "name": "General Vane o Revolucionário",
        "title": "Líder da Revolta Camponesa de Eldor",
        "locationId": "loc_eldoria",
        "profissao": "Ex-General e Líder Rebelde",
        "familia": "Camponeses oprimidos dos Fardos",
        "objetivo": "Derrubar a monarquia da Rainha Lyra e instaurar o governo do povo.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 0,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Enquanto os nobres bebem vinho, nossos filhos comem pó de pedra. Junte-se à revolução ou saia do caminho.",
        "dialogueFriendly": "O povo nunca esquecerá o cavaleiro que libertou os celeiros e quebrou as correntes de Eldor!",
        "dialogueHostile": "Você escolheu ser o carrasco da tirania real. Encontraremos você nas barricadas!"
      },
      {
        "id": "npc_harun",
        "name": "Sultão Harun Al-Dajir",
        "title": "Soberano do Sultanato das Areias de Ouro",
        "locationId": "loc_oasís_ouro",
        "profissao": "Sultão e Grão-Comerciante",
        "familia": "Dinastia Al-Dajir do Deserto",
        "objetivo": "Controlar 100% das rotas oceânicas e dos minérios de obsidiana do continente.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 0,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Bem-vindo aos bazares de ouro de Aramis. Tudo o que existe sob o sol tem um preço em moedas puras.",
        "dialogueFriendly": "Para meu parceiro comercial favorito, meus palácios e tesouros estão à disposição sem cobrança de juros.",
        "dialogueHostile": "Meus mercenários áureos e assassinos têm ordens para fechar todas as rotas e bazares para o seu nome."
      },
      {
        "id": "npc_morgana",
        "name": "Lady Morgana da Corte Sombria",
        "title": "Arquimaga Renegada do Pântano das Almas",
        "locationId": "loc_pantano_almas",
        "profissao": "Necromante e Feiticeira de Sangue",
        "familia": "Desconhecida (exilada do Círculo de Valen há um século)",
        "objetivo": "Despertar os deuses antigos de Aethel-Khaz e dominar a imortalidade através do sangue.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 0,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Os magos covardes de Valen temem o verdadeiro poder que habita no sangue e no abismo. E você?",
        "dialogueFriendly": "O sangue ancestral corre forte em suas veias. Compartilharemos a imortalidade quando o selo se romper.",
        "dialogueHostile": "Sua alma será exaurida e seu corpo servirá como carniça para meus feitiços no pântano!"
      },
      {
        "id": "npc_zorah",
        "name": "Mestre Alquimista Zorah",
        "title": "Engenheira-Chefe das Torres de Pólvora de Solgard",
        "locationId": "loc_cidade_solgard",
        "profissao": "Alquimista e Construtora de Bestas Mecânicas",
        "familia": "Clã da Engenharia Imperial de Solgard",
        "objetivo": "Aperfeiçoar o Titã de Ferro para que o Império conquiste todas as fortalezas do norte.",
        "esta_vivo": true,
        "conhece_jogador": false,
        "confia": 5,
        "odeia": 0,
        "tem_medo": 0,
        "ama": 0,
        "ja_foi_salvo": false,
        "ja_foi_traido": false,
        "dialogueNeutral": "Pólvora, engrenagens e óleo alquímico não têm sentimentos. Ou funcionam com precisão, ou explodem em pedaços.",
        "dialogueFriendly": "Sua mente mecânica é brilhante! Minhas bestas imperiais e poções explosivas estão com desconto de amigo.",
        "dialogueHostile": "Vire as costas antes que eu teste minha nova granada de pólvora-negra sob os pés do seu dragão!"
      }
    ]
  },
  "dragons_db": {
    "species": [
      {
        "id": "dragon_ignis",
        "name": "Ignis Aurum - O Dragão de Fogo Dourado",
        "elemento": "Fogo",
        "temperamento": "Indomável e Protetor",
        "baseWeightKg": 120,
        "baseSpeed": 85,
        "inteligencia": 70,
        "afinidade": 80,
        "agressividade": 75,
        "longevidade": "800 anos",
        "raridade": "Lenda",
        "tamanho": "Médio a Titânico",
        "habilidades": [
          "Sopro de Escamas Incandescentes",
          "Explosão de Brasa",
          "Rugido Sísmico",
          "Voo da Tempestade Dourada"
        ],
        "description": "Uma majestosa criatura de escamas douradas que irradia calor constante. Leal até a morte àqueles que conquistam sua confiança com coragem."
      },
      {
        "id": "dragon_zephyr",
        "name": "Zephyr Caeruleum - O Dragão da Tempestade e Ar",
        "elemento": "Ar e Trovão",
        "temperamento": "Sábio e Veloz",
        "baseWeightKg": 80,
        "baseSpeed": 110,
        "inteligencia": 90,
        "afinidade": 85,
        "agressividade": 45,
        "longevidade": "1200 anos",
        "raridade": "Épico",
        "tamanho": "Esbelto e Aerodinâmico",
        "habilidades": [
          "Sopro de Relâmpago Azul",
          "Asas do Tufão",
          "Esquiva Supersônica",
          "Camuflagem nas Nuvens"
        ],
        "description": "Sua envergadura corta os céus como um raio azul. É o dragão mais rápido e inteligente de Aethelgard, valorizando sabedoria sobre força bruta."
      },
      {
        "id": "dragon_terra",
        "name": "Terra Basalt - O Dragão de Cristal do Abismo",
        "elemento": "Terra e Rocha",
        "temperamento": "Estóico e Inabalável",
        "baseWeightKg": 350,
        "baseSpeed": 40,
        "inteligencia": 60,
        "afinidade": 65,
        "agressividade": 50,
        "longevidade": "2500 anos",
        "raridade": "Raro",
        "tamanho": "Colossal e Blindado",
        "habilidades": [
          "Carapaça de Basalto Indestrutível",
          "Sopro de Fragmentos de Cristal",
          "Terremoto de Cauda",
          "Regeneração Mineral"
        ],
        "description": "Uma fortaleza viva feita de pedra vulcânica e cristais de obsidiana. Quase impossível de ferir por armas convencionais de aço."
      },
      {
        "id": "dragon_umbra",
        "name": "Umbra Noctis - O Dragão das Sombras Primordiais",
        "elemento": "Sombras e Ocultismo",
        "temperamento": "Feroz e Enigmático",
        "baseWeightKg": 95,
        "baseSpeed": 95,
        "inteligencia": 85,
        "afinidade": 70,
        "agressividade": 90,
        "longevidade": "1000 anos",
        "raridade": "Lenda Divina",
        "tamanho": "Furtivo e Sinuoso",
        "habilidades": [
          "Sopro de Fogo-Negro Corruptor",
          "Mergulho na Sombra",
          "Olhar do Terror Mental",
          "Asas da Noite Eterna"
        ],
        "description": "Surgido das fendas escuras de Aethel-Khaz. Suas escamas absorvem a luz ao seu redor e seu rugido congela a alma dos covardes."
      },
      {
        "id": "dragon_sylva",
        "name": "Sylva Viridis - O Dragão da Natureza Ancestral",
        "elemento": "Natureza e Seiva Viva",
        "temperamento": "Pacífico e Curador",
        "baseWeightKg": 140,
        "baseSpeed": 65,
        "inteligencia": 80,
        "afinidade": 95,
        "agressividade": 30,
        "longevidade": "3000 anos",
        "raridade": "Épico",
        "tamanho": "Grande e Coberto de Musgo Mágico",
        "habilidades": [
          "Sopro de Névoa Curativa",
          "Raízes Prisioneiras",
          "Rugido da Regeneração",
          "Simbioze com o Cavaleiro"
        ],
        "description": "Guardião sagrado das florestas druídicas. Sua presença faz plantas crescerem e feridas físicas cicatrizarem em questão de minutos."
      }
    ]
  },
  "spells_db": {
    "schools": [
      {
        "id": "school_fire",
        "name": "Escola do Fogo e Brasa",
        "element": "Fogo",
        "description": "Magia ofensiva bruta. Alta destruição em área, mas gera fadiga térmica rápida se não controlada por Domínio Elemental.",
        "spells": [
          {
            "id": "spell_fireball",
            "name": "Bola de Fogo Rúnica",
            "cost": 15,
            "fatigue": 12,
            "damage": 45,
            "corruption": 0,
            "masteryReq": 1,
            "desc": "Dispara uma esfera incandescente que explode ao impacto."
          },
          {
            "id": "spell_fire_shield",
            "name": "Manto de Escamas Incandescentes",
            "cost": 20,
            "fatigue": 15,
            "damage": 0,
            "defenseBonus": 25,
            "corruption": 0,
            "masteryReq": 2,
            "desc": "Envolve o corpo em chamas puras, queimando atacantes e reduzindo dano físico."
          },
          {
            "id": "spell_inferno",
            "name": "Tempestade de Cinzas Solar",
            "cost": 45,
            "fatigue": 35,
            "damage": 110,
            "corruption": 2,
            "masteryReq": 3,
            "desc": "Incinera o campo de batalha inteiro com a ira do sol de Solgard."
          },
          {
            "id": "spell_meteor_shower",
            "name": "Chuva de Meteoros de Solgard",
            "cost": 75,
            "fatigue": 50,
            "damage": 210,
            "corruption": 5,
            "masteryReq": 4,
            "desc": "Convoca fragmentos em chamas do espaço astral para desintegrar o adversário e suas defesas."
          }
        ]
      },
      {
        "id": "school_water",
        "name": "Escola da Água e Gelo",
        "element": "Água",
        "description": "Manipulação de fluxos e congelamento. Reduz a velocidade e esquiva dos inimigos enquanto resfria a fadiga do conjurador.",
        "spells": [
          {
            "id": "spell_ice_lance",
            "name": "Lança de Gelo Perfurante",
            "cost": 12,
            "fatigue": 10,
            "damage": 38,
            "corruption": 0,
            "masteryReq": 1,
            "desc": "Arremessa um estilhaço congelado de alta pressão."
          },
          {
            "id": "spell_frost_nova",
            "name": "Explosão Congelante do Norte",
            "cost": 28,
            "fatigue": 22,
            "damage": 65,
            "slowEnemy": true,
            "corruption": 0,
            "masteryReq": 2,
            "desc": "Congela o solo, imobilizando adversários por um turno."
          },
          {
            "id": "spell_absolute_zero",
            "name": "Zero Absoluto de Val-Drak",
            "cost": 60,
            "fatigue": 40,
            "damage": 160,
            "freezeBoss": true,
            "corruption": 0,
            "masteryReq": 4,
            "desc": "Congela as moléculas do ar, paralisando até titãs e chefes por completo na rodada de combate."
          }
        ]
      },
      {
        "id": "school_earth",
        "name": "Escola da Terra e Basalto",
        "element": "Terra",
        "description": "A mais estável e defensiva das escolas arcanas. Cria barreiras impenetráveis e ergue pilares rochosos do chão.",
        "spells": [
          {
            "id": "spell_stone_wall",
            "name": "Muralha de Obsidiana",
            "cost": 18,
            "fatigue": 14,
            "defenseBonus": 40,
            "corruption": 0,
            "masteryReq": 1,
            "desc": "Ergue uma barreira de pedra para bloquear ataques pesados."
          },
          {
            "id": "spell_earthquake",
            "name": "Fenda Tectônica",
            "cost": 40,
            "fatigue": 30,
            "damage": 95,
            "corruption": 0,
            "masteryReq": 3,
            "desc": "Rachaduras profundas engolem as fileiras inimigas."
          },
          {
            "id": "spell_obsidian_cataclysm",
            "name": "Cataclismo de Cristal e Basalto",
            "cost": 70,
            "fatigue": 48,
            "damage": 185,
            "defenseBonus": 60,
            "corruption": 0,
            "masteryReq": 4,
            "desc": "Ergue fortalezas de obsidiana que causam esmagamento maciço e tornam o jogador quase invulnerável."
          }
        ]
      },
      {
        "id": "school_air",
        "name": "Escola do Ar e Trovão",
        "element": "Ar",
        "description": "Magia de alta velocidade e relâmpagos cortantes. Sincroniza perfeitamente com dragões de tempestade.",
        "spells": [
          {
            "id": "spell_wind_haste",
            "name": "Asas de Zephyr",
            "cost": 15,
            "fatigue": 10,
            "speedBonus": 30,
            "corruption": 0,
            "masteryReq": 1,
            "desc": "Concede agilidade sobrenatural e iniciativa imediata."
          },
          {
            "id": "spell_chain_lightning",
            "name": "Corrente de Relâmpago",
            "cost": 22,
            "fatigue": 18,
            "damage": 55,
            "chainBonus": true,
            "corruption": 0,
            "masteryReq": 2,
            "desc": "Dispara um raio que salta entre múltiplos alvos."
          },
          {
            "id": "spell_thunder_tempest",
            "name": "Tempestade de Trovões de Zephyr",
            "cost": 65,
            "fatigue": 42,
            "damage": 175,
            "chainBonus": true,
            "corruption": 0,
            "masteryReq": 4,
            "desc": "Eletrocuta o inimigo repetidamente com relâmpagos supersônicos."
          }
        ]
      },
      {
        "id": "school_light",
        "name": "Escola da Luz Solar",
        "element": "Luz",
        "description": "Magia de purificação e cura celestial. Cega inimigos das sombras e restaura a saúde do cavaleiro.",
        "spells": [
          {
            "id": "spell_solar_heal",
            "name": "Toque da Alvorada",
            "cost": 20,
            "fatigue": 15,
            "healAmount": 50,
            "corruption": -5,
            "masteryReq": 1,
            "desc": "Restaura HP instantaneamente e purifica traços de corrupção."
          },
          {
            "id": "spell_holy_ray",
            "name": "Raio de Purificação Solar",
            "cost": 30,
            "fatigue": 25,
            "damage": 75,
            "bonusVsShadow": true,
            "corruption": 0,
            "masteryReq": 2,
            "desc": "Feixe concentrado de luz que cega e desintegra mortos-vivos."
          },
          {
            "id": "spell_celestial_judgment",
            "name": "Julgamento Solar de Aethel",
            "cost": 70,
            "fatigue": 45,
            "damage": 190,
            "healAmount": 80,
            "corruption": -20,
            "masteryReq": 4,
            "desc": "Um pilar de luz divina desce do céu, incinerando feras corrompidas e curando o cavaleiro em +80 HP."
          }
        ]
      },
      {
        "id": "school_shadow",
        "name": "Escola das Sombras e Ocultismo",
        "element": "Sombras",
        "description": "Magia furtiva de ilusão e terror mental. Drena a vontade dos oponentes mas acumula corrupção arcana.",
        "spells": [
          {
            "id": "spell_shadow_blade",
            "name": "Lâmina da Escuridão",
            "cost": 15,
            "fatigue": 12,
            "damage": 50,
            "corruption": 3,
            "masteryReq": 1,
            "desc": "Corta a psique e o corpo do inimigo com sombras condensadas."
          },
          {
            "id": "spell_terror_veil",
            "name": "Véu do Pesadelo Sombrio",
            "cost": 25,
            "fatigue": 20,
            "terrorEffect": true,
            "corruption": 5,
            "masteryReq": 2,
            "desc": "Espalha alucinações apavorantes, reduzindo a moral inimiga a zero."
          },
          {
            "id": "spell_abyssal_rift",
            "name": "Fenda do Abismo Primordial",
            "cost": 65,
            "fatigue": 45,
            "damage": 195,
            "corruption": 12,
            "masteryReq": 4,
            "desc": "Rasga o tecido da realidade com fendas escuras que causam dano mental e físico irrecuperável."
          }
        ]
      },
      {
        "id": "school_nature",
        "name": "Escola da Natureza Druídica",
        "element": "Natureza",
        "description": "A magia de Lúmen. Convocação de vinhas prisioeiras, venenos naturais e cura simbiótica.",
        "spells": [
          {
            "id": "spell_entangle",
            "name": "Raízes Prisioneiras de Lúmen",
            "cost": 16,
            "fatigue": 12,
            "damage": 25,
            "imprison": true,
            "corruption": 0,
            "masteryReq": 1,
            "desc": "Prende as pernas do inimigo com raízes grossas e espinhosas."
          },
          {
            "id": "spell_life_bloom",
            "name": "Regeneração Simbiótica",
            "cost": 25,
            "fatigue": 18,
            "healOverTime": 60,
            "corruption": 0,
            "masteryReq": 2,
            "desc": "Cura contínua que restaura vitalidade ao longo da batalha."
          },
          {
            "id": "spell_forest_titan_wrath",
            "name": "Ira dos Titãs da Floresta",
            "cost": 65,
            "fatigue": 40,
            "damage": 165,
            "healAmount": 65,
            "imprison": true,
            "corruption": 0,
            "masteryReq": 4,
            "desc": "As árvores milenares de Lúmen ganham vida para esmagar os inimigos enquanto curam seu cavaleiro."
          }
        ]
      },
      {
        "id": "school_blood",
        "name": "Escola Proibida de Sangue",
        "element": "Sangue",
        "description": "A mais perigosa das artes arcanas. Sacrifica a própria saúde para liberar poder avassalador.",
        "spells": [
          {
            "id": "spell_blood_boil",
            "name": "Fervura Hemorrágica",
            "cost": 10,
            "hpCost": 25,
            "fatigue": 15,
            "damage": 90,
            "corruption": 8,
            "masteryReq": 1,
            "desc": "Sacrifica 25 de HP para ferver o sangue do adversário, causando dano crítico devastador."
          },
          {
            "id": "spell_vampiric_drain",
            "name": "Exaurir Alma e Sangue",
            "cost": 20,
            "fatigue": 20,
            "damage": 65,
            "lifesteal": true,
            "corruption": 10,
            "masteryReq": 2,
            "desc": "Drena a força vital do alvo e cura o conjurador, mas mancha a alma de corrupção negra."
          },
          {
            "id": "spell_blood_pact_supremacy",
            "name": "Pacto de Sangue do Terceiro Círculo",
            "cost": 30,
            "hpCost": 60,
            "fatigue": 45,
            "damage": 260,
            "corruption": 25,
            "masteryReq": 4,
            "desc": "Sacrifica 60 HP para desfechar a maldição suprema de sangue, causando o maior dano em alvo único de toda Aethelgard."
          }
        ]
      },
      {
        "id": "school_spirit",
        "name": "Escola Espiritual e Ancestral",
        "element": "Espiritual",
        "description": "Comunicação com o plano etéreo. Concede intuição infalível, proteção contra possessões e bênçãos dos heróis do passado.",
        "spells": [
          {
            "id": "spell_spirit_shield",
            "name": "Manto dos Reis Ancestrais",
            "cost": 20,
            "fatigue": 15,
            "defenseBonus": 35,
            "magicDefenseBonus": 50,
            "corruption": 0,
            "masteryReq": 1,
            "desc": "Proteção espectral máxima contra feitiços hostis e terror."
          },
          {
            "id": "spell_ancestral_hero_blessing",
            "name": "Bênção Divina de Aethel",
            "cost": 50,
            "fatigue": 35,
            "healAmount": 120,
            "defenseBonus": 80,
            "corruption": -15,
            "masteryReq": 4,
            "desc": "Convoca os espíritos dos reis fundadores para proteger seu corpo, concedendo +80 Defesa e curando +120 HP."
          }
        ]
      },
      {
        "id": "school_time",
        "name": "Escola Temporal do Relógio Rúnico",
        "element": "Temporal",
        "description": "A rara magia de distorção do tempo. Permite alterar o fluxo dos turnos em combate e reverter danos sofridos.",
        "spells": [
          {
            "id": "spell_time_stop",
            "name": "Dilatação Temporal de Aether",
            "cost": 40,
            "fatigue": 35,
            "extraTurn": true,
            "corruption": 4,
            "masteryReq": 3,
            "desc": "Pára o tempo por alguns segundos, concedendo uma rodada extra imediata ao jogador."
          },
          {
            "id": "spell_temporal_reversal",
            "name": "Reversão Temporal do Relógio Rúnico",
            "cost": 75,
            "fatigue": 50,
            "healAmount": 180,
            "extraTurn": true,
            "corruption": 8,
            "masteryReq": 4,
            "desc": "Rebobina o tempo de batalha, restaurando todo o HP perdido nos últimos turnos e concedendo turno extra."
          }
        ]
      },
      {
        "id": "school_runic",
        "name": "Escola Rúnica de Forja",
        "element": "Rúnica",
        "description": "Gravação de glifos mágicos em armas brancas e escudos, amplificando o combate corpo a corpo com força elemental.",
        "spells": [
          {
            "id": "spell_rune_weapon",
            "name": "Encantar Lâmina com Runa Ancestral",
            "cost": 18,
            "fatigue": 12,
            "weaponBonusDamage": 35,
            "corruption": 0,
            "masteryReq": 1,
            "desc": "Aumenta drasticamente o dano físico e mágico da sua arma equipada durante o combate."
          },
          {
            "id": "spell_runic_apotheosis_forge",
            "name": "Runa da Apoteose de Aço-Dragão",
            "cost": 60,
            "fatigue": 40,
            "weaponBonusDamage": 110,
            "defenseBonus": 50,
            "corruption": 0,
            "masteryReq": 4,
            "desc": "Grava runas divinas em toda a sua armadura e lâmina, transformando seus ataques físicos em tempestades destrutivas."
          }
        ]
      },
      {
        "id": "school_summon",
        "name": "Escola de Invocação do Abismo",
        "element": "Invocação",
        "description": "Abertura de fendas espaciais para convocar golens, familiares arcanos ou elementais para lutar ao seu lado.",
        "spells": [
          {
            "id": "spell_summon_golem",
            "name": "Convocar Golem de Obsidiana",
            "cost": 35,
            "fatigue": 28,
            "summonHelper": "Golem de Obsidiana",
            "corruption": 2,
            "masteryReq": 2,
            "desc": "Invoca um guardião de pedra pesada que absorve ataques destinados a você."
          },
          {
            "id": "spell_summon_spectral_dragon",
            "name": "Invocação do Dragão Espectral de Khaz",
            "cost": 80,
            "fatigue": 55,
            "damage": 220,
            "summonHelper": "Dragão Espectral",
            "corruption": 10,
            "masteryReq": 4,
            "desc": "Convoca o fantasma de um dragão ancestral que ataca ferozmente o inimigo e permanece defendendo seu cavaleiro."
          }
        ]
      }
    ]
  },
  "items_db": {
    "weapons": [
      {
        "id": "w_longsword",
        "name": "Espada Longa Real de Eldor",
        "style": "Espada Longa",
        "peso": 3.5,
        "alcance": "Médio",
        "velocidade": 65,
        "dano": 35,
        "durabilidade": {
          "current": 80,
          "max": 80
        },
        "qualidade": "Refinada",
        "raridade": "Incomum",
        "description": "Uma lâmina perfeitamente equilibrada para combates de cavaleiros na linha de frente."
      },
      {
        "id": "w_twin_blades",
        "name": "Duas Espadas da Tempestade do Sul",
        "style": "Duas Espadas",
        "peso": 2.8,
        "alcance": "Curto-Médio",
        "velocidade": 90,
        "dano": 32,
        "durabilidade": {
          "current": 70,
          "max": 70
        },
        "qualidade": "Refinada",
        "raridade": "Incomum",
        "description": "O par ideal para quem valoriza velocidade e ataques consecutivos sobre defesa."
      },
      {
        "id": "w_katana",
        "name": "Katana da Lua de Prata",
        "style": "Katana",
        "peso": 2.2,
        "alcance": "Médio",
        "velocidade": 85,
        "dano": 40,
        "durabilidade": {
          "current": 60,
          "max": 60
        },
        "qualidade": "Obra-Prima",
        "raridade": "Raro",
        "description": "Lâmina curva extremamente afiada, capaz de causar sangramento crítico com um único golpe preciso."
      },
      {
        "id": "w_greataxe",
        "name": "Machado de Batalha do Quebra-Escudo",
        "style": "Machado",
        "peso": 7,
        "alcance": "Médio",
        "velocidade": 40,
        "dano": 55,
        "durabilidade": {
          "current": 100,
          "max": 100
        },
        "qualidade": "Comum",
        "raridade": "Comum",
        "description": "Sua massa de ferro pesado estilhaça escudos pesados e carapaças minerais de um só golpe."
      },
      {
        "id": "w_warhammer",
        "name": "Martelo de Titã de Basalto",
        "style": "Martelo",
        "peso": 8.5,
        "alcance": "Curto",
        "velocidade": 35,
        "dano": 65,
        "durabilidade": {
          "current": 120,
          "max": 120
        },
        "qualidade": "Refinada",
        "raridade": "Raro",
        "description": "Arma contundente brutal. Causa atordoamento automático em alvos pesados."
      },
      {
        "id": "w_spear",
        "name": "Lança da Alvorada de Solgard",
        "style": "Lança",
        "peso": 4,
        "alcance": "Longo",
        "velocidade": 75,
        "dano": 38,
        "durabilidade": {
          "current": 75,
          "max": 75
        },
        "qualidade": "Refinada",
        "raridade": "Incomum",
        "description": "Permite atacar a uma distância segura, mantendo feras e cavaleiros inimigos afastados."
      },
      {
        "id": "w_dagger",
        "name": "Adaga Sombria do Corvo",
        "style": "Adaga",
        "peso": 0.8,
        "alcance": "Curto",
        "velocidade": 100,
        "dano": 25,
        "durabilidade": {
          "current": 50,
          "max": 50
        },
        "qualidade": "Obra-Prima",
        "raridade": "Raro",
        "description": "Leve e letal quando usada a partir da furtividade (+150% de dano em ataques surpresa)."
      },
      {
        "id": "w_shield",
        "name": "Escudo de Lâmina de Ferro e Bronze",
        "style": "Escudo",
        "peso": 6,
        "alcance": "Defensivo",
        "velocidade": 50,
        "dano": 15,
        "durabilidade": {
          "current": 150,
          "max": 150
        },
        "qualidade": "Refinada",
        "raridade": "Incomum",
        "description": "Absorve até 40 de dano físico por rodada em postura defensiva."
      },
      {
        "id": "w_bow",
        "name": "Arco Longo de Madeira de Lúmen",
        "style": "Arco",
        "peso": 2,
        "alcance": "Extremo",
        "velocidade": 70,
        "dano": 36,
        "durabilidade": {
          "current": 65,
          "max": 65
        },
        "qualidade": "Refinada",
        "raridade": "Incomum",
        "description": "Feito dos galhos flexíveis de Lúmen. Exige alta Precisão e Destreza."
      },
      {
        "id": "w_crossbow",
        "name": "Besta Alquímica Imperatória",
        "style": "Besta",
        "peso": 4.5,
        "alcance": "Extremo",
        "velocidade": 55,
        "dano": 48,
        "durabilidade": {
          "current": 85,
          "max": 85
        },
        "qualidade": "Obra-Prima",
        "raridade": "Épico",
        "description": "Dispara setas perfurantes com força mecânica constante, ignorando metade da armadura inimiga."
      },
      {
        "id": "w_legendary_eclipse",
        "name": "Lâmina do Eclipse Rúnico de Aethel-Khaz",
        "style": "Espada Longa",
        "peso": 3,
        "alcance": "Médio-Longo",
        "velocidade": 85,
        "dano": 88,
        "durabilidade": {
          "current": 300,
          "max": 300
        },
        "qualidade": "Lenda Divina",
        "raridade": "Lenda",
        "uniqueProc": "Dano de Fogo-Negro + Regeneração de Vontade",
        "description": "A mítica espada forjada no núcleo vulcânico de Aethel-Khaz antes da Grande Ruptura. Sua lâmina negra absorve a luz solar e libera cortes arcanos devastadores."
      },
      {
        "id": "w_heroic_dragon_spear",
        "name": "Lança de Escamas Incandescentes de Ignis",
        "style": "Lança",
        "peso": 3.8,
        "alcance": "Longo",
        "velocidade": 92,
        "dano": 76,
        "durabilidade": {
          "current": 250,
          "max": 250
        },
        "qualidade": "Obra-Prima",
        "raridade": "Épico",
        "uniqueProc": "Perfuração de Armadura 100%",
        "description": "Lança sagrada entalhada em osso de dragão titânico e encimada com uma ponta de obsidiana aquecida pelo sopro draconiano."
      },
      {
        "id": "w_heroic_dwarven_hammer",
        "name": "Martelo Quebra-Montanhas dos Anões Ancestrais",
        "style": "Martelo",
        "peso": 10.5,
        "alcance": "Curto",
        "velocidade": 45,
        "dano": 96,
        "durabilidade": {
          "current": 400,
          "max": 400
        },
        "qualidade": "Lenda Divina",
        "raridade": "Lenda",
        "uniqueProc": "Terremoto Sísmico em Todos os Inimigos",
        "description": "Uma marreta colossal feita de meteorito puro. Cada impacto ressoa no chão como um trovão tectônico que atordoa exércitos inteiros."
      },
      {
        "id": "w_unique_raven_scythe",
        "name": "Foice Sombria do Rei dos Esgotos",
        "style": "Machado",
        "peso": 4.2,
        "alcance": "Médio",
        "velocidade": 95,
        "dano": 72,
        "durabilidade": {
          "current": 200,
          "max": 200
        },
        "qualidade": "Obra-Prima",
        "raridade": "Épico",
        "uniqueProc": "Veneno Hemorrágico Contínuo (+30 Dano/Turno)",
        "description": "A arma secreta do líder máximo da Irmandade do Corvo. Sua lâmina curva escorre veneno de loto negro que nunca seca."
      }
    ],
    "armors": [
      {
        "id": "a_iron_plate",
        "name": "Armadura Pesada da Ordem de Ferro",
        "type": "armadura",
        "peso": 18,
        "defense": 35,
        "magicDefense": 10,
        "qualidade": "Refinada",
        "raridade": "Incomum",
        "description": "Placas espessas de aço e ferro reforçado."
      },
      {
        "id": "a_raven_cloak",
        "name": "Manto Sombrio da Irmandade do Corvo",
        "type": "armadura",
        "peso": 3,
        "defense": 15,
        "magicDefense": 25,
        "stealthBonus": 25,
        "qualidade": "Obra-Prima",
        "raridade": "Raro",
        "description": "Tecido escuro que absorve o som dos passos e aumenta a furtividade nas sombras."
      },
      {
        "id": "a_runic_vest",
        "name": "Peitoral Rúnico de Valen",
        "type": "armadura",
        "peso": 8,
        "defense": 22,
        "magicDefense": 45,
        "willBonus": 30,
        "qualidade": "Lenda",
        "raridade": "Épico",
        "description": "Cravejado com cristais azuis de Aether. Reduz o custo e a fadiga das conjurações mágicas."
      },
      {
        "id": "a_legendary_titan_plate",
        "name": "Manopla e Armadura do Dragão-Titã de Solgard",
        "type": "armadura",
        "peso": 22,
        "defense": 68,
        "magicDefense": 40,
        "qualidade": "Lenda Divina",
        "raridade": "Lenda",
        "description": "Placas espessas forjadas a partir da carapaça indestrutível de um Dragão de Basalto fundida com bronze imperial. Concede invulnerabilidade a fogo e atordoamento."
      },
      {
        "id": "a_unique_queen_mantle",
        "name": "Coroa e Manto de Prata Sombria de Eldor",
        "type": "armadura",
        "peso": 4.5,
        "defense": 30,
        "magicDefense": 65,
        "willBonus": 60,
        "qualidade": "Lenda Divina",
        "raridade": "Lenda",
        "description": "O manto ancestral dos primeiros reis feudais de Aethelgard. Fios de prata tecidos com magia de proteção celestial que purificam feitiços sombrios."
      },
      {
        "id": "a_druidic_living_bark",
        "name": "Carapaça de Seiva Viva de Lúmen",
        "type": "armadura",
        "peso": 9,
        "defense": 42,
        "magicDefense": 50,
        "healTurnBonus": 18,
        "qualidade": "Obra-Prima",
        "raridade": "Épico",
        "description": "Armadura simbiótica que cresce e se regenera em torno do corpo do guerreiro, cicatrizando feridas e cortes automaticamente."
      }
    ],
    "items": [
      {
        "id": "ration_food",
        "name": "Ração de Acampamento e Viagem",
        "type": "consumivel",
        "peso": 0.5,
        "price": 5,
        "description": "Alimento em conserva essencial para viajar entre regiões sem sofrer fome e dano por exaustão."
      },
      {
        "id": "potion_health",
        "name": "Poção de Cura Rápida",
        "type": "consumivel",
        "peso": 0.3,
        "price": 25,
        "healAmount": 60,
        "description": "Elixir vermelho que estanca sangramentos e restaura 60 de HP instantaneamente."
      },
      {
        "id": "potion_willpower",
        "name": "Poção de Vontade Arcana (Mana)",
        "type": "consumivel",
        "peso": 0.3,
        "price": 30,
        "willAmount": 50,
        "fatigueRelief": 20,
        "description": "Restaura 50 de Vontade/Mana e reduz em 20% a Fadiga Mágica acumulada."
      },
      {
        "id": "potion_antidote",
        "name": "Antídoto Druídico de Lúmen",
        "type": "consumivel",
        "peso": 0.2,
        "price": 20,
        "cureDisease": true,
        "description": "Purifica venenos e cura febres de escama em dragões ou cavaleiros."
      },
      {
        "id": "dragon_elixir",
        "name": "Elixir Draconiano Ancestral",
        "type": "consumivel",
        "peso": 1,
        "price": 100,
        "description": "Rara iguaria alquímica que sacia totalmente a fome do seu dragão e aumenta significativamente o vínculo com o cavaleiro."
      },
      {
        "id": "potion_heroic_rebirth",
        "name": "Elixir do Renascimento do Terceiro Círculo",
        "type": "consumivel",
        "peso": 0.5,
        "price": 350,
        "healAmount": 250,
        "willAmount": 200,
        "fatigueRelief": 100,
        "description": "Poderoso elixir dourado-celeste que restaura 100% de HP e Vontade, limpando totalmente a fadiga mágica e febres."
      },
      {
        "id": "mat_iron_ingot",
        "name": "Barra de Aço-Ferro Refinado",
        "type": "material",
        "peso": 2,
        "price": 15,
        "description": "Material fundamental utilizado na forja de armas, armaduras e reparos de lâminas desgastadas."
      },
      {
        "id": "mat_obsidian_crystal",
        "name": "Cristal Rúnico de Obsidiana",
        "type": "material",
        "peso": 0.5,
        "price": 45,
        "description": "Gema extraída de Aethel-Khaz utilizada para encantar armas e fabricar artefatos mágicos."
      },
      {
        "id": "mat_lumen_herb",
        "name": "Erva Fosforescente de Lúmen",
        "type": "material",
        "peso": 0.1,
        "price": 10,
        "description": "Erva medicinal utilizada por alquimistas para preparar poções e antídotos."
      },
      {
        "id": "relic_ring_nine_souls",
        "name": "Anel das Nove Almas de Valen",
        "type": "artefato",
        "peso": 0.1,
        "price": 1200,
        "passiveBonus": "Reduz o custo de todas as feitiçarias em 35% e concede +15 em Afinidade Mágica.",
        "description": "Anel de platina escura cravejado com uma gema que pulsa com as almas dos antigos grão-mestres arcanos."
      },
      {
        "id": "relic_time_tome",
        "name": "Tomo do Tempo Dilatado de Aether",
        "type": "artefato",
        "peso": 2.5,
        "price": 2000,
        "passiveBonus": "Permite conjurar magias temporais sem custo de fadiga e concede +20 de Iniciativa em combate.",
        "description": "Grimório com páginas de ouro flexível gravadas com os segredos celestiais da quarta dimensão."
      },
      {
        "id": "item_engagement_ring",
        "name": "Anel de Noivado Rúnico de Prata e Ouro",
        "type": "presente_romantico",
        "peso": 0.1,
        "price": 500,
        "romanceBoost": 35,
        "description": "Anel entalhado com juramentos de fidelidade eterna, exigido para pedir a mão de qualquer NPC nobre ou guerreiro em noivado."
      },
      {
        "id": "item_wedding_ring",
        "name": "Aliança Sagrada de Casamento de Aethelgard",
        "type": "presente_romantico",
        "peso": 0.1,
        "price": 1000,
        "romanceBoost": 50,
        "description": "Par de alianças abençoadas pelos oráculos celestiais para selar o matrimônio sagrado entre o cavaleiro e seu cônjuge."
      },
      {
        "id": "item_rose_bouquet",
        "name": "Buquê de Rosas Fosforescentes de Lúmen",
        "type": "presente_romantico",
        "peso": 0.3,
        "price": 40,
        "romanceBoost": 15,
        "description": "Flores raras que brilham suavemente no escuro com aroma adocicado, adoradas por magos, damas e guerreiros românticos."
      },
      {
        "id": "item_golden_necklace",
        "name": "Colar Áureo do Sultanato de Aramis",
        "type": "presente_romantico",
        "peso": 0.4,
        "price": 250,
        "romanceBoost": 22,
        "description": "Jóia suntuosa entalhada com ouro purificado de Aramis, perfeita para impressionar a nobreza real e mercadores."
      },
      {
        "id": "item_rare_perfume",
        "name": "Perfume Especiado das Ilhas de Névoa",
        "type": "presente_romantico",
        "peso": 0.2,
        "price": 80,
        "romanceBoost": 18,
        "description": "Frasco de essência exótica e afrodisíaca que desperta memórias de viagens marítimas e flertes apaixonados."
      },
      {
        "id": "item_poetry_book",
        "name": "Coletânea de Poemas Poéticos dos Reis Antigos",
        "type": "presente_romantico",
        "peso": 0.6,
        "price": 60,
        "romanceBoost": 16,
        "description": "Pergaminhos encadernados com baladas de amor e heroísmo medieval, ideais para cortejar intelectuais e sacerdotisas."
      }
    ]
  },
  "skills_db": {
    "archetypes": [
      {
        "id": "tree_swordsman",
        "name": "Maestria do Espadachim",
        "category": "combate",
        "description": "Perfeição no manejo de espadas longas, duplas e katanas. Focado em precisão cortante e contra-ataques fluídos.",
        "skills": [
          {
            "id": "sk_sword_1",
            "name": "Corte da Fenda Rápida",
            "cost": 1,
            "desc": "Aumenta em +15% a velocidade e dano com qualquer espada equipada.",
            "unlocked": false
          },
          {
            "id": "sk_sword_2",
            "name": "Estocada no Ponto Vital",
            "cost": 2,
            "reqSkill": "sk_sword_1",
            "desc": "Acertos críticos causam sangramento contínuo no adversário (+15 dano por turno).",
            "unlocked": false
          },
          {
            "id": "sk_sword_3",
            "name": "Postura do Contra-Ataque de Prata",
            "cost": 3,
            "reqSkill": "sk_sword_2",
            "desc": "Ao defender com sucesso em combate, você desfere imediatamente um contra-ataque sem gastar turno.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_knight",
        "name": "Maestria do Cavaleiro e Escudo",
        "category": "combate",
        "description": "A muralha defensiva de Aethelgard. Absorção de dano pesado e proteção inabalável para companheiros.",
        "skills": [
          {
            "id": "sk_knight_1",
            "name": "Baluarte de Ferro",
            "cost": 1,
            "desc": "Aumenta a Defesa Física Base em +20 e reduz o dano contundente em 25%.",
            "unlocked": false
          },
          {
            "id": "sk_knight_2",
            "name": "Slam do Escudo Pesado",
            "cost": 2,
            "reqSkill": "sk_knight_1",
            "desc": "Permite usar o escudo para atordoar inimigos pesados, quebrando sua iniciativa.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_berserker",
        "name": "Maestria do Berserker",
        "category": "combate",
        "description": "A fúria indomável dos machados e martelos pesados. Quanto menor sua vida, mais devastador se torna seu golpe.",
        "skills": [
          {
            "id": "sk_berserk_1",
            "name": "Fúria de Sangue",
            "cost": 1,
            "desc": "Quando seu HP estiver abaixo de 50%, seu dano com machados e martelos aumenta em +40%.",
            "unlocked": false
          },
          {
            "id": "sk_berserk_2",
            "name": "Golpe Quebra-Crânios",
            "cost": 2,
            "reqSkill": "sk_berserk_1",
            "desc": "Inmune a atordoamento em combate e ignora 50% da defesa física do oponente.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_hunter",
        "name": "Maestria do Caçador e Sobrevivência",
        "category": "exploração",
        "description": "Perícia nas florestas e pântanos. Reduz o consumo de rações em viagem e rastrea feras raras.",
        "skills": [
          {
            "id": "sk_hunt_1",
            "name": "Rastreador de Lúmen",
            "cost": 1,
            "desc": "O consumo de rações ao viajar entre regiões é reduzido à metade e evita emboscadas no pântano.",
            "unlocked": false
          },
          {
            "id": "sk_hunt_2",
            "name": "Conhecedor de Bestas",
            "cost": 2,
            "reqSkill": "sk_hunt_1",
            "desc": "Aumenta o dano contra monstros, gárgulas e feras selvagens em +30%.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_archer",
        "name": "Maestria do Arqueiro e Besta",
        "category": "combate",
        "description": "Atiradores de elite capazes de eliminar alvos antes que eles entrem no alcance de combate corpo a corpo.",
        "skills": [
          {
            "id": "sk_arch_1",
            "name": "Mirar na Brecha da Armadura",
            "cost": 1,
            "desc": "Aumenta a Precisão em +20 e a chance de acerto crítico à distância em +15%.",
            "unlocked": false
          },
          {
            "id": "sk_arch_2",
            "name": "Chuva de Setas Alquímicas",
            "cost": 2,
            "reqSkill": "sk_arch_1",
            "desc": "Dispara três setas rápidas no mesmo turno, atingindo múltiplos alvos ou concentrando no chefe.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_assassin",
        "name": "Maestria do Assassino Sombrio",
        "category": "furtividade",
        "description": "A arte da adaga e do veneno da Irmandade do Corvo. Acertos silenciosos nas sombras.",
        "skills": [
          {
            "id": "sk_ass_1",
            "name": "Passo de Sombra Silencioso",
            "cost": 1,
            "desc": "Aumenta o atributo Furtividade em +5 e desbloqueia opções de invasão silenciosa em eventos.",
            "unlocked": false
          },
          {
            "id": "sk_ass_2",
            "name": "Golpe de Misericórdia (Crítico letal)",
            "cost": 2,
            "reqSkill": "sk_ass_1",
            "desc": "Ataques surpresa com adagas causam 300% de dano crítico inicial contra alvos desprevenidos.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_sorcerer",
        "name": "Maestria do Feiticeiro Arcano",
        "category": "magia",
        "description": "Conhecimento profundo das energias arcanas de Aether e Valen. Reduz custos de canalização e fadiga.",
        "skills": [
          {
            "id": "sk_sorc_1",
            "name": "Canalização Eficiente",
            "cost": 1,
            "desc": "Reduz o custo de Vontade/Mana de todos os feitiços em 20%.",
            "unlocked": false
          },
          {
            "id": "sk_sorc_2",
            "name": "Mente de Aether (Sem Sobrecarga)",
            "cost": 2,
            "reqSkill": "sk_sorc_1",
            "desc": "Aumenta a taxa de recuperação diária de fadiga mágica em +40% e elimina a chance de sobrecarga.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_druid",
        "name": "Maestria do Druida da Natureza",
        "category": "magia",
        "description": "A comunhão com a seiva verde de Lúmen. Regeneração passiva e controle de raízes em combate.",
        "skills": [
          {
            "id": "sk_druid_1",
            "name": "Bênção da Seiva",
            "cost": 1,
            "desc": "Restaura 10 de HP automaticamente no início de cada rodada de combate.",
            "unlocked": false
          },
          {
            "id": "sk_druid_2",
            "name": "Ira da Floresta",
            "cost": 2,
            "reqSkill": "sk_druid_1",
            "desc": "Magias de Natureza causam +35% de dano e prendem inimigos por 2 turnos.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_merchant",
        "name": "Maestria do Mercador Áureo",
        "category": "economia",
        "description": "Negociação fina, monopólio de rotas e extorsão comercial com as guildas áureas.",
        "skills": [
          {
            "id": "sk_merch_1",
            "name": "Lábia de Ouro do Sultanato",
            "cost": 1,
            "desc": "Concede um desconto imediato de 25% na compra de itens e aumenta o valor de venda das mercadorias em 30%.",
            "unlocked": false
          },
          {
            "id": "sk_merch_2",
            "name": "Investidor de Caravana",
            "cost": 2,
            "reqSkill": "sk_merch_1",
            "desc": "Gera uma renda passiva diária de +15 ouro do comércio internacional.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_diplomat",
        "name": "Maestria do Diplomata Real",
        "category": "política",
        "description": "A arte de governar pela palavra, fechar tratados e manipular reis sem derramar sangue.",
        "skills": [
          {
            "id": "sk_dip_1",
            "name": "Palavra da Coroa",
            "cost": 1,
            "desc": "Aumenta o Carisma e Liderança em +4. Desbloqueia opções pacíficas de negociação em quase todas as guerras e missões.",
            "unlocked": false
          },
          {
            "id": "sk_dip_2",
            "name": "Pacto de Não-Agressão",
            "cost": 2,
            "reqSkill": "sk_dip_1",
            "desc": "Guardas reais e exércitos hostis pensam duas vezes antes de atacá-lo em territórios inimigos.",
            "unlocked": false
          }
        ]
      },
      {
        "id": "tree_dragon_tamer",
        "name": "Maestria do Domador de Dragões",
        "category": "dragões",
        "description": "O laço sagrado das Asas de Escama. Otimiza o humor, combate e evolução do seu dragão companheiro.",
        "skills": [
          {
            "id": "sk_drak_1",
            "name": "Voz do Titã Ancestral",
            "cost": 1,
            "desc": "O vínculo diário com o dragão aumenta o dobro mais rápido e o custo de fadiga do voo é zerado.",
            "unlocked": false
          },
          {
            "id": "sk_drak_2",
            "name": "Sincronia de Escamas de Fogo",
            "cost": 2,
            "reqSkill": "sk_drak_1",
            "desc": "Seu dragão ataca com 50% mais força e defende seu cavaleiro de feitiços mortais.",
            "unlocked": false
          }
        ]
      }
    ]
  },
  "guilds_db": {
    "guilds": [
      {
        "id": "guild_ferro",
        "name": "A Ordem dos Lâminas de Ferro",
        "category": "mercenários",
        "hierarchy": [
          "Recruta",
          "Membro de Lâmina",
          "Oficial de Ferro",
          "Conselheiro de Guerra",
          "Grão-Mestre da Forja"
        ],
        "currentRankIndex": 0,
        "reputation": 10,
        "headquarters": "loc_cidadela_ferro",
        "enemies": [
          "guild_corvo"
        ],
        "exclusiveShop": [
          {
            "id": "a_iron_plate",
            "price": 120,
            "reqRank": 1
          },
          {
            "id": "w_greataxe",
            "price": 80,
            "reqRank": 0
          },
          {
            "id": "mat_iron_ingot",
            "price": 12,
            "reqRank": 0
          }
        ],
        "companion": {
          "id": "comp_borin",
          "name": "Borin o Ferreiro",
          "bonus": "+30% durabilidade de armas em combate"
        },
        "canElectLeader": true,
        "canBetray": true,
        "description": "Ordem militar veterana focada em honra de contrato, aço pesado e defesa das fronteiras do norte."
      },
      {
        "id": "guild_valen",
        "name": "O Círculo Arcano de Valen",
        "category": "magos",
        "hierarchy": [
          "Iniciante Arcano",
          "Adepto dos Pergaminhos",
          "Mestre das Escolas",
          "Arquimago do Terceiro Círculo",
          "Grão-Mestre de Valen"
        ],
        "currentRankIndex": 0,
        "reputation": 5,
        "headquarters": "loc_porto_valen",
        "enemies": [
          "guild_ferro"
        ],
        "exclusiveShop": [
          {
            "id": "a_runic_vest",
            "price": 300,
            "reqRank": 2
          },
          {
            "id": "potion_willpower",
            "price": 20,
            "reqRank": 0
          },
          {
            "id": "mat_obsidian_crystal",
            "price": 35,
            "reqRank": 1
          }
        ],
        "companion": {
          "id": "comp_thalor",
          "name": "Aprendiz Lyros",
          "bonus": "-15% custo de mana nas feitiçarias"
        },
        "canElectLeader": true,
        "canBetray": true,
        "description": "Guardiões do conhecimento arcano milenar. Não toleram o uso descontrolado da Magia de Sangue."
      },
      {
        "id": "guild_corvo",
        "name": "A Irmandade do Corvo Sombrio",
        "category": "ladrões e assassinos",
        "hierarchy": [
          "Sombra Nova",
          "Olho Noturno",
          "Lâmina Oculta",
          "Mestre dos Sussurros",
          "O Rei dos Esgotos"
        ],
        "currentRankIndex": 0,
        "reputation": 0,
        "headquarters": "loc_porto_valen",
        "enemies": [
          "guild_ferro",
          "guild_valen"
        ],
        "exclusiveShop": [
          {
            "id": "a_raven_cloak",
            "price": 180,
            "reqRank": 1
          },
          {
            "id": "w_dagger",
            "price": 90,
            "reqRank": 0
          }
        ],
        "companion": {
          "id": "comp_kaelen",
          "name": "Sombra Vane",
          "bonus": "+25% furtividade e roubo nas estradas"
        },
        "canElectLeader": false,
        "canBetray": true,
        "description": "Sindicato subterrâneo que negocia segredos, assassinatos por encomenda e contrabando pelas rotas portuárias."
      },
      {
        "id": "guild_aurea",
        "name": "O Sindicato Áureo das Rotas",
        "category": "comerciantes",
        "hierarchy": [
          "Caixeiro-Viajante",
          "Mestre de Caravana",
          "Barão da Rota",
          "Conselheiro Áureo",
          "O Grão-Moeda"
        ],
        "currentRankIndex": 0,
        "reputation": 15,
        "headquarters": "loc_oasís_ouro",
        "enemies": [
          "guild_corvo"
        ],
        "exclusiveShop": [
          {
            "id": "potion_health",
            "price": 18,
            "reqRank": 0
          },
          {
            "id": "ration_food",
            "price": 3,
            "reqRank": 0
          },
          {
            "id": "dragon_elixir",
            "price": 80,
            "reqRank": 2
          }
        ],
        "companion": {
          "id": "comp_alden",
          "name": "Guarda de Caravana",
          "bonus": "+35% de ouro em recompensas e vendas"
        },
        "canElectLeader": true,
        "canBetray": true,
        "description": "O verdadeiro poder financeiro do continente. Quem controla as carroças de grãos e ouro, controla os reis."
      },
      {
        "id": "guild_escama",
        "name": "O Pacto das Asas de Escama",
        "category": "domadores de dragão",
        "hierarchy": [
          "Aspirante dos Ventos",
          "Cavaleiro do Sopro",
          "Vigilante das Nuvens",
          "Mestre das Escamas",
          "O Cavaleiro Ancestral"
        ],
        "currentRankIndex": 0,
        "reputation": 20,
        "headquarters": "loc_santuario_flutuante",
        "enemies": [],
        "exclusiveShop": [
          {
            "id": "dragon_elixir",
            "price": 60,
            "reqRank": 0
          },
          {
            "id": "w_spear",
            "price": 110,
            "reqRank": 1
          }
        ],
        "companion": {
          "id": "comp_dragon_scout",
          "name": "Vigilante Aéreo",
          "bonus": "+40% de visão do mapa e bônus em batalhas de dragão"
        },
        "canElectLeader": true,
        "canBetray": true,
        "description": "Antiga ordem sagrada dedicada à proteção dos dragões e à paz mística entre humanos e as feras aladas."
      }
    ]
  },
  "quests_db": {
    "quests": [
      {
        "id": "q_alden_caravan",
        "title": "A Caravana de Grãos do Norte",
        "giver": "Alden o Mercador ou Kaelen do Corvo",
        "locationReq": "loc_eldoria",
        "status": "available",
        "description": "Uma pesada caravana da Guilda Áurea carregando grãos e ouro imperial atravessará a estrada do norte esta noite.",
        "objectives": [
          "Decidir o destino da caravana na estrada do Vale das Cinzas"
        ],
        "choices": [
          {
            "text": "Proteger a caravana de Alden dos bandidos da estrada (+Honra, +Ouro, -15 HP)",
            "effects": {
              "gold": 80,
              "xp": 60,
              "hidden": {
                "honra": 15,
                "lealdade": 10,
                "altruismo": 5
              },
              "flags": {
                "flag_mercador_alden_faliu": false,
                "flag_rei_confia": true
              },
              "rep": {
                "reino_eldor": 10,
                "guild_aurea": 15
              }
            },
            "consequence": {
              "delayDays": 10,
              "title": "Estabilidade em Eldor",
              "desc": "Os celeiros de Eldor estão fartos graças à caravana salva. O preço da ração permanece estável."
            }
          },
          {
            "text": "Roubar a caravana para si e deixar os guardas amarrados (+300 Ouro, mas iniciará a cadeia da falência)",
            "effects": {
              "gold": 300,
              "xp": 80,
              "hidden": {
                "ganancia": 25,
                "crueldade": 10,
                "honra": -25
              },
              "flags": {
                "flag_roubou_caravana_real": true
              },
              "rep": {
                "guild_corvo": 20,
                "guild_aurea": -30,
                "reino_eldor": -15
              },
              "triggerSpecialChain": "merchant_robbery"
            }
          },
          {
            "text": "Interceptar as carroças e distribuir os grãos gratuitamente aos camponeses pobres (+Altruísmo extremo, mas Alden faliu)",
            "effects": {
              "gold": 0,
              "xp": 100,
              "hidden": {
                "altruismo": 30,
                "compaixão": 25,
                "honra": 10
              },
              "flags": {
                "flag_salvou_camponeses": true,
                "flag_mercador_alden_faliu": true
              },
              "rep": {
                "reino_eldor": -10,
                "guild_aurea": -40
              }
            },
            "consequence": {
              "delayDays": 15,
              "title": "O Herói das Aldeias",
              "desc": "Os camponeses reverenciam seu nome. A revolta armada contra o palácio perde força porque o povo não passa fome!"
            }
          }
        ]
      },
      {
        "id": "q_dragon_nest",
        "title": "O Ovo no Pico dos Dragões",
        "giver": "Pacto das Asas de Escama",
        "locationReq": "loc_picos_dragao",
        "status": "available",
        "description": "Um ovo raro de Dragão das Sombras foi encontrado em uma caverna instável dos Picos Nevados, cobiçado tanto por magos quanto por mercenários.",
        "objectives": [
          "Resgatar o ovo ou vendê-lo ao Império de Solgard"
        ],
        "choices": [
          {
            "text": "Entregar o ovo ao Santuário Flutuante das Asas de Escama (+Vínculo, +Reputação Sagrada)",
            "effects": {
              "gold": 50,
              "xp": 120,
              "dragonBond": 25,
              "hidden": {
                "altruismo": 10,
                "lealdade": 20
              },
              "flags": {
                "flag_pacto_dragao_antigo": true
              },
              "rep": {
                "guild_escama": 30
              }
            }
          },
          {
            "text": "Vender o ovo aos alquimistas imperiais de Solgard (+450 Ouro, mas escravizarão o filhote)",
            "effects": {
              "gold": 450,
              "xp": 80,
              "dragonBond": -40,
              "hidden": {
                "ganancia": 35,
                "crueldade": 25,
                "compaixão": -30
              },
              "flags": {
                "flag_dragao_vendido_solgard": true
              },
              "rep": {
                "imperio_solgard": 25,
                "guild_escama": -60
              }
            },
            "consequence": {
              "delayDays": 40,
              "title": "A Besta Alquímica de Solgard",
              "desc": "O Império de Solgard transformou o filhote em uma máquina de guerra alquímica, usando-o na invasão do norte."
            }
          }
        ]
      },
      {
        "id": "q_khaz_secret",
        "title": "O Segredo do Obelisco de Aethel-Khaz",
        "giver": "Arquimago Thalor",
        "locationReq": "loc_ruinas_khaz",
        "status": "available",
        "description": "Nas profundezas de Aethel-Khaz, um obelisco rúnico vibra com energia escura. Ele contém os registros proibidos da Era das Cinzas.",
        "objectives": [
          "Decifrar as runas ou destruir o obelisco para sempre"
        ],
        "choices": [
          {
            "text": "Decifrar e absorver o conhecimento proibido (+3 Pontos de Habilidade, +20 Corrupção Arcana)",
            "effects": {
              "skillPoints": 3,
              "xp": 150,
              "corruption": 20,
              "hidden": {
                "curiosidade": 30,
                "ambicao": 20
              },
              "flags": {
                "flag_segredo_reliquia_sombria": true,
                "flag_explorou_ruinas_khaz": true
              },
              "rep": {
                "guild_valen": 20
              }
            }
          },
          {
            "text": "Destruir o obelisco com seu martelo ou magia pura para que o mal nunca retorne (+Honra e Pureza)",
            "effects": {
              "gold": 0,
              "xp": 100,
              "corruption": -15,
              "hidden": {
                "honra": 25,
                "moralidade": 25
              },
              "flags": {
                "flag_explorou_ruinas_khaz": true,
                "flag_obelisco_destruido": true
              },
              "rep": {
                "guild_valen": -15,
                "reino_eldor": 15
              }
            }
          }
        ]
      },
      {
        "id": "q_peasant_revolt",
        "title": "A Fúria diante dos Portões Real",
        "giver": "Rainha Lyra ou Líder Rebelde Vane",
        "locationReq": "loc_eldoria",
        "reqFlags": {
          "flag_revolta_camponesa": true
        },
        "status": "locked",
        "description": "Milhares de camponeses famintos e armados cercam os portões de pedra do Palácio de Eldor. A Rainha Lyra ordena a carga da Lâmina de Ferro, enquanto Vane pede sua ajuda para derrubar o trono.",
        "objectives": [
          "Escolher de qual lado lutar no momento do confronto fatal"
        ],
        "choices": [
          {
            "text": "Liderar a carga dos Lâminas de Ferro ao lado da Capitã Vespera para salvar a Rainha Lyra (+1000 Ouro, -20% HP do povo)",
            "effects": {
              "gold": 1000,
              "xp": 200,
              "hidden": {
                "lealdade": 30,
                "crueldade": 20,
                "altruismo": -30
              },
              "flags": {
                "flag_revolta_camponesa": false,
                "flag_rainha_lyra_viva": true,
                "flag_rei_confia": true
              },
              "rep": {
                "reino_eldor": 50,
                "guild_ferro": 40
              }
            }
          },
          {
            "text": "Abrir os portões por dentro e ajudar Vane a derrubar a nobreza corrupta (+Revolução vitoriosa, mas inicia o caos)",
            "effects": {
              "gold": 200,
              "xp": 250,
              "hidden": {
                "altruismo": 20,
                "ambicao": 30,
                "honra": -15
              },
              "flags": {
                "flag_rainha_lyra_viva": false,
                "governante_eldor": "Rei Vane o Usurpador"
              },
              "rep": {
                "reino_eldor": -60,
                "guild_corvo": 40
              }
            },
            "consequence": {
              "delayDays": 15,
              "title": "Invasão de Solgard",
              "desc": "Aproveitando a queda da Rainha Lyra, o Imperador Kaelen VII declara a Grande Guerra do Norte para anexar Eldor."
            }
          }
        ]
      }
    ]
  },
  "events_main": {
    "events": [
      {
        "id": "event_204",
        "title": "O Convite do Círculo Arcano",
        "description": "Um emisário de manto azul do Círculo Arcano de Valen aproxima-se com cautela. Ele observa a afinidade mística em seus olhos e a imponência do dragão ao seu lado.",
        "requirements": {
          "flag_honra": {
            "min": 10
          },
          "guild": "guild_valen",
          "dragon": true
        },
        "choices": [
          {
            "text": "Aceitar a missão de escolta arcana aos Picos Nevados (+50 Ouro, +2 Honra, +5 Reputação de Guilda)",
            "effects": {
              "gold": 50,
              "hidden": {
                "honra": 2,
                "lealdade": 3
              },
              "rep": {
                "guild_valen": 5
              },
              "flags": {
                "flag_aliado_valen_norte": true
              }
            }
          },
          {
            "text": "Exigir o triplo do pagamento em ouro antes de selar qualquer acordo (+150 Ouro, +5 Ganância, -5 Reputação de Guilda)",
            "effects": {
              "gold": 150,
              "hidden": {
                "ganancia": 5,
                "honra": -2
              },
              "rep": {
                "guild_valen": -5
              }
            }
          }
        ]
      },
      {
        "id": "event_burn_village",
        "title": "A Aldeia em Chamas de Lúmen",
        "description": "No horizonte, colunas de fumaça preta sobem aos céus. Uma companhia de mercenários renegados está incendiando uma pequena aldeia agrícola para extorquir suprimentos.",
        "requirements": {
          "flag_cidade_queimada": false
        },
        "choices": [
          {
            "text": "Atacar os mercenários com seu dragão e espada para salvar as famílias (+100 XP, +15 Altruísmo, mas arrisca graves ferimentos em combate)",
            "effects": {
              "xp": 100,
              "hidden": {
                "altruismo": 15,
                "compaixão": 15,
                "coragem": 10
              },
              "flags": {
                "flag_salvou_aldeia_lumen": true
              },
              "rep": {
                "reino_eldor": 15,
                "guild_ferro": -10
              },
              "combatTrigger": "mercenary_raiders"
            },
            "consequence": {
              "delayDays": 12,
              "title": "A Colheita Farta de Lúmen",
              "desc": "Os camponeses que você salvou enviaram carroças com rações de comida como agradecimento até o seu acampamento."
            }
          },
          {
            "text": "Saquear as casas abandonadas enquanto os mercenários estão distraídos (+180 Ouro, +Rações, mas a aldeia queimará até as cinzas)",
            "effects": {
              "gold": 180,
              "items": {
                "ration_food": 6
              },
              "hidden": {
                "ganancia": 20,
                "crueldade": 15,
                "honra": -20
              },
              "flags": {
                "flag_cidade_queimada": true
              }
            },
            "consequence": {
              "delayDays": 20,
              "title": "A Praga dos Refugiados",
              "desc": "Os sobreviventes da aldeia queimada migraram para Eldoria, espalhando doenças e aumentando o desespero social."
            }
          },
          {
            "text": "Ignorar o conflito e seguir adiante sem se envolver (Nenhum risco, mas os aldeões serão dizimados)",
            "effects": {
              "hidden": {
                "crueldade": 5,
                "altruismo": -10
              },
              "flags": {
                "flag_cidade_queimada": true
              }
            }
          }
        ]
      },
      {
        "id": "event_plague_caravan",
        "title": "A Caravana dos Enfermos",
        "description": "Você encontra uma caravana de mercadores de Valen parada na estrada. Os cavalos morreram de febre e os viajantes tossem sangue negro: a temida Peste Sombria.",
        "requirements": {
          "flag_peste_valen": false
        },
        "choices": [
          {
            "text": "Oferecer seus antídotos e magia solar para purificar os enfermos (+120 XP, +Reputação em Valen, -2 Antídotos)",
            "reqItems": {
              "potion_antidote": 2
            },
            "effects": {
              "xp": 120,
              "items": {
                "potion_antidote": -2
              },
              "hidden": {
                "compaixão": 20,
                "altruismo": 15
              },
              "flags": {
                "flag_peste_valen": false,
                "flag_curou_caravana": true
              },
              "rep": {
                "guild_valen": 25
              }
            }
          },
          {
            "text": "Queimar as carroças à distância para garantir que a epidemia não chegue à capital Eldoria (+Segurança para milhares, -Crueldade aparente)",
            "effects": {
              "xp": 80,
              "hidden": {
                "crueldade": 10,
                "impulsividade": 5
              },
              "flags": {
                "flag_peste_valen": false,
                "flag_queimou_enfermos": true
              },
              "rep": {
                "reino_eldor": 10,
                "guild_valen": -30
              }
            },
            "consequence": {
              "delayDays": 30,
              "title": "Eldoria a Salvo da Peste",
              "desc": "Embora seu método tenha sido brutal, os médicos da corte confirmaram que sua intervenção evitou a Peste Sombria de dizimar a capital."
            }
          },
          {
            "text": "Sair correndo antes de inalar o miasma (-Coragem, a peste avançará para o sul)",
            "effects": {
              "hidden": {
                "coragem": -10
              },
              "flags": {
                "flag_peste_valen": true
              }
            },
            "consequence": {
              "delayDays": 15,
              "title": "A Peste de Valen Alastra-se",
              "desc": "O porto de Valen e as vilas vizinhas foram colocadas em quarentena forçada pela Peste Sombria."
            }
          }
        ]
      },
      {
        "id": "event_orphan_thief",
        "title": "O Ladrão Órfão dos Portões de Ferro",
        "description": "Uma criança magra com roupas remendadas tenta cortar sua bolsa de moedas enquanto você caminha pelo mercado. Ao ser pego, o garoto chora, dizendo que sua irmã está morrendo de fome na favela de Eldoria.",
        "requirements": {
          "location": "loc_eldoria"
        },
        "choices": [
          {
            "text": "Dar 35 moedas de ouro e duas rações ao garoto (+Altruísmo, +Compaixão, +Reputação no Povo)",
            "effects": {
              "gold": -35,
              "items": {
                "ration_food": -2
              },
              "hidden": {
                "altruismo": 18,
                "compaixão": 20
              },
              "flags": {
                "flag_salvou_ladrão_orfao": true
              },
              "rep": {
                "reino_eldor": 5
              }
            },
            "consequence": {
              "delayDays": 18,
              "title": "Os Olhos da Rua em Eldoria",
              "desc": "O garoto que você ajudou tornou-se líder dos órfãos espiões. Ele te entrega um bilhete avisando de uma emboscada na capital antes mesmo dos guardas saberem."
            }
          },
          {
            "text": "Entregar o garoto para a Guarda Real de Eldor para ser julgado pelas leis do reino (+Honra da Lei, -Compaixão)",
            "effects": {
              "hidden": {
                "honra": 10,
                "compaixão": -15
              },
              "rep": {
                "reino_eldor": 10,
                "guild_corvo": -15
              }
            }
          },
          {
            "text": "Quebrar o dedo da criança e jogá-la na lama como lição (+Crueldade extremada, +Medo no Povo)",
            "effects": {
              "hidden": {
                "crueldade": 25,
                "coragem": -5
              },
              "flags": {
                "flag_medo": 15
              },
              "rep": {
                "reino_eldor": -10
              }
            }
          }
        ]
      },
      {
        "id": "event_broken_bridge_toll",
        "title": "A Ponte Partida do Norte",
        "description": "O único acesso às montanhas está bloqueado por mercenários da Lâmina de Ferro. Eles cobram um pedágio abusivo de 120 ouro para autorizar a travessia, afirmando ordens do palácio.",
        "requirements": {
          "flag_ponte_norte_destruida": false
        },
        "choices": [
          {
            "text": "Pagar o pedágio de 120 moedas de ouro para evitar derramamento de sangue (-120 Ouro, +Reputação Lâmina de Ferro)",
            "effects": {
              "gold": -120,
              "rep": {
                "guild_ferro": 10
              }
            }
          },
          {
            "text": "Desafiar o capitão mercenário em combate tático (+150 XP, +Espólio de Ferro, -Reputação Lâmina de Ferro)",
            "effects": {
              "xp": 150,
              "rep": {
                "guild_ferro": -20
              },
              "combatTrigger": "mercenary_raiders"
            }
          },
          {
            "text": "Comandar seu dragão para dar um rugido sismico no céu, aterrorizando os soldados a liberarem a passagem grátis",
            "requirements": {
              "dragon": true
            },
            "effects": {
              "xp": 80,
              "dragonMood": 10,
              "hidden": {
                "coragem": 15,
                "orgulho": 10
              }
            }
          }
        ]
      },
      {
        "id": "event_shrine_of_blades",
        "title": "O Santuário das Lâminas Perdidas",
        "description": "Em um cruzamento silencioso, centenas de espadas enferrujadas estão fincadas na terra em homenagem aos cavaleiros caídos na Guerra de Khaz. Uma espada em especial ainda brilha com inscrições rúnicas prateadas.",
        "requirements": {
          "location": "loc_vale_cinzas"
        },
        "choices": [
          {
            "text": "Retirar a espada brilhante da terra para forjá-la em sua própria arma (+Espada Longa Real, +Ganância, -Honra dos Mortos)",
            "effects": {
              "items": {
                "w_longsword": 1
              },
              "hidden": {
                "ganancia": 15,
                "honra": -20
              },
              "flags": {
                "flag_profanou_santuario_laminas": true
              }
            }
          },
          {
            "text": "Ajoelhar-se em oração pelos guerreiros mortos e deixar 20 moedas de ouro como oferenda (+Honra, +Vontade máxima)",
            "effects": {
              "gold": -20,
              "willpower": 50,
              "hidden": {
                "honra": 20,
                "moralidade": 15
              },
              "flags": {
                "flag_honrou_cavaleiros_caidos": true
              }
            }
          }
        ]
      }
    ]
  },
  "events_exploration": {
    "events": [
      {
        "id": "event_ancient_shrine",
        "title": "O Altar Prateado de Aether",
        "description": "Em meio às cinzas e pedras partidas, um antigo altar de mármore branco emana uma suave ressonância rúnica. Inscrições ancestrais pedem um tributo de sangue ou magia para revelar seu segredo.",
        "requirements": {
          "location": "loc_vale_cinzas"
        },
        "choices": [
          {
            "text": "Sacrificar 25 do seu próprio HP sobre o altar de pedra (+1 Ponto de Atributo, +10 Corrupção)",
            "effects": {
              "hp": -25,
              "attrPoints": 1,
              "corruption": 10,
              "hidden": {
                "coragem": 10,
                "curiosidade": 15
              },
              "flags": {
                "flag_tributo_sangue_aether": true
              }
            }
          },
          {
            "text": "Canalizar sua Vontade Arcana para harmonizar as runas sem derramar sangue (+80 XP, +10 Afinidade Mágica)",
            "effects": {
              "willpower": -40,
              "xp": 80,
              "attrMod": {
                "key": "afinidadeMagica",
                "delta": 2
              },
              "hidden": {
                "curiosidade": 10,
                "sabedoria": 5
              },
              "flags": {
                "flag_altar_aether_purificado": true
              }
            }
          },
          {
            "text": "Afastar-se sem perturbar o sono dos deuses antigos (Nenhum efeito)",
            "effects": {
              "hidden": {
                "coragem": -2
              }
            }
          }
        ]
      },
      {
        "id": "event_lost_merchant_desert",
        "title": "O Mercador Perdido de Solgard",
        "description": "Nas dunas escaldantes de obsidiana, um caixeiro-viajante do Sindicato Áureo rasteja ao lado de um camelo morto por desidratação. Ele implora por um cantil de água e ração.",
        "requirements": {
          "location": "loc_deserto_solgard"
        },
        "choices": [
          {
            "text": "Compartilhar suas rações e água (+50 XP, +25 Reputação Áurea, -2 Rações)",
            "reqItems": {
              "ration_food": 2
            },
            "effects": {
              "xp": 50,
              "items": {
                "ration_food": -2
              },
              "hidden": {
                "altruismo": 15,
                "compaixão": 15
              },
              "rep": {
                "guild_aurea": 25
              },
              "flags": {
                "flag_salvou_mercador_deserto": true
              }
            },
            "consequence": {
              "delayDays": 14,
              "title": "O Agradecimento de Harun",
              "desc": "O mercador salvo era sobrinho do Sultão de Aramis. Você recebeu um crédito especial nas lojas da guilda áurea."
            }
          },
          {
            "text": "Cobrar 120 moedas de ouro pelas duas rações (+120 Ouro, +Ganância, -Compaixão)",
            "reqItems": {
              "ration_food": 2
            },
            "effects": {
              "gold": 120,
              "items": {
                "ration_food": -2
              },
              "hidden": {
                "ganancia": 25,
                "compaixão": -15
              }
            }
          },
          {
            "text": "Saquear os alforjes do camelo morto enquanto o mercador agoniza (+60 Ouro, +Gema Rúnica, +Crueldade)",
            "effects": {
              "gold": 60,
              "items": {
                "mat_obsidian_crystal": 1
              },
              "hidden": {
                "crueldade": 25,
                "ganancia": 20,
                "honra": -25
              },
              "flags": {
                "flag_deixou_mercador_morrer": true
              }
            }
          }
        ]
      },
      {
        "id": "event_dragon_migration",
        "title": "O Voo dos Dragões da Tempestade",
        "description": "As nuvens se abrem nos picos nevados e dezenas de dragões selvagens cortam o céu em uma migração ancestral. Seu dragão olha para as nuvens rugindo, sentindo o chamado de seus irmãos.",
        "requirements": {
          "dragon": true
        },
        "choices": [
          {
            "text": "Permitir que seu dragão voe com eles por algumas horas para fortalecer seus laços selvagens (+15 Humor, +10 Vínculo, +50 XP)",
            "effects": {
              "xp": 50,
              "dragonMood": 15,
              "dragonBond": 10,
              "hidden": {
                "empatia": 10,
                "compaixão": 10
              }
            }
          },
          {
            "text": "Segurar as rédeas e ordenar que permaneça no chão ao seu lado (+10 Disciplina/Dano, mas -15 Humor do dragão)",
            "effects": {
              "dragonMood": -15,
              "hidden": {
                "orgulho": 10,
                "impulsividade": -5
              }
            }
          }
        ]
      },
      {
        "id": "event_moss_altar_druid",
        "title": "A Árvore-Coração de Lúmen",
        "description": "No centro mais profundo da Floresta de Lúmen, a Árvore-Coração goteja uma seiva verde fosforescente com propriedades curativas miraculosas, mas feitiços druídicos testam a intenção dos que se aproximam.",
        "requirements": {
          "location": "loc_floresta_lumen"
        },
        "choices": [
          {
            "text": "Coletar a seiva com reverência e oração druídica (+1 Elixir Draconiano, +10 HP máx, +Reputação Natureza)",
            "effects": {
              "items": {
                "dragon_elixir": 1
              },
              "attrMod": {
                "key": "constituicao",
                "delta": 1
              },
              "hidden": {
                "altruismo": 10,
                "sabedoria": 10
              }
            }
          },
          {
            "text": "Cortar um galho da Árvore-Coração para vender madeira mágica (+250 Ouro, -Reputação Druídica, Feras atacam)",
            "effects": {
              "gold": 250,
              "hidden": {
                "ganancia": 30,
                "crueldade": 15
              },
              "rep": {
                "reino_eldor": -15
              },
              "combatTrigger": "shadow_wolf"
            }
          }
        ]
      },
      {
        "id": "event_dwarven_chest_khaz",
        "title": "O Cofre Selado dos Reis Anões",
        "description": "Em uma câmara colapsada das ruínas de Aethel-Khaz, um cofre de ferro forjado pesado com 7 fechaduras rúnicas emana um calor intenso.",
        "requirements": {
          "location": "loc_ruinas_khaz"
        },
        "choices": [
          {
            "text": "Forçar a abertura com martelo ou força bruta (Risco de explosão rúnica: -35 HP, mas chance de espólio)",
            "effects": {
              "hp": -35,
              "gold": 220,
              "items": {
                "mat_obsidian_crystal": 2
              },
              "hidden": {
                "coragem": 15,
                "impulsividade": 15
              }
            }
          },
          {
            "text": "Decifrar o código rúnico dos anões usando Inteligência e Sabedoria (+280 Ouro, +Gema de Obsidiana, sem dano)",
            "effects": {
              "gold": 280,
              "items": {
                "mat_obsidian_crystal": 3
              },
              "hidden": {
                "curiosidade": 20,
                "sabedoria": 15
              }
            }
          }
        ]
      }
    ]
  },
  "events_political": {
    "events": [
      {
        "id": "event_solgard_embassy",
        "title": "O Embaixador do Imperador Kaelen",
        "description": "Uma comitiva imperial de Solgard intercepta seu caminho perto da fronteira. O embaixador entrega um pergaminho selado: o Imperador Kaelen VII deseja comprar sua lealdade e do seu dragão na iminente guerra contra a Rainha Lyra.",
        "requirements": {
          "flag_guerra_eldor_solgard": false
        },
        "choices": [
          {
            "text": "Assinar o pacto imperial com Solgard (+500 Ouro, +Armadura de Ferro, mas tornará Eldor inimigo total)",
            "effects": {
              "gold": 500,
              "items": {
                "a_iron_plate": 1
              },
              "hidden": {
                "ambicao": 25,
                "lealdade": -15
              },
              "flags": {
                "flag_aliado_solgard": true,
                "flag_rei_confia": false
              },
              "rep": {
                "imperio_solgard": 40,
                "reino_eldor": -60
              }
            },
            "consequence": {
              "delayDays": 25,
              "title": "A Invasão de Solgard com seu Estandarte",
              "desc": "As tropas de Solgard cruzaram a fronteira exibindo seu estandarte e ouro. Eldor prepara suas defesas para o combate."
            }
          },
          {
            "text": "Rasgar o pergaminho e declarar lealdade à Rainha Lyra e a Aethelgard livre (+Honra, +Reputação de Eldor)",
            "effects": {
              "xp": 100,
              "hidden": {
                "honra": 25,
                "lealdade": 25
              },
              "flags": {
                "flag_aliado_eldor": true,
                "flag_rei_confia": true
              },
              "rep": {
                "reino_eldor": 40,
                "imperio_solgard": -50
              }
            }
          },
          {
            "text": "Vender as informações do ataque imperial aos dois lados para lucrar no caos (+350 Ouro, +Ganância extremada)",
            "effects": {
              "gold": 350,
              "hidden": {
                "ganancia": 35,
                "honra": -30
              },
              "flags": {
                "flag_agente_duplo": true
              }
            }
          }
        ]
      },
      {
        "id": "event_guild_tax",
        "title": "O Decreto de Impostos do Palácio",
        "description": "O cobrador real de impostos exige que todas as guildas comerciais paguem um tributo emergencial de 40% em barras de ouro para sustentar a cavalaria de fronteira.",
        "requirements": {
          "flag_impostos_altos": true
        },
        "choices": [
          {
            "text": "Apoiar o imposto da Rainha para fortalecer o exército real (+Reputação Real, -Reputação das Guildas)",
            "effects": {
              "hidden": {
                "lealdade": 10
              },
              "flags": {
                "flag_exerito_reforçado": true
              },
              "rep": {
                "reino_eldor": 25,
                "guild_aurea": -30
              }
            }
          },
          {
            "text": "Ajudar os mercadores a ocultar os cofres de ouro nos esgotos do Porto (+200 Ouro de propina, +Reputação Áurea)",
            "effects": {
              "gold": 200,
              "hidden": {
                "ganancia": 15,
                "honra": -15
              },
              "rep": {
                "guild_aurea": 35,
                "reino_eldor": -25
              }
            }
          }
        ]
      }
    ]
  },
  "narrative_db": {
    "chapters": [
      {
        "id": "chap_1_prologue",
        "title": "Capítulo 1: O Despertar nas Cinzas Prateadas",
        "subtitle": "Onde o destino de um cavaleiro e um dragão é forjado entre as ruínas do passado.",
        "scenes": [
          {
            "id": "scene_1_1",
            "title": "O Sussurro do Obelisco",
            "locationId": "loc_vale_cinzas",
            "illustration": "assets/backgrounds/ash_valley.jpg",
            "npcPortrait": null,
            "text": "O vento uiva através das fendas de basalto no Vale das Cinzas Prateadas. Você acorda sentindo o cheiro de ozônio e fumaça fria. Ao seu lado, a bolsa de couro contendo o ovo do dragão que você jurou proteger vibra com calor suave. A alguns metros, um obelisco rúnico fragmentado emana uma luz ciano intermitente, como se chamasse pelo seu nome.\n\nNo horizonte, o som de cascos de cavalo e ferro tilintando ecoa: uma patrulha de batedores se aproxima da estrada principal. Você precisa decidir como dar seus primeiros passos nas terras implacáveis de Aethelgard.",
            "choices": [
              {
                "text": "Aproximar-se do obelisco e tocar as runas com a mão nua para absorver seu conhecimento ancestral (+100 XP, +2 Afinidade Mágica, +15 Corrupção)",
                "effects": {
                  "xp": 100,
                  "attrMod": {
                    "key": "afinidadeMagica",
                    "delta": 2
                  },
                  "corruption": 15,
                  "hidden": {
                    "curiosidade": 20,
                    "coragem": 10
                  },
                  "flags": {
                    "flag_tocou_obelisco_inicial": true
                  }
                },
                "nextScene": "scene_1_2_arcane"
              },
              {
                "text": "Esconder a bolsa com o ovo sob seu manto e sacar sua arma, preparando-se para emboscar a patrulha que se aproxima (+Furtividade, +Espólio)",
                "effects": {
                  "xp": 80,
                  "attrMod": {
                    "key": "furtividade",
                    "delta": 2
                  },
                  "hidden": {
                    "crueldade": 10,
                    "impulsividade": 15
                  },
                  "flags": {
                    "flag_emboscou_patrulha_inicial": true
                  }
                },
                "nextScene": "scene_1_2_ambush"
              },
              {
                "text": "Ajoelhar-se junto às cinzas e aquecer o ovo em seu peito, priorizando a segurança do filhote sobre qualquer outra coisa (+25 Vínculo Draconiano, +Altruísmo)",
                "effects": {
                  "xp": 90,
                  "dragonBond": 25,
                  "hidden": {
                    "altruismo": 25,
                    "compaixão": 20
                  },
                  "flags": {
                    "flag_priorizou_filhote": true
                  }
                },
                "nextScene": "scene_1_2_bond"
              }
            ]
          },
          {
            "id": "scene_1_2_arcane",
            "title": "O Eco de Aethel-Khaz",
            "locationId": "loc_vale_cinzas",
            "illustration": "assets/backgrounds/ash_valley.jpg",
            "npcPortrait": "assets/portraits/thalor.jpg",
            "text": "Assim que seus dedos tocam a pedra fria, uma torrente de visões invade sua mente: exércitos anões marchando, dragões cobrindo o céu e a queda dos reis antigos. Quando você abre os olhos, um velho feiticeiro de manto azul está parado diante de você, apoiado em um cajado rúnico. É o Arquimago Thalor, Grão-Mestre de Valen.\n\n\"Sua alma resistiu ao toque das runas esquecidas sem se despedaçar,\" murmura Thalor, avaliando seu olhar. \"O Círculo Arcano precisa de guerreiros que compreendam o fardo da magia. Para onde você marcha, viajante?\"",
            "choices": [
              {
                "text": "\"Marcho para Eldoria para oferecer minha lâmina à Rainha Lyra e trazer ordem a este reino.\" (+Reputação com Eldor e Valen)",
                "effects": {
                  "xp": 120,
                  "gold": 60,
                  "hidden": {
                    "honra": 15,
                    "lealdade": 15
                  },
                  "rep": {
                    "reino_eldor": 15,
                    "guild_valen": 15
                  },
                  "flags": {
                    "flag_conheceu_thalor": true
                  }
                },
                "nextScene": "scene_1_3_road"
              },
              {
                "text": "\"Busco apenas segredos e ouro. Se o seu Círculo paga bem, podemos negociar.\" (+150 Ouro, +Ganância)",
                "effects": {
                  "xp": 100,
                  "gold": 150,
                  "hidden": {
                    "ganancia": 25,
                    "ambicao": 15
                  },
                  "rep": {
                    "guild_valen": 5
                  },
                  "flags": {
                    "flag_conheceu_thalor": true
                  }
                },
                "nextScene": "scene_1_3_road"
              }
            ]
          },
          {
            "id": "scene_1_2_ambush",
            "title": "A Patrulha da Lâmina de Ferro",
            "locationId": "loc_vale_cinzas",
            "illustration": "assets/creatures/mercenary_raiders.jpg",
            "npcPortrait": "assets/portraits/vespera.jpg",
            "text": "Você se oculta atrás das pilhas de obsidiana quando três cavaleiros com estandartes da Ordem de Ferro surgem na estrada. Eles revistam carroças abandonadas em busca de fugitivos rebeldes. Ao notarem sua movimentação, o líder da patrulha saca uma espada pesada.\n\n\"Parado aí, viajante das cinzas! Renda suas armas ou enfrente o julgamento do ferro!\"",
            "choices": [
              {
                "text": "Sacar sua arma e enfrentar o Capitão da Patrulha em combate tático agora mesmo!",
                "effects": {
                  "xp": 150,
                  "rep": {
                    "guild_ferro": -15
                  },
                  "combatTrigger": "mercenary_raiders",
                  "flags": {
                    "flag_lutuou_patrulha": true
                  }
                },
                "nextScene": "scene_1_3_road"
              },
              {
                "text": "Exibir o emblema de sua origem e negociar pacificamente sua passagem usando Carisma e Liderança",
                "effects": {
                  "xp": 130,
                  "gold": 50,
                  "hidden": {
                    "honra": 10,
                    "moralidade": 10
                  },
                  "rep": {
                    "guild_ferro": 15,
                    "reino_eldor": 10
                  },
                  "flags": {
                    "flag_negociou_patrulha": true
                  }
                },
                "nextScene": "scene_1_3_road"
              }
            ]
          },
          {
            "id": "scene_1_2_bond",
            "title": "O Eclodir da Escama",
            "locationId": "loc_vale_cinzas",
            "illustration": "assets/dragons/ignis_aurum.jpg",
            "npcPortrait": null,
            "text": "O calor do seu peito é o catalisador final. A casca espessa do ovo racha com um estalido metálico. Um pequeno filhote de dragão emerge, sacudindo as cinzas das asas úmidas. Ele fixa os olhos brilhantes em você, emitindo um suave ronronar que ressoa diretamente em sua mente: o início da telepatia draconiana.\n\nVocê sente sua energia vital se entrelaçar com a dele. Agora vocês são um só diante dos perigos de Aethelgard.",
            "choices": [
              {
                "text": "Alimentar o filhote com sua ração e jurar proteção eterna (+35 Vínculo, +10 Humor do Dragão)",
                "effects": {
                  "items": {
                    "ration_food": -1
                  },
                  "dragonBond": 35,
                  "dragonMood": 20,
                  "xp": 150,
                  "hidden": {
                    "altruismo": 20,
                    "empatia": 25
                  },
                  "flags": {
                    "flag_dragao_nascido_braços": true
                  }
                },
                "nextScene": "scene_1_3_road"
              }
            ]
          },
          {
            "id": "scene_1_3_road",
            "title": "A Encruzilhada para Eldoria",
            "locationId": "loc_vale_cinzas",
            "illustration": "assets/backgrounds/eldoria_city.jpg",
            "npcPortrait": "assets/portraits/alden.jpg",
            "text": "Com os primeiros perigos superados, você avança até o grande marco de pedra no limite do Vale das Cinzas. Diante de você se estendem as estradas para a Capital de Eldoria e para os portos ocidentais de Valen.\n\nUma pesada caravana de grãos comandada pelo mestre mercador Alden está parada no acostamento, com uma roda quebrada. Alden acena para você ansiosamente.\n\n\"Guerreiro! As estradas estão infestadas de saqueadores e minha carga alimenta metade da capital. Se me escoltar até os portões de Eldoria, pagarei em ouro puro e lhe darei passe livre nos bazares!\"",
            "choices": [
              {
                "text": "Aceitar a missão de escoltar Alden até a capital Eldoria (+100 Ouro, +Reputação Áurea e Real)",
                "effects": {
                  "gold": 100,
                  "xp": 180,
                  "hidden": {
                    "honra": 20,
                    "lealdade": 15
                  },
                  "rep": {
                    "guild_aurea": 25,
                    "reino_eldor": 20
                  },
                  "flags": {
                    "flag_escoltou_alden": true,
                    "flag_mercador_alden_faliu": false
                  }
                },
                "nextScene": "scene_2_1_eldoria_gates"
              },
              {
                "text": "Aproveitar a roda quebrada para exigir 300 moedas de ouro antecipadas ou deixá-lo à própria sorte (+300 Ouro, -Honra)",
                "effects": {
                  "gold": 300,
                  "xp": 120,
                  "hidden": {
                    "ganancia": 35,
                    "crueldade": 10,
                    "honra": -25
                  },
                  "rep": {
                    "guild_aurea": -20
                  },
                  "flags": {
                    "flag_extorquiu_alden": true
                  }
                },
                "nextScene": "scene_2_1_eldoria_gates"
              },
              {
                "text": "Seguir viagem sozinho pelo mapa livre, sem amarras com guildas ou mercadores (Exploração Sandbox Livre)",
                "effects": {
                  "xp": 100,
                  "hidden": {
                    "curiosidade": 15
                  }
                },
                "nextScene": "sandbox_free_explore"
              }
            ]
          }
        ]
      },
      {
        "id": "chap_2_eldoria",
        "title": "Capítulo 2: Sob a Coroa de Prata em Eldoria",
        "subtitle": "As muralhas de pedra protegem contra bestas, mas não contra traições no palácio.",
        "scenes": [
          {
            "id": "scene_2_1_eldoria_gates",
            "title": "Os Portões de Pedra",
            "locationId": "loc_eldoria",
            "illustration": "assets/backgrounds/eldoria_city.jpg",
            "npcPortrait": "assets/portraits/vespera.jpg",
            "text": "Você cruza os imponentes portões duplos de ferro de Eldoria. As ruas fervilham com cidadãos preocupados: panfletos colados nas paredes denunciam a escassez iminente e chamam o povo para uma revolta camponesa liderada pelo rebelde Vane.\n\nA Capitã Vespera, comandante da Guarda Real, intercepta seus passos na praça central. Ela reconhece o emblema em sua armadura e a presença mística do seu dragão.\n\n\"A Rainha Lyra convocou conselho extraordinário no Palácio Real,\" diz Vespera, com voz firme. \"O Império de Solgard está movimentando legiões na fronteira e o povo murmura revolução. A coroa precisa saber de que lado a sua lâmina lutará.\"",
            "choices": [
              {
                "text": "Acompanhar Vespera até a sala do Trono para jurar fidelidade à Rainha Lyra e defender a estabilidade do reino",
                "effects": {
                  "xp": 200,
                  "hidden": {
                    "lealdade": 25,
                    "honra": 20
                  },
                  "rep": {
                    "reino_eldor": 30,
                    "guild_ferro": 20
                  },
                  "flags": {
                    "flag_aliado_rainha_lyra": true,
                    "flag_rei_confia": true
                  }
                },
                "nextScene": "scene_2_2_royal_court"
              },
              {
                "text": "Recusar a convocação real e descer aos becos do mercado para procurar os líderes da revolução camponesa (+Revolta)",
                "effects": {
                  "xp": 200,
                  "hidden": {
                    "altruismo": 25,
                    "ambicao": 20,
                    "lealdade": -15
                  },
                  "rep": {
                    "reino_eldor": -25,
                    "guild_corvo": 25
                  },
                  "flags": {
                    "flag_revolta_camponesa": true,
                    "flag_aliado_rebeldes": true
                  }
                },
                "nextScene": "scene_2_2_slums"
              },
              {
                "text": "Entrar na Taverna do Corvo e explorar o mercado e as missões procedurais no seu próprio ritmo (Ir para Sandbox Livre)",
                "effects": {
                  "xp": 100
                },
                "nextScene": "sandbox_free_explore"
              }
            ]
          },
          {
            "id": "scene_2_2_royal_court",
            "title": "A Sala do Trono de Prata",
            "locationId": "loc_eldoria",
            "illustration": "assets/backgrounds/eldoria_city.jpg",
            "npcPortrait": "assets/portraits/lyra.jpg",
            "text": "O salão real é iluminado por grandes lustres de ferro e vitrais coloridos. A Rainha Lyra observa o mapa continental estendido sobre a mesa real. Ao vê-lo entrar, seus olhos expressam alívio misturado à severidade de uma governante em tempos de crise.\n\n\"Cavaleiro das Cinzas,\" diz a Rainha Lyra, inclinando a cabeça. \"Os espiões de Solgard infiltraram nossas guildas comerciais e tentam nos deixar sem alimentos. Se você eliminar o acampamento dos mercenários na Floresta de Lúmen e proteger nossas rotas, nós lhe concederemos o título de Barão e terras no norte.\"",
            "choices": [
              {
                "text": "Aceitar a missão real de limpar a Floresta de Lúmen dos mercenários de Solgard (+500 Ouro, +Reputação Máxima)",
                "effects": {
                  "gold": 500,
                  "xp": 300,
                  "hidden": {
                    "honra": 30,
                    "lealdade": 25
                  },
                  "rep": {
                    "reino_eldor": 50,
                    "imperio_solgard": -40
                  },
                  "flags": {
                    "flag_missao_real_aceita": true
                  }
                },
                "nextScene": "scene_3_1_desert_march"
              },
              {
                "text": "Pedir tempo para explorar Aethelgard antes de comprometer sua lâmina em uma guerra imperial",
                "effects": {
                  "xp": 150
                },
                "nextScene": "sandbox_free_explore"
              }
            ]
          },
          {
            "id": "scene_2_2_slums",
            "title": "O Esconderijo Subterrâneo",
            "locationId": "loc_eldoria",
            "illustration": "assets/backgrounds/eldoria_city.jpg",
            "npcPortrait": "assets/portraits/kaelen.jpg",
            "text": "Você desce pelos bueiros de pedra sob o porto velho de Eldoria. Em um porão úmido iluminado por tochas, Kaelen da Lâmina Sombria e o líder camponês Vane planejam a tomada dos celeiros reais.\n\n\"A Rainha Lyra prefere alimentar seus cavalos de guerra a dar pão aos camponeses,\" sussurra Kaelen com um sorriso frio. \"Se você nos ajudar a abrir o portão oeste à meia-noite, dividiremos todo o tesouro real e formaremos uma Aethelgard verdadeiramente livre.\"",
            "choices": [
              {
                "text": "Selar o pacto com Kaelen e Vane para derrubar a nobreza e iniciar a revolução (+1000 Ouro no saque, +Caos)",
                "effects": {
                  "gold": 1000,
                  "xp": 350,
                  "hidden": {
                    "ambicao": 35,
                    "altruismo": 20,
                    "honra": -25
                  },
                  "rep": {
                    "reino_eldor": -60,
                    "guild_corvo": 50
                  },
                  "flags": {
                    "flag_revolta_camponesa": true,
                    "flag_golpe_planejado": true
                  }
                },
                "nextScene": "scene_3_1_desert_march"
              },
              {
                "text": "Trair Kaelen no último minuto e alertar a Guarda Real em troca de anistia e 600 moedas de ouro",
                "effects": {
                  "gold": 600,
                  "xp": 250,
                  "hidden": {
                    "honra": -15,
                    "ganancia": 25
                  },
                  "rep": {
                    "reino_eldor": 40,
                    "guild_corvo": -80
                  },
                  "flags": {
                    "flag_traiu_kaelen": true
                  }
                },
                "nextScene": "scene_3_1_desert_march"
              }
            ]
          }
        ]
      },
      {
        "id": "chap_3_solgard",
        "title": "Capítulo 3: O Eclipse de Solgard e as Torres de Pólvora",
        "subtitle": "No deserto de obsidiana, engrenagens e canhões testam a força dos feitiços e escamas.",
        "scenes": [
          {
            "id": "scene_3_1_desert_march",
            "title": "A Marcha pelas Areias de Obsidiana",
            "locationId": "loc_deserto_solgard",
            "illustration": "assets/backgrounds/solgard_desert.jpg",
            "npcPortrait": null,
            "text": "O calor do Deserto de Solgard faz a areia negra de obsidiana cintilar como vidro moído. Seu dragão abre as asas, aproveitando as correntes térmicas para planar acima das dunas. No horizonte, a Cidadela de Solgard surge como uma montanha de bronze polido, com chaminés despejando fumaça acinzentada nas nuvens.\n\nAs torres de pólvora alquímica comandadas pela Engenheira-Chefe Zorah estão operando dia e noite, construindo bestas mecânicas e o temido Titã de Ferro para marchar rumo ao norte. Você sente que a destruição ou controle dessas torres definirá o resultado de qualquer guerra iminente.",
            "choices": [
              {
                "text": "Infiltrar-se nas Torres de Pólvora de Solgard para sabotar os canhões alquímicos antes da invasão (+400 XP, -Armas de Solgard)",
                "effects": {
                  "xp": 400,
                  "hidden": {
                    "coragem": 25,
                    "lealdade": 20
                  },
                  "rep": {
                    "reino_eldor": 40,
                    "imperio_solgard": -60
                  },
                  "flags": {
                    "flag_sabotou_torres_solgard": true
                  }
                },
                "nextScene": "scene_3_2_zorah_lab"
              },
              {
                "text": "Procurar a comitiva do Imperador Kaelen VII para oferecer seus serviços e o poder do seu dragão em troca do generalato",
                "effects": {
                  "gold": 800,
                  "xp": 350,
                  "hidden": {
                    "ambicao": 35,
                    "honra": -10
                  },
                  "rep": {
                    "imperio_solgard": 50,
                    "reino_eldor": -70
                  },
                  "flags": {
                    "flag_general_solgard": true
                  }
                },
                "nextScene": "scene_3_2_imperial_throne"
              },
              {
                "text": "Procurar as tendas nômades da Horda de Khaz-Dûm nas bordas do deserto para aliar-se ao Khã Vorak",
                "effects": {
                  "xp": 320,
                  "hidden": {
                    "coragem": 20,
                    "curiosidade": 20
                  },
                  "rep": {
                    "horda_khaz": 35,
                    "imperio_solgard": -30
                  },
                  "flags": {
                    "flag_aliado_horda_khaz": true
                  }
                },
                "nextScene": "scene_3_2_khan_tents"
              }
            ]
          },
          {
            "id": "scene_3_2_zorah_lab",
            "title": "A Forja Alquímica de Zorah",
            "locationId": "loc_cidade_solgard",
            "illustration": "assets/creatures/iron_titan.jpg",
            "npcPortrait": null,
            "text": "Você invade o coração industrial de Solgard. Engrenagens colossais giram acima de poços de óleo e pólvora-negra. Diante do protótipo inativo do Titã de Ferro, a Mestre Alquimista Zorah inspeciona manómetros de pressão.\n\nEla escuta seus passos e vira-se com uma chave inglesa na mão. \"Se você veio explodir minha obra-prima com magia primitiva, perderá o tempo. Mas se entender o valor do aço-dragão, posso instalar canhões rúnicos na carapaça do seu dragão que dobrarão seu poder destrutivo!\"",
            "choices": [
              {
                "text": "Explodir o reservatório de pólvora com uma Bola de Fogo e fugir voando nas costas do dragão (+Caos total em Solgard)",
                "effects": {
                  "xp": 450,
                  "hidden": {
                    "impulsividade": 25,
                    "crueldade": 15
                  },
                  "rep": {
                    "imperio_solgard": -80,
                    "reino_eldor": 50
                  },
                  "flags": {
                    "flag_tita_ferro_destruido": true
                  }
                },
                "nextScene": "scene_4_1_khaz_abyss"
              },
              {
                "text": "Aceitar o upgrade de armadura alquímica para o seu dragão (+Manopla de Titã, +30 Dano do Dragão, -Reputação Druídica)",
                "effects": {
                  "xp": 400,
                  "dragonBond": 20,
                  "items": {
                    "a_legendary_titan_plate": 1
                  },
                  "hidden": {
                    "curiosidade": 30,
                    "ganancia": 15
                  },
                  "rep": {
                    "imperio_solgard": 30
                  },
                  "flags": {
                    "flag_dragao_armadura_alquimica": true
                  }
                },
                "nextScene": "scene_4_1_khaz_abyss"
              }
            ]
          },
          {
            "id": "scene_3_2_imperial_throne",
            "title": "O Pacto da Pólvora com Kaelen VII",
            "locationId": "loc_cidade_solgard",
            "illustration": "assets/backgrounds/solgard_desert.jpg",
            "npcPortrait": null,
            "text": "O Imperador Kaelen VII senta-se em um trono de bronze cercado por legionários e alquimistas. Ele olha para você e para o dragão com pura ambição imperial.\n\n\"O feudalismo de Eldor é uma relíquia morta,\" proclama o Imperador. \"Junte sua ferocidade e seu dragão às minhas legiões de pólvora. Conquistaremos Aethel-Khaz, decifraremos os obeliscos e reinaremos sobre todas as províncias como deuses da nova era.\"",
            "choices": [
              {
                "text": "Selar o pacto de sangue e ferro com o Imperador (+Título de Grão-General de Solgard, +1200 Ouro)",
                "effects": {
                  "gold": 1200,
                  "xp": 500,
                  "hidden": {
                    "ambicao": 40,
                    "honra": -15
                  },
                  "rep": {
                    "imperio_solgard": 70,
                    "reino_eldor": -90
                  },
                  "flags": {
                    "flag_grao_general_solgard": true
                  }
                },
                "nextScene": "scene_4_1_khaz_abyss"
              }
            ]
          },
          {
            "id": "scene_3_2_khan_tents",
            "title": "O Juramento do Khã Vorak",
            "locationId": "loc_ruinas_khaz",
            "illustration": "assets/creatures/mercenary_raiders.jpg",
            "npcPortrait": null,
            "text": "Nas tendas de couro nos desfiladeiros escuros, o Khã Vorak o Esmaga-Pedras bebe hidromel em um chifre de touro. Seus guerreiros observam seu dragão com profundo respeito selvagem.\n\n\"Os reis feudais e os alquimistas imperiais querem nos acorrentar com impostos e canhões!\" ruge Vorak. \"Se você beber deste chifre e lutar ao nosso lado nas ruínas de Aethel-Khaz, a Horda inteira marchará sob o seu comando quando a batalha final começar!\"",
            "choices": [
              {
                "text": "Beber o hidromel do Khã e jurar aliança com a Horda Nômade livre (+Reputação com Khaz, +Machado dos Anões)",
                "effects": {
                  "xp": 450,
                  "items": {
                    "w_heroic_dwarven_hammer": 1
                  },
                  "hidden": {
                    "coragem": 30,
                    "lealdade": 25
                  },
                  "rep": {
                    "horda_khaz": 60,
                    "reino_eldor": -30,
                    "imperio_solgard": -60
                  },
                  "flags": {
                    "flag_irmao_sangue_vorak": true
                  }
                },
                "nextScene": "scene_4_1_khaz_abyss"
              }
            ]
          }
        ]
      },
      {
        "id": "chap_4_khaz",
        "title": "Capítulo 4: O Abismo de Aethel-Khaz e as Sete Chaves",
        "subtitle": "Nas entranhas da terra, a Magia de Sangue e as runas sagradas disputam a alma do mundo.",
        "scenes": [
          {
            "id": "scene_4_1_khaz_abyss",
            "title": "O Portão das Sete Fechaduras Rúnicas",
            "locationId": "loc_ruinas_khaz",
            "illustration": "assets/backgrounds/aethel_khaz.jpg",
            "npcPortrait": "assets/portraits/thalor.jpg",
            "text": "Você desce quilômetros nas profundezas de Aethel-Khaz. A temperatura sobe conforme rios de magma vermelho iluminam gigantescas estátuas de reis anões há muito esquecidos. No centro do abismo ergue-se o Grande Portão das Sete Fechaduras, onde o obelisco primordial repousa em silêncio.\n\nO Arquimago Thalor já está ali, flutuando com seus feitiços de proteção de Valen, enquanto do lado oposto, emergindo da névoa roxa, surge Lady Morgana da Corte Sombria com seus feiticeiros de sangue.\n\n\"Não deixe Thalor selar a fonte arcana!\" grita Morgana, com veias de sangue brilhando nas mãos. \"As Sete Chaves nos darão imortalidade eterna e o poder de remodelar as estrelas!\"\n\nThalor ergue seu cajado. \"Se esse portão for aberto sem purificação, a Peste Sombria engolirá Aethelgard. Você deve escolher, cavaleiro!\"",
            "choices": [
              {
                "text": "Apoiar Thalor e o Círculo de Valen, combatendo Lady Morgana para selar o obelisco para sempre (+Honra e Pureza Arcana)",
                "effects": {
                  "xp": 550,
                  "hidden": {
                    "honra": 35,
                    "moralidade": 30,
                    "altruismo": 20
                  },
                  "rep": {
                    "guild_valen": 70
                  },
                  "combatTrigger": "renegade_sorcerer",
                  "flags": {
                    "flag_obelisco_selado_valen": true
                  }
                },
                "nextScene": "scene_5_1_summit"
              },
              {
                "text": "Aliar-se a Lady Morgana, absorvendo a Magia de Sangue primordial para se tornar imortal (+30 Corrupção, +Pacto Proibido)",
                "effects": {
                  "xp": 600,
                  "corruption": 30,
                  "hidden": {
                    "ambicao": 45,
                    "crueldade": 25
                  },
                  "flags": {
                    "flag_imortal_magia_sangue": true,
                    "flag_usou_magia_proibida": true
                  }
                },
                "nextScene": "scene_5_1_summit"
              },
              {
                "text": "Empunhar o poder do seu Dragão para estilhaçar as Sete Fechaduras e libertar toda a magia para a natureza selvagem (+Vínculo 100%)",
                "effects": {
                  "xp": 650,
                  "dragonBond": 35,
                  "hidden": {
                    "curiosidade": 40,
                    "coragem": 30
                  },
                  "flags": {
                    "flag_magia_libertada_mundo": true
                  }
                },
                "nextScene": "scene_5_1_summit"
              }
            ]
          }
        ]
      },
      {
        "id": "chap_5_council",
        "title": "Capítulo 5: O Concílio dos Picos Nevados e A Apoteose",
        "subtitle": "No Santuário Flutuante sob a Lua de Sangue, o destino final das cinzas é selado.",
        "scenes": [
          {
            "id": "scene_5_1_summit",
            "title": "O Grande Concílio de Aethelgard",
            "locationId": "loc_santuario_flutuante",
            "illustration": "assets/backgrounds/dragon_peaks.jpg",
            "npcPortrait": "assets/portraits/orin.jpg",
            "text": "As nuvens se abrem nos Picos Nevados dos Dragões, revelando o Santuário Flutuante de Aether suspenso por cristais gravitacionais. Sob o clarão avermelhado da Lua de Sangue que se aproxima do eclipse, todos os maiores soberanos de Aethelgard se reuniram em trégua sagrada.\n\nA Rainha Lyra, o Imperador Kaelen VII, a Oráculo Seraphina, o Grão-Duque Roderick e o Khã Vorak estão ao redor da mesa redonda de mármore. Seu dragão, agora crescido em uma imponente fera titânica cujas asas escurecem o céu, pousa suavemente atrás de você.\n\nO silêncio cai sobre o salão. Todos sabem que o guerreiro que sobreviveu ao obelisco, navegou pela corrupção, dominou as guildas e domou o dragão primordial tem em suas mãos o poder absoluto para ditar a nova era do continente.\n\nO Ancião Druida Orin dá um passo à frente com o bastão sagrado. \"Cavaleiro das Cinzas... a palavra final sobre o destino de Aethelgard pertence a você. Qual será a sua crônica para os próximos mil anos?\"",
            "choices": [
              {
                "text": "👑 PROCLAMAR-SE IMPERADOR DE AETHELGARD: Unificar todos os reinos sob sua coroa, lâmina e o rugido do dragão titânico (Final Imperador)",
                "effects": {
                  "xp": 1000,
                  "hidden": {
                    "ambicao": 50,
                    "lideranca": 40
                  },
                  "flags": {
                    "flag_final_imperador_supremo": true
                  }
                },
                "nextScene": "epilogue_trigger"
              },
              {
                "text": "🛡️ FUNDAR A CONFEDERAÇÃO DAS CIDADES LIVRES: Abolir as coroas e instaurar um conselho onde camponeses, magos e mercadores governam em paz (Final Liberdade)",
                "effects": {
                  "xp": 1000,
                  "hidden": {
                    "altruismo": 50,
                    "moralidade": 40
                  },
                  "flags": {
                    "flag_final_republica_livre": true
                  }
                },
                "nextScene": "epilogue_trigger"
              },
              {
                "text": "🐉 ASCENSÃO À APOTEOSE DRACONIANA: Abandonar as disputas humanas e voar com seu dragão para o cosmos, tornando-se o Deus Guardião dos Céus (Final Dragão Supremo)",
                "requirements": {
                  "dragon": true
                },
                "effects": {
                  "xp": 1200,
                  "dragonBond": 50,
                  "hidden": {
                    "curiosidade": 50,
                    "empatia": 50
                  },
                  "flags": {
                    "flag_final_deus_draconiano": true
                  }
                },
                "nextScene": "epilogue_trigger"
              },
              {
                "text": "🔥 O CATACLISMO DE SANGUE: Usar o obelisco e a corrupção para subjugar todos os reis como seus servos imortais na escuridão eterna (Final Tirano Sombrio)",
                "effects": {
                  "xp": 1000,
                  "corruption": 50,
                  "hidden": {
                    "crueldade": 50,
                    "ganancia": 50
                  },
                  "flags": {
                    "flag_final_tirano_sombrio": true
                  }
                },
                "nextScene": "epilogue_trigger"
              }
            ]
          },
          {
            "id": "epilogue_trigger",
            "title": "O Epílogo das Cinzas",
            "locationId": "loc_santuario_flutuante",
            "illustration": "assets/backgrounds/title_bg.jpg",
            "npcPortrait": null,
            "text": "As decisões foram tomadas e os ecos de suas escolhas reverberam por cada floresta, cidade e deserto das Terras das Cinzas. O mundo nunca mais será o mesmo.\n\nSua jornada foi registrada nos pergaminhos eternos dos grão-mestres de Aethelgard. Você pode conferir sua crônica detalhada agora mesmo, exportar seu arquivo de save histórico em JSON ou continuar vivendo nas terras em modo sandbox aberto para concluir todas as conquistas do bestiário!",
            "choices": [
              {
                "text": "👑 ABRIR O EPÍLOGO HISTÓRICO FINAL E VER O DESFECHO DA SUA CRÔNICA",
                "effects": {
                  "xp": 500
                },
                "nextScene": "trigger_endings_manager_now"
              }
            ]
          }
        ]
      }
    ]
  },
  "bestiary_db": {
    "mythologies": [
      {
        "id": "myth_original",
        "name": "🔥 Herdeiros das Cinzas e Primordiais",
        "description": "As criaturas nativas nascidas da Grande Ruptura de Aethelgard e da corrupção dos obeliscos arcanos."
      },
      {
        "id": "myth_nordic",
        "name": "❄️ Mitologia Nórdica (Picos Nevados e Norte)",
        "description": "Feras e mortos-vivos das tundras congeladas, valquírias caídas e serpentes que rodeiam os mares de ferro."
      },
      {
        "id": "myth_egyptian",
        "name": "🏜️ Mitologia Egípcia (Deserto de Obsidiana e Oásis)",
        "description": "Guardiões das tumbas de ouro, esfinges enigmáticas, chacais solares e devoradores de almas sob o sol implacável."
      },
      {
        "id": "myth_greek_roman",
        "name": "🏛️ Mitologia Grega e Romana (Ruínas e Labirintos)",
        "description": "Colossos de bronze, górgonas da petrificação, minotauros de basalto e quimeras alquímicas do império."
      },
      {
        "id": "myth_japanese",
        "name": "⛩️ Mitologia Japonesa e Yokais (Florestas e Névoa)",
        "description": "Demônios com máscaras de chifre, raposas arcanas de nove caudas, monges-corvo das nuvens e tecelãs da noite."
      },
      {
        "id": "myth_brazilian",
        "name": "🦜 Mitologia Brasileira e Amazônica (Florestas Druídicas e Pântano)",
        "description": "Guardiões de pés virados das árvores sagradas, serpentes de fogo fátuo, colossos de fauce no peito e sereias do rio das cinzas."
      },
      {
        "id": "myth_african",
        "name": "🌍 Mitologia Africana (Sultanato e Terras de Vaelor)",
        "description": "Aranhas tecelãs da sabedoria, elefantes-serpente couraçados de minas de diamante, demônios das águas escuras e pássaros-trovão."
      },
      {
        "id": "myth_indigenous",
        "name": "🪶 Mitologia Indígena Americana (Cânions e Horda Nômade)",
        "description": "Espíritos da fome insaciável da nevasca, pássaros de relâmpago, drenadores noturnos e serpentes emplumadas de esmeralda."
      },
      {
        "id": "myth_vedic",
        "name": "🪷 Mitologia Indiana e Védica (Templos de Aether e Leste)",
        "description": "Águias celestiais douradas, demônios tigres ilusionistas, rainhas serpente de sete cabeças e semideuses de quatro braços."
      }
    ],
    "creatures": [
      {
        "id": "mercenary_raiders",
        "name": "Capitão Mercenário Renegado",
        "mythology": "myth_original",
        "hp": 120,
        "maxHp": 120,
        "damage": 28,
        "defense": 25,
        "magicDefense": 10,
        "morale": 80,
        "xpReward": 150,
        "goldReward": 120,
        "itemReward": "w_greataxe",
        "desc": "Um veterano fortemente armado de Eldor que lidera bandos de saqueadores. Fraqueza: Magias de Fogo e Golpe Quebra-Escudo."
      },
      {
        "id": "shadow_wolf",
        "name": "Lobo-Sombrio de Lúmen",
        "mythology": "myth_original",
        "hp": 85,
        "maxHp": 85,
        "damage": 32,
        "defense": 12,
        "magicDefense": 20,
        "morale": 90,
        "xpReward": 90,
        "goldReward": 25,
        "itemReward": "ration_food",
        "desc": "Fera corrompida com presas que causam sangramento contínuo. Fraqueza: Luz Solar e Furtividade."
      },
      {
        "id": "obsidian_gargoyle",
        "name": "Gárgula de Obsidiana de Aethel-Khaz",
        "mythology": "myth_original",
        "hp": 180,
        "maxHp": 180,
        "damage": 38,
        "defense": 45,
        "magicDefense": 40,
        "morale": 100,
        "xpReward": 220,
        "goldReward": 180,
        "itemReward": "mat_obsidian_crystal",
        "desc": "Sentinel de pedra rúnica impenetrável das profundezas. Fraqueza: Martelos Pesados e Eletricidade."
      },
      {
        "id": "renegade_sorcerer",
        "name": "Feiticeiro Renegado da Magia de Sangue",
        "mythology": "myth_original",
        "hp": 100,
        "maxHp": 100,
        "damage": 45,
        "defense:": 15,
        "magicDefense": 50,
        "morale": 75,
        "xpReward": 200,
        "goldReward": 150,
        "itemReward": "potion_willpower",
        "desc": "Conjurador implacável que absorve força vital a cada feitiço. Fraqueza: Ataques físicos rápidos à distância e Flechas."
      },
      {
        "id": "iron_titan",
        "name": "Titã de Ferro e Aço-Dragão",
        "mythology": "myth_original",
        "hp": 300,
        "maxHp": 300,
        "damage": 55,
        "defense": 55,
        "magicDefense": 30,
        "morale": 100,
        "xpReward": 450,
        "goldReward": 400,
        "itemReward": "a_iron_plate",
        "desc": "Colosso mecânico-alquímico de Solgard. Fraqueza: Fenda Tectônica e Sopro de Relâmpago do Dragão."
      },
      {
        "id": "wyvern_savage",
        "name": "Wyvern das Sombras Selvagem",
        "mythology": "myth_original",
        "hp": 220,
        "maxHp": 220,
        "damage": 48,
        "defense": 30,
        "magicDefense": 35,
        "morale": 85,
        "xpReward": 320,
        "goldReward": 250,
        "itemReward": "ration_food",
        "desc": "Predador alado venenoso que ataca das alturas de Val-Drak. Fraqueza: Besta Alquímica e Lança Perfurante."
      },
      {
        "id": "nordic_fenrir",
        "name": "Fenrir do Gelo Ancestral (Lobo Trovão)",
        "mythology": "myth_nordic",
        "hp": 260,
        "maxHp": 260,
        "damage": 52,
        "defense": 32,
        "magicDefense": 30,
        "morale": 100,
        "xpReward": 380,
        "goldReward": 280,
        "itemReward": "w_heroic_dragon_spear",
        "desc": "O colossal lobo devorador de sóis das tundras do norte, de pelagem branca como a nevasca e uivo de trovão. Fraqueza: Lanças Perfurantes e Magia Solar de Luz."
      },
      {
        "id": "nordic_jormungandr",
        "name": "Jörmungandr do Abismo (Serpente das Cinzas)",
        "mythology": "myth_nordic",
        "hp": 340,
        "maxHp": 340,
        "damage": 58,
        "defense": 50,
        "magicDefense": 45,
        "morale": 100,
        "xpReward": 490,
        "goldReward": 420,
        "itemReward": "mat_obsidian_crystal",
        "desc": "Serpente abissal com escamas de ferro frio que rodeia as profundezas de Aethel-Khaz e cosme veneno negro. Fraqueza: Eletricidade em Cadeia e Machado Quebra-Crânios."
      },
      {
        "id": "nordic_draugr",
        "name": "Draugr dos Sepulcros de Khaz",
        "mythology": "myth_nordic",
        "hp": 150,
        "maxHp": 150,
        "damage": 35,
        "defense": 38,
        "magicDefense": 15,
        "morale": 100,
        "xpReward": 190,
        "goldReward": 140,
        "itemReward": "mat_iron_ingot",
        "desc": "Guerreiro fúnebre congelado que guarda as tumbas nórdicas com armadura de bronze corrompida. Fraqueza: Magia de Luz e Fogo Rúnico."
      },
      {
        "id": "nordic_valkyrie",
        "name": "Valkíria Caída do Santuário Flutuante",
        "mythology": "myth_nordic",
        "hp": 230,
        "maxHp": 230,
        "damage": 50,
        "defense": 35,
        "magicDefense": 55,
        "morale": 95,
        "xpReward": 350,
        "goldReward": 300,
        "itemReward": "potion_heroic_rebirth",
        "desc": "Anjo guerreiro renegado com asas de penas negras que mergulha dos céus disparando lanças de relâmpago. Fraqueza: Magia Temporal e Terreno."
      },
      {
        "id": "egypt_anubis",
        "name": "Anúbis da Areia Negra (Guardião Solar)",
        "mythology": "myth_egyptian",
        "hp": 240,
        "maxHp": 240,
        "damage": 46,
        "defense": 40,
        "magicDefense": 50,
        "morale": 100,
        "xpReward": 360,
        "goldReward": 320,
        "itemReward": "w_dagger",
        "desc": "Besta chacal de bronze empunhando uma balança de ouro amaldiçoada que pesa e drena a alma do cavaleiro. Fraqueza: Magia de Gelo e Adagas Furtivas."
      },
      {
        "id": "egypt_sphinx",
        "name": "Esfinge de Obsidiana de Solgard",
        "mythology": "myth_egyptian",
        "hp": 280,
        "maxHp": 280,
        "damage": 48,
        "defense": 45,
        "magicDefense": 60,
        "morale": 90,
        "xpReward": 420,
        "goldReward": 380,
        "itemReward": "relic_ring_nine_souls",
        "desc": "Monstro alado de pedra e ouro que propõe enigmas mortais no deserto e ataca com feixes solares concentrados. Fraqueza: Inteligência e Martelo Quebra-Montanhas."
      },
      {
        "id": "egypt_ammit",
        "name": "Ammit o Devorador de Corações",
        "mythology": "myth_egyptian",
        "hp": 210,
        "maxHp": 210,
        "damage": 52,
        "defense": 35,
        "magicDefense": 25,
        "morale": 85,
        "xpReward": 310,
        "goldReward": 240,
        "itemReward": "potion_willpower",
        "desc": "Predador impiedoso das dunas com mandíbula de crocodilo e corpo de leão-hipopótamo que devora a Vontade/Mana. Fraqueza: Magia Druídica de Natureza."
      },
      {
        "id": "egypt_apophis",
        "name": "Apófis da Sombra do Oásis",
        "mythology": "myth_egyptian",
        "hp": 310,
        "maxHp": 310,
        "damage": 56,
        "defense": 42,
        "magicDefense": 55,
        "morale": 100,
        "xpReward": 460,
        "goldReward": 400,
        "itemReward": "w_legendary_eclipse",
        "desc": "A grande serpente do caos e escuridão eterna que tenta eclipsar o sol sobre as terras do Sultanato de Aramis. Fraqueza: Raio Solar Celestial e Julgamento Solar."
      },
      {
        "id": "greek_minotaur",
        "name": "Minotauro de Basalto de Khaz",
        "mythology": "myth_greek_roman",
        "hp": 250,
        "maxHp": 250,
        "damage": 54,
        "defense": 48,
        "magicDefense": 20,
        "morale": 95,
        "xpReward": 360,
        "goldReward": 290,
        "itemReward": "w_greataxe",
        "desc": "Colosso com chifres de ferro e machado duplo de obsidiana que domina os labirintos anões de Aethel-Khaz. Fraqueza: Destreza/Esquiva e Fenda Tectônica."
      },
      {
        "id": "greek_medusa",
        "name": "Medusa das Cinzas Prateadas (A Górgona)",
        "mythology": "myth_greek_roman",
        "hp": 190,
        "maxHp": 190,
        "damage": 44,
        "defense": 30,
        "magicDefense": 50,
        "morale": 85,
        "xpReward": 340,
        "goldReward": 310,
        "itemReward": "a_unique_queen_mantle",
        "desc": "Feiticeira górgona cujas serpentes de seiva negra petrificam armaduras e imobilizam cavaleiros nos vales prateados. Fraqueza: Postura Defensiva com Escudo e Espelhos Solares."
      },
      {
        "id": "greek_chimera",
        "name": "Quimera das Três Lâminas (Leão-Dragão)",
        "mythology": "myth_greek_roman",
        "hp": 270,
        "maxHp": 270,
        "damage": 50,
        "defense": 40,
        "magicDefense": 40,
        "morale": 90,
        "xpReward": 400,
        "goldReward": 350,
        "itemReward": "dragon_elixir",
        "desc": "Aberração alquímica solgardiana de três cabeças que cosme fogo, veneno e raios simultaneamente. Fraqueza: Trabalho em Equipe (Companheiros de Guilda)."
      },
      {
        "id": "greek_cerberus",
        "name": "Cérbero das Três Fauxes de Eldor",
        "mythology": "myth_greek_roman",
        "hp": 280,
        "maxHp": 280,
        "damage": 53,
        "defense": 44,
        "magicDefense": 35,
        "morale": 100,
        "xpReward": 410,
        "goldReward": 360,
        "itemReward": "a_iron_plate",
        "desc": "O mastim abissal de três cabeças encadeado para vigiar as masmorras subterrâneas do Palácio da Rainha Lyra. Fraqueza: Oferenda de Ração/Carne e Lança de Gelo."
      },
      {
        "id": "roman_cyclops",
        "name": "Ciclope de Bronze Imperatório",
        "mythology": "myth_greek_roman",
        "hp": 290,
        "maxHp": 290,
        "damage": 58,
        "defense": 52,
        "magicDefense": 25,
        "morale": 90,
        "xpReward": 430,
        "goldReward": 380,
        "itemReward": "w_crossbow",
        "desc": "Gigante de um olho só forjado e revestido em bronze pesado para destruir galeões navais de Vaelor. Fraqueza: Precisão à distância (Arco/Besta direto no olho central)."
      },
      {
        "id": "yokai_oni",
        "name": "Oni da Fenda Sombria (Demônio de Chifre)",
        "mythology": "myth_japanese",
        "hp": 240,
        "maxHp": 240,
        "damage": 52,
        "defense": 40,
        "magicDefense": 35,
        "morale": 95,
        "xpReward": 360,
        "goldReward": 300,
        "itemReward": "w_katana",
        "desc": "Gigante Yokai de pele escarlate com clava de ferro pontiaguda (Kanabo) e máscara de terror que drena a moral. Fraqueza: Katana da Lua de Prata e Magia Espiritual."
      },
      {
        "id": "yokai_kitsune",
        "name": "Kitsune das Nove Caudas de Lúmen",
        "mythology": "myth_japanese",
        "hp": 180,
        "maxHp": 180,
        "damage": 42,
        "defense": 22,
        "magicDefense": 65,
        "morale": 90,
        "xpReward": 350,
        "goldReward": 340,
        "itemReward": "relic_time_tome",
        "desc": "Raposa arcana milenar de fogo azul que cria miragens ilusórias e duplica suas rodadas de ataque em Lúmen. Fraqueza: Empatia Draconiana e Percepção alta."
      },
      {
        "id": "yokai_tengu",
        "name": "Tengu da Tempestade dos Picos",
        "mythology": "myth_japanese",
        "hp": 210,
        "maxHp": 210,
        "damage": 46,
        "defense": 30,
        "magicDefense": 45,
        "morale": 90,
        "xpReward": 330,
        "goldReward": 270,
        "itemReward": "w_twin_blades",
        "desc": "Monge guerreiro alado com máscara de corvo que controla ventos cortantes nos Picos Nevados. Fraqueza: Espada Longa e Magia de Terra."
      },
      {
        "id": "yokai_jorogumo",
        "name": "Jorōgumo da Seda da Noite",
        "mythology": "myth_japanese",
        "hp": 200,
        "maxHp": 200,
        "damage": 45,
        "defense": 28,
        "magicDefense": 40,
        "morale": 85,
        "xpReward": 320,
        "goldReward": 260,
        "itemReward": "potion_antidote",
        "desc": "Aberração aracnídea metamorfa que embosca cavaleiros com teias imobilizadoras e veneno de loto negro. Fraqueza: Fogo Rúnico e Antídotos."
      },
      {
        "id": "brazil_curupira",
        "name": "Curupira do Pé-Viramundo (Guardião de Lúmen)",
        "mythology": "myth_brazilian",
        "hp": 210,
        "maxHp": 210,
        "damage": 46,
        "defense": 34,
        "magicDefense": 55,
        "morale": 100,
        "xpReward": 350,
        "goldReward": 280,
        "itemReward": "mat_lumen_herb",
        "desc": "Espírito ancestral da floresta com cabelos de brasa viva e pés virados para trás, que inverte armadilhas e confunde caçadores. Fraqueza: Oferenda de Tabaco/Ração ou Magia Druídica."
      },
      {
        "id": "brazil_boitata",
        "name": "Boitatá da Brasa Sombria (Serpente Fátua)",
        "mythology": "myth_brazilian",
        "hp": 270,
        "maxHp": 270,
        "damage": 54,
        "defense": 38,
        "magicDefense": 60,
        "morale": 100,
        "xpReward": 410,
        "goldReward": 360,
        "itemReward": "mat_obsidian_crystal",
        "desc": "Serpente abissal de fogo azul e dourado com centenas de olhos flamejantes que defende os rios subterrâneos e cega gananciosos. Fraqueza: Magia de Água/Gelo e Honra."
      },
      {
        "id": "brazil_mapinguari",
        "name": "Mapinguari do Pântano Tóxico (Fauce no Peito)",
        "mythology": "myth_brazilian",
        "hp": 320,
        "maxHp": 320,
        "damage": 57,
        "defense": 56,
        "magicDefense": 30,
        "morale": 100,
        "xpReward": 470,
        "goldReward": 410,
        "itemReward": "a_druidic_living_bark",
        "desc": "Colosso coberto de pelagem impenetrável com um único olho central e uma segunda boca devoradora no peito que emana gás letal. Fraqueza: Arcos Perfurantes à distância e Vento de Zephyr."
      },
      {
        "id": "brazil_iara",
        "name": "Iara a Senhora das Águas de Valen",
        "mythology": "myth_brazilian",
        "hp": 190,
        "maxHp": 190,
        "damage": 43,
        "defense": 26,
        "magicDefense": 65,
        "morale": 90,
        "xpReward": 340,
        "goldReward": 330,
        "itemReward": "potion_willpower",
        "desc": "Entidade das profundezas navais que hipnotiza marujos e cavaleiros com canções arcanas, puxando-os para o abismo oceânico. Fraqueza: Resistência Mental alta e Manto Espiritual."
      },
      {
        "id": "brazil_capelobo",
        "name": "Capelobo da Escuridão (O Lobisomem-Tamanduá)",
        "mythology": "myth_brazilian",
        "hp": 240,
        "maxHp": 240,
        "damage": 50,
        "defense": 42,
        "magicDefense": 25,
        "morale": 95,
        "xpReward": 360,
        "goldReward": 290,
        "itemReward": "mat_iron_ingot",
        "desc": "Besta híbrida feroz com focinho perfurante e garras de ferro capaz de rasgar elmos e peitorais em segundos. Fraqueza: Prata e Lâminas Rúnicas."
      },
      {
        "id": "afro_anansi",
        "name": "Anansi o Tecelão de Pergaminhos",
        "mythology": "myth_african",
        "hp": 200,
        "maxHp": 200,
        "damage": 42,
        "defense": 30,
        "magicDefense": 60,
        "morale": 90,
        "xpReward": 340,
        "goldReward": 330,
        "itemReward": "relic_time_tome",
        "desc": "Entidade mística de oito patas que habita bibliotecas antigas de Aramis, propondo enigmas diplomáticos e armadilhas de teia arcana. Fraqueza: Sabedoria e Fogo."
      },
      {
        "id": "afro_grootslang",
        "name": "Grootslang da Caverna de Diamantes",
        "mythology": "myth_african",
        "hp": 330,
        "maxHp": 330,
        "damage": 58,
        "defense": 58,
        "magicDefense": 35,
        "morale": 100,
        "xpReward": 480,
        "goldReward": 450,
        "itemReward": "w_heroic_dwarven_hammer",
        "desc": "Monstro abissal blindado com couro de elefante e cauda de píton gigante que guarda minas de diamantes em Solgard. Fraqueza: Fenda Tectônica e Lança Quebra-Couro."
      },
      {
        "id": "afro_tokoloshe",
        "name": "Tokoloshe das Águas Escuras de Vaelor",
        "mythology": "myth_african",
        "hp": 170,
        "maxHp": 170,
        "damage": 44,
        "defense": 25,
        "magicDefense": 40,
        "morale": 85,
        "xpReward": 300,
        "goldReward": 250,
        "itemReward": "w_dagger",
        "desc": "Espírito aquático carnívoro de força sobre-humana e baixa estatura que embosca cavalos e patrulhas costeiras à noite. Fraqueza: Eletricidade/Relâmpago e Luz Solar."
      },
      {
        "id": "afro_impundulu",
        "name": "Impundulu o Pássaro-Trovão de Aramis",
        "mythology": "myth_african",
        "hp": 230,
        "maxHp": 230,
        "damage": 49,
        "defense": 32,
        "magicDefense": 50,
        "morale": 90,
        "xpReward": 360,
        "goldReward": 310,
        "itemReward": "w_crossbow",
        "desc": "Ave de rapina vampírica gigante que invoca tempestades de granizo e relâmpago, alimentando-se do sangue de rebanhos. Fraqueza: Besta Alquímica e Escudo Rúnico."
      },
      {
        "id": "indig_wendigo",
        "name": "Wendigo da Geada de Ferro (A Besta da Fome)",
        "mythology": "myth_indigenous",
        "hp": 250,
        "maxHp": 250,
        "damage": 52,
        "defense": 36,
        "magicDefense": 45,
        "morale": 100,
        "xpReward": 370,
        "goldReward": 300,
        "itemReward": "ration_food",
        "desc": "Espírito de exaustão, fome e gelo eterno com chifres de cervo esquelético que persegue viajantes famintos nas nevascas de Val-Drak. Fraqueza: Fogo Solar e Rações Saciadoras."
      },
      {
        "id": "indig_thunderbird",
        "name": "Pássaro-Trovão das Nuvens Nevadas",
        "mythology": "myth_indigenous",
        "hp": 270,
        "maxHp": 270,
        "damage": 54,
        "defense": 38,
        "magicDefense": 55,
        "morale": 95,
        "xpReward": 400,
        "goldReward": 340,
        "itemReward": "a_runic_vest",
        "desc": "Colosso alado legendário que dispara relâmpagos dos olhos e faz montanhas tremerem com o bater de suas asas. Fraqueza: Lanças de Gelo e Postura Defensiva."
      },
      {
        "id": "indig_chupacabra",
        "name": "Chupacabra das Cinzas (O Vampiro Noturno)",
        "mythology": "myth_indigenous",
        "hp": 160,
        "maxHp": 160,
        "damage": 40,
        "defense": 22,
        "magicDefense": 30,
        "morale": 80,
        "xpReward": 280,
        "goldReward": 220,
        "itemReward": "w_dagger",
        "desc": "Fera ágil de escamas cinzentas com espinhos na coluna que drena a vitalidade do gado e dos dragões durante a noite. Fraqueza: Luz da Alvorada e Adaga Furtiva."
      },
      {
        "id": "indig_quetzalcoatl",
        "name": "Quetzalcoatl de Prata (A Serpente Emplumada)",
        "mythology": "myth_indigenous",
        "hp": 300,
        "maxHp": 300,
        "damage": 56,
        "defense": 48,
        "magicDefense": 60,
        "morale": 100,
        "xpReward": 450,
        "goldReward": 400,
        "itemReward": "w_unique_raven_scythe",
        "desc": "Divindade celeste com escamas de esmeralda e plumas de prata pura que governa o ar rarefeito dos picos mais altos. Fraqueza: Magia de Sombras e Gravitação."
      },
      {
        "id": "vedic_garuda",
        "name": "Garuda Solar de Aethel-Lúmen (A Águia Dourada)",
        "mythology": "myth_vedic",
        "hp": 280,
        "maxHp": 280,
        "damage": 53,
        "defense": 44,
        "magicDefense": 58,
        "morale": 100,
        "xpReward": 420,
        "goldReward": 370,
        "itemReward": "relic_ring_nine_souls",
        "desc": "O grande pássaro celestial de asas douradas que caça serpentes abissais e protege os templos teocráticos do leste. Fraqueza: Magia de Água/Gelo e Sombras."
      },
      {
        "id": "vedic_rakshasa",
        "name": "Rakshasa da Corte de Sangue (Metamorfo)",
        "mythology": "myth_vedic",
        "hp": 230,
        "maxHp": 230,
        "damage": 49,
        "defense": 34,
        "magicDefense": 48,
        "morale": 90,
        "xpReward": 360,
        "goldReward": 330,
        "itemReward": "w_katana",
        "desc": "Demônio ilusionista com garras de tigre e presas venenosas que se disfarça de nobre em Eldoria para assassinar reis. Fraqueza: Percepção alta e Lâmina de Prata."
      },
      {
        "id": "vedic_naga",
        "name": "Naga Real das Sete Fauxes (Rainha Serpente)",
        "mythology": "myth_vedic",
        "hp": 290,
        "maxHp": 290,
        "damage": 55,
        "defense": 46,
        "magicDefense": 52,
        "morale": 95,
        "xpReward": 440,
        "goldReward": 390,
        "itemReward": "w_legendary_eclipse",
        "desc": "Rainha serpente multicabeça com coroa de rubis que vigia os canais subterrâneos de água mágica em Aethel-Khaz. Fraqueza: Eletricidade em Cadeia e Machado Quebra-Crânios."
      },
      {
        "id": "vedic_asura",
        "name": "Asura do Fogo-Negro (O Titã de Quatro Braços)",
        "mythology": "myth_vedic",
        "hp": 330,
        "maxHp": 330,
        "damage": 60,
        "defense": 55,
        "magicDefense": 45,
        "morale": 100,
        "xpReward": 480,
        "goldReward": 430,
        "itemReward": "w_heroic_dragon_spear",
        "desc": "Semideus guerreiro corrompido que empunha 4 espadas longas ao mesmo tempo em Solgard com fúria incontrolável. Fraqueza: Dilatação Temporal e Sopro do Dragão."
      }
    ]
  },
  "romance_db": {
    "residences": [
      {
        "id": "res_eldor_manor",
        "name": "Mansão Real dos Vales de Eldoria",
        "kingdomId": "reino_eldor",
        "price": 2500,
        "desc": "Uma propriedade aristocrática com jardins empedrados e lareira de ferro perto do Palácio da Rainha Lyra.",
        "perk": "+40 HP e +30 Vontade regenerados a cada repouso de casal.",
        "unlocked": false
      },
      {
        "id": "res_aramis_penthouse",
        "name": "Palácio das Especiarias e Ouro de Aramis",
        "kingdomId": "sultanato_aramis",
        "price": 4000,
        "desc": "Cobertura suntuosa com cúpula dourada, pátio com fontes e vista para os bazares oceânicos.",
        "perk": "Gera +35 moedas de ouro diárias de renda passiva para o casal.",
        "unlocked": false
      },
      {
        "id": "res_lumen_cabin",
        "name": "Chalé Élfico Simbiótico da Floresta de Lúmen",
        "kingdomId": "confederacao_valdrak",
        "price": 1800,
        "desc": "Um lar místico tecido entre as raízes e musgos fosforescentes das árvores milenares.",
        "perk": "Cura instantaneamente doenças do dragão e zera a fadiga mágica ao dormir.",
        "unlocked": false
      },
      {
        "id": "res_valdrak_spire",
        "name": "Fortaleza Rúnica nos Picos Nevados de Val-Drak",
        "kingdomId": "confederacao_valdrak",
        "price": 3000,
        "desc": "Santuário nas alturas com poleiro aéreo para seu dragão e observatório astronômico.",
        "perk": "+25% de bônus de dano com todas as magias e voo sem custo de fadiga.",
        "unlocked": false
      },
      {
        "id": "res_aethel_sanctuary",
        "name": "Mosteiro de Mármore e Ouro de Aethel-Lúmen",
        "kingdomId": "teocracia_aethel",
        "price": 2800,
        "desc": "Residência sacra iluminada por espelhos solares ininterruptos que afastam qualquer traço de magia escura.",
        "perk": "Limpa 100% da corrupção arcana do cavaleiro ao repousar e concede +30 Defesa Mágica.",
        "unlocked": false
      },
      {
        "id": "res_vaelor_manor",
        "name": "Castelo Marítimo do Grão-Ducado de Vaelor",
        "kingdomId": "grao_ducado_vaelor",
        "price": 3200,
        "desc": "Fortaleza costeira voltada para as ondas de ferro, com cais privativo e armaria reforçada.",
        "perk": "Reparos gratuitos para todas as armas equipadas e +35 Defesa Física Base.",
        "unlocked": false
      },
      {
        "id": "res_khaz_lodge",
        "name": "Salão Escavado no Abismo de Khaz-Dûm",
        "kingdomId": "horda_khaz",
        "price": 2000,
        "desc": "Caverna nobre entalhada no granito maciço com fogueira central de meteorito e troféus de feras legendárias.",
        "perk": "+40% de dano com armas pesadas e imunidade a frio/exaustão de nevasca.",
        "unlocked": false
      }
    ],
    "npcs": [
      {
        "id": "rom_lyra",
        "name": "Rainha Lyra de Eldor",
        "title": "Soberana do Trono de Prata",
        "kingdomId": "reino_eldor",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/lyra.jpg",
        "profession": "Rainha e Governante",
        "approval": 10,
        "status": "Conhecido",
        "favoriteGifts": [
          "item_rose_bouquet",
          "item_poetry_book",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "mat_iron_ingot",
          "ration_food"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Cavaleiro... a solidão do trono consome até a alma mais forte. Sua presença me traz uma paz que pergaminhos de lei jamais trouxeram."
          },
          {
            "reqApproval": 60,
            "text": "Quando olho nos seus olhos, não vejo apenas a espada que defende meu reino, vejo a pessoa com quem desejo compartilhar meu destino."
          },
          {
            "reqApproval": 80,
            "text": "Aceito seu anel rúnico de noivado com todo o meu coração! Que Eldor saiba que a Rainha encontrou seu cavaleiro eterno."
          }
        ],
        "weddingVows": "Diante dos vitrais sagrados da Catedral de Prata em Eldoria, a Rainha Lyra coloca sua coroa de lado por um momento e segura suas mãos: 'Eu prometo amar, governar e lutar ao seu lado até que as cinzas virem estrelas.'"
      },
      {
        "id": "rom_vespera",
        "name": "Capitã Vespera",
        "title": "Comandante da Lâmina de Ferro",
        "kingdomId": "reino_eldor",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/vespera.jpg",
        "profession": "Militar e Cavaleira",
        "approval": 15,
        "status": "Amizade",
        "favoriteGifts": [
          "w_dagger",
          "item_engagement_ring",
          "mat_iron_ingot"
        ],
        "dislikedGifts": [
          "item_poetry_book"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Guerreiros não costumam falar de sentimentos, mas quando lutamos costas com costas na emboscada, senti meu coração bater mais forte que o choque de escudos."
          },
          {
            "reqApproval": 60,
            "text": "Você ganhou minha confiança e meu afeto. Quero que você seja minha dupla em combate e no amor."
          },
          {
            "reqApproval": 80,
            "text": "Um anel de noivado de aço e prata! Eu o usarei com mais orgulho do que qualquer condecoração real."
          }
        ],
        "weddingVows": "Sob as trombetas da Guarda Real no pátio de Eldoria, Vespera ergue sua espada cruzada com a sua: 'Que nossa união seja inabalável como o ferro e cortante contra todos os nossos inimigos!'"
      },
      {
        "id": "rom_alden",
        "name": "Alden o Mercador",
        "title": "Barão Áureo das Rotas",
        "kingdomId": "reino_eldor",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/alden.jpg",
        "profession": "Comerciante e Diplomata",
        "approval": 5,
        "status": "Conhecido",
        "favoriteGifts": [
          "item_golden_necklace",
          "item_rare_perfume",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "ration_food",
          "mat_lumen_herb"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Já negociei especiarias raras e minérios imperiais, mas o seu carisma é o único tesouro que não consigo avaliar em moedas."
          },
          {
            "reqApproval": 60,
            "text": "Esqueça os contratos comerciais. Quero selar uma parceria romântica e duradoura exclusiva com você."
          },
          {
            "reqApproval": 80,
            "text": "Esse anel rúnico é uma obra-prima! Nosso noivado fará as guildas áureas inteiras celebrarem em banquetes!"
          }
        ],
        "weddingVows": "No bazar suntuoso de Eldoria regado a vinho especiado, Alden sela os votos: 'Minha fortuna, minhas rotas e meu amor pertencem a você agora e para sempre.'"
      },
      {
        "id": "rom_thalor",
        "name": "Arquimago Thalor",
        "title": "Grão-Mestre de Valen",
        "kingdomId": "confederacao_valdrak",
        "gender": "masculine",
        "orientation": "asexual_romantic",
        "portrait": "assets/portraits/thalor.jpg",
        "profession": "Estudioso e Arcanista",
        "approval": 10,
        "status": "Amizade",
        "favoriteGifts": [
          "relic_time_tome",
          "item_poetry_book",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "w_greataxe",
          "potion_health"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Passei mais de um século entre tomos antigos, mas nossa conexão intelectual e romântica transcende qualquer equação mística."
          },
          {
            "reqApproval": 60,
            "text": "Sua alma ressoa em perfeita harmonia astral com a minha. Quero que caminhemos juntos pela eternidade do tempo."
          },
          {
            "reqApproval": 80,
            "text": "Um anel de promessa rúnica... Aceito com reverência e amor devoto."
          }
        ],
        "weddingVows": "No topo da Torre de Magia de Valen sob a luz de estrelas cadentes, Thalor declama feitiços celestiais: 'Nosso laço é selado no próprio tecido do tempo.'"
      },
      {
        "id": "rom_borin",
        "name": "Borin o Ferreiro",
        "title": "Forjador de Aço-Dragão",
        "kingdomId": "reino_eldor",
        "gender": "masculine",
        "orientation": "masculine_preference",
        "portrait": "assets/portraits/borin.jpg",
        "profession": "Mestre Ferreiro",
        "approval": 20,
        "status": "Amizade",
        "favoriteGifts": [
          "mat_iron_ingot",
          "mat_obsidian_crystal",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "item_poetry_book",
          "item_rose_bouquet"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Hahaha! Você tem braços fortes e honra firme! Gosto da sua companhia na forja mais do que de qualquer cerveja anã."
          },
          {
            "reqApproval": 60,
            "text": "Meu coração bate como meu martelo na bigorna quando você está perto. Vamos namorar de verdade, guerreiro!"
          },
          {
            "reqApproval": 80,
            "text": "Por Aethel! Você me trouxe uma aliança rúnica! Sou o ferreiro mais feliz de toda Aethelgard!"
          }
        ],
        "weddingVows": "Em meio às faíscas quentes da Cidadela de Ferro, Borin abraça você: 'Fundidos no fogo e no aço, ninguém jamais nos separará!'"
      },
      {
        "id": "rom_kaelen",
        "name": "Kaelen da Lâmina Sombria",
        "title": "Rei dos Esgotos e Espião",
        "kingdomId": "reino_eldor",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/kaelen.jpg",
        "profession": "Ladrão e Espião-Chefe",
        "approval": 0,
        "status": "Conhecido",
        "favoriteGifts": [
          "w_dagger",
          "item_rare_perfume",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "a_iron_plate",
          "item_poetry_book"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Sempre vivi nas sombras desconfiando de todos, mas você é o único para quem revelei meu rosto e meus segredos."
          },
          {
            "reqApproval": 60,
            "text": "Mesmo em um mundo de traições, você é meu porto seguro. Quero você ao meu lado como meu par no crime e no amor."
          },
          {
            "reqApproval": 80,
            "text": "Um anel de noivado para uma sombra como eu? Você roubou meu coração em definitivo."
          }
        ],
        "weddingVows": "Nos telhados noturnos do Porto de Valen sob a luz da lua, Kaelen sussurra: 'Minhas lâminas e minha lealdade oculta são suas pela eternidade.'"
      },
      {
        "id": "rom_orin",
        "name": "Ancião Druida Orin",
        "title": "Guardião da Floresta de Lúmen",
        "kingdomId": "confederacao_valdrak",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/orin.jpg",
        "profession": "Sacerdote Druídico",
        "approval": 15,
        "status": "Amizade",
        "favoriteGifts": [
          "mat_lumen_herb",
          "potion_antidote",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "mat_iron_ingot",
          "mat_obsidian_crystal"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "As árvores de Lúmen florescem mais rápido quando você caminha ao meu lado. Sua energia vital me rejuvenesce."
          },
          {
            "reqApproval": 60,
            "text": "Nossas almas estão unidas como raízes milenares no solo sagrado. Seja meu companheiro na seiva e na vida."
          },
          {
            "reqApproval": 80,
            "text": "Um anel abençoado! Que os espíritos da floresta celebrem nosso noivado sagrado!"
          }
        ],
        "weddingVows": "Diante da Árvore-Coração de Lúmen, Orin envolve as mãos de vocês com musgo brilhante: 'Crescemos juntos em harmonia com a terra e o céu.'"
      },
      {
        "id": "rom_seraphina",
        "name": "Oráculo Seraphina",
        "title": "Alta Sacerdotisa de Aethel-Lúmen",
        "kingdomId": "teocracia_aethel",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/lyra.jpg",
        "profession": "Oráculo e Inquisidora",
        "approval": 0,
        "status": "Conhecido",
        "favoriteGifts": [
          "item_rose_bouquet",
          "item_golden_necklace",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "w_dagger",
          "potion_willpower"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Eu costumava olhar apenas para a luz divina do sol, mas agora meus olhos procuram por você em cada oração."
          },
          {
            "reqApproval": 60,
            "text": "Sua honra e coragem purificaram minhas incertezas. Quero que compartilhemos nossa fé e afeto dia e noite."
          },
          {
            "reqApproval": 80,
            "text": "Este anel de noivado é uma bênção celestial! Serei sua devota noiva e parceira sagrada."
          }
        ],
        "weddingVows": "No Mosteiro Solar de Aethel-Lúmen com feixes de luz cruzando o altar, Seraphina sela os votos: 'A luz do sol e o amor da minha alma abençoam nossa união!'"
      },
      {
        "id": "rom_roderick",
        "name": "Grão-Duque Roderick",
        "title": "Soberano dos Fardos do Oeste",
        "kingdomId": "grao_ducado_vaelor",
        "gender": "masculine",
        "orientation": "feminine_preference",
        "portrait": "assets/portraits/alden.jpg",
        "profession": "Almirante e Duque Feudal",
        "approval": 10,
        "status": "Conhecido",
        "favoriteGifts": [
          "w_longsword",
          "item_golden_necklace",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "ration_food",
          "mat_lumen_herb"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Comando centenas de navios de guerra, mas é a sua graça e coragem que comandam o leme do meu coração."
          },
          {
            "reqApproval": 60,
            "text": "Quero que governe o Grão-Ducado ao meu lado. Você é a musa e a força que Vaelor sempre precisou."
          },
          {
            "reqApproval": 80,
            "text": "Aceito sua aliança com honra marcial! Nosso noivado será saudado por salvas de canhão oceânicas!"
          }
        ],
        "weddingVows": "A bordo da nau-capitânia no cais de Vaelor com gaivotas voando, Roderick sela o matrimônio: 'Nenhum mar agitado jamais separará nosso amor.'"
      },
      {
        "id": "rom_vorak",
        "name": "Khã Vorak o Esmaga-Pedras",
        "title": "Senhor da Horda Nômade de Khaz",
        "kingdomId": "horda_khaz",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/borin.jpg",
        "profession": "Chefe Guerreiro Nômade",
        "approval": 0,
        "status": "Conhecido",
        "favoriteGifts": [
          "w_greataxe",
          "item_engagement_ring",
          "mat_iron_ingot"
        ],
        "dislikedGifts": [
          "item_poetry_book",
          "item_rare_perfume"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Rrrr! Você ruge como uma fera e luta com ferocidade! Gosto mais de você do que dos meus melhores corcéis!"
          },
          {
            "reqApproval": 60,
            "text": "Você conquistou o respeito da Horda e a fúria do meu coração. Seja meu par de batalha e amor!"
          },
          {
            "reqApproval": 80,
            "text": "Um anel de ferro e ouro! Você é oficialmente noivo do Khã! Que os clãs tremam!"
          }
        ],
        "weddingVows": "Em meio a fogueiras gigantescas nos cânions de Khaz-Dûm com tambores ressoando, Vorak ergue seu machado: 'Nossa força unida dominará as cinzas!'"
      },
      {
        "id": "rom_vane",
        "name": "General Vane o Revolucionário",
        "title": "Líder dos Camponeses Livres",
        "kingdomId": "reino_eldor",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/kaelen.jpg",
        "profession": "Ex-General e Revolucionário",
        "approval": 10,
        "status": "Conhecido",
        "favoriteGifts": [
          "ration_food",
          "item_poetry_book",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "item_golden_necklace"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Sempre lutei pela liberdade dos oprimidos, mas quando estou com você, sinto a liberdade do verdadeiro afeto."
          },
          {
            "reqApproval": 60,
            "text": "Você é minha inspiração para construir uma Aethelgard justa. Vamos caminhar juntos no amor e na revolução."
          },
          {
            "reqApproval": 80,
            "text": "Esse anel rúnico... Aceito! Que nosso noivado seja o símbolo da esperança do povo livre!"
          }
        ],
        "weddingVows": "Na praça das aldeias camponesas com flores sendo jogadas pelo povo, Vane declara: 'Lado a lado, construímos uma vida e um mundo sem correntes.'"
      },
      {
        "id": "rom_harun",
        "name": "Sultão Harun Al-Dajir",
        "title": "Soberano de Aramis",
        "kingdomId": "sultanato_aramis",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/alden.jpg",
        "profession": "Sultão e Grão-Comerciante",
        "approval": 5,
        "status": "Conhecido",
        "favoriteGifts": [
          "item_golden_necklace",
          "item_rare_perfume",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "ration_food",
          "mat_lumen_herb"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Possuo palácios com cúpulas de ouro e joias do mundo todo, mas seu sorriso é a joia mais rara de Aramis."
          },
          {
            "reqApproval": 60,
            "text": "Quero você como o amor supremo do Sultanato. Tudo o que possuo está aos seus pés."
          },
          {
            "reqApproval": 80,
            "text": "Uma aliança sagrada! Nosso noivado será comemorado com 40 dias de festivais em todo o deserto!"
          }
        ],
        "weddingVows": "Sob cúpulas de ouro e tapeçarias de seda no Palácio de Aramis, Harun beija sua mão: 'Você é o meu tesouro eterno e meu par real.'"
      },
      {
        "id": "rom_morgana",
        "name": "Lady Morgana da Corte Sombria",
        "title": "Mestra da Magia de Sangue",
        "kingdomId": "grao_ducado_vaelor",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/vespera.jpg",
        "profession": "Arquimaga e Feiticeira de Sangue",
        "approval": 0,
        "status": "Conhecido",
        "favoriteGifts": [
          "potion_willpower",
          "item_rare_perfume",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "item_rose_bouquet"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "O sangue que flui em nossas veias canta a mesma melodia escura. Você me intriga como nenhum outro feiticeiro."
          },
          {
            "reqApproval": 60,
            "text": "Abandone os covardes do mundo. Quero você como meu consorte e amor na eternidade do abismo."
          },
          {
            "reqApproval": 80,
            "text": "Um anel de promessa rúnica! Nosso noivado sela um pacto imortal que nem a morte quebrará!"
          }
        ],
        "weddingVows": "No Pântano das Almas iluminado por velas púrpuras, Morgana sela o matrimônio: 'Nossa união de sangue e alma imperará pelas eras.'"
      },
      {
        "id": "rom_zorah",
        "name": "Mestre Alquimista Zorah",
        "title": "Engenheira-Chefe das Torres de Solgard",
        "kingdomId": "imperio_solgard",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/lyra.jpg",
        "profession": "Alquimista e Engenheira",
        "approval": 10,
        "status": "Conhecido",
        "favoriteGifts": [
          "mat_iron_ingot",
          "mat_obsidian_crystal",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "item_poetry_book"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Minhas engrenagens funcionam com precisão matemática, mas você faz meu coração disparar como uma caldeira sob pressão!"
          },
          {
            "reqApproval": 60,
            "text": "Você é a centelha perfeita para minha vida. Quero namorar e projetar o futuro ao seu lado!"
          },
          {
            "reqApproval": 80,
            "text": "Uma aliança de noivado perfeitamente usinada! Você é meu par ideal na oficina e no amor!"
          }
        ],
        "weddingVows": "Na Grande Oficina de Solgard com faíscas mecânicas celebrando, Zorah declara: 'Nossas vidas agora giram na mesma engrenagem perfeita!'"
      },
      {
        "id": "rom_elara",
        "name": "Lady Elara do Vale",
        "title": "Nobre Estudiosa e Curandeira",
        "kingdomId": "reino_eldor",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/lyra.jpg",
        "profession": "Curandeira e Nobre",
        "approval": 15,
        "status": "Conhecido",
        "favoriteGifts": [
          "item_rose_bouquet",
          "item_poetry_book",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "w_dagger",
          "w_greataxe"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Cuido dos feridos que chegam de Khaz, mas você é quem cura as feridas do meu espírito."
          },
          {
            "reqApproval": 60,
            "text": "Quero dedicar minha vida a cuidar de você e compartilhar nosso amor todos os dias."
          },
          {
            "reqApproval": 80,
            "text": "Sim! Mil vezes sim! Usarei este anel com toda a devoção do meu ser."
          }
        ],
        "weddingVows": "Nos jardins prateados do Vale, Elara sorri delicadamente: 'Que nossa paz e afeto sejam um santuário inabalável.'"
      },
      {
        "id": "rom_darius",
        "name": "Cavaleiro Darius da Guarda Solar",
        "title": "Paladino de Aethel-Lúmen",
        "kingdomId": "teocracia_aethel",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/vespera.jpg",
        "profession": "Paladino Solar",
        "approval": 10,
        "status": "Conhecido",
        "favoriteGifts": [
          "w_longsword",
          "item_engagement_ring",
          "potion_health"
        ],
        "dislikedGifts": [
          "potion_willpower"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Minha espada jurou proteger a luz divina, mas meu escudo sempre se erguerá primeiro para proteger você."
          },
          {
            "reqApproval": 60,
            "text": "Sua nobreza me conquistou completamente. Quero cortejá-lo com toda a honra de um paladino."
          },
          {
            "reqApproval": 80,
            "text": "Este anel rúnico sela nosso noivado abençoado! Você é minha luz e meu amor."
          }
        ],
        "weddingVows": "Diante do altar solar de Aethel, Darius ergue o escudo: 'Juro proteção, honra e amor devoto por toda a eternidade.'"
      },
      {
        "id": "rom_sylas",
        "name": "Mestre Sylas dos Ventos",
        "title": "Domador de Dragões de Val-Drak",
        "kingdomId": "confederacao_valdrak",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/thalor.jpg",
        "profession": "Domador de Dragão Aéreo",
        "approval": 20,
        "status": "Amizade",
        "favoriteGifts": [
          "dragon_elixir",
          "item_rare_perfume",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "mat_iron_ingot"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Nossos dragões voam juntos em perfeita sincronia e eu sinto a mesma harmonia no meu coração por você."
          },
          {
            "reqApproval": 60,
            "text": "Voar com você é a maior liberdade que conheço. Seja meu namorado entre os picos nevados!"
          },
          {
            "reqApproval": 80,
            "text": "Uma aliança celestial! Nosso noivado será celebrado com um voo rasante sobre as nuvens!"
          }
        ],
        "weddingVows": "Nas alturas do Santuário Flutuante sob o rugido dos dragões, Sylas sela os votos: 'Nossos corações cortam os céus unidos para sempre.'"
      },
      {
        "id": "rom_isolda",
        "name": "Almirante Isolda da Frota Galeão",
        "title": "Comandante Naval do Oeste",
        "kingdomId": "grao_ducado_vaelor",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/vespera.jpg",
        "profession": "Almirante Naval",
        "approval": 15,
        "status": "Conhecido",
        "favoriteGifts": [
          "item_golden_necklace",
          "item_engagement_ring",
          "w_longsword"
        ],
        "dislikedGifts": [
          "item_poetry_book"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Naveguei por tempestades ferozes, mas nenhuma me balançou tanto quanto o seu olhar desafiador."
          },
          {
            "reqApproval": 60,
            "text": "Você é minha âncora e minha bússola. Vamos navegar juntos nesta jornada romântica."
          },
          {
            "reqApproval": 80,
            "text": "Um anel digno de uma almirante! Nosso noivado sela a mais forte aliança naval e romântica do oceano!"
          }
        ],
        "weddingVows": "No convés de comando com sinos tocando em Vaelor, Isolda jura: 'Você é o porto onde minha alma descansa e impera.'"
      },
      {
        "id": "rom_azra",
        "name": "Xamã Azra da Horda de Khaz",
        "title": "Sábia das Feras do Abismo",
        "kingdomId": "horda_khaz",
        "gender": "feminine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/orin.jpg",
        "profession": "Xamã e Espiritualista",
        "approval": 10,
        "status": "Conhecido",
        "favoriteGifts": [
          "potion_antidote",
          "item_engagement_ring",
          "mat_lumen_herb"
        ],
        "dislikedGifts": [
          "a_iron_plate"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Os espíritos das cinzas sussurraram seu nome nas minhas meditações. Você traz calor às noites frias de Khaz."
          },
          {
            "reqApproval": 60,
            "text": "Sua coragem e espírito selaram nosso destino. Quero amar e proteger sua alma nos cânions."
          },
          {
            "reqApproval": 80,
            "text": "Um anel de juramento rúnico! Que os ancestrais abençoem nosso noivado para todo o sempre!"
          }
        ],
        "weddingVows": "Na caverna sagrada da Horda com incenso de ervas queimando, Azra jura: 'Nossos espíritos correm livres e eternamente abraçados.'"
      },
      {
        "id": "rom_tarek",
        "name": "Tarek o Caixeiro Áureo",
        "title": "Negociante de Joias de Aramis",
        "kingdomId": "sultanato_aramis",
        "gender": "masculine",
        "orientation": "pansexual",
        "portrait": "assets/portraits/alden.jpg",
        "profession": "Ourives e Comerciante",
        "approval": 10,
        "status": "Conhecido",
        "favoriteGifts": [
          "item_rare_perfume",
          "item_golden_necklace",
          "item_engagement_ring"
        ],
        "dislikedGifts": [
          "ration_food"
        ],
        "dialogues": [
          {
            "reqApproval": 30,
            "text": "Lapidei diademas e cristais para príncipes, mas nenhuma joia brilha tanto quanto a sua generosidade."
          },
          {
            "reqApproval": 60,
            "text": "Quero compartilhar meu ouro, minhas rotas e meu coração apaixonado com você todos os dias."
          },
          {
            "reqApproval": 80,
            "text": "Uma aliança magnífica! Nosso noivado fará os bazares de Aramis transbordarem de celebração!"
          }
        ],
        "weddingVows": "Nos jardins suspensos do oásis em Aramis, Tarek sorri: 'Você é a joia mais preciosa da minha vida.'"
      }
    ]
  }
};
