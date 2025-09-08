// ======= Base inicial (conforme enunciado) =======
const initialPlayers = [
  {
    nome: "Andressa Alves",
    posicao: "Meio-campo",
    clube: "Corinthians",
    foto: "https://static.corinthians.com.br/uploads/17340952198d8818c8e140c64c743113f563cf750f.jpg",
    gols: 15,
    assistencias: 10,
    jogos: 28,
    favorita: false
  },
  {
    nome: "Dayana Rodríguez",
    posicao: "Meio-campo",
    clube: "Corinthians",
    foto: "https://www.ogol.com.br/img/jogadores/new/17/86/531786_dayana_rodriguez_20250418230620.png",
    gols: 5,
    assistencias: 12,
    jogos: 30,
    favorita: false
  },
  {
    nome: "Mariza",
    posicao: "Zagueira",
    clube: "Corinthians",
    foto: "https://www.ogol.com.br/img/jogadores/new/64/05/526405_mariza_20250723194000.png",
    gols: 2,
    assistencias: 1,
    jogos: 32,
    favorita: false
  },
  {
    nome: "Thaís Regina",
    posicao: "Zagueira",
    clube: "Corinthians",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTb45soFQKI8Xi1u0fVoqjpfWxxClfDcXyTg&s",
    gols: 1,
    assistencias: 2,
    jogos: 25,
    favorita: false
  },
  {
    nome: "Letícia Teles",
    posicao: "Zagueira",
    clube: "Corinthians",
    foto: "https://cdn.meutimao.com.br/fotos-do-corinthians/w941/2025/01/10/leticia_teles_durante_a_pre-temporada_c40q.jpg",
    gols: 0,
    assistencias: 0,
    jogos: 18,
    favorita: false
  }
];
let players = [];
let currentPlayerId = null; 
let currentSort = null;     

const playersContainer = document.getElementById('playersContainer');
const playerModal = document.getElementById('playerModal');
const deleteModal = document.getElementById('deleteModal');
const playerForm = document.getElementById('playerForm');
const searchInput = document.getElementById('searchInput');
const clubeFilter = document.getElementById('clubeFilter');
const sortByNameBtn = document.getElementById('sortByName');
const sortByPositionBtn = document.getElementById('sortByPosition');

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  const stored = localStorage.getItem('footballPlayers');
  if (stored) {
    players = JSON.parse(stored);
  } else {
    players = [...initialPlayers];
    saveToLocalStorage();
  }
  renderPlayers();
  populateClubFilter();
}

function setupEventListeners() {
  document.getElementById('addPlayerBtn').addEventListener('click', openAddModal);
  document.querySelector('#playerModal .close').addEventListener('click', closePlayerModal);
  document.getElementById('cancelBtn').addEventListener('click', closePlayerModal);
  playerForm.addEventListener('submit', handlePlayerSubmit);

  document.querySelector('#deleteModal .close').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

  searchInput.addEventListener('input', handleSearch);
  clubeFilter.addEventListener('change', handleClubFilter);
  sortByNameBtn.addEventListener('click', () => handleSort('nome'));
  sortByPositionBtn.addEventListener('click', () => handleSort('posicao'));

  window.addEventListener('click', (e) => {
    if (e.target === playerModal) closePlayerModal();
    if (e.target === deleteModal) closeDeleteModal();
  });
}

function saveToLocalStorage() {
  localStorage.setItem('footballPlayers', JSON.stringify(players));
}

function renderPlayers(playersToRender = players) {
  if (!playersToRender.length) {
    playersContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>Nenhuma jogadora encontrada</h3>
        <p>Tente ajustar os filtros de busca</p>
      </div>
    `;
    return;
  }

  playersContainer.innerHTML = playersToRender.map((player, index) => `
    <div class="player-card ${player.favorita ? 'favorita' : ''}">
      <div class="player-photo">
        ${player.foto
          ? `<img src="${player.foto}" alt="${player.nome}" 
                 onerror="this.style.display='none'; this.parentNode.querySelector('.no-photo').style.display='block';">`
          : `<img src="" style="display:none;">`
        }
        <i class="fas fa-user no-photo" style="display:${player.foto ? 'none' : 'block'};"></i>
      </div>

      <div class="player-info">
        <div class="player-header">
          <div class="player-details">
            <h3>${player.nome}</h3>
            <div class="position">${player.posicao}</div>
            <div class="club">${player.clube}</div>
          </div>
          <button class="favorite-btn ${player.favorita ? 'favorita' : ''}" onclick="toggleFavorite(${index})" title="Favoritar">
            <i class="fas fa-star"></i>
          </button>
        </div>

        <div class="player-stats">
          <div class="stat">
            <div class="stat-value">${toInt(player.gols)}</div>
            <div class="stat-label">Gols</div>
          </div>
          <div class="stat">
            <div class="stat-value">${toInt(player.assistencias)}</div>
            <div class="stat-label">Assistências</div>
          </div>
          <div class="stat">
            <div class="stat-value">${toInt(player.jogos)}</div>
            <div class="stat-label">Jogos</div>
          </div>
        </div>

        <div class="player-actions">
          <button class="action-btn edit-btn" onclick="openEditModal(${index})">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="action-btn delete-btn" onclick="openDeleteModal(${index})">
            <i class="fas fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    </div>
  `).join('');
}



function populateClubFilter() {
  const clubs = [...new Set(players.map(p => p.clube))].sort((a, b) =>
    a.localeCompare(b, 'pt', { sensitivity: 'base' })
  );
  clubeFilter.innerHTML = '<option value="">Todos os clubes</option>' +
    clubs.map(c => `<option value="${c}">${c}</option>`).join('');
}

function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Nova Jogadora';
  playerForm.reset();
  currentPlayerId = null;
  playerModal.style.display = 'block';
}

function openEditModal(index) {
  const player = players[index];
  if (!player) return;

  document.getElementById('modalTitle').textContent = 'Editar Jogadora';

  document.getElementById('nome').value = player.nome;
  document.getElementById('posicao').value = player.posicao;
  document.getElementById('clube').value = player.clube;
  document.getElementById('foto').value = player.foto || '';
  document.getElementById('gols').value = toInt(player.gols);
  document.getElementById('assistencias').value = toInt(player.assistencias);
  document.getElementById('jogos').value = toInt(player.jogos);

  currentPlayerId = index;
  playerModal.style.display = 'block';
}

function closePlayerModal() {
  playerModal.style.display = 'none';
  currentPlayerId = null;
}

function openDeleteModal(index) {
  currentPlayerId = index;
  deleteModal.style.display = 'block';
}

function closeDeleteModal() {
  deleteModal.style.display = 'none';
  currentPlayerId = null;
}

function handlePlayerSubmit(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const posicao = document.getElementById('posicao').value.trim();
  const clube = document.getElementById('clube').value.trim();
  const foto = document.getElementById('foto').value.trim();
  const gols = clampNonNegativeInt(document.getElementById('gols').value);
  const assistencias = clampNonNegativeInt(document.getElementById('assistencias').value);
  const jogos = clampNonNegativeInt(document.getElementById('jogos').value);

  if (!nome || !posicao || !clube) {
    showAlert('Por favor, preencha todos os campos obrigatórios!', 'error');
    return;
  }

  const data = { nome, posicao, clube, foto, gols, assistencias, jogos, favorita: false };

  if (currentPlayerId === null) {
    // Create
    players.unshift(data);
    saveToLocalStorage();
    renderPlayersFilteredView();
    populateClubFilter();
    closePlayerModal();
    showAlert('Jogadora adicionada com sucesso!', 'success');
  } else {
    // Update
    const oldFav = players[currentPlayerId].favorita;
    players[currentPlayerId] = { ...data, favorita: oldFav };
    saveToLocalStorage();
    renderPlayersFilteredView();
    populateClubFilter();
    closePlayerModal();
    showAlert('Jogadora editada com sucesso!', 'success');
  }
}

function confirmDelete() {
  if (currentPlayerId === null) return;
  // Delete
  players.splice(currentPlayerId, 1);
  saveToLocalStorage();
  renderPlayersFilteredView();
  populateClubFilter();
  closeDeleteModal();
  showAlert('Jogadora removida com sucesso!', 'success');
}

function toggleFavorite(index) {
  const p = players[index];
  if (!p) return;
  p.favorita = !p.favorita;
  saveToLocalStorage();
  renderPlayersFilteredView();
}

function handleSearch() {
  renderPlayersFilteredView();
}

function handleClubFilter() {
  renderPlayersFilteredView();
}

function handleSort(sortBy) {
  document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));

  if (currentSort === sortBy) {
    players.reverse();
  } else {
    players.sort((a, b) => {
      if (sortBy === 'nome') {
        return a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' });
      }
      if (sortBy === 'posicao') {
        return a.posicao.localeCompare(b.posicao, 'pt', { sensitivity: 'base' });
      }
      return 0;
    });
    currentSort = sortBy;

    if (sortBy === 'nome') sortByNameBtn.classList.add('active');
    if (sortBy === 'posicao') sortByPositionBtn.classList.add('active');
  }

  saveToLocalStorage();
  renderPlayersFilteredView();
}

function renderPlayersFilteredView() {
  const term = searchInput.value.toLowerCase().trim();
  const club = clubeFilter.value;

  let list = [...players];

  if (club) {
    list = list.filter(p => p.clube === club);
  }

  if (term) {
    list = list.filter(p =>
      p.nome.toLowerCase().includes(term) ||
      p.posicao.toLowerCase().includes(term)
    );
  }

  renderPlayers(list);
}

function showAlert(message, type) {
  document.querySelectorAll('.alert').forEach(a => a.remove());

  const el = document.createElement('div');
  el.className = `alert ${type}`;
  el.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    ${message}
  `;
  document.body.appendChild(el);

  setTimeout(() => el.classList.add('show'), 50);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

function clampNonNegativeInt(v) {
  const n = toInt(v);
  return n < 0 ? 0 : n;
}

window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
window.toggleFavorite = toggleFavorite;
