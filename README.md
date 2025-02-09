<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Word War</title>
  <style>
    /* Global Styles */
    body {
      background: #f0f0f0;          /* Light gray background */
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      text-align: center;
      color: #333;
    }
    
    /* Header Styling */
    h2 {
      font-size: 2.5em;
      margin-bottom: 20px;
      color: #222;
    }
    
    /* Instruction Paragraph Styling */
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
    
    /* Button Styling */
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
    
    /* Input Field Styling */
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

<h2>Word War</h2>

<p id="instructions"></p>

<button id="button1">Start Game</button>

<script>
  let startingWord = "fire"; // Initial word
  let sWord = startingWord; // Current word to compare against
  let button1 = document.querySelector("#button1");
  let instructions = document.querySelector("#instructions"); // Get instructions element
  let userInput2; // Declare globally for access in unSplit
  let splitButton; // Declare globally for access in unSplit
  let usedWords = []
  usedWords.push(startingWord)

  button1.onclick = startGame;

  function startGame() {
      let userInput = document.createElement("input");
      userInput.id = "userInput";
      userInput.type = "text";
      document.body.appendChild(userInput);
      instructions.innerText = "Your current word is '" + startingWord + "'.";
      button1.innerText = "Submit";
      button1.onclick = valCheck;

      // Create the split button
      splitButton = document.createElement("button");
      splitButton.innerText = "Split";
      document.body.appendChild(splitButton);
      splitButton.onclick = split;
  }

  function split() {
      // Create the second input field
      userInput2 = document.createElement("input");
      userInput2.type = "text";
      userInput2.id = "discardInput";
      userInput2.placeholder = "Discard word";
      document.body.appendChild(userInput2);

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
          document.body.removeChild(userInput2);
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
                  sWord = keepWord; // Update the current word
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
                  instructions.innerText =
                      "Your word does not contain all the letters of the previous word. Please try again. Your current word is: " + sWord + ".";
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

   

   
               
    





    
   
       
              
    
           
    
