import { ReturnObjectPlayer } from "../types/serverToClientTypes";
import { io } from "../server";
import { playerState, player, playerRound } from "../types/internalTypes";
import { getGame, getLastRound, getSortedResults } from "./gameState";
import { endRound } from "../globalEvents";

const playerData: playerState = {
  players: [],
};

export const addPlayerToServerAndGame = (
  gameId: number,
  newPlayer: player
): void => {
  playerData.players.push(newPlayer);
  const game = getGame(gameId);
  if (game.players.find((p) => p === newPlayer.socketId) === undefined) {
    game.players.push(newPlayer.socketId);
  }
};
export const getPlayer = (playerId: string): player | null => {
  return (
    playerData.players.find((player) => player.socketId === playerId) ?? null
  );
};

export const playerPlayedRound = (
  playerId: string,
  answer: number[],
  playerScore: number,
  gameId: number,
  timeUsed: number
): playerRound | null => {
  const player = getPlayer(playerId);
  if (!player) {
    return null;
  }
  player.roundsPlayed.push({
    round: player.roundsPlayed.length + 1,
    answer: answer,
    timeUsed: timeUsed,
    playerId: playerId,
    gameId: gameId,
    score: playerScore,
  });
};

export const playerDisconnected = async (socketId: string): Promise<number> => {
  const player = playerData.players.find(
    (player) => player.socketId === socketId
  );
  if (player) {
    const game = getGame(player.gameId);
    const players = getPlayersFromGame(game.gameId);
    const shouldNotifyPlayers =
      game.rounds.length !== player.roundsPlayed.length &&
      players
        .filter((player) => player.socketId !== socketId)
        .every((player) => player.roundsPlayed.length === game.rounds.length);
    const isHost = await deletePlayer(socketId);
    if (shouldNotifyPlayers) {
      const round = getLastRound(game.gameId);
      if (round) {
        io.in(game.gameId.toString()).emit(endRound, {
          gameId: game.gameId,
          round: round.round,
          maxRound: game.maxRound,
          result: getSortedResults(game.gameId),
          hostId: game.hostId,
        });
      }
    }
    if (isHost || game?.players.length === 0) {
      return player.gameId;
    }
  }
  return 0;
};
export const deletePlayer = async (playerId: string): Promise<boolean> => {
  //returns boolean true if the player was the host
  const player = getPlayer(playerId);
  playerData.players = playerData.players.filter(
    (player) => player.socketId !== playerId
  );
  const game = getGame(player.gameId);
  game.players = game.players.filter((player) => player !== playerId);
  (await io.fetchSockets()).forEach((socket) => {
    if (socket.id === playerId) {
      socket.leave(game.gameId.toString());
    }
  });
  if (game.hostId == playerId) {
    return true;
  }
  return false;
};

const getPlayersFromGame = (gameId: number): player[] => {
  return (
    getGame(gameId)
      ?.players.map((playerId) => getPlayer(playerId))
      .filter((player) => player !== null) ?? []
  );
};
export const getPlayersFromGameReturnObject = (
  gameId: number
): ReturnObjectPlayer[] => {
  return getPlayersFromGame(gameId).map((player) => {
    return {
      name: player.name,
      avatarIndex: player.avatarIndex,
    };
  });
};

export const getPlayerAsString = (): string => {
  let playerStateString = `<br\>PlayerState:<br\>`;
  playerData.players.forEach((player) => {
    playerStateString += `Player ${player.name}.\t inGame: ${
      getGame(player.gameId).gameId
    }<br\>isHost: ${
      getGame(player.gameId).hostId === player.socketId
    }<br\> RoundsCount: ${player.roundsPlayed.length}<br\>Results:<br\>${[
      ...player.roundsPlayed.map(
        (round: playerRound) =>
          `${round.round}.\t Score: ${round.score} \tTime Used: ${round.timeUsed} Answer: ${round.answer}<br\>`
      ),
    ]}<br\><br\>`;
  });
  playerStateString += `<br\>`;
  return playerStateString;
};

export const allPlayersHavePlayed = (
  gameId: number,
  roundNumber: number
): boolean => {
  const players = getPlayersFromGame(gameId);
  return players.every((player) =>
    player.roundsPlayed.some((round) => round.round === roundNumber)
  );
};
export const getPlayerIdsNotPlayedRound = (
  gameId: number,
  roundNumber: number
) => {
  const players = getPlayersFromGame(gameId);
  return players
    .filter(
      (player) =>
        !player.roundsPlayed.some((round) => round.round === roundNumber)
    )
    .map((player) => player.socketId);
};
