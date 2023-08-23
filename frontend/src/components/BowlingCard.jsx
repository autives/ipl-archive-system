import React from "react";
import { styled } from "styled-components";

const Player_stat = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;

  row-gap: 1rem;
  padding: 0.5rem 0rem 0.5rem 0rem;
  grid-template-columns: repeat(2, 1fr);
  .Title {
    // max-width: 50rem;
    // word-break: break-word;
    grid-column: 1 / span 2;
    padding: 0rem 0rem 1.5rem 0rem;
  }
  .Stat {
    text-align: left;
  }
  .Haina_hola {
    padding: 0rem 0rem 0rem 4rem;
  }
  .Milestone {
    text-transform: lowercase;
  }
`;

function BowlingCard(props) {
  const { bowlingStats } = props;
  return (
    <Player_stat>
      <div className="Title">
        <h2 className="Stat">Bowling Stats</h2>
      </div>
      <h3>Innings:</h3>
      <h3 className="Haina_hola">{bowlingStats.innings}</h3>
      <h3>Runs:</h3>
      <h3 className="Haina_hola">{bowlingStats.runs}</h3>
      <h3>Wickets:</h3>
      <h3 className="Haina_hola">{bowlingStats.wickets}</h3>
      <h3>Maiden Overs:</h3>
      <h3 className="Haina_hola">{bowlingStats.maidenOvers}</h3>
      <h3>Extras:</h3>
      <h3 className="Haina_hola">{bowlingStats.extras}</h3>
      <h3>Average:</h3>
      <h3 className="Haina_hola">{bowlingStats.average}</h3>
      <h3>Economy:</h3>
      <h3 className="Haina_hola">{bowlingStats.economy}</h3>
    </Player_stat>
  );
}

export default BowlingCard;
