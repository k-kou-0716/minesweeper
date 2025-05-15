'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [sampleCounter, setsampleCounter] = useState(0);
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

  //左クリック０（蓋），１（はてな），２（フラグ）～
  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
    setUserInputs(newUserInputs);
  };
  console.log(userInputs);
  setsampleCounter((sampleCounter + 1) % 14);

  //右クリック４（開ける）
  //再帰関数（calcBoard===0なら）

  //爆弾設置
  //userInputsに４があったら爆弾を配置
  if (userInputs.flat().filter((cell) => cell === 4).length === 1) {
    const newBombMap = structuredClone(bombMap);
    //ランダム

    setBombMap(newBombMap);
  }

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
                <div
                  className={styles.design}
                  style={{ backgroundPosition: `${-30 * sampleCounter}px` }}
                />
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
