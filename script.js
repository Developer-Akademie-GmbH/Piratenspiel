let frame = 0;
let state = 'IDLE';
let left = 300;

setInterval(moveCharacter,75);
setInterval(updateBackground, 1000 / 60);
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
       // left arrow
       left -= 5;
       setState('WALK');
    }
    else if (e.keyCode == '39') {
       // right arrow
       left += 5;
       setState('WALK');
    }
}

function updateBackground() {
    currentBackground.style.objectPosition = `${-left}px`;
}

function moveCharacter(){
    pirate.src = `img/2/2_entity_000_${state}_00${frame}.png`;
    frame++;

    if(frame == 7) {
        frame = 0;
    }
}


function setState(newState) {
    if(state !== newState) {
        frame = 0;
        state = newState;
    }  
}