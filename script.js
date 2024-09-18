let frame = 0;
let state = 'IDLE';
let left = 300;
let leftArrow = false;
let rightArrow = false;
let attacking = false;
const enemies = []; // Array
const bullets = []; // Array
const enemyCount = 100;
let backgroundMusic = new Audio('sounds/background_music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;
let hit = new Audio('sounds/hit.MP3');
let shot = new Audio('sounds/shot.mp3');
let gameOver = new Audio('sounds/game-over.mp3');
let walk = new Audio('sounds/walk.mp3');
walk.loop=true;


setInterval(moveCharacterAndEnemies,75);
setInterval(updateGame, 1000 / 60);
setInterval(checkCollisions, 1000 / 60);
setInterval(checkCharacterCollision, 1000 / 60);
document.onkeydown = checkKey;
document.onkeyup = unCheckKey;
createEnemies();

function checkKey(e) {
    if(state !== 'DIE') {
        e = e || window.event;

        if(backgroundMusic.paused) {
            // backgroundMusic.play(); // Bitte einkommentieren, wenn du Musik willst
        }

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
            startAttack();
        }
    } 
}

function startAttack() {
    attacking = true;
    // Bullet anzeigen

    setTimeout(function() {
        shot.currentTime = 0;
        shot.play();
        const bullet = document.createElement('img'); // <img>
        bullet.classList.add('bullet'); // <img class="bullet">
        // <img class="enemy" src="img/bullet.png">
        bullet.src = 'img/bullet.png'; 
        document.body.appendChild(bullet);

        bullets.push({
            element: bullet,
            initialX: 295
        });
    }, 0);
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
    if (state !== 'DIE') {
        currentBackground.style.left = `${-left}px`;
        currentBackground2.style.left = `${-(left - currentBackground.width)}px`;
        currentBackground3.style.left = `${-(left - currentBackground.width * 2)}px`;

        // Update enemy positions to stay fixed on background
        enemies.forEach(enemy => {
            if(!enemy.hit) {
                enemy.initialX -= 0.5;
            }
            enemy.element.style.left = `${enemy.initialX - left}px`;
        });

        bullets.forEach(bullet => {
            bullet.initialX += 15;
            bullet.element.style.left = `${bullet.initialX}px`;
        });


        if(leftArrow && left > 0) {
            left -= 5;
        }
        if(rightArrow && left < 3235) {
            left += 5;
        }

        if(leftArrow || rightArrow) {
            walk.play();
        } else {
            walk.pause();
        }

        if(attacking) {
            setState('ATTACK');
        } else if(leftArrow || rightArrow) {
            setState('WALK');
        } else {
            setState('IDLE');
        }
    }
}

function moveCharacterAndEnemies(){
    if(state !== 'DIE') {
        updateEnemies();
    }

    if (state === 'DIE' && frame < 7) { // Führe die Sterbeanimation einmal aus
        pirate.src = `img/2/2_entity_000_DIE_00${frame}.png`;
        frame++;
    } else if (state !== 'DIE') { // Andere Zustände
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
}


function createEnemies() {
    for (let i = 0; i < enemyCount; i++) {
        const enemyType = Math.floor(Math.random() * 3) + 1;
        const enemy = document.createElement('img'); // <img>
        enemy.classList.add('enemy'); // <img class="enemy">
        // <img class="enemy" src="img/Minotaur_01/Minotaur_01_Walking_000.png">
        enemy.src = `img/Minotaur_0${enemyType}/Minotaur_0${enemyType}_Walking_000.png`; 

        document.getElementById('enemiesContainer').appendChild(enemy);

        // Store enemy's position
        enemies.push({
            element: enemy,
            initialX: 800 + i * 600 * Math.random(),
            frame: i % 17, // Mathematische Rest. Beispiel i = 20; 20 / 18 = 1 Rest 2
            type: enemyType
        });
    }
}

function checkCollisions() {
    enemies.forEach(enemy => {
        if (!enemy.hit) { // Nur ungetroffene Gegner prüfen
            bullets.forEach((bullet, bulletIndex) => {
                const bulletRect = bullet.element.getBoundingClientRect();
                const enemyRect = enemy.element.getBoundingClientRect();

                // Kollision überprüfen
                if (
                    bulletRect.left < enemyRect.right &&
                    bulletRect.right > enemyRect.left &&
                    bulletRect.top < enemyRect.bottom &&
                    bulletRect.bottom > enemyRect.top
                ) {
                    // Treffer
                    hit.currentTime = 0;
                    hit.play();
                    enemy.hit = true; // Gegner als getroffen markieren
                    enemy.frame = 5; // Animation von vorne beginnen

                    // Kugel entfernen
                    bullet.element.remove(); // Entferne das Kugel-Element aus dem DOM
                    bullets.splice(bulletIndex, 1); // Entferne die Kugel aus dem Array
                }
            });
        }
    });
}

function updateEnemies() {
    enemies.forEach(enemy => {
        if (enemy.hit) {
            // Dying Animation
            if (enemy.frame < 10) {
                enemy.element.src = `img/Minotaur_0${enemy.type}/Minotaur_0${enemy.type}_Dying_00${enemy.frame}.png`;
            } else {
                enemy.element.src = `img/Minotaur_0${enemy.type}/Minotaur_0${enemy.type}_Dying_0${enemy.frame}.png`;
            }
            enemy.frame++;
            // Dying Animation endet bei Frame 14
            if (enemy.frame > 14) {
                enemy.frame = 14; // Bleibt auf dem letzten Bild stehen
            }
        } else {
            // Walking Animation
            if (enemy.frame < 10) {
                enemy.element.src = `img/Minotaur_0${enemy.type}/Minotaur_0${enemy.type}_Walking_00${enemy.frame}.png`;
            } else {
                enemy.element.src = `img/Minotaur_0${enemy.type}/Minotaur_0${enemy.type}_Walking_0${enemy.frame}.png`;
            }
            enemy.frame++;
            if (enemy.frame == 17) {
                enemy.frame = 0;
            }
        }
    });
}



function setState(newState) {
    if(state !== newState) {
        frame = 0;
        state = newState;
    }  
}


function checkCharacterCollision() {
    if(state !== 'DIE') {
        const pirateRect = pirate.getBoundingClientRect();

        enemies.forEach(enemy => {
            const enemyRect = enemy.element.getBoundingClientRect();

            // Kollision zwischen Charakter und Gegner überprüfen
            if (
                pirateRect.left < enemyRect.right &&
                pirateRect.right > enemyRect.left &&
                pirateRect.top < enemyRect.bottom &&
                pirateRect.bottom > enemyRect.top &&
                !enemy.hit
            ) {
                // Kollision erkannt
                setState('DIE'); // Setze den Zustand des Charakters auf 'DIE'
                
                // Bewegung des Charakters und der Gegner stoppen
                leftArrow = false;
                rightArrow = false;
                walk.pause();
                backgroundMusic.pause();
                gameOver.play();

                // Gegnerbewegung stoppen
                enemies.forEach(enemy => {
                    enemy.movable = false; // Füge eine Eigenschaft hinzu, um die Bewegung zu kontrollieren
                });
            }
        });
    }
}
