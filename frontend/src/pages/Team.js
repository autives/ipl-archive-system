import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "./Axios";

const TeamPage = () => {
  const [teamData, setTeamData] = useState([]);
  const [isErr, setIsErr] = useState("");
  const [playerImages, setPlayerImages] = useState({});
  const [isFetched, setIsFetched] = useState(false);
  const [teamImage, setTeamImage] = useState();
  const { id } = useParams();

  useEffect(() => {
    const getTeamData = async () => {
      try {
        const res = await axios.get(`/team?id=${id}`);
        setTeamData(res.data);

        const imgPromiseTeam = async () => {
          const resImage = await axios.get(
            `/image?path=${res.data.data["logo"]}`,
            {
              responseType: "arraybuffer",
            }
          );
          const imgBlob = new Blob([resImage.data], { type: "image/png" }); //here
          const imageObjectURL = URL.createObjectURL(imgBlob);
          setTeamImage(imageObjectURL);
        };
        imgPromiseTeam();
        
        const imgPromisePlayers = res.data["players"].map(async (player) => {
          const resImage = await axios.get(`/image?path=${player.photo}`, {
            responseType: "arraybuffer",
          });
          const imgBlob = new Blob([resImage.data], { type: "image/png" })
          const imageObjectURL = URL.createObjectURL(imgBlob);

          setPlayerImages((prevImages) => ({
            ...prevImages,
            [player.id]: imageObjectURL,
          }));
        });
        await Promise.all(imgPromisePlayers);  
        setIsFetched(true);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.header);
          setIsErr(error.message);
        } else {
          console.log("Error :" + error.message);
        }
      }
    };
    getTeamData();
  }, [id]);

  {
    isFetched && console.log(teamData);
  }

  return (
    <Container>
     {isFetched && (
      <TeamRow>
        <TeamColumn>
          <TeamHeader>
            <TeamLogo
              src={teamImage}
              alt="Team Logo"
            />
            <TeamName>{teamData.data.name}</TeamName>
          </TeamHeader>
        </TeamColumn>
        <TeamColumn>
          <TeamStatsCard
          >
            <CardContent>
            <StatTitle>Team Stats</StatTitle>
              <StatItem>
                <StatLabel>Player Count</StatLabel>
                <StatValue>{teamData.stats.playerCount}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Games Played</StatLabel>
                <StatValue>{teamData.stats.gamesPlayed}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Season Played</StatLabel>
                <StatValue>{teamData.stats.seasonsPlayed}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Games Won</StatLabel>
                <StatValue>{teamData.stats.gamesWon}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Season Won</StatLabel>
                <StatValue>{teamData.stats.seasonsWon}</StatValue>
              </StatItem>
            </CardContent>
          </TeamStatsCard>
        </TeamColumn>
      </TeamRow>
      )}
      {isFetched && (
      <PlayerRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SquadTitleContainer>
            <SquadTitle>SQUAD</SquadTitle>
          </SquadTitleContainer>
        </div>
        <PlayerGrid>
          {teamData &&
            teamData.players.map((player) => (
            <NavLink className="PlayerCard" key={player.id} to={`/players/${player.id}`}>
              <>
                <img
                  className="PlayerPhoto"
                  src={
                    playerImages[player.id]
                  }
                  alt={`${player.name}'s photo`}
                />
                <div className="PlayerName">
                  {player.name}
                </div>
              </>
              </NavLink>
            ))}
        </PlayerGrid>
      </PlayerRow>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  overflow: auto;
`;

const TeamRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center the content horizontally */
  align-items: center; /* Center the content vertically */
  margin-bottom: 20px;

  @media (min-width: 768px) {
    max-width: 900px; /* Set a maximum width for the content */
  }
`;

const TeamColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center; /* Center the content horizontally */
  padding: 30px 40px 0px 50px;
  // @media (min-width: 768px) {
    // width: 50%;
  // }
`;

const TeamHeader = styled.div`
  display: flex;
  align-items: center;
`;

const TeamLogo = styled.img`
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
`;

const TeamName = styled.h1`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 32px;
  max-width: 40px;
  padding: 0px 150px 0px 10px;
  opacity: 100;
`;

const TeamStatsCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  width: 350px;
  opacity: 0.7;
  box-shadow: ${({ isHovered }) =>
    isHovered ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none"};
  transition: box-shadow 0.3s ease-in-out;
  padding: 20px;
  flex: 1;
  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PlayerRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const SquadTitleContainer = styled.div`
  display: inline-block;
  background-color: rgb(10, 10, 107); /* Adjust the background color */
  border-radius: 10%; /* Add border styling */
  padding: 0.5rem; /* Add padding to create some space around the title */
  font-style: italic; /* Make the title italic */
  align-items: center;
  justify-contents: center;
  width: auto;
  opacity: 0.7;
`;

const SquadTitle = styled.h2`
  color: white;
  font-style: italic;
`;

const PlayerGrid = styled.div`
  padding-top: 2rem;
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(6, 20rem); /* Adjust the card width as needed */
  justify-content: center; /* Center the grids horizontally */
  grid-gap: 2rem; /* Adjust the gap between cards */
  .PlayerCard{
    width: 20rem;
    height: 25rem;
    // padding: 1.5rem;
    background-color: rgba(242, 242, 242, 0.5); /* Here, 0.5 is the opacity value */
    text-align: center;
    transition: transform 0.3s ease;
    border-radius: 10%;
    cursor: pointer; 
    &:hover {
      transform: scale(1.05);
    }
  
    .PlayerPhoto {
      width: 100%;
      height: auto;
      // border-radius: 50%;
    }
  
    .PlayerName {
      color: black;
      font-size: 20px;
      font-weight: bold;
      opacity: 0.7;
      margin-top: 2px;
    }
  }
`;

const CardContent = styled.div``;

const StatTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 20px;
`;

const StatLabel = styled.span`
  font-weight: bold;
  flex: 1;
`;

const StatValue = styled.span`
  flex: 1;
  text-align: right;
`;

export default TeamPage;
