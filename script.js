let frame = 0;
let state = 'IDLE';
let left = 300;
let leftArrow = false;
let rightArrow = false;
let attacking = false;
const enemies = []; // Array
const bullets = []; // Array
const enemyCount = 8;


setInterval(moveCharacterAndEnemies,75);
setInterval(updateGame, 1000 / 60);
setInterval(checkCollisions, 1000 / 60);
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
        startAttack();
    }
}

function startAttack() {
    attacking = true;
    // Bullet anzeigen

    setTimeout(function() {
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
    currentBackground.style.left = `${-left}px`;
    currentBackground2.style.left = `${-(left - 1721)}px`;
    currentBackground3.style.left = `${-(left - 1721 * 2)}px`;

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

    if(attacking) {
        setState('ATTACK');
    } else if(leftArrow || rightArrow) {
        setState('WALK');
    } else {
        setState('IDLE');
    }
}

function moveCharacterAndEnemies(){
    updateEnemies();
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
                enemy.element.src = `img/Minotaur_01/Minotaur_01_Dying_00${enemy.frame}.png`;
            } else {
                enemy.element.src = `img/Minotaur_01/Minotaur_01_Dying_0${enemy.frame}.png`;
            }
            enemy.frame++;
            // Dying Animation endet bei Frame 14
            if (enemy.frame > 14) {
                enemy.frame = 14; // Bleibt auf dem letzten Bild stehen
            }
        } else {
            // Walking Animation
            if (enemy.frame < 10) {
                enemy.element.src = `img/Minotaur_01/Minotaur_01_Walking_00${enemy.frame}.png`;
            } else {
                enemy.element.src = `img/Minotaur_01/Minotaur_01_Walking_0${enemy.frame}.png`;
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