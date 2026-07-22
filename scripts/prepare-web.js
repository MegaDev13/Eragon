#!/usr/bin/env node
/**
 * Prepara automaticamente a pasta www para o Capacitor.
 * Copia todos os arquivos do projeto para www/, ignorando pastas indesejadas.
 * Executado automaticamente no GitHub Actions.
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = process.cwd();
const TARGET_DIR = path.join(SOURCE_DIR, 'www');

// Pastas e arquivos a IGNORAR (sempre)
const EXCLUDES = [
  '.git',
  '.github',
  'node_modules',
  'android',
  'www',
  '.cache',
  'dist',
  '.DS_Store',
  'package-lock.json.tmp'
];

function shouldExclude(name) {
  return EXCLUDES.includes(name);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (shouldExclude(entry.name)) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('🛠️  Preparando pasta www para Capacitor...');

// Limpa www anterior (se existir)
if (fs.existsSync(TARGET_DIR)) {
  fs.rmSync(TARGET_DIR, { recursive: true, force: true });
}

// Cria nova www com cópia completa
copyRecursive(SOURCE_DIR, TARGET_DIR);

console.log('✅ Pasta www criada com sucesso!');
console.log('   - Todos os arquivos do jogo foram copiados');
console.log('   - Pastas ignoradas: ' + EXCLUDES.join(', '));