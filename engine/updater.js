/**
 * Crônica de Aethelgard - Gerenciador de Atualizações Automáticas via GitHub (updater.js)
 * Verifica novas versões no GitHub Pages, faz download em segundo plano e aplica sem reinstalar o APK.
 */

class LiveUpdater {
  constructor() {
    this.currentVersion = "1.0.42";
    // URL padrão configurável para o seu repositório GitHub Pages
    this.githubRepoUrl = localStorage.getItem("aethelgard_repo_url") || "https://SEU_USUARIO.github.io/SEU_REPOSITORIO/";
    this.isChecking = false;
    this.hasUpdateReady = false;
  }

  init() {
    console.log(`[LiveUpdater] Inicializado na versão ${this.currentVersion}. Repositório configurado: ${this.githubRepoUrl}`);
    
    // Configurar temporizador para checar atualizações a cada 30 minutos quando online
    setInterval(() => {
      this.checkForUpdates(false);
    }, 30 * 60 * 1000);

    // Checar logo após a inicialização do jogo (com um pequeno atraso de 3s para não interferir na animação)
    setTimeout(() => {
      this.checkForUpdates(false);
    }, 3000);
  }

  setGitHubUrl(url) {
    if (!url.endsWith("/")) url += "/";
    this.githubRepoUrl = url;
    localStorage.setItem("aethelgard_repo_url", url);
    console.log(`[LiveUpdater] URL do GitHub atualizada para: ${url}`);
    if (window.ui) window.ui.showToast(`URL de atualização definida: ${url}`, "info");
  }

  async checkForUpdates(silent = true) {
    if (this.isChecking) return;
    if (!navigator.onLine) {
      if (!silent && window.ui) window.ui.showToast("Você está offline. O jogo está rodando com os dados locais salvos.", "warning");
      return;
    }

    // Se a URL ainda for o placeholder padrão, não tentar requisição externa em silent mode
    if (this.githubRepoUrl.includes("SEU_USUARIO.github.io")) {
      if (!silent && window.ui) {
        window.ui.showModalAlert(
          "⚙️ CONFIGURAR REPOSITÓRIO GITHUB",
          `<p>Para que o aplicativo APK baixe atualizações automáticas, informe a URL do seu GitHub Pages:</p>
          <input type="text" id="repo-url-input" value="${this.githubRepoUrl}" class="inv-search-field mt-3" placeholder="https://seu-usuario.github.io/seu-repo/"/>
          <p class="mt-2" style="font-size:12px; opacity:0.8;">O app consultará o arquivo <strong>version.json</strong> nesse endereço para aplicar novas melhorias e eventos no jogo.</p>`,
          "Salvar e Verificar Agora",
          () => {
            const input = document.getElementById("repo-url-input");
            if (input && input.value) {
              this.setGitHubUrl(input.value.trim());
              this.checkForUpdates(false);
            }
          }
        );
      }
      return;
    }

    this.isChecking = true;
    try {
      const versionUrl = `${this.githubRepoUrl}version.json?t=${Date.now()}`;
      console.log(`[LiveUpdater] Verificando atualizações em: ${versionUrl}`);
      
      const response = await fetch(versionUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      
      const remoteData = await response.json();
      if (remoteData && remoteData.version) {
        if (this.compareVersions(remoteData.version, this.currentVersion) > 0) {
          console.log(`[LiveUpdater] Nova versão encontrada no GitHub: v${remoteData.version} (Atual: v${this.currentVersion})`);
          this.promptUpdateReady(remoteData);
        } else {
          console.log("[LiveUpdater] O jogo já está na versão mais recente.");
          if (!silent && window.ui) window.ui.showToast("Sua Crônica de Aethelgard está 100% atualizada!", "success");
        }
      }
    } catch (err) {
      console.warn("[LiveUpdater] Não foi possível checar o version.json remoto:", err.message);
      if (!silent && window.ui) window.ui.showToast("Falha ao consultar o GitHub. O jogo continuará rodando offline perfeitamente.", "warning");
    } finally {
      this.isChecking = false;
    }
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  }

  async promptUpdateReady(remoteData) {
    this.hasUpdateReady = true;
    if (!window.ui) return;

    // Se houver Service Worker ativo ou se estamos rodando em app WebView, baixar novos arquivos JSON
    window.ui.showModalAlert(
      "⚔️ NOVA ATUALIZAÇÃO DISPONÍVEL NO GITHUB",
      `<div class="update-alert-content">
        <p style="font-size:16px; color:#facc15; font-weight:bold;">Versão Remota Detectada: v${remoteData.version} <small style="color:#94a3b8;">(Sua versão: v${this.currentVersion})</small></p>
        <p class="mt-2"><strong>Novidades desta atualização:</strong></p>
        <div class="p-3 mt-1" style="background:rgba(0,0,0,0.5); border-left:3px solid #10b981; border-radius:4px; font-size:13.5px;">
          ${remoteData.releaseNotes || "Melhorias de estabilidade, expansão narrativa e balanceamento de itens."}
        </div>
        <p class="mt-3" style="font-size:13px; opacity:0.9;">O aplicativo baixará os novos pacotes e arquivos JSON agora mesmo. Seus saves e progresso serão preservados com total segurança na memória local.</p>
      </div>`,
      "Baixar e Aplicar Atualização Agora",
      async () => {
        await this.downloadAndApplyUpdate(remoteData);
      }
    );
    if (window.audioManager) window.audioManager.play("levelup");
  }

  async downloadAndApplyUpdate(remoteData) {
    if (window.ui) window.ui.showToast("Baixando pacotes atualizados do GitHub Pages...", "info");
    
    try {
      // Baixar o novo data_loader.js ou arquivos JSON atualizados para o cache local
      const dataUrl = `${this.githubRepoUrl}assets/data_loader.js?t=${Date.now()}`;
      const resp = await fetch(dataUrl, { cache: "no-store" });
      
      if (resp.ok) {
        const scriptContent = await resp.text();
        // Armazenar no localStorage para que o app carregue o script remoto atualizado na próxima inicialização
        localStorage.setItem("aethelgard_dynamic_data_script", scriptContent);
        localStorage.setItem("aethelgard_cached_version", remoteData.version);
        
        // Atualizar versão interna
        this.currentVersion = remoteData.version;
        
        if (window.ui) {
          window.ui.showModalAlert(
            "✅ ATUALIZAÇÃO APLICADA COM SUCESSO!",
            `<p>O jogo foi atualizado para a versão <strong>v${remoteData.version}</strong>!</p>
            <p class="mt-2">O aplicativo irá recarregar a engine agora para ativar os novos eventos e missões.</p>`,
            "Recarregar Jogo Agora",
            () => {
              window.location.reload();
            }
          );
        }
      } else {
        throw new Error(`Falha no download dos dados remotos (HTTP ${resp.status})`);
      }
    } catch (e) {
      console.error("[LiveUpdater] Erro ao baixar e aplicar atualização:", e);
      if (window.ui) {
        window.ui.showModalAlert(
          "⚠️ AVISO DE ATUALIZAÇÃO",
          `<p>Não foi possível baixar os dados atualizados diretamente do servidor (${e.message}).</p>
          <p class="mt-2">Se você estiver rodando em modo PWA com Service Worker, o próprio navegador já agendou a atualização para a próxima inicialização.</p>`,
          "Continuar Jogando"
        );
      }
    }
  }

  /**
   * Chamado no início do core.js: se houver um script de dados remoto em cache no localStorage superior, avaliá-lo
   */
  applyCachedUpdatesIfPresent() {
    const cachedVer = localStorage.getItem("aethelgard_cached_version");
    const cachedScript = localStorage.getItem("aethelgard_dynamic_data_script");
    
    if (cachedVer && cachedScript && this.compareVersions(cachedVer, this.currentVersion) > 0) {
      console.log(`[LiveUpdater] Aplicando pacote de dados dinâmico da versão v${cachedVer} do cache local...`);
      try {
        // Avalia o data_loader.js remoto em cache
        const evalFn = new Function(cachedScript);
        evalFn();
        this.currentVersion = cachedVer;
        console.log(`[LiveUpdater] Dados dinâmicos v${cachedVer} carregados com sucesso no DATA_REGISTRY!`);
      } catch (err) {
        console.error("[LiveUpdater] Erro ao avaliar script em cache:", err);
        localStorage.removeItem("aethelgard_dynamic_data_script");
      }
    }
  }
}

window.liveUpdater = new LiveUpdater();
