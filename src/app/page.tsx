'use client';

import { useState } from 'react';
import styles from './page.module.css';

//カスタムの初期値
const DEFAULT_CUSTOM_HEIGHT = 10;
const DEFAULT_CUSTOM_WIDTH = 10;
const DEFAULT_CUSTOM_BOMBCOUNT = 15;

//難易度の種類を定義
type level = 'easy' | 'normal' | 'hard';
type gameMode = level | 'custom';

//難易度の設定の定義
interface gameModeSetting {
  height: number;
  width: number;
  bombs: number;
  levelName: string;
}

//難易度ごと設定
const GAMEMODE_SETTINGS: Record<gameMode, gameModeSetting> = {
  easy: { height: 9, width: 9, bombs: 10, levelName: '初級' },
  normal: { height: 16, width: 16, bombs: 40, levelName: '中級' },
  hard: { height: 16, width: 30, bombs: 99, levelName: '上級' },
  custom: {
    height: DEFAULT_CUSTOM_HEIGHT,
    width: DEFAULT_CUSTOM_WIDTH,
    bombs: DEFAULT_CUSTOM_BOMBCOUNT,
    levelName: 'カスタム',
  },
};
//inputHなどを使わないと数字を入力したらすぐに盤面が変わってしまうので、適用しないと変わらないようにするため
//盤面サイズの定義
interface boardSizeState {
  height: number;
  width: number;
  inputH: string;
  inputW: string;
}
//爆弾数の定義
interface bombCountState {
  count: number;
  inputB: string;
}

//計算値
function calcBoard(
  userInputs: number[][],
  bombMap: number[][],
  currentHeight: number,
  currentWidth: number,
  directions = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ],
) {
  const board: number[][] = Array.from({ length: currentHeight }, () =>
    Array.from({ length: currentWidth }, () => 0),
  );

  //盤面の計算
  for (let y = 0; y < currentHeight; y++) {
    for (let x = 0; x < currentWidth; x++) {
      if (bombMap[y][x] === 1) {
        board[y][x] = 11 + (userInputs[y][x] + 8) * 100;
      } else {
        let count = 0;
        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            ny >= 0 &&
            ny < currentHeight &&
            nx >= 0 &&
            nx < currentWidth &&
            bombMap[ny][nx] === 1
          ) {
            count += 1;
          }
        }
        board[y][x] = count + (userInputs[y][x] + 8) * 100;
      }
    }
  }

  //再帰関数  boardSizeが70×70近くになると落ちる
  const zeroCheck = (x: number, y: number) => {
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        ny >= 0 &&
        ny < currentHeight &&
        nx >= 0 &&
        nx < currentWidth &&
        board[ny][nx] !== undefined &&
        board[ny][nx] < 1200
      ) {
        if (board[ny][nx] % 100 !== 0) {
          board[ny][nx] += 400;
        } else {
          board[ny][nx] += 400;
          zeroCheck(nx, ny);
        }
      }
    }
  };
  for (let y = 0; y < currentHeight; y++) {
    for (let x = 0; x < currentWidth; x++) {
      if (board[y][x] === 1200) {
        zeroCheck(x, y);
      }
    }
  }

  //爆弾が開かれた場合、爆弾の位置に400を加算
  if (board.flat().includes(1211)) {
    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        if (bombMap[y][x] === 1) {
          board[y][x] += 400;
        }
      }
    }
  }
  return board;
}

//時計を作る

//右か左クリックされたら時計スタート

//リセット、難易度変更、更新で時計ストップ

export default function Home() {
  //ユーザー操作
  const [userInputs, setUserInputs] = useState<number[][]>(() =>
    Array.from({ length: GAMEMODE_SETTINGS.easy.height }, () =>
      Array.from({ length: GAMEMODE_SETTINGS.easy.width }, () => 0),
    ),
  );
  //爆弾位置
  const [bombMap, setBombMap] = useState<number[][]>(() =>
    Array.from({ length: GAMEMODE_SETTINGS.easy.height }, () =>
      Array.from({ length: GAMEMODE_SETTINGS.easy.width }, () => 0),
    ),
  );
  //級選択
  const [selectedMode, setSelectedMode] = useState<gameMode>('easy');

  //盤面サイズ
  const [boardSize, setboardSize] = useState<boardSizeState>({
    height: GAMEMODE_SETTINGS.easy.height,
    width: GAMEMODE_SETTINGS.easy.width,
    inputH: String(GAMEMODE_SETTINGS.easy.height),
    inputW: String(GAMEMODE_SETTINGS.easy.width),
  });

  //爆弾数
  const [bombCount, setbombCount] = useState<bombCountState>({
    count: GAMEMODE_SETTINGS.easy.bombs,
    inputB: String(GAMEMODE_SETTINGS.easy.bombs),
  });

  //時計

  //盤面データとゲームオーバー状態を計算
  //ゲームクリアを作る
  const calcBoardDate = calcBoard(userInputs, bombMap, boardSize.height, boardSize.width);
  const GameOver = calcBoardDate.flat().includes(1211);
  // const GameClear

  //盤面リセット
  const resetBoard = (height: number, width: number, count: number) => {
    setboardSize({ height, width, inputH: String(height), inputW: String(width) });
    setbombCount({ count, inputB: String(count) });
    setUserInputs(Array.from({ length: height }, () => Array.from({ length: width }, () => 0)));
    setBombMap(Array.from({ length: height }, () => Array.from({ length: width }, () => 0)));
  };

  // 難易度変更
  const modeChangeClickHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //as~として扱う（使いすぎ注意）理解あさい
    const newMode = e.target.value as gameMode;
    setSelectedMode(newMode);

    if (newMode !== 'custom') {
      resetBoard(
        GAMEMODE_SETTINGS[newMode].height,
        GAMEMODE_SETTINGS[newMode].width,
        GAMEMODE_SETTINGS[newMode].bombs,
      );
    } else {
      //ここを入力値にする
      resetBoard(DEFAULT_CUSTOM_HEIGHT, DEFAULT_CUSTOM_WIDTH, DEFAULT_CUSTOM_BOMBCOUNT);
    }
  };

  //カスタム設定更新,リセット
  const resetClickHandler = () => {
    //カスタム設定更新
    if (selectedMode === 'custom') {
      //ここ綺麗にできそう
      const heightInput = Number(boardSize.inputH),
        widthInput = Number(boardSize.inputW),
        bombsInput = Number(bombCount.inputB);
      //カスタムの範囲指定bombsInputを<=にするには再帰関数を直さなければいけない
      if (
        1 <= heightInput &&
        heightInput <= 100 &&
        1 <= widthInput &&
        widthInput <= 100 &&
        1 <= bombsInput &&
        bombsInput < heightInput * widthInput
      ) {
        resetBoard(heightInput, widthInput, bombsInput);
      } else {
        alert('規格外です。');
      }
    } else {
      //リセット
      resetBoard(
        GAMEMODE_SETTINGS[selectedMode].height,
        GAMEMODE_SETTINGS[selectedMode].width,
        GAMEMODE_SETTINGS[selectedMode].bombs,
      );
    }
  };

  // 右クリック処理
  const rightClickHandler = (x: number, y: number, e: React.MouseEvent) => {
    //メニューを開かない
    e.preventDefault();
    if (GameOver || userInputs[y][x] === 4) return;
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
    setUserInputs(newUserInputs);
  };

  // 左クリック処理
  const clickHandler = (x: number, y: number) => {
    if (GameOver || userInputs[y][x] === 4) return;

    const newBombMap = structuredClone(bombMap);
    if (!newBombMap.flat().some((cell) => cell === 1)) {
      let count = 0;

      while (count < bombCount.count) {
        const rx = Math.floor(Math.random() * boardSize.width);
        const ry = Math.floor(Math.random() * boardSize.height);
        if ((ry === y && rx === x) || newBombMap[ry][rx] === 1) continue;
        count++;
        newBombMap[ry][rx] = 1;
      }
      setBombMap(newBombMap);
    }

    const newUserInputs = structuredClone(userInputs);
    if (newUserInputs[y][x] !== 0) return;
    newUserInputs[y][x] = 4;
    setUserInputs(newUserInputs);
  };

  //残り爆弾数
  const bombNumberDisplay = bombCount.count - userInputs.flat().filter((cell) => cell === 2).length;

  return (
    <div className={styles.container}>
      <div>
        <select value={selectedMode} onChange={modeChangeClickHandler}>
          <option value="easy">初級</option>
          <option value="normal">中級</option>
          <option value="hard">上級</option>
          <option value="custom">カスタム</option>
        </select>
        {selectedMode === 'custom' && (
          <div>
            <label>
              幅:{' '}
              <input
                type="number"
                value={boardSize.inputW}
                onChange={(e) => setboardSize((p) => ({ ...p, inputW: e.target.value }))}
                style={{ width: '50px' }}
              />
            </label>
            <label>
              高さ:{' '}
              <input
                type="number"
                value={boardSize.inputH}
                onChange={(e) => setboardSize((p) => ({ ...p, inputH: e.target.value }))}
                style={{ width: '50px' }}
              />
            </label>
            <label>
              爆弾:{' '}
              <input
                type="number"
                value={bombCount.inputB}
                onChange={(e) => setbombCount((p) => ({ ...p, inputB: e.target.value }))}
                style={{ width: '50px' }}
              />
            </label>
            <button onClick={resetClickHandler} style={{ marginLeft: '10px' }}>
              更新
            </button>
          </div>
        )}
      </div>

      <div
        className={styles.board}
        style={{
          width: 30 * boardSize.width + 40,
          height: 30 * boardSize.height + 120,
        }}
      >
        <div className={styles.frameTop} style={{ width: 30 * boardSize.width + 12 }} />
        <div
          className={styles.frameBottom}
          style={{
            width: 30 * boardSize.width + 12,
            height: 30 * boardSize.height + 12,
          }}
        />
        <div className={styles.smile} onClick={resetClickHandler}>
          <div
            className={styles.design}
            style={{ backgroundPosition: GameOver ? '-390px' : '-330px' }}
          />
        </div>
        <div className={styles.time} />
        <div className={styles.bombNumberDisplay} style={{ color: 'red' }}>
          {bombNumberDisplay}
        </div>
        <div
          className={styles.gameBoard}
          style={{ width: 30 * boardSize.width, height: 30 * boardSize.height }}
        >
          {calcBoardDate.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${cell < 1200 ? styles.cover : ''}`}
                style={{ background: cell === 1611 ? 'red' : '' }}
                onClick={GameOver ? undefined : () => clickHandler(x, y)}
                onContextMenu={GameOver ? undefined : (e) => rightClickHandler(x, y, e)}
              >
                <div
                  className={styles.design}
                  style={{
                    backgroundPosition:
                      cell >= 1200
                        ? `${-30 * (cell % 100) + 30}px`
                        : cell >= 900
                          ? `${-30 * Math.floor(cell / 100) + 27}px`
                          : cell >= 800
                            ? `30px`
                            : undefined,
                  }}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
