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
  // const [bombMap, setBombMap] = useState<number[][]>([
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // ]);

  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    setsampleCounter((sampleCounter + 1) % 14);
    console.log(sampleCounter);
    console.log(x, y);
    setUserInputs(newUserInputs);
  };
  //装飾の要素がばらばらでclickが反応しない→cssを勉強する
  //.mapのところを計算値にする
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <div className={styles.frameTop} />
        <div className={styles.frameBottom} />
        {userInputs.map((row, y) =>
          row.map((color, x) => {
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
