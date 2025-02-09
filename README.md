
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Word War - User System</title>
  <style>
    /* Global Styles */
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
    
    p {
      font-size: 1.2em;
    }
    
    /* Container for forms and game */
    .container {
      max-width: 400px;
      margin: 0 auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    /* Input Field Styling */
    input[type="text"],
    input[type="password"] {
      width: 90%;
      padding: 10px;
      font-size: 1em;
      border: 2px solid #ddd;
      border-radius: 5px;
      margin: 10px 0;
      transition: border-color 0.3s ease;
    }
    
    input[type="text"]:focus,
    input[type="password"]:focus {
      border-color: #007bff;
      outline: none;
    }
    
    /* Button Styling */
    button {
      background-color: #007bff;
      border: none;
      padding: 10px 20px;
      font-size: 1em;
      border-radius: 5px;
      color: #fff;
      cursor: pointer;
      margin: 10px 5px;
      transition: background-color 0.3s ease;
    }
    
    button:hover {
      background-color: #0056b3;
    }
    
    /* Hide sections initially */
    .hidden {
      display: none;
    }
    
    a {
      color: #007bff;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>

<!-- Login Form -->
<div id="loginForm" class="container">
  <h2>Login</h2>
  <input type="text" id="loginUsername" placeholder="Username">
  <input type="password" id="loginPassword" placeholder="Password">
  <button id="loginButton">Login</button>
  <p>Don't have an account? <a href="#" id="showRegister">Register here</a></p>
</div>

<!-- Registration Form -->
<div id="registerForm" class="container hidden">
  <h2>Register</h2>
  <input type="text" id="registerUsername" placeholder="Username">
  <input type="password" id="registerPassword" placeholder="Password">
  <button id="registerButton">Register</button>
  <p>Already have an account? <a href="#" id="showLogin">Login here</a></p>
</div>

<!-- Game Section -->
<div id="gameSection" class="container hidden">
  <button id="logoutButton" style="float:right;">Logout</button>
  <h2>Word War</h2>
  <p id="instructions"></p>
  <button id="button1">Start Game</button>
</div>

<script>
  /* -------------------------------
     User System Code (Registration, Login, Logout)
  --------------------------------- */
  
  // Simple user "database" stored in localStorage
  function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function registerUser(username, password) {
    let users = getUsers();
    if (users.find(u => u.username === username)) {
      return false; // Username already exists
    }
    users.push({username, password});
    saveUsers(users);
    return true;
  }

  function loginUser(username, password) {
    let users = getUsers();
    return users.find(u => u.username === username && u.password === password);
  }

  // Switch between Login and Register forms
  document.getElementById('showRegister').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
  });

  document.getElementById('showLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
  });

  // Registration handling
  document.getElementById('registerButton').addEventListener('click', function() {
    let username = document.getElementById('registerUsername').value.trim();
    let password = document.getElementById('registerPassword').value.trim();
    if (username && password) {
      if (registerUser(username, password)) {
        alert('Registration successful. Please log in.');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
      } else {
        alert('User already exists. Please choose a different username.');
      }
    } else {
      alert('Please fill in both fields.');
    }
  });

  // Login handling
  document.getElementById('loginButton').addEventListener('click', function() {
    let username = document.getElementById('loginUsername').value.trim();
    let password = document.getElementById('loginPassword').value.trim();
    if (username && password) {
      let user = loginUser(username, password);
      if (user) {
        alert('Login successful!');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('gameSection').classList.remove('hidden');
      } else {
        alert('Invalid username or password.');
      }
    } else {
      alert('Please fill in both fields.');
    }
  });

  // Logout handling
  document.getElementById('logoutButton').addEventListener('click', function() {
    document.getElementById('gameSection').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
  });


  /* -------------------------------
     Game Code (Word War)
  --------------------------------- */

  let startingWord = "fire";   // Initial word
  let sWord = startingWord;    // Current word
  let button1 = document.querySelector("#button1");
  let instructions = document.querySelector("#instructions");
  let userInput2;            // For use in unSplit
  let splitButton;           // For use in unSplit
  let usedWords = [];
  usedWords.push(startingWord);

  button1.onclick = startGame;

  function startGame() {
      let userInput = document.createElement("input");
      userInput.id = "userInput";
      userInput.type = "text";
      document.getElementById('gameSection').appendChild(userInput);
      instructions.innerText = "Your current word is '" + startingWord + "'.";
      button1.innerText = "Submit";
      button1.onclick = valCheck;

      // Create the split button
      splitButton = document.createElement("button");
      splitButton.innerText = "Split";
      document.getElementById('gameSection').appendChild(splitButton);
      splitButton.onclick = split;
  }

  function split() {
      // Create the second input field
      userInput2 = document.createElement("input");
      userInput2.type = "text";
      userInput2.id = "discardInput";
      userInput2.placeholder = "Discard word";
      document.getElementById('gameSection').appendChild(userInput2);

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
          document.getElementById('gameSection').removeChild(userInput2);
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
                  instructions.innerText = "Your new word is: " + keepWord + ".";
                  sWord = keepWord;
                  usedWords.push(sWord);
                  // Reset split button for further splits
                  unSplit();
              } else {
                  instructions.innerText = "Your words do not contain all the letters of the previous word. Try again. Your current word is: " + sWord + ".";
              }
          } else {
              instructions.innerText = "This word has already been used. Your current word is: " + sWord + ".";
          }
      } else {
          instructions.innerText = "Invalid split. Try again. Your current word is: " + sWord + ".";
      }
      // Clear the input boxes
      userInputD.value = "";
      userInputK.value = "";
  }

  function valCheck() {
      let userInput = document.querySelector("#userInput");
      let newWord = userInput.value.toLowerCase();

      if (userInput.value.length === sWord.length + 1) {
          if (!usedWords.includes(newWord)) {
              let isValid = true;
              for (let i = 0; i < sWord.length; i++) {
                  if (newWord.includes(sWord[i])) {
                      newWord = newWord.replace(sWord[i], "");
                  } else {
                      isValid = false;
                      break;
                  }
              }
              if (isValid) {
                  instructions.innerText = "Your new word is: " + userInput.value + ".";
                  sWord = userInput.value;
                  usedWords.push(sWord);
              } else {
                  instructions.innerText = "Your word does not contain all the letters of the previous word. Please try again. Your current word is: " + sWord + ".";
              }
          } else {
              instructions.innerText = "This word has already been used. Your current word is: " + sWord + ".";
          }
      } else {
          instructions.innerText = "Incorrect length. Please try again. Your current word is: " + sWord + ".";
      }
      // Clear the input box
      userInput.value = "";
  }
</script>
</body>
</html>
    
    
     
      
      
     
     
                     
      


   
               
    





    
   
       
              
    
           
    
