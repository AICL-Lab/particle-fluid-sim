#!/usr/bin/env node

/**
 * Build script for documentation site
 * Converts markdown files to HTML and creates a static documentation site
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_DIR = path.join(__dirname, '..', '_site');
const DOCS_DIR = path.join(__dirname, '..', 'docs');

// Simple markdown to HTML converter
function mdToHtml(md) {
  let html = md;
  
  // Code blocks (must be processed before other transformations)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  
  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
    const cells = content.split('|').map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) {
      return ''; // Skip separator line
    }
    const tag = 'td';
    const row = cells.map(c => `<${tag}>${c}</${tag}>`).join('');
    return `<tr>${row}</tr>`;
  });
  
  // Wrap consecutive <tr> in <table>
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table>\n$1</table>');
  
  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>');
  
  // Paragraphs - convert remaining newlines
  html = html.replace(/\n\n/g, '</p>\n<p>');
  html = `<p>${html}</p>`;
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[123]>)/g, '$1');
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  
  return html;
}

// Create HTML wrapper for documentation pages
function wrapDocPage(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - WebGPU Particle Fluid Documentation</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💧</text></svg>">
    <style>
        .doc-content { max-width: 900px; margin: 40px auto; padding: 0 24px; }
        .doc-content h1 { font-size: 36px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #d0d7de; }
        .doc-content h2 { font-size: 28px; margin-top: 40px; margin-bottom: 16px; }
        .doc-content h3 { font-size: 22px; margin-top: 32px; margin-bottom: 12px; }
        .doc-content p { margin-bottom: 16px; line-height: 1.8; }
        .doc-content a { color: #0969da; }
        .doc-content code { background: #f6f8fa; padding: 2px 6px; border-radius: 4px; font-family: SFMono-Regular, Consolas, monospace; font-size: 14px; }
        .doc-content pre { background: #1f2328; color: #e6edf3; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; }
        .doc-content pre code { background: none; padding: 0; color: inherit; }
        .doc-content table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .doc-content th, .doc-content td { border: 1px solid #d0d7de; padding: 12px; text-align: left; }
        .doc-content th { background: #f6f8fa; font-weight: 600; }
        .doc-content ul, .doc-content ol { margin-left: 24px; margin-bottom: 16px; }
        .doc-content li { margin-bottom: 8px; }
        .doc-content blockquote { border-left: 4px solid #0969da; padding-left: 16px; margin: 16px 0; color: #656d76; }
        .back-link { display: inline-block; margin-bottom: 24px; color: #0969da; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
        nav { margin: 24px 0; padding: 16px; background: #f6f8fa; border-radius: 6px; }
        nav a { margin-right: 16px; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container header-content">
            <div class="logo">
                <span class="logo-icon">💧</span>
                <h1><a href="/" style="text-decoration: none; color: inherit;">WebGPU Particle Fluid</a></h1>
            </div>
            <nav class="nav">
                <a href="/">Home</a>
                <a href="/docs/API/">API</a>
                <a href="/docs/PERFORMANCE/">Performance</a>
                <a href="/docs/TROUBLESHOOTING/">Troubleshooting</a>
                <a href="https://github.com/LessUp/particle-fluid-sim" target="_blank">GitHub</a>
            </nav>
        </div>
    </header>
    <main class="doc-content">
        <a href="/" class="back-link">← Back to Home</a>
        ${content}
    </main>
    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>Released under the <a href="/LICENSE">MIT License</a></p>
            </div>
        </div>
    </footer>
    <script src="/search-index.js"></script>
    <script src="/main.js"></script>
</body>
</html>`;
}

// Build the site
function build() {
  console.log('🔨 Building documentation site...');
  
  // Clean and create site directory
  if (fs.existsSync(SITE_DIR)) {
    fs.rmSync(SITE_DIR, { recursive: true });
  }
  fs.mkdirSync(SITE_DIR, { recursive: true });
  
  // Copy static files from docs/site
  const staticDir = path.join(DOCS_DIR, 'site');
  if (fs.existsSync(staticDir)) {
    fs.cpSync(staticDir, SITE_DIR, { recursive: true });
    console.log('✅ Copied static files');
  }
  
  // Files to convert from markdown to HTML
  const mdFiles = [
    { src: 'docs/API.md', dest: 'docs/API/index.html', title: 'API Reference' },
    { src: 'docs/PERFORMANCE.md', dest: 'docs/PERFORMANCE/index.html', title: 'Performance Guide' },
    { src: 'docs/TROUBLESHOOTING.md', dest: 'docs/TROUBLESHOOTING/index.html', title: 'Troubleshooting' },
    { src: 'docs/maintenance.md', dest: 'docs/maintenance/index.html', title: 'Maintenance Guide' },
    { src: 'docs/architecture/README.md', dest: 'docs/architecture/index.html', title: 'Architecture' },
    { src: 'docs/setup/README.md', dest: 'docs/setup/index.html', title: 'Setup Guide' },
    { src: 'docs/tutorials/README.md', dest: 'docs/tutorials/index.html', title: 'Tutorials' },
    { src: 'README.md', dest: 'README/index.html', title: 'README' },
    { src: 'CHANGELOG.md', dest: 'CHANGELOG/index.html', title: 'Changelog' },
    { src: 'CONTRIBUTING.md', dest: 'CONTRIBUTING/index.html', title: 'Contributing' },
    { src: 'LICENSE', dest: 'LICENSE/index.html', title: 'License' },
  ];
  
  mdFiles.forEach(({ src, dest, title }) => {
    const srcPath = path.join(__dirname, '..', src);
    const destPath = path.join(SITE_DIR, dest);
    
    if (fs.existsSync(srcPath)) {
      const md = fs.readFileSync(srcPath, 'utf8');
      const html = mdToHtml(md);
      const wrapped = wrapDocPage(title, html);
      
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, wrapped);
      console.log(`✅ Converted: ${src}`);
    } else {
      console.log(`⚠️  Not found: ${src}`);
    }
  });
  
  console.log('✅ Documentation site built successfully!');
}

build();
