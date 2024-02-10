import { IEngineSettings } from 'src/app/components/chess-board/helpers/PlayerTeamHelper';

export function getEngineName(engineSettings: IEngineSettings) {
  return (
    `Stockfish ${engineSettings.skillLevel} (` +
    `${engineSettings.elo ? engineSettings.elo + ',' : ''}${
      (engineSettings.timeForMove ?? 0) / 1000
    }s)`
  );
}
