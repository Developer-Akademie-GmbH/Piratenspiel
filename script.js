let frame = 0;
let state = 'IDLE';
let left = 300;
let leftArrow = false;
let rightArrow = false;
let attacking = false;
const enemies = []; // Array
const enemyCount = 3;


setInterval(moveCharacterAndEnemies,75);
setInterval(updateGame, 1000 / 60);
document.onkeydown = checkKey;
document.onkeyup = unCheckKey;
createEnemies();

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '37') {
       // left arrow
       leftArrow = true;
       setState('WALK');
    }
    else if (e.keyCode == '39') {
       // right arrow
       rightArrow = true;
       setState('WALK');
    } 
    if (e.keyCode == '68'){ // 'd' Taste 
        attacking = true;
    }
}

function unCheckKey(e) {
    e = e || window.event;

    if (e.keyCode == '37') {
        leftArrow = false;
    } else if (e.keyCode == '39') {
        rightArrow = false;
    }
}

function updateGame() {
    currentBackground.style.objectPosition = `${-left}px`;

    // Update enemy positions to stay fixed on background
    enemies.forEach(enemy => {
        enemy.initialX -= 0.5;
        enemy.element.style.left = `${enemy.initialX - left}px`;
    });


    if(leftArrow) {
        left -= 5;
    }
    if(rightArrow) {
        left += 5;
    }

    if(attacking) {
        setState('ATTACK');
    } else if(leftArrow || rightArrow) {
        setState('WALK');
    } else {
        setState('IDLE');
    }
}

function moveCharacterAndEnemies(){

    enemies.forEach(enemy => {
        if(enemy.frame < 10) {
            enemy.element.src = `img/Minotaur_01/Minotaur_01_Walking_00${enemy.frame}.png`;
        } else {
            enemy.element.src = `img/Minotaur_01/Minotaur_01_Walking_0${enemy.frame}.png`;
        }
        enemy.frame++;
        if(enemy.frame == 17) {
            enemy.frame = 0;
        }
    });
    
    pirate.src = `img/2/2_entity_000_${state}_00${frame}.png`;
    frame++;
    if(leftArrow) {
        pirate.style.transform = "scaleX(-1)";
    }

    if(rightArrow) {
        pirate.style.transform = "scaleX(1)";
    }

    if(frame == 7) {
        attacking = false;
        frame = 0;
    }
}


function createEnemies() {
    for (let i = 0; i < enemyCount; i++) {
        const enemy = document.createElement('img'); // <img>
        enemy.classList.add('enemy'); // <img class="enemy">
        // <img class="enemy" src="img/Minotaur_01/Minotaur_01_Walking_000.png">
        enemy.src = 'img/Minotaur_01/Minotaur_01_Walking_000.png'; 

        document.getElementById('enemiesContainer').appendChild(enemy);

        // Store enemy's position
        enemies.push({
            element: enemy,
            initialX: 800 + i * 300,
            frame: i
        });
    }
}


function setState(newState) {
    if(state !== newState) {
        frame = 0;
        state = newState;
    }  
}