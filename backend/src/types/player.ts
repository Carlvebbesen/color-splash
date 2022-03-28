export interface Player {
    name : string;
    socketID : string;
    gameID? : string;
    round? : number;
    answer? : string;
}

/**
 * ALgoritmen for hvordan vi for hver runde emiter shit til hver individuelle player
 * Ha en array, med players, med socketID og masse shit om hver player lagret.
 * Itererer over den i gameloopen for hver runde, og emit til hver socket id, 
 * dens data som finnes i dictionary players - som blir oppdatert for hver runde.
 * 
 */
