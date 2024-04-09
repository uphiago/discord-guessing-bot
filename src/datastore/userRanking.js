import { addPointsForTry, addPointsForWin, getTopPlayers } from "./store.js";
import { getConfig } from './config.js';

const distributeTryPoints = (guildId, userId) => {
  const { guesstry } = getConfig();
  addPointsForTry(guildId, userId, guesstry);
};

const distributeWinPoints = (guildId, userId) => {
  const { guesswin, guesstry } = getConfig();
  addPointsForWin(guildId, userId, guesswin - guesstry);
};

const displayTopPlayers = (guildId, msg) => {
  const topPlayers = getTopPlayers(guildId);
  let rankingMessage = "Top 10 Jogadores:\n";
  topPlayers.forEach((player, index) => {
    rankingMessage += `${index + 1}. <@${player.userId}> PONTOS: ${player.points}\n`;
  });
  msg.reply(rankingMessage);
};

export { distributeTryPoints, distributeWinPoints, displayTopPlayers };