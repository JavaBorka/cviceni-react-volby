import { useState, useEffect } from 'react';
import Candidate from './Candidate';
import candidate01 from './assets/candidate01.png'
import candidate02 from './assets/candidate02.png'
import candidate03 from './assets/candidate03.png'
import candidate04 from './assets/candidate04.png'

import './index.css';

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [president, setPresident] = useState(null);

  useEffect(() => setCandidates([
    { name: "Ferdinand Mravenec", avatar: candidate01 },
    { name: "Markéta Smetana", avatar: candidate02 },
    { name: "Beáta Skočdopolová", avatar: candidate03 },
    { name: "Lubomír Poňuchálek", avatar: candidate04 },
  ]), []);
  
  const handleVote = (name) => {
    setPresident(name)
  }

  return (
    <div className="container">
      <div className="castle">
        <div className="castle__image"></div>
        <div className="castle__body">
          <h1>Nový prezident</h1>
          <p className="castle__president">
            {
              president === null ? 'Vyberte svého kandidáta' : president
            }
          </p>
        </div>
      </div>
      
      <h2>Kandidáti</h2>
      <div className="candidate-list">
        {candidates.map((c) => (
          <Candidate 
            key={c.name}
            name={c.name} 
            avatar={c.avatar}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};

export default App
