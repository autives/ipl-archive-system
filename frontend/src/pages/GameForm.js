import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "./Axios";
import { FaCheck } from "react-icons/fa";

const TickIcon = styled(FaCheck)`
  color: green;
  margin-left: 5px;
`;

const Container = styled.div`
    margin: 5px;
    align-items: center;
`;

const TeamContainer = styled.div`
    margin: 5px;
    width: 100%;
    float: left;
    padding: 20px;
    border-radius: 10px;
    border: 2px solid #000;
`

const FormContainer = styled.div`
    margin: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: auto;
    overflow: auto;
`;

const ContainerChild = styled.div`
    width: 50%;
    float: left;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const InningContainer = styled.div`
    width: 49%;
    float: left;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid #000;
    margin: 5px;
`

const InlineDiv = styled.div`
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%
`;

const InputLarge = styled.input`
    width: 200px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px;
`;

const Select = styled.select`
    padding: 5px;
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 3px;
`;

const Input = styled.input`
    width: 100px;
    padding: 5px;
    border-radius: 5px;
    margin: 3px;
`;

const Button = styled.button`
    padding: 5px 10px;
    margin: 5px 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 30px;
    height: 30px;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: rgba(200,100, 100,1);
  color: white;
  margin-top:1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const GameForm = () => {
    const [teamList, setTeamList] = useState([[], []])
    const [playingTeams, setPlayingTeams] = useState([]);
    const [playingTeamsData, setPlayingTeamsData] = useState([]);
    const [gameData, setGameData] = useState({
        gYear: null, gMonth: null, gDay: null, tossWon: null, firstBat: null, winner: null, venue: ""
    });
    const [innings, setInnings] = useState([
        {
            battingInnings: [{playerId: 0, runs:null, balls: null, sixes: null, fours: null, dotsPlayed: null, out: 'BOWLED'}],
            bowlingInnings: [{playerId: 0, balls: null, maidenOvers: null, runs: null, wicketsTaken: null, wides: null, noBalls: null, legBy: null, by: null}]
        },
        {
            battingInnings: [{playerId: 0, runs:null, balls: null, sixes: null, fours: null, dotsPlayed: null, out: 'BOWLED'}],
            bowlingInnings: [{playerId: 0, balls: null, maidenOvers: null, runs: null, wicketsTaken: null, wides: null, noBalls: null, legBy: null, by: null}]
        }
    ]);

    const [outMethods, setOutMethods] = useState([]);

    const [responseStatus, setResponseStatus] = useState(0);

    useEffect(() => {
        const FetchTeams = async () => {
            const res = await axios.get(`/teams`)
            const updatedTeamList = [...teamList];
            updatedTeamList[0] = res.data.teams;
            updatedTeamList[1] = JSON.parse(JSON.stringify(res.data.teams));
            setTeamList(updatedTeamList);
        }

        const GetOutMethods = async () => {
            const methods = await axios.get(`/getEnum?enum=WicketMethod`);
            setOutMethods(methods.data)
        }

        if(teamList[0].length <= 0) { FetchTeams(); }
        if(outMethods.length <= 0) { GetOutMethods(); }
    })

    const updatePlayingTeams = async (index, id) => {
        const updatedPlayingTeams = [...playingTeams];
        updatedPlayingTeams[index] = id === "select" ? null : teamList[index].find(team => team.id == id);

        const teamToChange = 1 - index;
        if(playingTeams.length >= index + 1 && playingTeams[index]) {
            const updatedTeamListIndexed = [...teamList[teamToChange].filter(item => item.id != id), playingTeams[index]];
            const updatedTeamList = [...teamList];
            updatedTeamList[teamToChange] = updatedTeamListIndexed
            setTeamList(updatedTeamList);
        } else {
            const updatedTeamListIndexed = [...teamList[teamToChange].filter(item => item.id != id)];
            const updatedTeamList = [...teamList];
            updatedTeamList[teamToChange] = updatedTeamListIndexed;
            setTeamList(updatedTeamList);
        }
        
        const updatedPlayingTeamsDataPromises = updatedPlayingTeams.map(async (team) => {
            const res = await axios.get(`/team?id=${team.id}`);
            return res.data;
        })

        Promise.all(updatedPlayingTeamsDataPromises).then(
            updatedPlayingTeamsData => {
                setPlayingTeamsData(updatedPlayingTeamsData);
            }
        ).catch(error => {console.error("Error occured when fetching team data ", error)})

        setPlayingTeams(updatedPlayingTeams);
    }

    const handleAddInning = (inningIndex, inningType) => {
        const updatedInnings = [...innings];
        const inningToUpdate = updatedInnings[inningIndex][inningType];

        const newInning = {
            battingInnings: {playerId: 0, runs:null, balls: null, sixes: null, fours: null, dotsPlayed: null, out: 'BOWLED'},
            bowlingInnings: {playerId: null, balls: null, maidenOvers: null, runs: null, wicketsTaken: null, wides: null, noBalls: null, legBy: null, by: null}
        };
        inningToUpdate.push(newInning[inningType]);
        setInnings(updatedInnings);
    };

    const handleRemoveInning = (inningIndex, inningType, index) => {
        const updatedInnings = [...innings];
        const inningToUpdate = updatedInnings[inningIndex][inningType];
        inningToUpdate.splice(index, 1);
        setInnings(updatedInnings);
    };

    const handleInputChange = (inningIndex, inningType, index, field, value) => {
        console.log(inningIndex, inningType, index, field, value)
        if(field === 'playerId') {
            const isPlayerAlreadySelected = innings[inningIndex][inningType].some(
                (inning, idx) => idx !== index && inning.playerId === value
            );
            if(isPlayerAlreadySelected) {
                return;
            }
        }
        const updatedInnings = [...innings];
        const inningToUpdate = updatedInnings[inningIndex][inningType];
        inningToUpdate[index][field] = value; 
        setInnings(updatedInnings);

        console.log(innings);
    };

    const handleGameDataChange = (key, value) => {
        const updatedGameData = {...gameData};
        console.log(key, value);
        updatedGameData[key] = key === "venue" ? value : parseInt(value);
        setGameData(updatedGameData);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = new FormData();
            data.append("table", "game");
            data.append("team1", playingTeams[0].id);
            data.append("team2", playingTeams[1].id);
            data.append("gYear", gameData.gYear);
            data.append("gMonth", gameData.gMonth);
            data.append("gDay", gameData.gDay);
            data.append("tossWon", gameData.tossWon);
            data.append("firstBat", gameData.firstBat);
            data.append("winner", gameData.winner);
            data.append("venue", gameData.venue);

            data.append("innings", JSON.stringify(innings));

            const headers = {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            };

            console.log(data);
            const res = await axios.post("/insert", data, { headers });
            setResponseStatus(res.status);
        } catch (error) {
            console.error(error.config);
        }
    }

    return ( teamList[0] &&
        <FormContainer>
            <h2>Multiple Inning Form</h2>
            
            <InlineDiv>
                <InputLarge 
                    value={gameData.gYear}
                    onChange={e => handleGameDataChange("gYear", parseInt(e.target.value))}
                    type='number'
                    min={1900}
                    max={2090}
                    placeholder='Year'
                />
                <InputLarge 
                    value={gameData.gMonth}
                    onChange={e => handleGameDataChange("gMonth", parseInt(e.target.value))}
                    type='number'
                    placeholder='Month'
                    min={1}
                    max={12}
                />
                <InputLarge 
                    value={gameData.gDay}
                    onChange={e => handleGameDataChange("gDay", parseInt(e.target.value))}
                    type='number'
                    placeholder='Day'
                    min={1}
                    max={32}
                />
                <InputLarge 
                    value={gameData.venue}
                    onChange={e => handleGameDataChange("venue", e.target.value)}
                    placeholder='Venue'
                />         
            </InlineDiv>

            <TeamContainer>
                <ContainerChild>
                    <Select
                        value={playingTeams.length >= 1 && playingTeams[0] ? playingTeams[0].id : "select"} onChange={e => updatePlayingTeams(0, parseInt(e.target.value))}>
                        <option value="select">Team 1</option>
                        {teamList[0].map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                </ContainerChild>

                <ContainerChild>
                    <Select
                        value={playingTeams.length >= 2 && playingTeams[1] ? playingTeams[1].id : "select"} onChange={e => updatePlayingTeams(1, parseInt(e.target.value))}>
                        <option value="select">Team 2</option>
                        {teamList[1].map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                </ContainerChild>
            </TeamContainer>

            {(playingTeams.length >= 2) && (
                <InlineDiv>
                    <Select
                        value={gameData.tossWon ? gameData.tossWon.id : "select"} onChange={e => handleGameDataChange('tossWon', e.target.value)}>
                        <option value="select">Toss Winner</option>
                        {playingTeams.map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                    <Select
                        value={gameData.firstBat ? gameData.firstBat.id : "select"} onChange={e => handleGameDataChange('firstBat', e.target.value)}>
                        <option value="select">First Batting</option>
                        {playingTeams.map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>

                    <Select
                        value={gameData.winner ? gameData.winner.id : "select"} onChange={e => handleGameDataChange('winner', e.target.value)}>
                        <option value="select">Winner</option>
                        {playingTeams.map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                </InlineDiv>
            )}

            {(playingTeams.length >= 2) && innings.map((inning, inningIndex) => (
                <InningContainer>
                    {Object.keys(inning).map(key => (
                        <Container key={key}>
                            <h3>{key}</h3>
                            <hr />
                            {inning[key].map((batorbowl, index) => (playingTeamsData[0] && playingTeamsData[1]) && (
                                <Container>
                                <Container key={`${key}${index}`}>
                                    <Select  
                                        value={batorbowl.playerId} onChange={e => handleInputChange(inningIndex, key, index, "playerId", parseInt(e.target.value))}>
                                        <option value="select">Player</option>
                                        {playingTeamsData[inningIndex] && playingTeamsData[inningIndex].players && (
                                            playingTeamsData[inningIndex].players.map(player => (
                                                <option key={player.id} value={player.id}>{player.name}</option>
                                            ))
                                        )}
                                    </Select>
                                    <Input 
                                        value={batorbowl.runs}
                                        onChange={e => handleInputChange(inningIndex, key, index, "runs", parseInt(e.target.value))}
                                        type='number'
                                        min={0}
                                        placeholder='Runs'
                                    />
                                    <Input 
                                        value={batorbowl.balls}
                                        onChange={e => handleInputChange(inningIndex, key, index, "balls", parseInt(e.target.value))}
                                        type='number'
                                        min={0}
                                        placeholder='Balls'
                                    />
                                    {key === 'battingInnings' && (<span>                                        
                                        <Input 
                                            value={batorbowl.sixes}
                                            onChange={e => handleInputChange(inningIndex, key, index, "sixes", parseInt(e.target.value))}
                                            type='number'
                                            min={0}
                                            placeholder='Sixes'
                                        />
                                        <Input 
                                            value={batorbowl.fours}
                                            onChange={e => handleInputChange(inningIndex, key, index, "fours", parseInt(e.target.value))}
                                            type='number'
                                            min={0}
                                            placeholder='Fours'
                                        />
                                        <Select  
                                            value={batorbowl.out} onChange={e => handleInputChange(inningIndex, key, index, "out", e.target.value)}>
                                            {outMethods.map(method => (
                                                <option value={method}>{method}</option>
                                            ))}
                                        </Select>                                     
                                    </span>)}
                                    {key === 'bowlingInnings' && (<span>
                                        <Input 
                                            value={batorbowl.maidenOvers}
                                            onChange={e => handleInputChange(inningIndex, key, index, "maidenOvers", parseInt(e.target.value))}
                                            min={0}
                                            type='number'
                                            placeholder='Maiden'
                                        />
                                        <Input 
                                            value={batorbowl.wicketsTaken}
                                            onChange={e => handleInputChange(inningIndex, key, index, "wicketsTaken", parseInt(e.target.value))}
                                            type='number'
                                            min={0}
                                            placeholder='Wickets'
                                        />
                                        <Input 
                                            value={batorbowl.wides}
                                            onChange={e => handleInputChange(inningIndex, key, index, "wides", parseInt(e.target.value))}
                                            min={0}
                                            type='number'
                                            placeholder='Wides'
                                        />
                                        <Input 
                                            value={batorbowl.noBalls}
                                            onChange={e => handleInputChange(inningIndex, key, index, "noBalls", parseInt(e.target.value))}
                                            type='number'
                                            min={0}
                                            placeholder='No Balls'
                                        />
                                        <Input 
                                            value={batorbowl.legBy}
                                            onChange={e => handleInputChange(inningIndex, key, index, "legBy", parseInt(e.target.value))}
                                            type='number'
                                            min={0}
                                            placeholder='Leg By'
                                        />
                                        <Input 
                                            value={batorbowl.by}
                                            onChange={e => handleInputChange(inningIndex, key, index, "by", parseInt(e.target.value))}
                                            type='number'
                                            min={0}
                                            placeholder='By'
                                        />
                                    </span>)}
                                    {(inning[key].length > 1) && (
                                        <InlineDiv><Button onClick={() => handleRemoveInning(inningIndex, key, index)}>-</Button></InlineDiv>
                                    )}
                                </Container>
                                <hr />
                                </Container>
                            ))}
                            <InlineDiv>
                                <Button onClick={() => handleAddInning(inningIndex, key)}>+</Button>
                            </InlineDiv>
                        <hr />
                        </Container>
                    ))}
                </InningContainer>
            ))}

            {(innings[0]['battingInnings'][0].playerId !== 0 &&
              innings[1]['battingInnings'][0].playerId !== 0 &&
              innings[0]['bowlingInnings'][0].playerId !== 0 &&
              innings[1]['bowlingInnings'][0].playerId !== 0) && (
                <StyledButton onClick={handleSubmit}>
                    Submit
                    {responseStatus === 200 && <TickIcon />}
                </StyledButton>
              )}
        </FormContainer>
    );
};

export default GameForm;
