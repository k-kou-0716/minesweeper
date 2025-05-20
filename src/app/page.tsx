'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const size = 9;

  const [userInputs, setUserInputs] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [bombMap, setBombMap] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const directions = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  //右クリック０（蓋），１（はてな），２（フラグ）～
  const rigthclickHandler = (x: number, y: number, e: React.MouseEvent) => {
    e.preventDefault();
    //空いたところは触らない
    const newUserInputs = structuredClone(userInputs);
    if (newUserInputs[y][x] === 4) return;
    newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
    setUserInputs(newUserInputs);
  };

  //左クリック４（開ける）
  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    //蓋（０）のところ以外開けない
    if (newUserInputs[y][x] !== 0) return;
    newUserInputs[y][x] = 4;
    setUserInputs(newUserInputs);

    //一度だけ爆弾を設置
    const newBombMap = structuredClone(bombMap);
    if (bombMap.flat().filter((cell) => cell === 1).length === 0) {
      //ランダム（最初に開けたところには置かない//9の所はレベルで変える
      let count = 0;
      while (count < 10) {
        const rx = Math.floor(Math.random() * 9);
        const ry = Math.floor(Math.random() * 9);
        if ((ry === y && rx === x) || newBombMap[ry][rx] === 1) {
          continue;
        }
        count += 1;
        newBombMap[ry][rx] = 1;
      }
    }
    setBombMap(newBombMap);
  };

  //userInputsとbombMapをもらう
  const calcBoard = (userInputs: number[][], bombMap: number[][]) => {
    const board: number[][] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    //全マス八方向見て爆弾の数を数える//9の所はレベルで変える
    //forをmapにする
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (bombMap[y][x] === 1) {
          //爆弾＋マーク
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
          //数字＋マーク
          board[y][x] = count + (userInputs[y][x] + 8) * 100;
        }
      }
    }

    //再帰関数（calcBoard===800が連続してたら800以外が来るまで開ける
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
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (board[y][x] === 1200) {
          zeroCheck(x, y);
        }
      }
    }

    //このときbombMap=1だったらゲームオーバ、爆弾のマスを全部開ける、爆発したところを赤くする
    //1211があったら終了、cssで赤くする、爆弾の位置を4
    if (board.flat().includes(1211)) {
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (bombMap[y][x] === 1) {
            //終了爆弾開示
            board[y][x] += 400;
          }
        }
      }
    }
    return board;
  };

  console.log(userInputs);
  console.log(bombMap);
  console.log(calcBoard(userInputs, bombMap));

  return (
    <div className={styles.container}>
      <div className={styles.board} style={{ width: 30 * size + 40, height: 30 * size + 120 }}>
        <div className={styles.frameTop} style={{ width: 30 * size + 12 }} />
        <div
          className={styles.frameBottom}
          style={{ width: 30 * size + 12, height: 30 * size + 12 }}
        />
        <div className={styles.gameBoard} style={{ width: 30 * size, height: 30 * size }}>
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
