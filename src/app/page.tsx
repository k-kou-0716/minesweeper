// 'use client';

// import { useState } from 'react';
// import styles from './page.module.css';

// export default function Home() {
//   const [sampleCounter, setsampleCounter] = useState(0);
//   const [userInputs, setUserInputs] = useState<number[][]>([
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   ]);
//   const [bombMap, setBombMap] = useState<number[][]>([
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   ]);
//   const calcBoard = (userInputs: number[][], bombMap: number[][]) => {
//     const newUserInputs = structuredClone(userInputs);
//     newUserInputs[y][x] += 1;
//     setUserInputs(userInputs)
//     return newUserInputs;
//   };

//   const clickHandler = (x: number, y: number) => {
//     calcBoard(userInputs, bombMap)
//     };
//   };

//   // const calcUserInputs = (userInputs: number[][]) => {
//   //   const newUserInputs = structuredClone(userInputs);
//   //   setsampleCounter((sampleCounter + 1) % 7);
//   //   setUserInputs(newUserInputs);
//   // };

//   // const clickHandler = (x: number, y: number) => {
//   //   const newUserInputs = structuredClone(userInputs);
//   //   newUserInputs[x][y] += 1;
//   //   setUserInputs(newUserInputs);
//   //   console.log(x, y);
//   // };

//   // const clickHandler = (x: number, y: number) => {
//   //   const newUserInputs = structuredClone(userInputs);
//   //   setsampleCounter((sampleCounter + 1) % 14);
//   //   console.log(sampleCounter);
//   //   console.log(x, y);
//   //   setUserInputs(newUserInputs);
//   // };

//   //装飾の要素がばらばらでclickが反応しない→cssを勉強する
//   //.mapのところを計算値にする
//   // <div className={styles.frameTop} />
//   //       <div className={styles.frameBottom} />
//   return (
//     <div className={styles.container}>
//       <div className={styles.board}>
//         {calcBoard(userInputs, bombMap).map((row, y) =>
//           row.map((cell, x) => {
//             return (
//               <div key={`${x}-${y}`} className={styles.cell} onClick={() => clickHandler(x, y)}>
//                 <div
//                   className={styles.design}
//                   style={{ backgroundPosition: cell === 30 ? `${-30 * sampleCounter + 30}px` : '' }}
//                 />
//               </div>
//             );
//           }),
//         )}
//       </div>
//     </div>
//   );
// }
