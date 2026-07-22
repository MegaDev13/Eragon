/**
 * Patch para carregar os novos sistemas de descoberta
 * Adicione isto no final de assets/data_loader.js ou inclua via index.html
 */

// Inicializa os novos sistemas após o carregamento principal
if (typeof window !== 'undefined') {
  // Garante que os managers existam mesmo sem save
  setTimeout(() => {
    if (!window.discoveryManager) {
      console.log('[Patch] Inicializando DiscoveryManager');
      // discovery_manager.js já registra a instância global
    }
    if (!window.affinityManager) {
      console.log('[Patch] Inicializando AffinityManager');
    }
    if (!window.explorationEngine) {
      console.log('[Patch] Inicializando ExplorationEngine');
    }
  }, 1200);
}