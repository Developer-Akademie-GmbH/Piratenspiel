let frame = 0;


function moveCharacter(){
    pirate.src = `img/2/2_entity_000_IDLE_00${frame}.png`;
    frame++;

    if(frame == 7) {
        frame = 0;
    }
}