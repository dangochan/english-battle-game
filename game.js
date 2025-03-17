// Updated game.js with first load character fix
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let princeHP = 50;
let dragonHP = 50;

// Load game settings from local storage
const savedSettings = JSON.parse(localStorage.getItem("gameSettings"));
if (savedSettings) {
  princeHP = savedSettings.princeHP || 50;
  dragonHP = savedSettings.dragonHP || 50;
  if (Array.isArray(savedSettings.questions)) {
    questions.length = 0; // Clear default questions
    questions.push(...savedSettings.questions); // Load custom questions
  }
}


// Example question and answers
const questions = [
  {
    question: "Name a popular pizza topping.",
    answers: ["cheese", "pepperoni", "mushrooms"],
    revealed: []
  },
  {
    question: "Name a common pet.",
    answers: ["dog", "cat", "fish","birds"],
    revealed: []
  },
  {
    question: "Name something people usually carry in their wallet.",
    answers: ["credit cards", "money", "id card"],
    revealed: []
  },
  {
    question: "Name of materials you can recycle..",
    answers: ["papers", "plastic", "glass", "metal"],
    revealed: []
  },
  {question:" Name something you can’t leave home without.",
    answer:["phone", "wallet", "keys", "bag"],
    revealed:[]
  },
  {question:"Name a mode of public transportation.",
    answer:["bus","train","taxi","subway"],
    revealed:[]
  },

];

let currentQuestionIndex = 0;
let princeImg, dragonImg;
let imagesLoaded = false;

// Initialize game when window loads
window.onload = function() {
  // Initialize character images
  loadImages();
  
  // Add event listener for Enter key
  setupEventListeners();
  
  // Start game rendering
  requestAnimationFrame(gameLoop);
};

function loadImages() {
  // Reset images loaded flag
  imagesLoaded = false;
  
  // Load prince image
  princeImg = new Image();
  princeImg.src = "Prince_char.png"; 
  princeImg.onerror = function() {
    console.log("Prince image failed to load - using fallback");
    // Draw immediately so we don't wait for loading
    drawCharacters();
  };
  
  // Load dragon image
  dragonImg = new Image();
  dragonImg.src = "Dragon_char.png";
  dragonImg.onerror = function() {
    console.log("Dragon image failed to load - using fallback");
    // Draw immediately so we don't wait for loading
    drawCharacters();
  };
  
  // When both images load, mark as loaded and redraw
  let loadedCount = 0;
  function checkAllLoaded() {
    loadedCount++;
    if (loadedCount >= 2) {
      imagesLoaded = true;
      drawCharacters();
    }
  }
  
  princeImg.onload = checkAllLoaded;
  dragonImg.onload = checkAllLoaded;
  
  // Safety fallback - draw anyway after a short timeout
  setTimeout(() => {
    if (!imagesLoaded) {
      console.log("Images taking too long - using fallback");
      drawCharacters();
    }
  }, 500);
}

// Load game settings from local storage
function loadGameSettings() {
  const savedSettings = localStorage.getItem("gameSettings");
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      princeHP = settings.princeHP || 50;
      dragonHP = settings.dragonHP || 50;
      if (Array.isArray(settings.questions)) {
        questions.length = 0; // Clear default questions
        questions.push(...settings.questions); // Load custom questions
      }
      console.log("Game settings loaded:", settings);
    } catch (error) {
      console.error("Error loading game settings:", error);
    }
  }
}
loadGameSettings();

function setupEventListeners() {
  // Add event listener for Enter key on input
  const answerInput = document.getElementById("answerInput");
  if (answerInput) {
    answerInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        submitAnswer();
      }
    });
    // Focus on the input field at start
    answerInput.focus();
  }
}

function gameLoop() {
  drawCharacters();
  requestAnimationFrame(gameLoop);
}

function drawCharacters() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = "#87CEFA"; // Light sky blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grass
  ctx.fillStyle = "#2E8B57"; // Sea green
  ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
  
  // Draw prince (left side)
  if (princeImg && princeImg.complete) {
    ctx.drawImage(princeImg, 80, canvas.height - 210, 150, 150);
  } else {
    // Fallback if image isn't loaded
    ctx.fillStyle = "blue";
    ctx.fillRect(100, canvas.height - 150, 60, 80);
  }
  
  // Draw dragon (right side)
  if (dragonImg && dragonImg.complete) {
    ctx.drawImage(dragonImg, canvas.width - 212, canvas.height - 260, 200, 200);
  } else {
    // Fallback if image isn't loaded
    ctx.fillStyle = "green";
    ctx.fillRect(canvas.width - 180, canvas.height - 150, 80, 80);
  }
  
  // Draw character HP
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Prince HP: ${princeHP}`, 50, 50);
  ctx.fillText(`Dragon HP: ${dragonHP}`, 650, 50);
  
  // Draw question in the canvas
  ctx.font = "25px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  //ctx.text
  ctx.fillText(`${questions[currentQuestionIndex].question}`, canvas.width/2, 120);
  ctx.textAlign = "left";
  
  // Display revealed answers in the canvas
  const revealed = questions[currentQuestionIndex].revealed;
  ctx.textAlign = "center";
  ctx.fillText(`Revealed: ${revealed.length > 0 ? revealed.join(", ") : "None"}`, canvas.width/2, 435);
  ctx.textAlign = "left";
  
  // Also update HTML elements
  updateHTMLElements();
}

function updateHTMLElements() {
  // Update question label
  const questionLabel = document.getElementById("questionLabel");
  if (questionLabel) {
    questionLabel.textContent = "Question: " + questions[currentQuestionIndex].question;
  }
  
  // Update revealed answers
  const revealedLabel = document.getElementById("revealedLabel");
  if (revealedLabel) {
    const revealed = questions[currentQuestionIndex].revealed;
    revealedLabel.textContent = "Revealed Answers: " + (revealed.length > 0 ? revealed.join(", ") : "None");
  }
}

function updateQuestion() {
  // Update question in both canvas and HTML
  drawCharacters(); // This will also update the HTML elements
}

function submitAnswer() {
  try {
    const answerInput = document.getElementById("answerInput");
    const answer = answerInput.value.trim().toLowerCase();

    if (!answer) {
      alert("Please enter an answer!");
      answerInput.focus();
      return;
    }

    const correctAnswers = questions[currentQuestionIndex].answers;
    const revealedAnswers = questions[currentQuestionIndex].revealed;

    const selectedCharacter = document.querySelector('input[name="character"]:checked');
    if (!selectedCharacter) {
      alert("Please select a character (Prince or Dragon)!");
      answerInput.focus();
      return;
    }

    const character = selectedCharacter.value;

    if (correctAnswers.includes(answer) && !revealedAnswers.includes(answer)) {
      handleAnswer(character, answer);
    } else if (revealedAnswers.includes(answer)) {
      alert("That answer was already guessed!");
    } else {
      alert("Wrong answer! No HP lost.");
    }

    // Clear the input and refocus on it
    answerInput.value = "";
    answerInput.disabled = false;
    answerInput.focus();

  } catch (error) {
    console.error("Error in submitAnswer:", error);
    alert("Something went wrong. Please try again.");
  }
}


function handleAnswer(character, answer) {
  try {
    // Add the correct answer to revealed answers
    questions[currentQuestionIndex].revealed.push(answer);
    
    // Deduct HP from the opponent
    if (character === "prince") {
      dragonHP -= 5;
      alert("Prince got it right! Dragon loses 5 HP.");
    } else {
      princeHP -= 5;
      alert("Dragon got it right! Prince loses 5 HP.");
    }
    
    drawCharacters();
    checkGameStatus();
    
  } catch (error) {
    console.error("Error in handleAnswer:", error);
  }
}

function checkGameStatus() {
  try {
    // Check for win condition
    if (princeHP <= 0) {
      alert("Dragon wins!");
      resetGame();
      return;
    } else if (dragonHP <= 0) {
      alert("Prince wins!");
      resetGame();
      return;
    }
    
    // Check if all answers are revealed
    const correctAnswers = questions[currentQuestionIndex].answers;
    const revealedAnswers = questions[currentQuestionIndex].revealed;
    
    if (revealedAnswers.length === correctAnswers.length) {
      alert("All answers revealed! Moving to the next question.");
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      updateQuestion();
    }
    
  } catch (error) {
    console.error("Error in checkGameStatus:", error);
  }
}

function resetGame() {
  princeHP = 50;
  dragonHP = 50;
  currentQuestionIndex = 0;
  questions.forEach(q => (q.revealed = []));
  updateQuestion();

  // Show a modal to congratulate and restart
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.color = "white";
  modal.style.fontSize = "24px";
  modal.style.zIndex = "10";
  modal.innerHTML = `
    <div style="background: #333; padding: 20px; border-radius: 8px;">
      <p>Congratulations! You won!</p>
      <button onclick="location.reload()">Start Again</button>
    </div>
  `;
  document.body.appendChild(modal);
}
