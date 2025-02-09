
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Word War Multiplayer</title>
  <style>
    /* (Include the CSS styles from the previous example or your own) */
    body {
      background: #f0f0f0;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      text-align: center;
      color: #333;
    }
    h2 {
      font-size: 2.5em;
      margin-bottom: 20px;
      color: #222;
    }
    p#instructions {
      font-size: 1.2em;
      margin: 20px auto;
      width: 80%;
      max-width: 600px;
      background: #fff;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    button {
      background-color: #007bff;
      border: none;
      padding: 10px 20px;
      font-size: 1em;
      border-radius: 5px;
      color: #fff;
      cursor: pointer;
      margin: 10px;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #0056b3;
    }
    input[type="text"] {
      padding: 10px;
      font-size: 1em;
      border: 2px solid #ddd;
      border-radius: 5px;
      margin: 10px;
      width: 200px;
      transition: border-color 0.3s ease;
    }
    input[type="text"]:focus {
      border-color: #007bff;
      outline: none;
    }
  </style>
</head>
<body>
  <!-- A simple login prompt -->
  <div id="loginSection">
    <h2>Enter Username</h2>
    <input type="text" id="usernameInput" placeholder="Username">
    <button id="joinButton">Join Game</button>
  </div>

  <!-- Game Section -->
  <div id="gameSection" class="hidden">
    <h2>Word War Multiplayer</h2>
    <p id="instructions"></p>
    <button id="button1">Start Game</button>
  </div>

  <!-- Include Socket.IO client library -->
  <script src="/socket.io/socket.io.js"></script>
  <script>
    // Connect to the server
    const socket = io();

    // Elements
    const loginSection = document.getElementById('loginSection');
    const gameSection = document.getElementById('gameSection');
    const joinButton = document.getElementById('joinButton');
    const usernameInput = document.getElementById('usernameInput');
    const instructions = document.getElementById('instructions');
    const button1 = document.getElementById('button1');

    // Game variables
    let sWord = "fire";   // starting word
    let usedWords = [sWord];
    let userInput2, splitButton;

    // When the player clicks "Join Game", send the username to the server
    joinButton.onclick = () => {
      const username = usernameInput.value.trim();
      if (username) {
        socket.emit('joinGame', username);
        loginSection.classList.add('hidden');
        gameSection.classList.remove('hidden');
        instructions.innerText = `Welcome ${username}! The starting word is '${sWord}'.`;
      }
    };

    // When the server sends a new game state, update the UI.
    socket.on('gameState', (data) => {
      sWord = data.sWord;
      usedWords = data.usedWords;
      instructions.innerText = `Current word is: ${sWord}`;
    });

    // (Optional) Update player list if needed
    socket.on('playerList', (players) => {
      console.log('Current players:', players);
    });

    // Function to start the game (create input fields and buttons)
    button1.onclick = startGame;
    function startGame() {
      // Create an input field for the word
      let userInput = document.createElement("input");
      userInput.id = "userInput";
      userInput.type = "text";
      gameSection.appendChild(userInput);

      button1.innerText = "Submit";
      button1.onclick = valCheck;

      // Create the split button
      splitButton = document.createElement("button");
      splitButton.innerText = "Split";
      gameSection.appendChild(splitButton);
      splitButton.onclick = split;
    }

    // Called after a valid move to send the move to the server.
    function sendMove(newWord) {
      socket.emit('makeMove', { newWord });
    }

    // After a valid move, clear inputs and wait for updated game state from server.
    function nextTurn() {
      // In this basic example, we simply wait for the server to send an updated game state.
      let userInput = document.getElementById("userInput");
      if (userInput) userInput.value = "";
    }

    function split() {
      // Create the second input field
      userInput2 = document.createElement("input");
      userInput2.type = "text";
      userInput2.id = "discardInput";
      userInput2.placeholder = "Discard word";
      gameSection.appendChild(userInput2);

      // Update the placeholder for the first input field
      let userInput = document.querySelector("#userInput");
      userInput.placeholder = "Keep word";

      // Update Submit button behavior
      button1.onclick = splitvalCheck;

      // Change the split button to allow "unsplit"
      splitButton.innerText = "Unsplit";
      splitButton.onclick = unSplit;
    }

    function unSplit() {
      // Remove the second input field if it exists
      if (userInput2) {
        gameSection.removeChild(userInput2);
        userInput2 = null;
      }
      // Reset Submit button behavior
      button1.onclick = valCheck;
      // Restore split button functionality
      splitButton.innerText = "Split";
      splitButton.onclick = split;
    }

    function splitvalCheck() {
      let userInputD = document.querySelector("#discardInput");
      let userInputK = document.querySelector("#userInput");

      let discardWord = userInputD.value.toLowerCase();
      let keepWord = userInputK.value.toLowerCase();

      if (
        discardWord.length + keepWord.length === sWord.length &&
        (discardWord.length === Math.ceil(sWord.length / 2) || discardWord.length === Math.floor(sWord.length / 2)) &&
        (keepWord.length === Math.ceil(sWord.length / 2) || keepWord.length === Math.floor(sWord.length / 2))
      ) {
        if (!usedWords.includes(keepWord)) {
          let isValid = true;
          let inputC = discardWord + keepWord;
          for (let i = 0; i < sWord.length; i++) {
            if (inputC.includes(sWord[i])) {
              inputC = inputC.replace(sWord[i], "");
            } else {
              isValid = false;
              break;
            }
          }
          if (isValid) {
            instructions.innerText = `Valid split! New word is: ${keepWord}.`;
            sWord = keepWord;
            usedWords.push(sWord);
            unSplit();
            sendMove(sWord); // Send move to server
          } else {
            instructions.innerText = `Invalid split. Your words did not include all letters. Current word: ${sWord}.`;
          }
        } else {
          instructions.innerText = `Word already used. Try a different word. Current word: ${sWord}.`;
        }
      } else {
        instructions.innerText = `Invalid split lengths. Try again. Current word: ${sWord}.`;
      }
      userInputD.value = "";
      userInputK.value = "";
    }

    function valCheck() {
      let userInput = document.querySelector("#userInput");
      let newWord = userInput.value.toLowerCase();

      if (userInput.value.length === sWord.length + 1) {
        if (!usedWords.includes(newWord)) {
          let isValid = true;
          let temp = newWord;
          for (let i = 0; i < sWord.length; i++) {
            if (temp.includes(sWord[i])) {
              temp = temp.replace(sWord[i], "");
            } else {
              isValid = false;
              break;
            }
          }
          if (isValid) {
            instructions.innerText = `Valid move! New word is: ${userInput.value}.`;
            sWord = userInput.value;
            usedWords.push(sWord);
            sendMove(sWord); // Send move to server
          } else {
            instructions.innerText = `Invalid move. Your word does not include all the letters. Current word: ${sWord}.`;
          }
        } else {
          instructions.innerText = `Word already used. Try again. Current word: ${sWord}.`;
        }
      } else {
        instructions.innerText = `Incorrect length. Try again. Current word: ${sWord}.`;
      }
      userInput.value = "";
    }
  </script>
</body>
</html>

    
    
      
     
    


    
           
    
