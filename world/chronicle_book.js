/**
 * Crônica de Aethelgard - Livro das Crônicas (chronicle_book.js)
 * Registra automaticamente a jornada do protagonista em capítulos vivos.
 * Cada campanha gera um livro único. O mundo vive, a crônica é a sua marca.
 */

class ChronicleBook {
  constructor() {
    this.chapters = [];
    this.currentChapter = null;
    this.knownMilestones = new Set();
  }

  init(savedData = null) {
    if (savedData) {
      this.chapters = savedData.chapters || [];
      this.currentChapter = savedData.currentChapter || null;
      this.knownMilestones = new Set(savedData.knownMilestones || []);
    } else {
      // Humble beginning
      this.startNewChapter("A Chegada ao Vale das Cinzas");
      if (this.currentChapter) {
        this.currentChapter.entries.push({
          id: Date.now(),
          day: "Dia 1",
          type: "discovery",
          title: "Você acorda sozinho no Vale das Cinzas, exilado e sem nome. Apenas 18 moedas e três rações. O mundo não o conhece.",
          source: "Início Humilde"
        });
      }
    }
  }

  // Called automatically by various systems
  recordMilestone(type, details, source = "Jornada") {
    const day = window.calendarManager ? window.calendarManager.getFormattedDate() : "Dia desconhecido";
    const milestoneKey = `${type}_${details.substring(0, 20)}`;

    if (this.knownMilestones.has(milestoneKey)) return; // avoid duplicates
    this.knownMilestones.add(milestoneKey);

    const entry = {
      id: Date.now(),
      day,
      type,
      title: details,
      source,
      timestamp: Date.now()
    };

    // Create or append to current chapter
    if (!this.currentChapter || this.currentChapter.entries.length > 6) {
      this.startNewChapter(`Capítulo ${this.chapters.length + 1}: ${this.generateChapterTitle(type)}`);
    }

    if (this.currentChapter) {
      this.currentChapter.entries.push(entry);
    }

    // Auto-record important events
    if (window.ui) {
      window.ui.showToast(`📜 Crônica atualizada: ${details}`, "info");
    }

    console.log(`[Chronicle] Registrado: ${type} - ${details}`);
  }

  startNewChapter(title) {
    this.currentChapter = {
      title: title,
      startedDay: window.calendarManager ? window.calendarManager.getFormattedDate() : "Dia 1",
      entries: []
    };
    this.chapters.push(this.currentChapter);
  }

  generateChapterTitle(type) {
    const titles = {
      "discovery": ["A Primeira Descoberta", "O Segredo Encontrado", "O Mundo se Abre"],
      "recruit": ["O Primeiro Companheiro", "Laços que Formam", "A Primeira Aliança"],
      "quest": ["A Primeira Missão", "Escolha e Consequência", "A Marca de um Herói"],
      "travel": ["A Primeira Jornada", "Estradas Desconhecidas", "Além do Vale"],
      "battle": ["O Primeiro Sangue", "A Lâmina e o Fogo", "Sobrevivente"],
      "dragon": ["O Nascimento da Escama", "O Primeiro Voo", "O Dragão Desperta"],
      "affinity": ["A Primeira Confiança", "Laço Profundo", "Aliado de Sangue"],
      "economy": ["O Primeiro Ouro", "Comércio e Sobrevivência", "O Preço da Vida"]
    };
    const list = titles[type] || ["A Jornada Continua"];
    return list[Math.floor(Math.random() * list.length)];
  }

  // Auto-triggers from main systems (call from core/events)
  recordDiscovery(id, source) {
    this.recordMilestone("discovery", `Descobriu ${id}`, source);
  }

  recordRecruit(npcName) {
    this.recordMilestone("recruit", `Recrutou ${npcName} para a Party`);
  }

  recordQuestComplete(questTitle) {
    this.recordMilestone("quest", `Concluiu "${questTitle}"`);
  }

  recordTravel(dest) {
    this.recordMilestone("travel", `Viajou até ${dest}`);
  }

  recordBattle(enemy) {
    this.recordMilestone("battle", `Derrotou ${enemy}`);
  }

  getFullChronicle() {
    return {
      title: "Livro das Crônicas de Aethelgard",
      protagonist: window.attributesManager ? `Nível ${window.attributesManager.level}` : "O Exilado",
      chapters: this.chapters,
      totalChapters: this.chapters.length,
      lastEntry: this.currentChapter ? this.currentChapter.entries[this.currentChapter.entries.length - 1] : null
    };
  }

  exportData() {
    return {
      chapters: JSON.parse(JSON.stringify(this.chapters)),
      currentChapter: this.currentChapter,
      knownMilestones: Array.from(this.knownMilestones)
    };
  }
}

window.chronicleBook = new ChronicleBook();