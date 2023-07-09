import React from "react";
import { styled } from "styled-components";

const Player_stat = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;

  row-gap: 0.5rem;
  padding: 0.5rem 0rem 0.5rem 0rem;
  grid-template-columns: repeat(2, 1fr);
  .Title {
    // max-width: 50rem;
    // word-break: break-word;
    grid-column: 1 / span 2;
    padding: 0rem 0rem 2rem 0rem;
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

function BowlingCard() {
  return (
    <Player_stat>
      <div className="Title">
        <h2 className="Stat">Bowling Stats</h2>
      </div>
      <h3>Innings Played:</h3>
      <h3 className="Haina_hola">69</h3>
      <h3>Total Runs:</h3>
      <h3 className="Haina_hola">845</h3>
      <h3>Balls Played:</h3>
      <h3 className="Haina_hola">500</h3>
      <h3>Strike Rate:</h3>
      <h3 className="Haina_hola">169.56</h3>
      <h3>Not outs:</h3>
      <h3 className="Haina_hola">17</h3>
      <h3>Average:</h3>
      <h3 className="Haina_hola">70</h3>
      <h3 className="Milestone">50s:</h3>
      <h3 className="Haina_hola">17</h3>
      <h3 className="Milestone">100s:</h3>
      <h3 className="Haina_hola">5</h3>
      <h3>Sixes:</h3>
      <h3 className="Haina_hola">70</h3>
      <h3>Strike Rate:</h3>
      <h3 className="Haina_hola">adgfasdlfk</h3>
      <h3>Not Out:</h3>
      <h3 className="Haina_hola">100</h3>
    </Player_stat>
  );
}

export default BowlingCard;
