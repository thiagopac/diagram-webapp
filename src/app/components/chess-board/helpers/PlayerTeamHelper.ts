import { Color } from 'chessground/types';
import { DEFAULT_ID } from 'src/app/services/peer-to-peer.service';
import { getEngineName } from 'src/app/shared/engine/engine-helpers';
import { UsernameProperties } from 'src/app/shared/util/username';
import { environment } from 'src/environments/environment';

export function getDefaultNames() {
  const engineSettings: IEngineSettings = getDefaultEngineSettings();
  const engineSettings2: IEngineSettings = {
    ...engineSettings,
    elo: 1350,
  };

  if (false && !environment.production) {
    const d: any = {};
    for (let i = 0; i < 20; ++i) {
      const s = 'abc' + i.toString();
      d[s] = createPlayerTeam(
        {} as UsernameProperties,
        s,
        'black',
        engineSettings
      );
    }
    return {
      [DEFAULT_ID]: createPlayerTeam({} as UsernameProperties, 'default'),
      ...d,
    };
  }

  return {
    [DEFAULT_ID]: createPlayerTeam({} as UsernameProperties, 'default'),
    stockfish: createPlayerTeam(
      {} as UsernameProperties,
      getEngineName(engineSettings),
      'black',
      engineSettings
    ),
    stockfish2: createPlayerTeam(
      {} as UsernameProperties,
      getEngineName(engineSettings2),
      'black',
      engineSettings2
    ),
  };
}

export function getDefaultEngineSettings(): IEngineSettings {
  return {
    timeForMove: 700,
    elo: 1200,
    skillLevel: 5,
  };
}

function createPlayerTeam(
  properties: UsernameProperties,
  name: string,
  color: Color = 'white',
  engineSettings?: IEngineSettings
): IPlayerTeam {
  return {
    properties,
    name,
    team: color,
    owner: DEFAULT_ID,
    isReady: true,
    sortNumber: 0,
    engineSettings,
  };
}

export function getSortedTeamKeys(names: PlayerTeamDict) {
  return Object.keys(names).sort((a, b) => {
    const lt = (c: string, d: string) =>
      names[c].sortNumber < names[d].sortNumber ||
      (names[c].sortNumber === names[d].sortNumber && c < d);
    if (lt(a, b)) return -1;
    if (lt(b, a)) return 1;
    return 0;
  });
}

export function keyValueFilter(
  names: PlayerTeamDict,
  teamName: Color
): PlayerTeamDict {
  return Object.fromEntries(
    Object.entries(names).filter(([k, v]) => v.team === teamName)
  );
}

export interface IEngineSettings {
  timeForMove: number;
  elo: number;
  skillLevel: number;
}

export interface IPlayerTeam {
  properties: UsernameProperties;
  name: string;
  team: Color;
  owner: string;
  sortNumber: number;
  isReady?: boolean;
  engineSettings?: IEngineSettings;
  rematchRequested?: boolean;
}

export type PlayerTeamDict = { [id: string]: IPlayerTeam };
