import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChessgroundModule } from 'ngx-chessground';
import { AudioService } from 'src/app/services/audio.service';
import { ChessStatusService } from 'src/app/services/chess-status.service';
import { ChessTimerFormatPipe } from 'src/app/pipes/chess-timer-format.pipe';
import { GetCpuIdService } from 'src/app/services/get-cpu-id.service';
import { createPeers } from 'src/app/mocks/services/peer-to-peer-helpers';
import { PeerToPeerService } from 'src/app/services/peer-to-peer.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ChessTimerComponent } from '../chess-timer/chess-timer.component';

import { ChessBoardComponent } from './chess-board.component';
import { ChessTimerService } from 'src/app/services/chess-timer.service';
import { getAudioServiceMock } from 'src/app/mocks/audio.service.mock';
import { ReactiveComponentModule } from '@ngrx/component';
import { PlayerListComponent } from '../player-list/player-list.component';
import { CommandService } from 'src/app/services/command.service';
import { Api } from 'chessground/api';

import * as ChessJS from 'chess.js';
import { arrowLeftEvent, arrowRightEvent } from 'src/app/mocks/keyboard.mock';
import { PeerToPeerServiceMock } from 'src/app/mocks/services/peer-to-peer.service.mock';
import { IMock, It, Mock, Times } from 'typemoq';
import { GetNextMoveProviderService } from 'src/app/services/get-next-move-provider.service';
import { IGetNextMove } from './helpers/GetNextMove/IGetNextMove';
import { MoveHandlerResolverService } from 'src/app/services/move-handler-resolver.service';
import { getNextMoveGetterProviderMock } from 'src/app/mocks/next-move-getter-provider.mock';
import { UsernameProperties } from 'src/app/shared/util/username';

describe('ChessBoardComponent', () => {
  let component: ChessBoardComponent;
  let fixture: ComponentFixture<ChessBoardComponent>;
  let chessStatusService: ChessStatusService;
  let chessTimerService: ChessTimerService;
  let sharedDataService: SharedDataService;
  let commandService: CommandService;
  let peers: PeerToPeerServiceMock[];
  let cg: Api;
  let getNextMoveMock: IMock<IGetNextMove>;
  let nextMoveGetterProviderMock: IMock<GetNextMoveProviderService>;

  beforeEach(async () => {
    peers = createPeers(2);
    sharedDataService = new SharedDataService(peers[0]);
    commandService = new CommandService(
      sharedDataService,
      peers[0],
      new GetCpuIdService(peers[0])
    );
    getNextMoveMock = Mock.ofType<IGetNextMove>();
    nextMoveGetterProviderMock = getNextMoveGetterProviderMock(
      getNextMoveMock.object
    );

    commandService.createPlayer(
      {
        properties: {} as UsernameProperties,
        name: 'p1',
        team: 'white',
        sortNumber: 0,
        owner: peers[0].getId(),
      },
      peers[0].getId()
    );
    commandService.createPlayer(
      {
        properties: {} as UsernameProperties,
        name: 'p2',
        team: 'black',
        sortNumber: 1,
        owner: peers[1].getId(),
      },
      'p2'
    );
    commandService.createPlayer(
      {
        properties: {} as UsernameProperties,
        name: 'p3',
        team: 'white',
        sortNumber: 2,
        owner: peers[2].getId(),
      },
      'p3'
    );

    chessStatusService = new ChessStatusService(sharedDataService);
    chessTimerService = new ChessTimerService();

    const configureTestBed = TestBed.configureTestingModule({
      declarations: [
        ChessBoardComponent,
        ChessTimerComponent,
        ChessTimerFormatPipe,
        PlayerListComponent,
      ],
      imports: [NgxChessgroundModule, ReactiveComponentModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '' },
        { provide: PeerToPeerService, useValue: peers[0] },
        { provide: SharedDataService, useValue: sharedDataService },
        { provide: AudioService, useValue: getAudioServiceMock() },
        { provide: CommandService, useValue: commandService },
        {
          provide: GetNextMoveProviderService,
          useValue: nextMoveGetterProviderMock.object,
        },
        MoveHandlerResolverService,
      ],
    });

    TestBed.overrideComponent(ChessBoardComponent, {
      add: {
        providers: [
          { provide: ChessStatusService, useValue: chessStatusService },
          { provide: ChessTimerService, useValue: chessTimerService },
        ],
      },
    });

    await configureTestBed.compileComponents();

    fixture = TestBed.createComponent(ChessBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // tslint:disable-next-line
    cg = component['cg'];

    jasmine.clock().install();
    jasmine.clock().mockDate();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    component.ngOnDestroy();
  });

  function doMove(
    from: ChessJS.Square,
    to: ChessJS.Square,
    claimedTime?: number
  ) {
    peers[0].broadcastAndToSelf({
      command: 'MOVE',
      from,
      to,
      claimedTime,
      numMoves: 0,
      matchId: 1,
    });
    jasmine.clock().tick(1);
  }

  function getMovableStatus() {
    if (cg.state.movable.color === undefined) return 'unmovable';
    return cg.state.movable.color === cg.state.turnColor
      ? 'movable'
      : 'premovable';
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.myTeam).toBe('white');
  });

  it('should only timeout after 2 moves', () => {
    expect(chessStatusService.isGameOver()).toBeFalse();
    jasmine.clock().tick(200 * 1000);
    expect(chessStatusService.isGameOver()).toEqual(
      false,
      'Zero moves should not timeout'
    );
    doMove('e2', 'e4');
    jasmine.clock().tick(200 * 1000);
    expect(chessStatusService.isGameOver()).toEqual(
      false,
      'One move should not timeout'
    );
    doMove('e7', 'e5');
    jasmine.clock().tick(200 * 1000);
    expect(chessStatusService.isGameOver()).toEqual(
      true,
      'Two moves should timeout'
    );
  });

  it('threefold repetition', () => {
    expect(chessStatusService.isGameOver()).toBeFalse();
    const moves: [ChessJS.Square, ChessJS.Square][] = [
      ['b1', 'c3'],
      ['b8', 'c6'],
      ['c3', 'b1'],
      ['c6', 'b8'],
    ];
    for (let i = 0; i < 2; ++i) {
      for (const move of moves) {
        expect(chessStatusService.isGameOver()).toBeFalse();
        doMove(move[0], move[1]);
      }
    }
    expect(chessStatusService.isGameOver()).toBeTrue();
    expect(chessStatusService.currentStatus.getValue()).toEqual('draw');
  });

  it('resign option', () => {
    expect(chessStatusService.isGameOver()).toBeFalse();
    commandService.resign('white');
    jasmine.clock().tick(1 * 1000);
    expect(chessStatusService.isGameOver()).toEqual(
      true,
      'should have resigned'
    );
    expect(chessStatusService.currentStatus.getValue()).toEqual(
      'white resigned',
      'should have resigned'
    );
  });

  it('timer settings', () => {
    chessTimerService.setupTimer(
      {
        whiteTime: 3,
        whiteIncrement: 2,
        asymmetric: false,
      },
      'white'
    );

    const assertTimes = (
      whiteTime: number,
      blackTime: number,
      msg?: string
    ) => {
      chessTimerService.tickHandlerExposed();
      expect(chessTimerService.getTimeSync('white')).toBeCloseTo(
        whiteTime,
        2,
        msg
      );
      expect(chessTimerService.getTimeSync('black')).toBeCloseTo(
        blackTime,
        2,
        msg
      );
    };

    assertTimes(60, 60, '0 moves');
    doMove('e2', 'e4');
    jasmine.clock().tick(1000);
    assertTimes(60, 60, 'after 1 move');
    doMove('e7', 'e5');
    assertTimes(60, 60, 'after 2 moves');
    jasmine.clock().tick(1000);
    assertTimes(59, 60, 'after 2 moves + 1 sec');
    doMove('d2', 'd4');
    assertTimes(64, 60, 'after 3rd move, increment');
    jasmine.clock().tick(2 * 1000);
    assertTimes(64, 58, 'after 3rd move + 2 secs');
    doMove('d7', 'd5');
    assertTimes(64, 63, 'after 4th move, increment');
  });

  describe('left/right buttons', () => {
    it('when it is the players turn', () => {
      doMove('e2', 'e4');
      doMove('e7', 'e5');
      doMove('d2', 'd4');
      doMove('d7', 'd5');
      expect(getMovableStatus()).toEqual('movable', 'initial');
      for (let i = 0; i < 20; ++i) {
        component.keyEvent(arrowLeftEvent);
        expect(getMovableStatus()).toEqual(
          'unmovable',
          `try to go BEFORE the start ${i}`
        );
      }
      for (let i = 0; i < 3; ++i) {
        component.keyEvent(arrowRightEvent);
        expect(getMovableStatus()).toEqual(
          'unmovable',
          'go up to previous move'
        );
      }
      for (let i = 0; i < 20; ++i) {
        component.keyEvent(arrowRightEvent);
        expect(getMovableStatus()).toEqual(
          'movable',
          `try to go AFTER the start ${i}`
        );
      }
      component.keyEvent(arrowLeftEvent);
      expect(getMovableStatus()).toEqual(
        'unmovable',
        'go back from the start (again)'
      );
    });

    it('when it is another persons turn', () => {
      doMove('e2', 'e4');
      expect(getMovableStatus()).toEqual('unmovable', 'opponents turn');
      component.keyEvent(arrowLeftEvent);
      expect(getMovableStatus()).toEqual('unmovable', 'clearly');
      component.keyEvent(arrowRightEvent);
      expect(getMovableStatus()).toEqual('unmovable', 'opponents turn');

      doMove('e7', 'e5');
      expect(getMovableStatus()).toEqual('unmovable', 'teammates turn');
      component.keyEvent(arrowLeftEvent);
      expect(getMovableStatus()).toEqual('unmovable', 'clearly');
      component.keyEvent(arrowRightEvent);
      expect(getMovableStatus()).toEqual('unmovable', 'teammates turn');

      doMove('d2', 'd4');
      doMove('d7', 'd5');
      expect(getMovableStatus()).toEqual('movable', 'my turn');
      component.keyEvent(arrowLeftEvent);
      expect(getMovableStatus()).toEqual('unmovable', 'clearly');
      component.keyEvent(arrowRightEvent);
      expect(getMovableStatus()).toEqual('movable', 'my turn');
    });
  });

  describe('engine tests', () => {
    beforeEach(() => {
      commandService.deletePlayer('p2');
      commandService.deletePlayer('p3');
      nextMoveGetterProviderMock.verify(
        (x) => x.getNextMoveGetter(It.isAny()),
        Times.exactly(0)
      );
      commandService.addCPU('black');
    });

    it('engine is called correct amount of times', () => {
      doMove('e2', 'e4');
      getNextMoveMock.verify((x) => x.getMove(It.isAny()), Times.exactly(1));
      doMove('e7', 'e5');
      doMove('d2', 'd4');
      getNextMoveMock.verify((x) => x.getMove(It.isAny()), Times.exactly(2));
      expect(true).toBeTrue();
    });

    it('engine is called correct number on gameover', () => {
      doMove('e2', 'e4');
      getNextMoveMock.verify((x) => x.getMove(It.isAny()), Times.exactly(1));
      doMove('f7', 'f5');
      getNextMoveMock.verify((x) => x.getMove(It.isAny()), Times.exactly(1));
      doMove('e4', 'e5');
      getNextMoveMock.verify((x) => x.getMove(It.isAny()), Times.exactly(2));
      doMove('g7', 'g5');
      getNextMoveMock.verify((x) => x.getMove(It.isAny()), Times.exactly(2));
      doMove('d1', 'h5');
      getNextMoveMock.verify((x) => x.getMove(It.isAny()), Times.exactly(2));
      expect(true).toBeTrue();
    });

    it('rebuild counts', () => {
      nextMoveGetterProviderMock.verify(
        (x) => x.getNextMoveGetter(It.isAny()),
        Times.exactly(1)
      );
      expect(true).toBeTrue();
    });
  });
});
