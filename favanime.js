  const searchInput = document.getElementById('searchInput');
  const animeList = document.getElementById('animeList');
  const cards = Array.from(animeList.querySelectorAll('.card'));

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    cards.forEach(card => {
      const title = card.getAttribute('data-title').toLowerCase();
      const visible = title.includes(query) || query === '';
      card.style.display = visible ? 'block' : 'none';
    });
  });