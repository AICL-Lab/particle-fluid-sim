// Search functionality
const searchIndex = typeof SEARCH_INDEX !== 'undefined' ? SEARCH_INDEX : [];

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            searchResults.classList.add('hidden');
            return;
        }

        const results = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.content.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
        ).slice(0, 10);

        if (results.length > 0) {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" onclick="window.location.href='${result.url}'">
                    <h4>${result.title}</h4>
                    <p>${result.content.substring(0, 120)}...</p>
                </div>
            `).join('');
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = '<div class="search-result-item"><p>No results found</p></div>';
            searchResults.classList.remove('hidden');
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchResults.classList.add('hidden');
            searchInput.blur();
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
