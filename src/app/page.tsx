'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
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
  // const rigthclickHandler = (x: number, y: number) => {
  //   const newUserInputs = structuredClone(userInputs);
  //   newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
  //   setUserInputs(newUserInputs);
  // };
  //上を使って表示する

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
      //ランダム（最初に開けたところとその周りには置かない）
      const size = 9;
      let count = 0;
      while (count < 10) {
        const rx = Math.floor(Math.random() * size);
        const ry = Math.floor(Math.random() * size);
        for (const [dx, dy] of directions) {
          const nx = x + dx,
            ny = y + dy;
          if ((ry === y && rx === x) || (ry === ny && rx === nx) || newBombMap[ry][rx] === 1) {
            count -= 1;
          }
          count += 1;
          newBombMap[ry][rx] = 1;
        }
      }
    }
    setBombMap(newBombMap);
  };

  console.log(userInputs);
  console.log(bombMap);

  //userInputsとbombMapをもらう
  // const calcBoard = (userInputs: number[][], bombMap: number[][]) => {};
  //爆弾の周りをbombMap!==1のところ以外calcBoard+=1  ←これも状態が必要？
  //再帰関数（calcBoard===0が連続してたら0以外が来るまで開けるuserInputs===4）
  //userInputs==4のところはcalcBoardの数字を表示する
  //このときbombMap=1だったらゲームオーバー

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
