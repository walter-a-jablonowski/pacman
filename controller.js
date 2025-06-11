document.addEventListener('DOMContentLoaded', () => {
  // Game constants
  const CELL_SIZE = 20;
  const BOARD_WIDTH = 19;
  const BOARD_HEIGHT = 22;
  const FPS = 10;
  
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
      element: document.createElement('div')
    };
    
    // Create pacman element
    pacman.element.className = 'cell pacman';
    pacman.element.style.width = `${CELL_SIZE}px`;
    pacman.element.style.height = `${CELL_SIZE}px`;
    pacman.element.style.left = `${pacman.x * CELL_SIZE}px`;
    pacman.element.style.top = `${pacman.y * CELL_SIZE}px`;
    
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
      ghost.element.style.width = `${CELL_SIZE}px`;
      ghost.element.style.height = `${CELL_SIZE}px`;
      ghost.element.style.left = `${ghost.x * CELL_SIZE}px`;
      ghost.element.style.top = `${ghost.y * CELL_SIZE}px`;
      
      // Add ghost to the game board
      gameBoardElement.appendChild(ghost.element);
      ghosts.push(ghost);
    }
  }
  
  // Update the display
  function updateDisplay()
  {
    // Update pacman position
    pacman.element.style.left = `${pacman.x * CELL_SIZE}px`;
    pacman.element.style.top = `${pacman.y * CELL_SIZE}px`;
    
    // Update ghost positions
    for (const ghost of ghosts)
    {
      ghost.element.style.left = `${ghost.x * CELL_SIZE}px`;
      ghost.element.style.top = `${ghost.y * CELL_SIZE}px`;
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
      if (Math.random() < 0.3)
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
    }, 1000 / FPS);
  }
  
  // Handle keyboard input
  document.addEventListener('keydown', (event) => {
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
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    
    // Start game if waiting or game over
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
  
  // Initialize the game
  initGame();
});
