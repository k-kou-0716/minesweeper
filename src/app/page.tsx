'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

//やること
//一つの関数に機能を詰めすぎている=>分割する(calcBoard、leftClickHandler、resetClickHandler)
//マジックナンバーを消す=>cellの状態を定義する、もしくは、cellにタプル型？などを利用し、2つの情報を入れる
//型を制限して不自由にする
//見た目が悪い=>時計、爆弾の残数の素材を拾ってくる
//動作が重い=>どうしたら改善するのかよくわからない、再帰関数かcalcBoard

//カスタムの初期値
const DEFAULT_CUSTOM_HEIGHT = 10;
const DEFAULT_CUSTOM_WIDTH = 10;
const DEFAULT_CUSTOM_BOMBCOUNT = 15;

//難易度の種類を定義
type Level = 'easy' | 'normal' | 'hard';
type GameMode = Level | 'custom';

//難易度の設定の定義
interface GameModeSetting {
  height: number;
  width: number;
  bombs: number;
  levelName: string;
}

//難易度ごと設定 GameModeがkeyとなり対応する物を持ってくる
const GAMEMODE_SETTINGS: Record<GameMode, GameModeSetting> = {
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

//盤面サイズの定義
interface BoardSize {
  height: number;
  width: number;
  inputHeight: string;
  inputWidthidth: string;
}

//爆弾数の定義
interface BombCount {
  count: number;
  inputBombs: string;
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
  const openZeroCheck = (x: number, y: number) => {
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
          openZeroCheck(nx, ny);
        }
      }
    }
  };
  for (let y = 0; y < currentHeight; y++) {
    for (let x = 0; x < currentWidth; x++) {
      if (board[y][x] === 1200) {
        openZeroCheck(x, y);
      }
    }
  }

  //爆弾が開かれた場合、爆弾の位置に400を足す
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
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('easy');

  //盤面サイズ
  const [boardSize, setBoardSize] = useState<BoardSize>({
    height: GAMEMODE_SETTINGS.easy.height,
    width: GAMEMODE_SETTINGS.easy.width,
    inputHeight: String(GAMEMODE_SETTINGS.easy.height),
    inputWidthidth: String(GAMEMODE_SETTINGS.easy.width),
  });

  //爆弾数
  const [bombCount, setBombCount] = useState<BombCount>({
    count: GAMEMODE_SETTINGS.easy.bombs,
    inputBombs: String(GAMEMODE_SETTINGS.easy.bombs),
  });

  //カウントアップ
  const [timeCount, setTimeCount] = useState(0);

  //盤面データ
  const calculatedBoardData = calcBoard(userInputs, bombMap, boardSize.height, boardSize.width);

  //開けた爆弾がないか
  const isGameOver =
    calculatedBoardData.flat().includes(1211) || calculatedBoardData.flat().includes(1611);
  //残りのマス目が爆弾の数と同じか（爆弾の数 = 全マス + 開けて爆弾だったマス - 開けたマス）
  const isGameClear =
    bombCount.count ===
    boardSize.height * boardSize.width +
      calculatedBoardData.flat().filter((cell) => cell === 1211 || cell === 1611).length -
      calculatedBoardData.flat().filter((cell) => cell >= 1200).length;

  useEffect(() => {
    // ゲームが進行中かどうか
    const isGameInProgress =
      bombMap.flat().some((cell) => cell === 1) && !isGameOver && !isGameClear;

    // ゲームが進行中ならタイマーを開始する
    if (isGameInProgress) {
      const timerId = setInterval(() => {
        setTimeCount((prevCount) => prevCount + 1);
      }, 1000);

      //前のタイマーが残り続けないように消す
      return () => {
        clearInterval(timerId);
      };
    }
    // bombMap, isGameOver, isGameClearの状態が変わるたびに更新
  }, [bombMap, isGameOver, isGameClear]);

  //盤面リセット
  const resetBoard = (height: number, width: number, count: number) => {
    setBoardSize({ height, width, inputHeight: String(height), inputWidthidth: String(width) });
    setBombCount({ count, inputBombs: String(count) });
    setUserInputs(Array.from({ length: height }, () => Array.from({ length: width }, () => 0)));
    setBombMap(Array.from({ length: height }, () => Array.from({ length: width }, () => 0)));
    setTimeCount(0);
  };

  // 難易度変更
  const changeModeClickHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //as~として扱う（使いすぎ注意）理解あさい
    const newGameMode = e.target.value as GameMode;
    setSelectedGameMode(newGameMode);

    if (newGameMode !== 'custom') {
      resetBoard(
        GAMEMODE_SETTINGS[newGameMode].height,
        GAMEMODE_SETTINGS[newGameMode].width,
        GAMEMODE_SETTINGS[newGameMode].bombs,
      );
    } else {
      resetBoard(DEFAULT_CUSTOM_HEIGHT, DEFAULT_CUSTOM_WIDTH, DEFAULT_CUSTOM_BOMBCOUNT);
    }
  };

  //カスタム設定更新,リセット
  const resetClickHandler = () => {
    //カスタム設定更新
    if (selectedGameMode === 'custom') {
      //ここ綺麗にできそう
      //入力値
      const heightInput = Number(boardSize.inputHeight),
        widthInput = Number(boardSize.inputWidthidth),
        bombsInput = Number(bombCount.inputBombs);
      //場合によってalertを変える
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
        GAMEMODE_SETTINGS[selectedGameMode].height,
        GAMEMODE_SETTINGS[selectedGameMode].width,
        GAMEMODE_SETTINGS[selectedGameMode].bombs,
      );
    }
  };

  // 右クリック処理
  const rightClickHandler = (x: number, y: number, e: React.MouseEvent) => {
    //メニューを開かない
    e.preventDefault();
    if (userInputs[y][x] === 4) return;
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
    setUserInputs(newUserInputs);
  };

  // 左クリック処理
  const leftClickHandler = (x: number, y: number) => {
    if (userInputs[y][x] === 4) return;

    const newBombMap = structuredClone(bombMap);
    if (!newBombMap.flat().some((cell) => cell === 1)) {
      setTimeCount(0);

      //爆弾を初期設置
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
        <select value={selectedGameMode} onChange={changeModeClickHandler}>
          <option value="easy">初級</option>
          <option value="normal">中級</option>
          <option value="hard">上級</option>
          <option value="custom">カスタム</option>
        </select>
        {selectedGameMode === 'custom' && (
          <div>
            <label>
              幅:{' '}
              <input
                type="number"
                value={boardSize.inputWidthidth}
                onChange={(e) => setBoardSize((p) => ({ ...p, inputWidthidth: e.target.value }))}
                style={{ width: '50px' }}
              />
            </label>
            <label>
              高さ:{' '}
              <input
                type="number"
                value={boardSize.inputHeight}
                onChange={(e) => setBoardSize((p) => ({ ...p, inputHeight: e.target.value }))}
                style={{ width: '50px' }}
              />
            </label>
            <label>
              爆弾:{' '}
              <input
                type="number"
                value={bombCount.inputBombs}
                onChange={(e) => setBombCount((p) => ({ ...p, inputBombs: e.target.value }))}
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
            style={{
              backgroundPosition: isGameOver ? '-390px' : isGameClear ? '-360px' : '-330px',
            }}
          />
        </div>
        <div className={styles.time} style={{ color: 'red' }}>
          {timeCount}
        </div>
        <div className={styles.bombNumberDisplay} style={{ color: 'red' }}>
          {bombNumberDisplay}
        </div>
        <div
          className={styles.gameBoard}
          style={{ width: 30 * boardSize.width, height: 30 * boardSize.height }}
        >
          {calculatedBoardData.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${cell < 1200 ? styles.cover : ''}`}
                style={{ background: cell === 1611 ? 'red' : '' }}
                onClick={isGameOver || isGameClear ? undefined : () => leftClickHandler(x, y)}
                onContextMenu={
                  isGameOver || isGameClear ? undefined : (e) => rightClickHandler(x, y, e)
                }
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
