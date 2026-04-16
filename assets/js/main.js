// Main JavaScript for WebGPU Particle Fluid Simulation
// ============================================================================

(function() {
  'use strict';

  // Mobile Navigation Toggle
  // ============================================================================
  const menuBtn = document.querySelector('.header__menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('is-open', !isExpanded);
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  // ============================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 64;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // Table of Contents Active Link Highlighting
  // ============================================================================
  const toc = document.querySelector('.toc');
  if (toc) {
    const headings = document.querySelectorAll('h2[id], h3[id]');
    const tocLinks = toc.querySelectorAll('a');

    function highlightTocLink() {
      const scrollPos = window.scrollY + 100;
      let current = null;

      headings.forEach(heading => {
        if (heading.offsetTop <= scrollPos) {
          current = heading;
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === '#' + current.id) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', debounce(highlightTocLink, 100));
    highlightTocLink();
  }

  // Search functionality
  // ============================================================================
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let searchIndex = null;

    // Fetch search index
    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        searchIndex = data;
      })
      .catch(error => console.error('Error loading search index:', error));

    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      const resultsContainer = document.getElementById('search-results');

      if (!query || !searchIndex) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
        return;
      }

      const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.content.toLowerCase().includes(query) ||
               (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)));
      }).slice(0, 10);

      displaySearchResults(results, resultsContainer, query);
    }, 300));
  }

  function displaySearchResults(results, container, query) {
    if (results.length === 0) {
      container.innerHTML = '<div class="search__no-results">No results found</div>';
    } else {
      container.innerHTML = results.map(item => `
        <a href="${item.url}" class="search__result">
          <div class="search__result-title">${highlightMatch(item.title, query)}</div>
          <div class="search__result-excerpt">${highlightMatch(truncate(item.excerpt || item.content, 150), query)}</div>
        </a>
      `).join('');
    }
    container.classList.remove('hidden');
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  }

  // Utility: Debounce function
  // ============================================================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Utility: Intersection Observer for animations
  // ============================================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Copy code button
  // ============================================================================
  document.querySelectorAll('pre code').forEach(codeBlock => {
    const pre = codeBlock.parentElement;
    const button = document.createElement('button');
    button.className = 'btn btn--sm btn--ghost code-copy-btn';
    button.innerHTML = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);
        button.innerHTML = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
          button.innerHTML = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.innerHTML = 'Failed';
        setTimeout(() => {
          button.innerHTML = 'Copy';
        }, 2000);
      }
    });

    // Create code block header
    const header = document.createElement('div');
    header.className = 'code-block__header';

    // Try to detect language from class
    const lang = codeBlock.className.match(/language-(\w+)/);
    if (lang) {
      const langSpan = document.createElement('span');
      langSpan.textContent = lang[1];
      header.appendChild(langSpan);
    }

    header.appendChild(button);

    // Wrap pre in code-block
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    wrapper.appendChild(header);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
  });

  // Back to top button
  // ============================================================================
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-accent-primary, #58a6ff);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 500) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
    }
  }, 100));

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Keyboard navigation enhancements
  // ============================================================================
  document.addEventListener('keydown', (e) => {
    // Press '/' to focus search
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      searchInput?.focus();
    }

    // Press 'Escape' to close mobile nav
    if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
      menuBtn.click();
    }
  });

  // Analytics (privacy-friendly)
  // ============================================================================
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Send page view event
      const analyticsData = {
        path: window.location.pathname,
        referrer: document.referrer,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        timestamp: new Date().toISOString()
      };

      // Store locally for batching
      let analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
      analytics.push(analyticsData);

      // Keep only last 100 entries
      if (analytics.length > 100) {
        analytics = analytics.slice(-100);
      }

      localStorage.setItem('analytics', JSON.stringify(analytics));
    });
  }

  // Console greeting
  // ============================================================================
  console.log(
    '%c WebGPU Particle Fluid Simulation ',
    'background: linear-gradient(90deg, #58a6ff, #79c0ff); color: #0d1117; font-size: 14px; font-weight: bold; padding: 8px 12px; border-radius: 4px;'
  );
  console.log(
    '%c Open source and free forever. Check out the code at https://github.com/LessUp/particle-fluid-sim',
    'color: #8b949e; font-size: 12px;'
  );

})();
