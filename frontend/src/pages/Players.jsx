import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import BattingCard from "../components/BattingCard";
import BowlingCard from "../components/BowlingCard";
import ToggleButton from "../components/Toggle";
import axios from "./Axios";
import { useParams } from "react-router-dom";
import {useNavigate} from 'react-router-dom'

const MainContainer = styled.div`
    display : flex;
    justify-content : center;
    padding-top:0rem;
}
`;

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
`;

const Left_box = styled.div`
  padding: 3.2rem 10rem 6rem 0rem;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  display: flex;
`;
const PlayerInfo = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  border-bottom: 2px solid grey;

  > div:not(:last-child),
  > h3:not(:last-child):not(:nth-last-child(2)) {
    border-bottom: 2px solid grey;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    color: white;
  }
  .PlayerName {
    max-width: 50rem;
    min-width: 30rem;
    grid-column: 1 / span 2;
    .Name {
      font-size: 5rem;
      color: white;
      opacity: 0.75;
      font-weight: 500;
      text-transform: uppercase;
    }
  }
  .Affinity {
    max-width: 5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    color: white;
  }
`;
const Right_box = styled.div`
  padding: 0rem 0rem 0rem 15rem;
  justify-content: center;
  // flex-direction : column;
  grid-template-row: repeat(2, 1fr);
  align-items: center;
  display: grid;
  //background : ${({ theme }) => theme.colors.bg};
  height: 55rem;
  width: 55rem;
  border-radius: 10%;
  opacity: 0.7;

  .button {
    background-color: #e74c3c;
    color: white;
    padding: 10px 20px;
    height:2rem;
    width:4rem;
    border: none;
    border-radius: 5px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    &:hover {
      background-color: #c0392b;
      transform: scale(1.05);
    }
`;

const Photo = styled.img`
  width: auto;
  height: 50rem;
  margin-left: auto;
  transition: transform 1s ease;
  &:hover {
    transform: scale(1.05);
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  height: 4rem;
  width: auto;
  padding: 0rem 0rem 0rem 5.1rem;
  flex-direction: row;
  align-items: flex-start;
  background: "transparent";
  > *:not(:last-child) {
    margin-right: 0;
  }
`;
const PlayerStat = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 51rem;
  width: 55rem;
  align-items: center;
  background: ${({ theme }) => theme.colors.activeColor};
  border-radius: 10%;
`;

const DeleteButton = styled.button`
  background-color: white;
  opacity:1;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.8rem;
  cursor: pointer;
  text-color:black;
  margin-top:2rem;
  width:30%;
  justify-self: end;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: grey;
    transform: scale(1.05);
  }
`;

function Players() {
  const [playerData, setPlayerData] = useState([]);
  const [isErr, setIsErr] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [image, setImage] = useState();
  const { id } = useParams();
  const [isConfirmed, setIsConfirmed]= useState(false);
  const [isDeleted, setIsDeleted]=useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getPlayerData = async () => {
      try {
        const res = await axios.get(`/player?id=${id}`);
        setPlayerData(res.data);
        console.log(res.data);

        const imgPromise = async () => {
          const resImage = await axios.get(
            `/image?path=${res.data.data["photo"]}`,
            {
              responseType: "arraybuffer",
            }
          );
          const imgBlob = new Blob([resImage.data], { type: "image/png" });
          const imageObjectURL = URL.createObjectURL(imgBlob);

          setImage(imageObjectURL);
        };

        imgPromise();
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
    getPlayerData();
  }, [id]);

  const [showBatting, setShowBatting] = useState(true);
  const toggleCard = (isBatting) => {
    setShowBatting(isBatting);
  };
  {
    isFetched && console.log(playerData);
  }

  const battingStats = playerData.battingStats || {
    runs: 0,
    strikeRate: 0,
    average: 0,
    balls: 0,
    sixes: 0,
    fours: 0,
    innings: 0,
    fifties: 0,
    centuries: 0,
    notOut: 0,
  };
  const bowlingStats = playerData.bowlingStats || {
    innings: 0,
    overs: 0,
    runs: 0,
    maidenOvers: 0,
    wickets: 0,
    extras: 0,
    average: 0,
    economy: 0,
  };

  const handleDeleteClick = async (event) => {
    event.preventDefault();
    const Confirmed = window.confirm('Are you sure you want to delete this item?');
    // setIsConfirmed(Confirmed);

    if(Confirmed){
        try {
            // Perform the delete action here
            // You can add your delete logic
            const res = await axios.post('/delete', playerData.data.id)
            console.log(res.status);
            setIsDeleted(res.status);
    
            // After successful deletion, navigate to the home page
            if (res.status === 200) {
              navigate('/');
            }
          } catch (error) {
            // Handle errors here if needed
            console.error('Error deleting item:', error);
          }
    }
  };
  return (
    <MainContainer>
      {isErr !== "" && <h2>{isErr}</h2>}
      {isFetched && (
        <>
        <Container>
          <Left_box>
            <Photo src={image} alt="haina hola" />
            <PlayerInfo>
              <div className="PlayerName">
                <h2 className="Name">{playerData.data.name}</h2>
              </div>
              <h3 className="Country">Country:</h3>
              <h3 className="Country">{playerData.data.country}</h3>
              <h3 className="YOB">YOB:</h3>
              <h3 className="YOB">{playerData.data.bYear}</h3>
              <h3 className="Affinity">Role:</h3>
              <h3 className="Affinity">{playerData.data.playerAffinity}</h3>
            </PlayerInfo>
          </Left_box>
          <Right_box>
            <ButtonContainer>
              <ToggleButton
                active={showBatting}
                onClick={() => toggleCard(true)}
                label="Batting"
              />
              <ToggleButton
                active={!showBatting}
                onClick={() => toggleCard(false)}
                label="Bowling"
              />
            </ButtonContainer>
            <PlayerStat>
              {showBatting ? (
                <BattingCard battingStats={battingStats} />
              ) : (
                <BowlingCard bowlingStats={bowlingStats} />
              )}
            </PlayerStat>
            <DeleteButton classname ="button" onClick={handleDeleteClick}>Delete Player</DeleteButton>
          </Right_box>
        </Container>

          </>
      )}
    </MainContainer>
  );
}

export default Players;
