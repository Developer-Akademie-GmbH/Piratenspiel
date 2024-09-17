let frame = 0;
let state = 'IDLE';

setInterval(moveCharacter,75);

function moveCharacter(){
    pirate.src = `img/2/2_entity_000_${state}_00${frame}.png`;
    frame++;

    if(frame == 7) {
        frame = 0;
    }
}


function setState(newState) {
    frame = 0;
    state = newState;
}