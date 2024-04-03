import * as React from 'react'
import type { Card } from './parse-template.js';

// <div class="bg-white">
//   <div class="flex justify-center items-center min-h-screen min-w-full">
//         <div class="flex relative">
//             <div class="w-72 h-40 bg-green-400 transform transition-all skew-x-12 -skew-y-12 absolute rounded-lg">

//             </div>
//             <div class="w-72 h-40 bg-yellow-400 transform transition-all skew-x-12 -skew-y-12 absolute -top-4 -left-4 rounded-lg">
    
//             </div>
//             <div class="w-72 h-40 bg-red-400 transform transition-all skew-x-12 -skew-y-12 absolute -top-8 -left-8 rounded-lg">
    
//             </div>
//             <div class="w-72 h-40 bg-black transform transition-all skew-x-12 -skew-y-12 absolute -top-12 -left-12 rounded-lg">
    
//             </div>
//             <div class="w-72 h-40 bg-purple-400 transform transition-all skew-x-12 -skew-y-12 absolute -top-16 -left-16 rounded-lg">
//             </div>
//             <div class="w-72 h-40 bg-white flex justify-center items-center border-2 border-black transform transition-all skew-x-12 -skew-y-12 absolute -top-20 -left-20 rounded-lg">
//               Hello there! This is your crad<br>
//               foo
//                             Hello there! This is your crad<br>
//               foo
//                             Hello there! This is your crad<br>
//               foo

//               foo
//                             Hello there! This is your crad<br>
//               foo
//                             Hello there! This is your crad<br>
//               foo
//             </div>
//         </div>
//     </div>
// </div>

export const CurrentCard: React.FC<{ card: Card; }> = ({ card }) => (
  <div className="card">
    <h2 className="card-text">{card.text}</h2>
    {card.category && <h3 className="card-category">{card.category}</h3>}
  </div>
);

export const NoCard: React.FC = () => (
  <p>There is no card to display (yet).</p>
);

export const DisplayedCard: React.FC<{ card: Card | null; }> = ({ card }) => (
  card ? <CurrentCard card={card}/> : <NoCard/>
);