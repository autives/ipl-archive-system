import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import BattingCard from '../components/BattingCard';
import BowlingCard from "../components/BowlingCard";
import ToggleButton from '../components/Toggle';
import axios from './Axios';
import { useParams } from 'react-router-dom';

const MainContainer = styled.div`
    display : flex;
    justify-content : center;
    background
}
`;

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: repeat(2, 1fr);
`

const Left_box = styled.div`
    padding : 6rem 10rem 6rem 0rem;
    justify-content: center;
    flex-direction : column;
    align-items: center;
    display : flex;
`
const PlayerInfo = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: repeat(2, 1fr);
    border-bottom: 2px solid grey;
   
    > div:not(:last-child),
    > h3:not(:last-child):not(:nth-last-child(2)){
        border-bottom: 2px solid grey;
        padding-top: .5rem;
        padding-bottom: .5rem;
        color: white;
    }
    .PlayerName {
        max-width: 50rem;
        grid-column: 1 / span 2;
    
        .Name {
          font-size: 5rem;
          color: white;
          opacity: 0.75;
          font-weight: 500;
          text-transform: uppercase;
        };
      
      }
      .Affinity {
        max-width: 5rem;  
        padding-top: .5rem;
        padding-bottom: .5rem;
        color: white;  
    }


`

const Right_box = styled.div`
    padding : 0rem 0rem 0rem 15rem;
    justify-content: center;
    // flex-direction : column;
    grid-template-row: repeat(2, 1fr);
    align-items: center;
    display : grid;
    //background : ${({theme}) => theme.colors.bg};
    height : 55rem;
    width: 55rem;
    border-radius : 10%;
    opacity : .7;
`

const Photo = styled.img`
    width : auto;
    height : 50rem;
    margin-left : auto;
    transition: transform 1s ease;
    &:hover {
        transform: scale(1.05);
        }
`
const ButtonContainer = styled.div`
    display : flex;
    height: 4rem;
    width: auto;
    padding : 0rem 0rem 0rem 5.1rem;
    flex-direction: row;
    align-items: flex-start; 
    background : "transparent";
    > *:not(:last-child) {
        margin-right: 0;
      }
`
const PlayerStat = styled.div`
    display : flex;
    flex-direction : column;
    justify-content: center;
    height: 51rem;
    width: 55rem;
    align-items: center;
    background : ${({theme}) => theme.colors.activeColor};
    border-radius: 10%;
`

function Players() {
    const [playerData, setPlayerData]= useState([]);
    const [isErr, setIsErr] = useState("");
    const [isFetched, setIsFetched] = useState(false);
    const [image, setImage] = useState();
    const { id } = useParams();
    
    useEffect ( () => {
        const getPlayerData = async () => {
            try{
                const res = await axios.get(`/player?id=${id}`); 
                setPlayerData(res.data);
                console.log(res.data)

                const imgPromise = async () => {
                    const resImage = await axios.get(`/image?path=${res.data.data["photo"]}`, {
                    responseType: "arraybuffer",
                    });
                    const imgBlob = new Blob([resImage.data], { type: "image/png" });
                    const imageObjectURL = URL.createObjectURL(imgBlob);
        
                    setImage(imageObjectURL);
                };

                imgPromise();
                setIsFetched(true);
            } catch(error) {
                if(error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.header);
                setIsErr(error.message);
                } else {
                    console.log('Error :' + error.message)
                }
            }
            
        }
        getPlayerData();
    }, [id]);

    const [showBatting, setShowBatting] = useState(true);
    const toggleCard = (isBatting) => {
        setShowBatting(isBatting);
    };
    {isFetched && (console.log(playerData))}
    return (
    <MainContainer>
    {isErr !== "" && <h2>{isErr}</h2>}
    {isFetched && (
    <Container>
        <Left_box>
            <Photo src = {image} alt="haina hola" />
            <PlayerInfo>
            <div className= "PlayerName">
            <h2 className='Name'>{playerData.data.name}</h2>
            </div>
            <h3 className='Country'>Country:</h3>
            <h3 className='Country'>{playerData.data.country}</h3>
            <h3 className='YOB'>YOB:</h3>
            <h3 className='YOB'>{playerData.data.bYear}</h3>
            <h3 className='Affinity'>Role:</h3>
            <h3 className='Affinity'>{playerData.data.playerAffinity}</h3>
            </PlayerInfo>
        </Left_box>
        <Right_box>
        <ButtonContainer>
            <ToggleButton active = {showBatting} onClick={() => toggleCard(true)} label="Batting" />
            <ToggleButton active = {!showBatting} onClick={() => toggleCard(false)} label="Bowling" />
        </ButtonContainer>
        <PlayerStat>
        {(showBatting) ? <BattingCard battingStats={playerData.battingStats} /> : <BowlingCard bowlingStats={playerData.bowlingStats} />}
        </PlayerStat>
        </Right_box>
    </Container>
    )}
    </MainContainer>
  )
};

export default Players;