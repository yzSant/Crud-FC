var gir = [
  {
    "nome": "Andressa Alves",
    "posicao": "Meio-campo",
    "clube": "Corinthians",
    "foto": "https://example.com/andressa.jpg",
    "gols": 15,
    "assistencias": 10,
    "jogos": 28,
    "favorita": false
  },
  {
    "nome": "Dayana Rodríguez",
    "posicao": "Meio-campo",
    "clube": "Corinthians",
    "foto": "https://example.com/dayana.jpg",
    "gols": 5,
    "assistencias": 12,
    "jogos": 30,
    "favorita": false
  },
  {
    "nome": "Mariza",
    "posicao": "Zagueira",
    "clube": "Corinthians",
    "foto": "https://example.com/mariza.jpg",
    "gols": 2,
    "assistencias": 1,
    "jogos": 32,
    "favorita": false
  },
  {
    "nome": "Thaís Regina",
    "posicao": "Zagueira",
    "clube": "Corinthians",
    "foto": "https://example.com/thais.jpg",
    "gols": 1,
    "assistencias": 2,
    "jogos": 25,
    "favorita": false
  },
  {
    "nome": "Letícia Teles",
    "posicao": "Zagueira",
    "clube": "Corinthians",
    "foto": "https://example.com/leticia.jpg",
    "gols": 0,
    "assistencias": 0,
    "jogos": 18,
    "favorita": false
  }
];

var players = [];
var editIndex = null;

// Inicialização
window.onload = function () {
  if (!localStorage.getItem("players")) {
    localStorage.setItem("players", JSON.stringify(gir));
  }
  players = JSON.parse(localStorage.getItem("players"));

  displayPlayers();
  fillClubFilter();

  document.getElementById("playerForm").addEventListener("submit", addPlayer);
  document.getElementById("saveEditBtn").addEventListener("click", saveEdit);
  document.getElementById("closeModalBtn").addEventListener("click", closeEditModal);
  document.getElementById("searchInput").addEventListener("input", displayPlayers);
  document.getElementById("filterClub").addEventListener("change", displayPlayers);
  document.getElementById("sortSelect").addEventListener("change", displayPlayers);
};

// Exibir jogadoras
function displayPlayers() {
  var container = document.getElementById("playersContainer");
  container.innerHTML = "";

  var search = document.getElementById("searchInput").value.toLowerCase();
  var filterClub = document.getElementById("filterClub").value;
  var sortBy = document.getElementById("sortSelect").value;

  var filtered = [];
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    if ((p.nome.toLowerCase().indexOf(search) !== -1 ||
         p.posicao.toLowerCase().indexOf(search) !== -1) &&
        (filterClub === "" || p.clube === filterClub)) {
      filtered.push(p);
    }
  }

  // Ordenação simples
  if (sortBy === "nome") {
    filtered.sort(function (a, b) {
      var A = a.nome.toLowerCase();
      var B = b.nome.toLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  } else if (sortBy === "posicao") {
    filtered.sort(function (a, b) {
      var A = a.posicao.toLowerCase();
      var B = b.posicao.toLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  }

  for (var j = 0; j < filtered.length; j++) {
    var player = filtered[j];

    var card = document.createElement("div");
    card.className = "card";

    var html = "";
    html += '<img src="' + player.foto + '" alt="' + player.nome + '" onerror="this.src=\'https://via.placeholder.com/150\'">';
    html += '<div class="card-body">';
    html += '<h3>' + player.nome + '</h3>';
    html += '<p>' + player.posicao + ' - ' + player.clube + '</p>';
    html += '<p>Gols: ' + player.gols + ' | Assistências: ' + player.assistencias + ' | Jogos: ' + player.jogos + '</p>';
    html += '<div class="actions">';
    html += '<button onclick="toggleFavorite(' + getIndex(player) + ')">' + (player.favorita ? '★' : '☆') + '</button>';
    html += '<button onclick="openEditModal(' + getIndex(player) + ')">Editar</button>';
    html += '<button onclick="deletePlayer(' + getIndex(player) + ')">Excluir</button>';
    html += '</div>';
    html += '</div>';

    card.innerHTML = html;
    container.appendChild(card);
  }
}

// Pegar índice no array original
function getIndex(player) {
  for (var i = 0; i < players.length; i++) {
    if (players[i] === player) return i;
  }
  return -1;
}

// Adicionar jogadora
function addPlayer(e) {
  e.preventDefault();

  var nome = document.getElementById("nome").value;
  var posicao = document.getElementById("posicao").value;
  var clube = document.getElementById("clube").value;
  var foto = document.getElementById("foto").value;
  var gols = parseInt(document.getElementById("gols").value, 10);
  var assistencias = parseInt(document.getElementById("assistencias").value, 10);
  var jogos = parseInt(document.getElementById("jogos").value, 10);

  if (!nome || !posicao || !clube || !foto) {
    alert("Preencha todos os campos!");
    return;
  }

  var player = {
    nome: nome,
    posicao: posicao,
    clube: clube,
    foto: foto,
    gols: isNaN(gols) ? 0 : gols,
    assistencias: isNaN(assistencias) ? 0 : assistencias,
    jogos: isNaN(jogos) ? 0 : jogos,
    favorita: false
  };

  players.push(player);
  savePlayers();
  displayPlayers();
  e.target.reset();
  showAlert("Jogadora adicionada com sucesso!");
}

// Favoritar
function toggleFavorite(index) {
  players[index].favorita = !players[index].favorita;
  savePlayers();
  displayPlayers();
}

// Abrir modal de edição
function openEditModal(index) {
  editIndex = index;
  var p = players[index];
  document.getElementById("editNome").value = p.nome;
  document.getElementById("editPosicao").value = p.posicao;
  document.getElementById("editClube").value = p.clube;
  document.getElementById("editFoto").value = p.foto;
  document.getElementById("editGols").value = p.gols;
  document.getElementById("editAssistencias").value = p.assistencias;
  document.getElementById("editJogos").value = p.jogos;
  document.getElementById("editModal").style.display = "block";
}

// Fechar modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  editIndex = null;
}

// Salvar edição
function saveEdit() {
  if (editIndex === null) return;

  var p = players[editIndex];
  p.nome = document.getElementById("editNome").value;
  p.posicao = document.getElementById("editPosicao").value;
  p.clube = document.getElementById("editClube").value;
  p.foto = document.getElementById("editFoto").value;
  p.gols = parseInt(document.getElementById("editGols").value, 10) || 0;
  p.assistencias = parseInt(document.getElementById("editAssistencias").value, 10) || 0;
  p.jogos = parseInt(document.getElementById("editJogos").value, 10) || 0;

  savePlayers();
  displayPlayers();
  closeEditModal();
  showAlert("Jogadora editada com sucesso!");
}

// Excluir jogadora
function deletePlayer(index) {
  if (confirm("Tem certeza que deseja excluir esta jogadora?")) {
    players.splice(index, 1);
    savePlayers();
    displayPlayers();
    showAlert("Jogadora removida com sucesso!");
  }
}

// Salvar no localStorage
function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

// Preencher filtro de clubes
function fillClubFilter() {
  var clubs = [];
  for (var i = 0; i < players.length; i++) {
    var clube = players[i].clube;
    if (clubs.indexOf(clube) === -1) {
      clubs.push(clube);
    }
  }

  clubs.sort();
  var filterSelect = document.getElementById("filterClub");
  for (var j = 0; j < clubs.length; j++) {
    var option = document.createElement("option");
    option.value = clubs[j];
    option.textContent = clubs[j];
    filterSelect.appendChild(option);
  }
}

// Alert simples
function showAlert(msg) {
  var div = document.createElement("div");
  div.className = "alert";
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(function () {
    document.body.removeChild(div);
  }, 2000);
}
