document.addEventListener('DOMContentLoaded', () => {
  // Game constants
  const CELL_SIZE = 20;
  const BOARD_WIDTH = 19;
  const BOARD_HEIGHT = 22;
  const FPS = 7;  // Reduced from 10 to 7 for slower movement
  const PACMAN_SIZE = CELL_SIZE * 1.2;
  const GHOST_SIZE = CELL_SIZE * 1.2;
  
  // Game variables
  let gameBoard = [];
  let pacman = { x: 0, y: 0, direction: 'right', nextDirection: 'right' };
  let ghosts = [];
  let score = 0;
  let dotsCount = 0;
  let gameInterval = null;
  let gameState = 'waiting'; // waiting, playing, gameover, won
  
  // Game board element
  const gameBoardElement = document.getElementById('game-board');
  const scoreElement = document.getElementById('score');
  const overlayElement = document.getElementById('overlay');
  const overlayContentElement = document.querySelector('.overlay-content');
  
  // Initialize the game
  function initGame()
  {
    // Initialize control buttons
    initControlButtons();
    // Set board size
    gameBoardElement.style.width = `${CELL_SIZE * BOARD_WIDTH}px`;
    gameBoardElement.style.height = `${CELL_SIZE * BOARD_HEIGHT}px`;
    
    // Create the game board
    createBoard();
    
    // Place pacman
    placePacman();
    
    // Place ghosts
    placeGhosts();
    
    // Update the display
    updateDisplay();
    
    // Set game state
    gameState = 'waiting';
    showOverlay('Press space to start');
  }
  
  // Create the game board
  function createBoard()
  {
    // Clear the game board
    gameBoard = [];
    gameBoardElement.innerHTML = '';
    dotsCount = 0;
    
    // Define the maze layout (0 = empty, 1 = wall, 2 = dot)
    const mazeLayout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
      [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
      [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
      [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
      [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
      [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
      [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
      [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 2, 1],
      [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
      [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    
    // Create the game board
    for (let y = 0; y < BOARD_HEIGHT; y++)
    {
      gameBoard[y] = [];
      for (let x = 0; x < BOARD_WIDTH; x++)
      {
        const cellType = mazeLayout[y][x];
        gameBoard[y][x] = { type: cellType, element: null };
        
        // Create cell element
        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.style.width = `${CELL_SIZE}px`;
        cellElement.style.height = `${CELL_SIZE}px`;
        cellElement.style.left = `${x * CELL_SIZE}px`;
        cellElement.style.top = `${y * CELL_SIZE}px`;
        
        // Set cell type
        if (cellType === 1)
        {
          cellElement.classList.add('wall');
        }
        else if (cellType === 2)
        {
          cellElement.classList.add('dot');
          cellElement.style.width = `${CELL_SIZE / 4}px`;
          cellElement.style.height = `${CELL_SIZE / 4}px`;
          cellElement.style.left = `${x * CELL_SIZE + CELL_SIZE / 2 - CELL_SIZE / 8}px`;
          cellElement.style.top = `${y * CELL_SIZE + CELL_SIZE / 2 - CELL_SIZE / 8}px`;
          dotsCount++;
        }
        
        // Add cell to the game board
        gameBoard[y][x].element = cellElement;
        gameBoardElement.appendChild(cellElement);
      }
    }
  }
  
  // Place pacman
  function placePacman()
  {
    // Place pacman at the bottom center
    pacman = {
      x: 9,
      y: 16,
      direction: 'right',
      nextDirection: 'right',
      element: document.createElement('div'),
      mouthAngle: 45 // Angle for the mouth animation
    };
    
    // Create pacman element
    pacman.element.className = 'cell pacman';
    pacman.element.style.width = `${PACMAN_SIZE}px`;
    pacman.element.style.height = `${PACMAN_SIZE}px`;
    pacman.element.style.left = `${pacman.x * CELL_SIZE - (PACMAN_SIZE - CELL_SIZE) / 2}px`;
    pacman.element.style.top = `${pacman.y * CELL_SIZE - (PACMAN_SIZE - CELL_SIZE) / 2}px`;
    
    // Create pacman's eye
    const eye = document.createElement('div');
    eye.style.position = 'absolute';
    eye.style.width = `${PACMAN_SIZE / 8}px`;
    eye.style.height = `${PACMAN_SIZE / 8}px`;
    eye.style.backgroundColor = 'black';
    eye.style.borderRadius = '50%';
    eye.style.top = `${PACMAN_SIZE / 4}px`;
    eye.style.right = `${PACMAN_SIZE / 3}px`;
    pacman.element.appendChild(eye);
    
    // Add pacman to the game board
    gameBoardElement.appendChild(pacman.element);
  }
  
  // Place ghosts
  function placeGhosts()
  {
    // Clear ghosts
    ghosts = [];
    
    // Ghost colors
    const ghostColors = ['red', 'pink', 'cyan', 'orange'];
    
    // Ghost starting positions
    const ghostPositions = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 10, y: 9 },
      { x: 9, y: 8 }
    ];
    
    // Create ghosts
    for (let i = 0; i < 4; i++)
    {
      const ghost = {
        x: ghostPositions[i].x,
        y: ghostPositions[i].y,
        direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)],
        color: ghostColors[i],
        element: document.createElement('div')
      };
      
      // Create ghost element
      ghost.element.className = `cell ghost ghost-${ghost.color}`;
      ghost.element.style.width = `${GHOST_SIZE}px`;
      ghost.element.style.height = `${GHOST_SIZE}px`;
      ghost.element.style.left = `${ghost.x * CELL_SIZE - (GHOST_SIZE - CELL_SIZE) / 2}px`;
      ghost.element.style.top = `${ghost.y * CELL_SIZE - (GHOST_SIZE - CELL_SIZE) / 2}px`;
      
      // Add eyes to ghost
      const eyesContainer = document.createElement('div');
      eyesContainer.style.position = 'absolute';
      eyesContainer.style.display = 'flex';
      eyesContainer.style.justifyContent = 'space-around';
      eyesContainer.style.width = '100%';
      eyesContainer.style.top = '25%';
      eyesContainer.style.padding = '0 15%';
      
      // Create two eyes
      for (let j = 0; j < 2; j++) {
        const eye = document.createElement('div');
        eye.style.width = `${GHOST_SIZE / 5}px`;
        eye.style.height = `${GHOST_SIZE / 5}px`;
        eye.style.backgroundColor = 'white';
        eye.style.borderRadius = '50%';
        eye.style.position = 'relative';
        
        const pupil = document.createElement('div');
        pupil.style.width = `${GHOST_SIZE / 10}px`;
        pupil.style.height = `${GHOST_SIZE / 10}px`;
        pupil.style.backgroundColor = 'blue';
        pupil.style.borderRadius = '50%';
        pupil.style.position = 'absolute';
        pupil.style.top = '25%';
        pupil.style.left = '25%';
        
        eye.appendChild(pupil);
        eyesContainer.appendChild(eye);
      }
      
      ghost.element.appendChild(eyesContainer);
      
      // Add ghost to the game board
      gameBoardElement.appendChild(ghost.element);
      ghosts.push(ghost);
    }
  }
  
  // Update the display
  function updateDisplay()
  {
    // Update pacman position
    pacman.element.style.left = `${pacman.x * CELL_SIZE - (PACMAN_SIZE - CELL_SIZE) / 2}px`;
    pacman.element.style.top = `${pacman.y * CELL_SIZE - (PACMAN_SIZE - CELL_SIZE) / 2}px`;
    
    // Update pacman mouth based on direction
    updatePacmanMouth();
    
    // Update ghost positions
    for (const ghost of ghosts)
    {
      ghost.element.style.left = `${ghost.x * CELL_SIZE - (GHOST_SIZE - CELL_SIZE) / 2}px`;
      ghost.element.style.top = `${ghost.y * CELL_SIZE - (GHOST_SIZE - CELL_SIZE) / 2}px`;
    }
    
    // Update score
    scoreElement.textContent = score;
  }
  
  // Move pacman
  function movePacman()
  {
    // Try to change direction if requested
    if (pacman.nextDirection !== pacman.direction)
    {
      const nextX = getNextPosition(pacman.x, pacman.y, pacman.nextDirection).x;
      const nextY = getNextPosition(pacman.x, pacman.y, pacman.nextDirection).y;
      
      if (!isWall(nextX, nextY))
      {
        pacman.direction = pacman.nextDirection;
      }
    }
    
    // Get next position
    const nextPos = getNextPosition(pacman.x, pacman.y, pacman.direction);
    
    // Check if next position is valid
    if (!isWall(nextPos.x, nextPos.y))
    {
      // Move pacman
      pacman.x = nextPos.x;
      pacman.y = nextPos.y;
      
      // Check if pacman ate a dot
      if (gameBoard[pacman.y][pacman.x].type === 2)
      {
        // Remove dot
        gameBoard[pacman.y][pacman.x].type = 0;
        gameBoard[pacman.y][pacman.x].element.classList.remove('dot');
        
        // Increase score
        score += 10;
        dotsCount--;
        
        // Check if all dots are eaten
        if (dotsCount === 0)
        {
          gameState = 'won';
          clearInterval(gameInterval);
          showOverlay('You won!<br>Press space to play again');
        }
      }
    }
  }
  
  // Move ghosts
  function moveGhosts()
  {
    for (const ghost of ghosts)
    {
      // Decide if ghost should change direction
      if (Math.random() < 0.2)  // Reduced from 0.3 to 0.2 for less random direction changes
      {
        // Get possible directions
        const possibleDirections = [];
        
        // Check each direction
        for (const dir of ['up', 'down', 'left', 'right'])
        {
          const nextPos = getNextPosition(ghost.x, ghost.y, dir);
          if (!isWall(nextPos.x, nextPos.y))
          {
            possibleDirections.push(dir);
          }
        }
        
        // Choose a random direction
        if (possibleDirections.length > 0)
        {
          ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }
      }
      
      // Get next position
      const nextPos = getNextPosition(ghost.x, ghost.y, ghost.direction);
      
      // Check if next position is valid
      if (!isWall(nextPos.x, nextPos.y))
      {
        // Move ghost
        ghost.x = nextPos.x;
        ghost.y = nextPos.y;
      }
      else
      {
        // Choose a new random direction
        const possibleDirections = [];
        
        // Check each direction
        for (const dir of ['up', 'down', 'left', 'right'])
        {
          const nextPos = getNextPosition(ghost.x, ghost.y, dir);
          if (!isWall(nextPos.x, nextPos.y))
          {
            possibleDirections.push(dir);
          }
        }
        
        // Choose a random direction
        if (possibleDirections.length > 0)
        {
          ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }
      }
      
      // Check if ghost caught pacman
      if (ghost.x === pacman.x && ghost.y === pacman.y)
      {
        gameState = 'gameover';
        clearInterval(gameInterval);
        showOverlay('Game Over!<br>Press space to play again');
      }
    }
  }
  
  // Get next position based on current position and direction
  function getNextPosition(x, y, direction)
  {
    switch (direction)
    {
      case 'up':
        return { x, y: y - 1 };
      case 'down':
        return { x, y: y + 1 };
      case 'left':
        return { x: x - 1, y };
      case 'right':
        return { x: x + 1, y };
      default:
        return { x, y };
    }
  }
  
  // Check if position is a wall
  function isWall(x, y)
  {
    // Check if position is out of bounds
    if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT)
    {
      return true;
    }
    
    // Check if position is a wall
    return gameBoard[y][x].type === 1;
  }
  
  // Show overlay
  function showOverlay(message)
  {
    overlayContentElement.innerHTML = message;
    overlayElement.style.display = 'flex';
    
    // Update start button text based on game state
    const startButton = document.getElementById('btn-start');
    if (gameState === 'waiting')
    {
      startButton.textContent = 'Start';
    }
    else if (gameState === 'gameover')
    {
      startButton.textContent = 'Retry';
    }
    else if (gameState === 'won')
    {
      startButton.textContent = 'Play Again';
    }
  }
  
  // Hide overlay
  function hideOverlay()
  {
    overlayElement.style.display = 'none';
  }
  
  // Start the game
  function startGame()
  {
    // Reset score
    score = 0;
    
    // Initialize the game
    initGame();
    
    // Hide overlay
    hideOverlay();
    
    // Set game state
    gameState = 'playing';
    
    // Start game loop
    gameInterval = setInterval(() => {
      movePacman();
      moveGhosts();
      updateDisplay();
      animatePacmanMouth();
    }, 1000 / FPS);
  }
  
  // Handle keyboard input
  document.addEventListener('keydown', (event) => {
    // Store the previous direction to allow for buffered input
    const prevDirection = pacman.nextDirection;
    // Handle arrow keys
    switch (event.key)
    {
      case 'ArrowUp':
        pacman.nextDirection = 'up';
        event.preventDefault();
        break;
      case 'ArrowDown':
        pacman.nextDirection = 'down';
        event.preventDefault();
        break;
      case 'ArrowLeft':
        pacman.nextDirection = 'left';
        event.preventDefault();
        break;
      case 'ArrowRight':
        pacman.nextDirection = 'right';
        event.preventDefault();
        break;
      case ' ':
        // Start game if waiting or game over
        if (gameState === 'waiting' || gameState === 'gameover' || gameState === 'won')
        {
          startGame();
        }
        event.preventDefault();
        break;
    }
  });
  
  // Handle touch input for mobile devices
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (event) => {
    // Check if the touch is on a control button
    if (event.target.classList.contains('control-btn')) {
      // Let the button's own event handler handle it
      return;
    }
    
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    
    // Start game if waiting or game over - only if not touching a control button
    if (gameState === 'waiting' || gameState === 'gameover' || gameState === 'won')
    {
      startGame();
    }
  });
  
  document.addEventListener('touchmove', (event) => {
    if (gameState !== 'playing') return;
    
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Determine swipe direction
    if (Math.abs(diffX) > Math.abs(diffY))
    {
      // Horizontal swipe
      if (diffX > 0)
      {
        pacman.nextDirection = 'right';
      }
      else
      {
        pacman.nextDirection = 'left';
      }
    }
    else
    {
      // Vertical swipe
      if (diffY > 0)
      {
        pacman.nextDirection = 'down';
      }
      else
      {
        pacman.nextDirection = 'up';
      }
    }
    
    // Update touch start position
    touchStartX = touchEndX;
    touchStartY = touchEndY;
    
    event.preventDefault();
  }, { passive: false });
  
  // Function to animate Pacman's mouth
  function animatePacmanMouth()
  {
    if (gameState === 'playing')
    {
      pacman.mouthAngle += 5;
      if (pacman.mouthAngle > 45) pacman.mouthAngle = 0;
      updatePacmanMouth();
    }
  }
  
  // Update Pacman's mouth based on direction
  function updatePacmanMouth()
  {
    // Clear any existing mouth
    if (pacman.mouthElement) {
      pacman.element.removeChild(pacman.mouthElement);
    }
    
    // Create a mouth using a div with a clip-path
    const mouth = document.createElement('div');
    mouth.style.position = 'absolute';
    mouth.style.width = '100%';
    mouth.style.height = '100%';
    mouth.style.backgroundColor = 'black';
    
    // Set rotation based on direction
    let rotation = 0;
    switch (pacman.direction)
    {
      case 'up': rotation = -90; break;
      case 'down': rotation = 90; break;
      case 'left': rotation = 180; break;
      case 'right': rotation = 0; break;
    }
    
    // Create a mouth using clip-path
    const angle = pacman.mouthAngle;
    mouth.style.clipPath = `polygon(
      50% 50%, 
      100% ${50 - angle}%, 
      100% ${50 + angle}%
    )`;
    mouth.style.transform = `rotate(${rotation}deg)`;
    
    pacman.element.appendChild(mouth);
    pacman.mouthElement = mouth;
  }
  
  // Initialize control buttons
  function initControlButtons()
  {
    // Get control buttons
    const upButton = document.getElementById('btn-up');
    const downButton = document.getElementById('btn-down');
    const leftButton = document.getElementById('btn-left');
    const rightButton = document.getElementById('btn-right');
    const startButton = document.getElementById('btn-start');
    
    // Function to handle direction button press
    const handleDirectionButton = (direction) => {
      pacman.nextDirection = direction;
    };
    
    // Function to handle start button press
    const handleStartButton = () => {
      if (gameState === 'waiting' || gameState === 'gameover' || gameState === 'won')
      {
        startGame();
      }
    };
    
    // Add both click and touch event listeners for better responsiveness
    // Up button
    upButton.addEventListener('mousedown', () => handleDirectionButton('up'));
    upButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleDirectionButton('up');
    }, { passive: false });
    
    // Down button
    downButton.addEventListener('mousedown', () => handleDirectionButton('down'));
    downButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleDirectionButton('down');
    }, { passive: false });
    
    // Left button
    leftButton.addEventListener('mousedown', () => handleDirectionButton('left'));
    leftButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleDirectionButton('left');
    }, { passive: false });
    
    // Right button
    rightButton.addEventListener('mousedown', () => handleDirectionButton('right'));
    rightButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleDirectionButton('right');
    }, { passive: false });
    
    // Start button - add multiple event types for better reliability
    startButton.addEventListener('mousedown', handleStartButton);
    startButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleStartButton();
    }, { passive: false });
    startButton.addEventListener('click', handleStartButton);
    
    // Prevent default touch behavior to avoid scrolling while playing
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(button => {
      // Prevent all default touch events
      ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(eventType => {
        button.addEventListener(eventType, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, { passive: false });
      });
    });
  }
  
  // Initialize the game
  initGame();
});
