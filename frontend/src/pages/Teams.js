import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import axios from "./Axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const TeamGrid = styled.div`
  padding-top: 8rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 4rem;
  .TeamCard {
    width: 30rem;
    height: 33rem;
    padding: 1.5rem;
    background-color: #f2f2f2;
    text-align: center;
    transition: transform 0.3s ease;
    border-radius : 3%;
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
      }
    .Name, .Desc {
      color: black;
    }
`;

const TeamLogo = styled.img`
  width: 15rem;
  height: 10rem;
  margin-bottom: 1rem;
  border-radius: 3%
  overflow : hidden; 
`;

function Teams() {
  const [teamData, setTeamData] = useState([]);
  const [isErr, setIsErr] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  // const { id } = useParams();
  useEffect(() => {
    const getTeamData = async () => {
      try {
        // if(!playerData){
        const res = await axios.get(`/teams`);
        setTeamData(res.data);
        setIsFetched(true);
        // }
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.header);
          setIsErr(error.message);
        } else {
          console.log("Error : ${error.message}");
        }
      }
    };
    getTeamData();
  }, []);

  return (
    <Container>
      {isFetched === true && (
        <TeamGrid>
          {teamData.map((team) => (
            <NavLink className="TeamCard" key={team.id} to={`/team/${team.id}`}>
              <>
                <TeamLogo src={team.logo} alt={team.name} />
                <h3 class="Name">{team.name}</h3>
                <p class="Desc">{team.description}</p>
              </>
            </NavLink>
          ))}
        </TeamGrid>
      )}
    </Container>
  );
}

export default Teams;
