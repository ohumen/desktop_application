/* TIME */
function updateClock() {
  var now = new Date();
  var dname = now.getDay(),
      mo = now.getMonth(),
      dnum = now.getDate(),
      yr = now.getFullYear(),
      hou = now.getHours(),
      min = now.getMinutes(),
      pe = "AM";

      if(hou == 0) {
        hou = 12;
      }

      if(hou > 12) {
        hou = hou - 12;
        pe = "PM";
      }

      Number.prototype.pad = function(digits) {
        for(var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
      }

      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var ids = ["day-name", "month", "day-number", "year", "hour", "minutes", "period"];
      var values = [week[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), pe];
      for(var i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).firstChild.nodeValue = values[i];
      }
}

function initClock() {
  updateClock();
  window.setInterval("updateClock()", 1)
}

/* DRAGGABLE WINDOWS */
function makeElementDraggable(element) {
    let isDragging = false;
    let initialX, initialY;
    let zIndex = 10;

    const header = element.querySelector('.draggable-item');

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX - element.getBoundingClientRect().left;
        initialY = e.clientY - element.getBoundingClientRect().top;
        header.style.cursor = 'grabbing';
        
        zIndex++;
        element.style.zIndex = zIndex;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const newX = e.clientX - initialX;
        const newY = e.clientY - initialY;

        element.style.top = newY + 'px';
        element.style.left = newX + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'grab';
    });
}

const snake_game = document.querySelector('.snake-game-section');
const error = document.querySelector('.error-section');
const pop_up = document.querySelector('.pop-up-section');
const to_do = document.querySelector('.to-do-section');
const calculator = document.querySelector('.calculator-section');
const music_player = document.querySelector('.music-player-section');
const folder = document.querySelector('.folder-section');
const img1 = document.querySelector('.img1-section');
const img2 = document.querySelector('.img2-section');

makeElementDraggable(snake_game);
makeElementDraggable(error);
makeElementDraggable(pop_up);
makeElementDraggable(to_do);
makeElementDraggable(calculator);
makeElementDraggable(music_player);
makeElementDraggable(folder);
makeElementDraggable(img1);
makeElementDraggable(img2);

/* TOGGABLE WINDOWS SNAKE GAME*/
const snakeGamesIcon = document.querySelector('.snake-icon');
const snakeGameSection = document.querySelector('.snake-game-section');
const snakeGameCloseBtn = document.querySelector('.snake-game-section .close-button');

snakeGameSection.style.display = 'block';

let isSnakeGameOpen = true;

function closesnakeGameSection() {
    snakeGameSection.style.display = 'none';
    isSnakeGameOpen = false;
}

snakeGameCloseBtn.addEventListener('click', () => {
    closesnakeGameSection();
});

snakeGamesIcon.addEventListener('click', () => {
    if (isSnakeGameOpen) {
        return;
    }

    snakeGameSection.style.display = 'block';
    isSnakeGameOpen = true;
});

/* SNAKE GAME */
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));
const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        score++; 
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    
    snakeX += velocityX;
    snakeY += velocityY;
    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; 
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);

/* TOGGABLE WINDOWS TO DO*/
const notesIcon = document.querySelector('.notes-icon');
const toDoSection = document.querySelector('.to-do-section');
const toDoCloseBtn = document.querySelector('.to-do-section .close-button');

toDoSection.style.display = 'block';

let isToDoOpen = true;

function closeToDoSection() {
    toDoSection.style.display = 'none';
    isToDoOpen = false;
}

toDoCloseBtn.addEventListener('click', () => {
    closeToDoSection();
});

notesIcon.addEventListener('click', () => {
    if (isToDoOpen) {
        return;
    }

    toDoSection.style.display = 'block';
    isToDoOpen = true;
});

/* TOGGABLE WINDOWS CALCULATOR*/
const calculatorsIcon = document.querySelector('.calculator-icon');
const calculatorSection = document.querySelector('.calculator-section');
const calculatorCloseBtn = document.querySelector('.calculator-section .close-button');

calculatorSection.style.display = 'block';

let isCalculatorOpen = true;

function closeCalculatorSection() {
    calculatorSection.style.display = 'none';
    isCalculatorOpen = false;
}

calculatorCloseBtn.addEventListener('click', () => {
    closeCalculatorSection();
});

calculatorsIcon.addEventListener('click', () => {
    if (isCalculatorOpen) {
        return;
    }

    calculatorSection.style.display = 'block';
    isCalculatorOpen = true;
});

/* TOGGABLE WINDOWS MUSIC PLAYER*/
const musicPlayersIcon = document.querySelector('.music-icon');
const musicPlayerSection = document.querySelector('.music-player-section');
const musicPlayerCloseBtn = document.querySelector('.music-player-section .close-button');

musicPlayerSection.style.display = 'block';

let isMusicPlayerOpen = true;

function closeMusicPlayerSection() {
    musicPlayerSection.style.display = 'none';
    isMusicPlayerOpen = false;
}

musicPlayerCloseBtn.addEventListener('click', () => {
    closeMusicPlayerSection();
});

musicPlayersIcon.addEventListener('click', () => {
    if (isMusicPlayerOpen) {
        return;
    }

    musicPlayerSection.style.display = 'block';
    isMusicPlayerOpen = true;
});

/* MUSIC PLAYER */
const flowerovloveAudio = new Audio('./sound/flowerovlove-NextBestExit.mp3');
const RemiWolfAudio = new Audio('./sound/RemiWolf-DiscoMan.mp3');
const BORNSAudio = new Audio('./sound/BØRNS–ElectricLove.mp3');

window.addEventListener('load', () => {
    songs[0].ele.play();
  });   

const prevBtn = document.querySelector('.previous');
const playBtn = document.querySelector('.play-pause');
const nextBtn = document.querySelector('.next');
const songName = document.querySelector('.song-name');
const playPauseIcon = document.querySelector('#play-pause-icon');
const progressBar = document.querySelector('.progress');
const currentTimeDisplay = document.querySelector('.current-time');
const durationDisplay = document.querySelector('.duration');


const songs = [
    { ele: flowerovloveAudio, audioName: 'flowerovlove - Next Best Exit', volume: 0.5 },
    { ele: RemiWolfAudio, audioName: 'Remi Wolf - Disco Man', volume: 0.5 },
    { ele: BORNSAudio, audioName: 'BØRNS - Electric Love', volume: 0.5 },
];

for (const song of songs) {
    song.ele.addEventListener('ended', () => {
        updateSong('next');
        playPauseSong();
    });

    song.ele.addEventListener('timeupdate', updateProgressBar);
    song.ele.addEventListener('loadedmetadata', updateDuration);
}

let current = 0;
let currentSong = songs[current].ele;
songName.textContent = songs[current].audioName;

playBtn.addEventListener('click', () => {
    playPauseSong();
});

nextBtn.addEventListener('click', () => {
    updateSong('next');
    playPauseSong();
});

prevBtn.addEventListener('click', () => {
    updateSong('prev');
    playPauseSong();
});

currentSong.addEventListener('timeupdate', updateProgressBar);
currentSong.addEventListener('loadedmetadata', updateDuration);

function updateProgressBar() {
    const currentTime = currentSong.currentTime;
    const duration = currentSong.duration;
    const percentage = (currentTime / duration) * 100;
    progressBar.style.width = `${percentage}%`;

    currentTimeDisplay.textContent = formatTime(currentTime);
}

function updateDuration() {
    const duration = currentSong.duration;
    durationDisplay.textContent = formatTime(duration);
}

function updateSong(action) {
    currentSong.pause();
    currentSong.currentTime = 0;

    if (action === 'next') {
        current++;
        if (current > songs.length - 1) current = 0;
    }
    if (action === 'prev') {
        current--;
        if (current < 0) current = songs.length - 1;
    }
    currentSong = songs[current].ele;
    songName.textContent = songs[current].audioName;

    currentSong.volume = songs[current].volume;
}

function playPauseSong() {
    if (currentSong.paused) {
        currentSong.play();
        document.getElementById('play-pause-button').src = "./assets/pause-button.png";
    } else {
        currentSong.pause();
        document.getElementById('play-pause-button').src = "./assets/play-button.png";
    }
}

function updateProgressBar() {
    const currentTime = currentSong.currentTime;
    const duration = currentSong.duration;
    const percentage = (currentTime / duration) * 100;
    progressBar.style.width = `${percentage}%`;

    currentTimeDisplay.textContent = formatTime(currentTime);
}

function updateDuration() {
    const duration = currentSong.duration;
    durationDisplay.textContent = formatTime(duration);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const volumeSlider = document.querySelector('.volume-slider');
const sliderKnob = document.querySelector('.slider-knob');

let isDragging = false;

volumeSlider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateVolume(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateVolume(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function updateVolume(event) {
    if (isDragging) {
        const sliderRect = volumeSlider.getBoundingClientRect();
        const offsetX = event.clientX - sliderRect.left;
        const sliderWidth = sliderRect.width;

        let newVolume = offsetX / sliderWidth;
        newVolume = Math.max(0, Math.min(1, newVolume)); 

        currentSong.volume = newVolume;
        updateSliderPosition(newVolume);
    }
}

function updateSliderPosition(volume) {
    const sliderWidth = volumeSlider.offsetWidth;
    const knobWidth = sliderKnob.offsetWidth;
    const newPosition = (sliderWidth - knobWidth) * volume;
    sliderKnob.style.left = newPosition + 'px';
}

/* TOGGABLE WINDOWS FOLDER*/
const foldersIcon = document.querySelector('.folder-icon');
const folderSection = document.querySelector('.folder-section');
const folderCloseBtn = document.querySelector('.folder-section .close-button');

folderSection.style.display = 'block';

let isFolderOpen = true;

function closeFolderSection() {
    folderSection.style.display = 'none';
    isFolderOpen = false;
}

folderCloseBtn.addEventListener('click', () => {
    closeFolderSection();
});

foldersIcon.addEventListener('click', () => {
    if (isFolderOpen) {
        return;
    }

    folderSection.style.display = 'block';
    isFolderOpen = true;
});

/* TOGGABLE IMG 001 */
const img_001sIcon = document.querySelector('.pool-photo');
const img_001Section = document.querySelector('.img1-section');
const img_001CloseBtn = document.querySelector('.img1-section .close-button');

img_001Section.style.display = 'block';

let isImg_001Open = true;

function closeImg_001Section() {
    img_001Section.style.display = 'none';
    isImg_001Open = false;
}

img_001CloseBtn.addEventListener('click', () => {
    closeImg_001Section();
});

img_001sIcon.addEventListener('click', () => {
    if (isImg_001Open) {
        return;
    }

    img_001Section.style.display = 'block';
    isImg_001Open = true;
});

/* TOGGABLE IMG 002 */
const img_002sIcon = document.querySelector('.plant-photo');
const img_002Section = document.querySelector('.img2-section');
const img_002CloseBtn = document.querySelector('.img2-section .close-button');

img_002Section.style.display = 'block';

let isImg_002Open = true;

function closeImg_002Section() {
    img_002Section.style.display = 'none';
    isImg_002Open = false;
}

img_002CloseBtn.addEventListener('click', () => {
    closeImg_002Section();
});

img_002sIcon.addEventListener('click', () => {
    if (isImg_002Open) {
        return;
    }

    img_002Section.style.display = 'block';
    isImg_002Open = true;
});

/* CLOSE WINDOW BUTTON */
var closeButtons = document.querySelectorAll('.close-button');

closeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        var classesToClose = ['.folder-section', '.snake-game-section', '.error-section', '.pop-up-section', '.music-player-section'];
        
        classesToClose.forEach(function (classToClose) {
            var elementToClose = button.closest(classToClose);
            
            if (elementToClose) {
                elementToClose.style.display = "none";
            }
        });
    });
});

var closePopUp = document.querySelectorAll('.pop-up-buttons');

closePopUp.forEach(function (button) {
    button.addEventListener('click', function () {
        var classesToClose = ['.pop-up-section'];
        
        classesToClose.forEach(function (classToClose) {
            var elementToClose = button.closest(classToClose);
            
            if (elementToClose) {
                elementToClose.style.display = "none";
            }
        });
    });
});

var closeError = document.querySelectorAll('.error-btn');

closeError.forEach(function (button) {
    button.addEventListener('click', function () {
        var classesToClose = ['.error-section'];
        
        classesToClose.forEach(function (classToClose) {
            var elementToClose = button.closest(classToClose);
            
            if (elementToClose) {
                elementToClose.style.display = "none";
            }
        });
    });
});