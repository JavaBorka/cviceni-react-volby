import React from 'react';
import './style.css';

const Candidate = ({ name, avatar }) => (
  <div className="candidate">
    <h3 className="candidate__name">{name}</h3>
    <img className="candidate__avatar" src={avatar} />
    <button className="btn-vote">Vybrat</button>
  </div>
);

export default Candidate;