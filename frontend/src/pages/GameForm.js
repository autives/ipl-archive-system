import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "./Axios";

const Container = styled.div`
    border: 3px solid #fff;
    padding: 20px;
    overflow: auto;
`

const ContainerChild = styled.div`
    width: 50%;
    float: left;
    padding: 20px;
    border: 2px solid red;
`

const Button = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
`;

const Input = styled.input`
    width: 70px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    .tiny {
        width:50px;
    }
`;

const InputLarge = styled.input`
    width: 200px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    .tiny {
        width:50px;
    }
`;

const Select = styled.select`
    width: 150px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const InlineDiv = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    select,
    input {
        margin-right: 10px;
    }
`;

const GameForm = () => {
    const [teamList, setTeamList] = useState([[], []])
    const [playingTeams, setPlayingTeams] = useState([]);
    const [playingTeamsData, setPlayingTeamsData] = useState([]);
    const [gameData, setGameData] = useState({
        gYear: 2023, gMonth: 8, gDay: 25, tossWon: {}, firstBat: {}, winner: {}, venue: ""
    });
    const [innings, setInnings] = useState([
        {
            battingInnings: [{playerId: 0, runs: 0, balls: 0, sixes: 0, fours: 0, dotsPlayed: 0, out: 'BOWLED'}],
            bowlingInnings: [{playerId: 0, balls: 0, maidenOvers: 0, runs: 0, wicketsTaken: 0, wides: 0, noBalls: 0, legBy: 0, by: 0}]
        },
        {
            battingInnings: [{playerId: 0, runs: 0, balls: 0, sixes: 0, fours: 0, dotsPlayed: 0, out: 'BOWLED'}],
            bowlingInnings: [{playerId: 0, balls: 0, maidenOvers: 0, runs: 0, wicketsTaken: 0, wides: 0, noBalls: 0, legBy: 0, by: 0}]
        }
    ]);

    const [outMethods, setOutMethods] = useState([]);

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
            battingInnings: {playerId: 0, runs: 0, balls: 0, sixes: 0, fours: 0, dotsPlayed: 0, out: 'BOWLED'},
            bowlingInnings: {playerId: 0, balls: 0, maidenOvers: 0, runs: 0, wicketsTaken: 0, wides: 0, noBalls: 0, legBy: 0, by: 0}
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
    };

    const handleGameDataChange = (key, value) => {
        const updatedGameData = {...gameData};
        updatedGameData[key] = value;
        setGameData(updatedGameData);
    }

    return ( teamList[0] &&
        <Container>
            <h2>Multiple Inning Form</h2>
            
            <InlineDiv>
                <InputLarge 
                    value={gameData.gYear}
                    onChange={e => handleGameDataChange("gYear", e.target.value)}
                    type='number'
                    min={1900}
                    max={2090}
                />
                <InputLarge 
                    value={gameData.gMonth}
                    onChange={e => handleGameDataChange("gMonth", e.target.value)}
                    type='number'
                    
                    min={1}
                    max={12}
                />
                <InputLarge 
                    value={gameData.gDay}
                    onChange={e => handleGameDataChange("gDay", e.target.value)}
                    type='number'
                    
                    min={1}
                    max={32}
                />
                <InputLarge 
                    value={gameData.venue}
                    onChange={e => handleGameDataChange("venue", e.target.value)}
                    placeholder='Venue'
                />         
            </InlineDiv>
            <Container>
                <ContainerChild>
                    <label htmlFor='team1'>Team 1</label>
                    <Select
                        id='team1'
                        value={playingTeams.length >= 1 && playingTeams[0] ? playingTeams[0].id : "select"} onChange={e => updatePlayingTeams(0, e.target.value)}>
                        <option value="select">Select</option>
                        {teamList[0].map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                </ContainerChild>

                <ContainerChild>
                    <label htmlFor='team2'>Team 2</label>
                    <Select
                        id='team2'
                        value={playingTeams.length >= 2 && playingTeams[1] ? playingTeams[1].id : "select"} onChange={e => updatePlayingTeams(1, e.target.value)}>
                        <option value="select">Select</option>
                        {teamList[1].map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                </ContainerChild>
            </Container>

            {(playingTeams.length >= 2) && (<div>
                <InlineDiv>
                    <Select>
                        value={gameData.tossWon.id} onChange={e => handleGameDataChange('tossWon', e.target.value)}
                        {playingTeams.map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                    <Select>
                        value={gameData.firstBat.id} onChange={e => handleGameDataChange('firstBat', e.target.value)}
                        {playingTeams.map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>

                    <Select>
                        value={gameData.winner.id} onChange={e => handleGameDataChange('winner', e.target.value)}
                        {playingTeams.map((team) => (
                            <option value={team.id}>{team.abbrev}</option>
                        ))}
                    </Select>
                </InlineDiv>
            </div>)}

            {innings.map((inning, inningIndex) => (
                <ContainerChild>
                    {Object.keys(inning).map(key => (
                        <div key={key}>
                            <h3>{key}</h3>

                            {inning[key].map((batorbowl, index) => (playingTeamsData[0] && playingTeamsData[1]) && (
                                <Container>
                                <p>{`${key}${index}`}</p>
                                <InlineDiv key={`${key}${index}`}>
                                    <Select  
                                        value={batorbowl.playerId} onChange={e => handleInputChange(inningIndex, key, index, "playerId", e.target.value)}>
                                        <option value="select">Select</option>
                                        {playingTeamsData[inningIndex] && playingTeamsData[inningIndex].players && (
                                            playingTeamsData[inningIndex].players.map(player => (
                                                <option key={player.id} value={player.id}>{player.name}</option>
                                            ))
                                        )}
                                    </Select>
                                    <Input 
                                        value={batorbowl.runs}
                                        onChange={e => handleInputChange(inningIndex, key, index, "runs", e.target.value)}
                                        type='number'
                                        min={0}
                                        
                                    />
                                    <Input 
                                        value={batorbowl.balls}
                                        onChange={e => handleInputChange(inningIndex, key, index, "balls", e.target.value)}
                                        type='number'
                                        min={0}
                                        
                                    />
                                    {key === 'battingInnings' && (<div>                                        
                                        <Input 
                                            value={batorbowl.sixes}
                                            onChange={e => handleInputChange(inningIndex, key, index, "sixes", e.target.value)}
                                            type='number'
                                            min={0}
                                            
                                        />
                                        <Input 
                                            value={batorbowl.fours}
                                            onChange={e => handleInputChange(inningIndex, key, index, "fours", e.target.value)}
                                            type='number'
                                            min={0}
                                            
                                        />
                                        <Select  
                                            value={batorbowl.out} onChange={e => handleInputChange(inningIndex, key, index, "out", e.target.value)}>
                                            {outMethods.map(method => (
                                                <option value={method}>{method}</option>
                                            ))}
                                        </Select>                                     
                                    </div>)}
                                    {key === 'bowlingInnings' && (<div>
                                        <Input 
                                            value={batorbowl.maidenOvers}
                                            onChange={e => handleInputChange(inningIndex, key, index, "maidenOvers", e.target.value)}
                                            min={0}
                                            type='number'
                                            
                                        />
                                        <Input 
                                            value={batorbowl.wicketsTaken}
                                            onChange={e => handleInputChange(inningIndex, key, index, "wicketsTaken", e.target.value)}
                                            type='number'
                                            min={0}
                                            
                                        />
                                        <Input 
                                            value={batorbowl.wides}
                                            onChange={e => handleInputChange(inningIndex, key, index, "wides", e.target.value)}
                                            min={0}
                                            type='number'
                                            
                                        />
                                        <Input 
                                            value={batorbowl.noBalls}
                                            onChange={e => handleInputChange(inningIndex, key, index, "noBalls", e.target.value)}
                                            type='number'
                                            min={0}
                                            
                                        />
                                        <Input 
                                            value={batorbowl.legBy}
                                            onChange={e => handleInputChange(inningIndex, key, index, "legBy", e.target.value)}
                                            type='number'
                                            min={0}
                                            
                                        />
                                        <Input 
                                            value={batorbowl.by}
                                            onChange={e => handleInputChange(inningIndex, key, index, "by", e.target.value)}
                                            type='number'
                                            min={0}
                                            
                                        />
                                    </div>)}
                                    {(inning[key].length > 1) && (
                                        <Button onClick={() => handleRemoveInning(inningIndex, key, index)}>-</Button>
                                    )}
                                </InlineDiv>
                                </Container>
                            ))}
                            <Button onClick={() => handleAddInning(inningIndex, key)}>+</Button>
                        </div>
                    ))}
                </ContainerChild>
            ))}
        </Container>
    );
};

export default GameForm;
