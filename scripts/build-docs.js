#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const SITE_DIR = path.join(ROOT_DIR, '_site');
const STATIC_SITE_DIR = path.join(ROOT_DIR, 'docs', 'site');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const GITHUB_BLOB_ROOT = 'https://github.com/LessUp/particle-fluid-sim/blob/master';

const pageDefinitions = [
  {
    source: 'README.md',
    dest: 'README/index.html',
    title: 'README',
    summary: 'Project overview, quick start, architecture, validation commands, and spec links.',
    tags: ['readme', 'overview', 'quick-start', 'webgpu'],
  },
  {
    source: 'CHANGELOG.md',
    dest: 'CHANGELOG/index.html',
    title: 'Changelog',
    summary: 'Version history and notable releases for the project.',
    tags: ['changelog', 'releases', 'history'],
  },
  {
    source: 'CONTRIBUTING.md',
    dest: 'CONTRIBUTING/index.html',
    title: 'Contributing',
    summary: 'Repository workflow, contribution rules, and OpenSpec-first expectations.',
    tags: ['contributing', 'workflow', 'process'],
  },
  {
    source: 'LICENSE',
    dest: 'LICENSE/index.html',
    title: 'License',
    summary: 'MIT license for the project.',
    tags: ['license', 'mit'],
  },
  {
    source: 'docs/README.md',
    dest: 'docs/index.html',
    title: 'Documentation Index',
    summary: 'Curated map of the durable documentation and specification pages.',
    tags: ['docs', 'index', 'reference'],
  },
  {
    source: 'docs/API.md',
    dest: 'docs/API/index.html',
    title: 'API Reference',
    summary: 'TypeScript-facing API and module reference for the simulation.',
    tags: ['api', 'typescript', 'reference'],
  },
  {
    source: 'docs/PERFORMANCE.md',
    dest: 'docs/PERFORMANCE/index.html',
    title: 'Performance Guide',
    summary: 'Practical profiling and performance guidance for the WebGPU runtime.',
    tags: ['performance', 'profiling', 'runtime'],
  },
  {
    source: 'docs/TROUBLESHOOTING.md',
    dest: 'docs/TROUBLESHOOTING/index.html',
    title: 'Troubleshooting',
    summary: 'Browser, runtime, and setup troubleshooting for the simulation.',
    tags: ['troubleshooting', 'debugging', 'browser'],
  },
  {
    source: 'docs/maintenance.md',
    dest: 'docs/workflow/index.html',
    title: 'Workflow Guide',
    summary: 'Project-specific closeout workflow, hooks, validation, and review checkpoints.',
    tags: ['workflow', 'maintenance', 'openspec', 'review'],
  },
  {
    source: 'docs/architecture/README.md',
    dest: 'docs/architecture/index.html',
    title: 'Architecture Overview',
    summary: 'System architecture, GPU pipeline, and data flow overview.',
    tags: ['architecture', 'gpu', 'pipeline'],
  },
  {
    source: 'docs/setup/README.md',
    dest: 'docs/setup/index.html',
    title: 'Setup Guide',
    summary: 'Environment setup, local tooling, LSP, and hook installation guidance.',
    tags: ['setup', 'lsp', 'hooks', 'development'],
  },
  {
    source: 'openspec/specs/product/webgpu-particle-fluid-sim.md',
    dest: 'specs/product/index.html',
    title: 'Product Requirements',
    summary: 'Functional and non-functional requirements for the current simulation.',
    tags: ['specs', 'product', 'requirements'],
  },
  {
    source: 'openspec/specs/rfc/0001-core-architecture.md',
    dest: 'specs/architecture/index.html',
    title: 'Core Architecture RFC',
    summary: 'Detailed architecture RFC covering the CPU/GPU split and rendering design.',
    tags: ['specs', 'rfc', 'architecture'],
  },
  {
    source: 'openspec/specs/rfc/0002-implementation-tasks.md',
    dest: 'specs/implementation/index.html',
    title: 'Implementation Tasks',
    summary: 'Historical implementation task record for the current version.',
    tags: ['specs', 'tasks', 'history'],
  },
  {
    source: 'openspec/specs/api/typescript-interfaces.md',
    dest: 'specs/api/index.html',
    title: 'API Specification',
    summary: 'Specification-level API contracts and interfaces for the codebase.',
    tags: ['specs', 'api', 'contracts'],
  },
  {
    source: 'openspec/specs/testing/bdd-specifications.md',
    dest: 'specs/testing/index.html',
    title: 'Testing Specification',
    summary: 'BDD and verification expectations for the simulation.',
    tags: ['specs', 'testing', 'bdd'],
  },
];

const pages = pageDefinitions.map((page) => ({
  ...page,
  sourcePath: path.join(ROOT_DIR, page.source),
  sitePath: page.dest.replace(/index\.html$/, ''),
}));

const routeMap = new Map(pages.map((page) => [path.resolve(page.sourcePath), page.sitePath]));

marked.setOptions({
  gfm: true,
});

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanSite() {
  if (fs.existsSync(SITE_DIR)) {
    fs.rmSync(SITE_DIR, { recursive: true, force: true });
  }
  ensureDir(SITE_DIR);
}

function copyStaticSiteFiles() {
  if (fs.existsSync(STATIC_SITE_DIR)) {
    fs.cpSync(STATIC_SITE_DIR, SITE_DIR, {
      recursive: true,
      filter: (src) => path.basename(src) !== 'search-index.js',
    });
  }
}

function copyDemoBuild() {
  if (!fs.existsSync(DIST_DIR)) {
    console.log('ℹ️  Demo build not found, skipping /demo site output');
    return;
  }

  fs.cpSync(DIST_DIR, path.join(SITE_DIR, 'demo'), { recursive: true });
  console.log('✅ Copied demo build to /demo');
}

function getSiteRoot(dest) {
  const segments = path.posix.dirname(dest).split('/').filter(Boolean);
  return segments.length === 0 ? './' : '../'.repeat(segments.length);
}

function relativeLink(fromDest, targetPath) {
  const fromDir = path.posix.dirname(fromDest);
  const targetDir = targetPath.replace(/\/$/, '');
  let relative = path.posix.relative(fromDir, targetDir);

  if (relative === '') {
    relative = '.';
  }

  return targetPath.endsWith('/') ? `${relative}/` : relative;
}

function resolveMarkdownTarget(href, currentSourcePath, currentDest) {
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('data:') ||
    href.startsWith('#')
  ) {
    return href;
  }

  const [rawPath, hash = ''] = href.split('#');
  const resolvedPath = path.resolve(path.dirname(currentSourcePath), rawPath);

  let targetPath = resolvedPath;
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    const directoryReadme = path.join(resolvedPath, 'README.md');
    if (routeMap.has(directoryReadme)) {
      targetPath = directoryReadme;
    }
  }

  if (routeMap.has(targetPath)) {
    const targetSitePath = routeMap.get(targetPath);
    const link = relativeLink(currentDest, targetSitePath);
    return hash ? `${link}#${hash}` : link;
  }

  if (targetPath.startsWith(ROOT_DIR)) {
    const repoPath = path.relative(ROOT_DIR, targetPath).replaceAll(path.sep, '/');
    return `${GITHUB_BLOB_ROOT}/${repoPath}${hash ? `#${hash}` : ''}`;
  }

  return href;
}

function rewriteMarkdownLinks(markdown, currentSourcePath, currentDest) {
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    const rewrittenHref = resolveMarkdownTarget(href, currentSourcePath, currentDest);
    return `[${label}](${rewrittenHref})`;
  });
}

function wrapDocument(page, html) {
  const siteRoot = getSiteRoot(page.dest);
  const homeUrl = relativeLink(page.dest, '');
  const demoUrl = relativeLink(page.dest, 'demo/');
  const docsUrl = relativeLink(page.dest, 'docs/');
  const specsUrl = relativeLink(page.dest, 'specs/product/');
  const workflowUrl = relativeLink(page.dest, 'docs/workflow/');
  const apiUrl = relativeLink(page.dest, 'docs/API/');
  const performanceUrl = relativeLink(page.dest, 'docs/PERFORMANCE/');
  const troubleshootingUrl = relativeLink(page.dest, 'docs/TROUBLESHOOTING/');
  const licenseUrl = relativeLink(page.dest, 'LICENSE/');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title} - WebGPU Particle Fluid Simulation</title>
    <meta name="description" content="${page.summary}" />
    <link rel="stylesheet" href="${siteRoot}styles.css" />
  </head>
  <body data-site-root="${siteRoot}">
    <header class="header">
      <div class="container header-content">
        <a href="${homeUrl}" class="logo">
          <span class="logo-icon">💧</span>
          <span class="logo-text">Particle Fluid</span>
        </a>
        <nav class="nav">
          <a href="${demoUrl}" class="nav-link demo-link">Demo</a>
          <a href="${docsUrl}" class="nav-link">Docs</a>
          <a href="${specsUrl}" class="nav-link">Specs</a>
          <a href="https://github.com/LessUp/particle-fluid-sim" target="_blank" class="nav-link">GitHub</a>
        </nav>
      </div>
    </header>
    <main class="doc-content">
      <a href="${homeUrl}" class="back-link">← Back to Home</a>
      <nav>
        <a href="${docsUrl}">Docs Index</a>
        <a href="${apiUrl}">API</a>
        <a href="${performanceUrl}">Performance</a>
        <a href="${troubleshootingUrl}">Troubleshooting</a>
        <a href="${workflowUrl}">Workflow</a>
      </nav>
      ${html}
    </main>
    <footer class="footer">
      <div class="container">
        <div class="footer-bottom">
          <p>Released under the <a href="${licenseUrl}">MIT License</a></p>
        </div>
      </div>
    </footer>
    <script src="${siteRoot}search-index.js"></script>
    <script src="${siteRoot}main.js"></script>
  </body>
</html>`;
}

function buildMarkdownPages() {
  for (const page of pages) {
    if (!fs.existsSync(page.sourcePath)) {
      console.log(`⚠️  Skipping missing page source: ${page.source}`);
      continue;
    }

    const rawMarkdown = fs.readFileSync(page.sourcePath, 'utf8');
    const rewrittenMarkdown = rewriteMarkdownLinks(rawMarkdown, page.sourcePath, page.dest);
    const html = marked.parse(rewrittenMarkdown);
    const wrapped = wrapDocument(page, html);
    const outputPath = path.join(SITE_DIR, page.dest);

    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, wrapped);
    console.log(`✅ Built page: ${page.dest}`);
  }
}

function buildSearchIndex() {
  const searchIndex = pages.map((page) => ({
    title: page.title,
    url: page.sitePath,
    content: page.summary,
    tags: page.tags,
  }));

  const output = `const SEARCH_INDEX = ${JSON.stringify(searchIndex, null, 2)};\n`;
  fs.writeFileSync(path.join(SITE_DIR, 'search-index.js'), output);
  console.log('✅ Generated search index');
}

function build() {
  console.log('🔨 Building Pages site...');
  cleanSite();
  copyStaticSiteFiles();
  copyDemoBuild();
  buildMarkdownPages();
  buildSearchIndex();
  console.log('✅ Pages site built successfully');
}

build();
