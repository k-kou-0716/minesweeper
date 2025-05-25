'use client';

import { useState } from 'react';
import styles from './page.module.css';

// 定数は外で定義
const HEIGHT = 9;
const WIDTH = 9;
const BOMBCOUNT = 10;

// userInputsとbombMapをもらう
function calcBoard(
  userInputs: number[][],
  bombMap: number[][],
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
  const board: number[][] = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => 0),
  );

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (bombMap[y][x] === 1) {
        board[y][x] = 11 + (userInputs[y][x] + 8) * 100;
      } else {
        let count = 0;
        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;
          if (board[ny] !== undefined && board[ny][nx] !== undefined && bombMap[ny][nx] === 1) {
            count += 1;
          }
        }
        board[y][x] = count + (userInputs[y][x] + 8) * 100;
      }
    }
  }

  const zeroCheck = (x: number, y: number) => {
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (board[ny] !== undefined && board[ny][nx] !== undefined && board[ny][nx] < 1200) {
        if (board[ny][nx] % 100 !== 0) {
          board[ny][nx] += 400;
        } else {
          board[ny][nx] += 400;
          zeroCheck(nx, ny);
        }
      }
    }
  };
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x] === 1200) {
        zeroCheck(x, y);
      }
    }
  }

  if (board.flat().includes(1211)) {
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (bombMap[y][x] === 1) {
          board[y][x] += 400;
        }
      }
    }
  }
  return board;
}

export default function Home() {
  // ユーザーの入力
  const [userInputs, setUserInputs] = useState<number[][]>(
    Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => 0)),
  );
  // 爆弾の配置
  const [bombMap, setBombMap] = useState<number[][]>(
    Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => 0)),
  );

  //右クリック０（蓋），１（はてな），２（フラグ）～
  const rigthclickHandler = (x: number, y: number, e: React.MouseEvent) => {
    e.preventDefault();
    const newUserInputs = structuredClone(userInputs);
    if (newUserInputs[y][x] === 4) return;
    newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
    setUserInputs(newUserInputs);
  };

  //左クリック４（開ける）
  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    if (newUserInputs[y][x] !== 0) return;
    newUserInputs[y][x] = 4;
    setUserInputs(newUserInputs);

    //爆弾を設置
    const newBombMap = structuredClone(bombMap);
    if (bombMap.flat().filter((cell) => cell === 1).length === 0) {
      let count = 0;
      while (count < BOMBCOUNT) {
        const rx = Math.floor(Math.random() * WIDTH);
        const ry = Math.floor(Math.random() * HEIGHT);
        if ((ry === y && rx === x) || newBombMap[ry][rx] === 1) {
          continue;
        }
        count += 1;
        newBombMap[ry][rx] = 1;
      }
    }
    setBombMap(newBombMap);
  };

  const bombNumber = BOMBCOUNT - userInputs.flat().filter((cell) => cell === 2).length;

  // リセット時
  const smileHandler = () => {
    const newUserInputs = structuredClone(userInputs);
    const newBombMap = structuredClone(bombMap);
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        newUserInputs[y][x] = 0;
        newBombMap[y][x] = 0;
      }
    }
    setUserInputs(newUserInputs);
    setBombMap(newBombMap);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board} style={{ width: 30 * WIDTH + 40, height: 30 * HEIGHT + 120 }}>
        <div className={styles.frameTop} style={{ width: 30 * WIDTH + 12 }} />
        <div
          className={styles.frameBottom}
          style={{ width: 30 * WIDTH + 12, height: 30 * HEIGHT + 12 }}
        />
        <div
          className={styles.smile}
          onClick={smileHandler}
          onMouseDown={(e) => e.currentTarget.classList.add(styles.pressed)}
          onMouseUp={(e) => e.currentTarget.classList.remove(styles.pressed)}
          onMouseLeave={(e) => e.currentTarget.classList.remove(styles.pressed)}
        >
          <div
            className={styles.design}
            style={{
              backgroundPosition: calcBoard(userInputs, bombMap).flat().includes(1211)
                ? '-390px'
                : '-330px',
            }}
          />
        </div>
        <div className={styles.time} />
        <div className={styles.bombNumber} style={{ color: 'red' }}>
          {bombNumber}
        </div>
        <div className={styles.gameBoard} style={{ width: 30 * WIDTH, height: 30 * HEIGHT }}>
          {calcBoard(userInputs, bombMap).map((row, y) =>
            row.map((cell, x) => {
              return (
                <div
                  key={`${x}-${y}`}
                  className={`${styles.cell} ${cell < 1200 ? styles.designBlank : ''}`}
                  //開けて爆弾のところは1611、自動で開いた爆弾は1211
                  style={{ background: cell === 1611 ? 'red' : '' }}
                  onClick={
                    calcBoard(userInputs, bombMap).flat().includes(1211)
                      ? undefined
                      : () => clickHandler(x, y)
                  }
                  onContextMenu={
                    calcBoard(userInputs, bombMap).flat().includes(1211)
                      ? undefined
                      : (e) => rigthclickHandler(x, y, e)
                  }
                >
                  <div
                    className={styles.design}
                    style={{
                      backgroundPosition:
                        //空いたら数字か爆弾を表示
                        cell >= 1200
                          ? `${-30 * (cell % 100) + 30}px`
                          : //閉じてたら旗かはてなを表示
                            cell >= 900
                            ? //ここを27にしないとなぜかズレる(designBlankのboderを消すとズレない)、いずれ解明する
                              `${-30 * Math.floor(cell / 100) + 27}px`
                            : //何も表示しない
                              cell >= 800
                              ? `30px`
                              : undefined,
                    }}
                  />
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
