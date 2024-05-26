function hideTeamFunctions() {
  document.getElementById("teamsContainer").innerHTML = "";
  document.getElementById("copyBtn").style.display = "none";
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("playersTitle").style.display = "none";
  document.getElementById("teamsContainer").style.display = "none";
}

document.querySelectorAll(".perguntas-iniciais select").forEach((select) => {
  select.addEventListener("change", function () {
    document.getElementById("playerInputsContainer").innerHTML = "";
    document.getElementById("submitContainer").innerHTML = "";
    hideTeamFunctions();
  });
});

// Função para aplicar sombra temporariamente
function applyTemporaryShadow(element) {
  element.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.15)";
  setTimeout(() => {
    element.style.boxShadow = "none";
  }, 200);
}

document
  .getElementById("form-times-jogadores")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const numberOfTeams = document.getElementById("times").value;
    const playersPerTeam = document.getElementById("jogadores").value;
    createPlayerInputs(numberOfTeams, playersPerTeam);
    applyTemporaryShadow(event.submitter); // Aplica sombra no botão "Prosseguir"
  });

function createPlayerInputs(numberOfTeams, playersPerTeam) {
  hideTeamFunctions();

  const playersTitle = document.getElementById("playersTitle");
  playersTitle.style.display = "block"; // Torna o título visível

  const playerInputsContainer = document.getElementById(
    "playerInputsContainer"
  );
  playerInputsContainer.innerHTML = "";

  const totalPlayers = numberOfTeams * playersPerTeam;
  for (let i = 0; i < totalPlayers; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Jogador ${i + 1}`;
    input.classList.add("input-text");
    input.maxLength = 20; // Define o limite de caracteres
    playerInputsContainer.appendChild(input);
  }

  const submitContainer = document.getElementById("submitContainer");
  submitContainer.innerHTML = "";

  const finalSubmitBtn = document.createElement("button");
  finalSubmitBtn.textContent = "Gerar";
  finalSubmitBtn.classList.add("submit-btn");
  finalSubmitBtn.addEventListener("click", function (event) {
    const playerInputs = document.querySelectorAll(
      "#playerInputsContainer input"
    );
    let allNamesEntered = true;
    let playerNames = [];

    playerInputs.forEach((input) => {
      if (input.value === "") {
        allNamesEntered = false;
        input.style.border = "1px solid red"; // Adiciona borda vermelha para campos não preenchidos
        input.style.boxShadow = "0 0 5px red"; // Adiciona sombra vermelha
      } else {
        playerNames.push(input.value.substring(0, 25)); // Limita o número de caracteres
        input.style.border = "1px solid #262626"; // Remove a borda vermelha de campos preenchidos
        input.style.boxShadow = "none"; // Remove a sombra dos campos preenchidos
      }
    });

    if (allNamesEntered) {
      generateTeams(numberOfTeams, playersPerTeam, playerNames);
      document.getElementById("playersTitle").style.display = "block"; // Torna o título visível novamente
      document.getElementById("teamsContainer").style.border =
        "1px solid #8cc63f"; // Exibe a borda
      applyTemporaryShadow(event.target); // Aplica sombra no botão "Gerar"
    } else {
      document.getElementById("teamsContainer").innerHTML = ""; // Oculta a função generateTeams
      document.getElementById("teamsContainer").style.border = "none"; // Oculta a borda
      document.getElementById("copyBtn").style.display = "none"; // Oculta o botão de cópia
      document.getElementById("resetBtn").style.display = "none"; // Oculta o botão de reset
    }
  });

  submitContainer.appendChild(finalSubmitBtn);
}

function generateTeams(numberOfTeams, playersPerTeam, playerNames) {
  hideTeamFunctions();

  const teams = {};
  for (let i = 1; i <= numberOfTeams; i++) {
    teams[`Time ${i}`] = [];
  }

  playerNames.sort(() => Math.random() - 0.5);

  let playerIndex = 0;
  for (let teamNumber = 1; teamNumber <= numberOfTeams; teamNumber++) {
    for (let playerNumber = 1; playerNumber <= playersPerTeam; playerNumber++) {
      teams[`Time ${teamNumber}`].push(playerNames[playerIndex]);
      playerIndex++;
    }
  }

  displayTeams(teams);
  showButtons();
}

function displayTeams(teams) {
  const teamsContainer = document.getElementById("teamsContainer");
  teamsContainer.style.display = "flex"; // Exibe o container dos times

  teamsContainer.innerHTML = "";

  // Adiciona o estilo CSS para remover a bolinha da lista
  const style = document.createElement("style");
  style.innerHTML = `
      ul {
          list-style-type: none; /* Remove a bolinha da lista */
      }
      li {
          /* Estilo adicional para o item da lista, se necessário */
      }
  `;
  document.head.insertAdjacentElement("beforeend", style);

  for (const [teamName, players] of Object.entries(teams)) {
    const teamDiv = document.createElement("div");
    const teamHeading = document.createElement("h3");
    teamHeading.textContent = teamName;
    teamHeading.classList.add("team-name"); // Adiciona a classe para o nome do time
    const playersList = document.createElement("ul");
    players.forEach((player) => {
      const playerItem = document.createElement("li");
      playerItem.textContent = player;
      playerItem.classList.add("player-name"); // Adiciona a classe para o nome do jogador
      playersList.appendChild(playerItem);
    });
    teamDiv.appendChild(teamHeading);
    teamDiv.appendChild(playersList);
    teamsContainer.appendChild(teamDiv);
  }
}

function showButtons() {
  const copyBtn = document.getElementById("copyBtn");
  copyBtn.style.display = "block";

  const resetBtn = document.getElementById("resetBtn");
  resetBtn.style.display = "block";
}

document.getElementById("copyBtn").addEventListener("click", function () {
  copyTeamsToClipboard();
  applyTemporaryShadow(this); // Aplica sombra no botão "Copiar"
});

function copyTeamsToClipboard() {
  // Verifica se já existe uma mensagem de sucesso na tela
  const existingSuccessMessage = document.querySelector(".success-message");
  if (existingSuccessMessage) {
    return; // Sai da função se houver uma mensagem existente
  }

  const teamsContainer = document.getElementById("teamsContainer");
  const teamDivs = teamsContainer.querySelectorAll("div");
  let teamsText = "";

  teamDivs.forEach((teamDiv, index) => {
    const teamName = teamDiv.querySelector(".team-name").textContent;
    const playerItems = teamDiv.querySelectorAll(".player-name");

    teamsText += `${teamName}:\n`;

    playerItems.forEach((playerItem) => {
      teamsText += `- ${playerItem.textContent}\n`;
    });

    if (index < teamDivs.length - 1) {
      teamsText += "\n"; // Adiciona uma linha em branco entre os times
    }
  });

  navigator.clipboard
    .writeText(teamsText)
    .then(() => {
      const successMessage = document.createElement("div");
      successMessage.textContent = "Copiado com sucesso!";
      successMessage.classList.add("success-message");
      successMessage.style.position = "fixed";
      successMessage.style.top = "50%";
      successMessage.style.left = "50%";
      successMessage.style.transform = "translate(-50%, -50%)";
      successMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      successMessage.style.color = "white";
      successMessage.style.padding = "10px 20px";
      successMessage.style.borderRadius = "5px";
      successMessage.style.zIndex = "9999";
      successMessage.style.fontFamily = "poppins-medium";
      successMessage.style.fontSize = "12px";
      successMessage.style.transition = "opacity 0.2s";
      document.body.appendChild(successMessage);

      // Fade out the success message after 2 seconds
      setTimeout(() => {
        successMessage.style.opacity = "0";
        setTimeout(() => {
          successMessage.remove();
        }, 200);
      }, 800);
    })
    .catch((err) => {
      console.error("Erro ao copiar para a área de transferência: ", err);
      alert("Ocorreu um erro ao copiar os times para a área de transferência.");
    });
}

document.getElementById("resetBtn").addEventListener("click", function () {
  resetForm();
});

function resetForm() {
  document.getElementById("times").selectedIndex = 0;
  document.getElementById("jogadores").selectedIndex = 0;
  document.getElementById("playerInputsContainer").innerHTML = "";
  document.getElementById("submitContainer").innerHTML = "";
  hideTeamFunctions();
}
