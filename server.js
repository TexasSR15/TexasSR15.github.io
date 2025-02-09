// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Set up Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (your HTML, CSS, and client JS)
app.use(express.static('public'));

// Game state
let sWord = "fire";
let usedWords = [sWord];
let players = []; // We'll store { id, username }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // When a client sends a join message, add them to the players list.
  socket.on('joinGame', (username) => {
    players.push({ id: socket.id, username });
    // Send the current game state to the new player.
    socket.emit('gameState', { sWord, usedWords, players });
    // Inform everyone else a new player has joined.
    io.emit('playerList', players);
  });

  // When a player makes a move (adding a letter or splitting), the client emits a "makeMove" event.
  socket.on('makeMove', (data) => {
    // Data could be like: { newWord: "newword", moveType: "add" } or { newWord: "newword", moveType: "split" }
    // In a real game, do server-side validation of the move before accepting it.
    if (!usedWords.includes(data.newWord)) { // Very simplified validation
      sWord = data.newWord;
      usedWords.push(sWord);
      // Broadcast the updated game state to everyone
      io.emit('gameState', { sWord, usedWords, players });
    } else {
      // Optionally, send an error message back to the client
      socket.emit('errorMessage', 'That word has already been used.');
    }
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    players = players.filter(p => p.id !== socket.id);
    io.emit('playerList', players);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

   

  
     
      
             
         
          
              
      
    
    
    
 
     
     
    
 
  
     
       


  
     
      
         
                 
