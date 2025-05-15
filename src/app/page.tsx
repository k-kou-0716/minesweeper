'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [userInputs, setUserInputs] = useState<number[][]>([
    [4, 0, 0, 0, 0, 0, 0, 0, 0],
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

  //左クリック０（蓋），１（はてな），２（フラグ）～
  // const rigthclickHandler = (x: number, y: number) => {
  //   const newUserInputs = structuredClone(userInputs);
  //   newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
  //   setUserInputs(newUserInputs);
  // };

  //右クリック４（開ける）
  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = 4;
    setUserInputs(newUserInputs);
    //再帰関数（calcBoard===0なら）
    const newBombMap = structuredClone(bombMap);
    //一度だけ爆弾を設置
    if (bombMap.flat().filter((cell) => cell === 1).length === 0) {
      //ランダム
      const size = 9;
      let count = 0;
      while (count < 10) {
        const rx = Math.floor(Math.random() * size);
        const ry = Math.floor(Math.random() * size);
        if ((ry === y && rx === x) || newBombMap[ry][rx] === 1) {
          continue;
        }
        count += 1;
        newBombMap[ry][rx] = 1;
      }
    }
    setBombMap(newBombMap);
  };

  console.log(userInputs);
  console.log(bombMap);

  //周りの爆弾の数
  // const calcBoard = (userInputs: number[][], bombMap: number[][]) => {};

  //装飾の要素がばらばらでclickが反応しない→cssを勉強する
  //.mapのところを計算値にする
  // <div className={styles.frameTop} />
  //       <div className={styles.frameBottom} />
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {userInputs.map((row, y) =>
          row.map((cell, x) => {
            return (
              <div key={`${x}-${y}`} className={styles.cell} onClick={() => clickHandler(x, y)}>
                <div className={styles.design} style={{ backgroundPosition: `${-30}px` }} />
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
