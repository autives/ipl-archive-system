import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import axios from "./Axios";
import { FaCheck } from "react-icons/fa";
import SearchBar from '../components/SearchBar';

const TickIcon = styled(FaCheck)`
  color: green;
  margin-left: 5px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 1rem;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  background-color: #f0f6fd;
`;

const Form = styled.form`
  background-color: white;
  border-radius: 10px;
  position:relative;
  padding-top: 0px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
`;
const StyledNumberInput = styled.input`
  width: 100%;
  padding: 8px;
//   margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  appearance: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledInputa = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ImagePreview = styled.img`
  max-width: 1;
  height: 10rem;
  margin-top: 15px;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: rgba(200, 100, 100, 1);
  color: white;
  margin-top: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const DateInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const DateInputLabel = styled.label`
  //   margin-left: 5px;
  font-size: 14px;
`;

const FlexRowContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top:0px;
`;

const CheckboxLabel = styled.label`
  margin-left: 5px;
  font-size: 14px;
`;

function SeasonForm() {
  const [num, setNum] = useState();
  const [orangeCap, setOrangeCap] = useState();
  const [purpleCap, setPurpleCap] = useState();
  const [mostValued, setMostValued] = useState();
  const [fairPlay, setFairPlay] = useState();
  const [responseStatus, setResponseStatus] = useState(0);

  const [teamList, setTeamList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  
  useEffect(() => {
    const FetchTeams = async () => {
        const res = await axios.get(`/teams`)
        setTeamList(res.data.teams);
    }
    const FetchPlayers = async () => {
        const res = await axios.get(`/players`)
        setPlayerList(res.data);
    }

    if(teamList.length <= 0) { FetchPlayers(); }
    if(teamList.length <= 0) { FetchTeams(); }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      const data = new FormData();
      data.append("table", "seasons");
      data.append("num", num);
      data.append("orangeCap", orangeCap);
      data.append("purpleCap", purpleCap);
      data.append("mostValued", mostValued);
      data.append("fairPlay", fairPlay);

      const headers = {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      };
      const res = await axios.post("/insert", data, { headers });
      setResponseStatus(res.status);
    } catch (error) {
      console.error(error.config);
    }
  };


  return (
    (teamList && playerList) && (
      <Container>
        <Form>
        <Title>Season Form</Title>
            <StyledInput
                value={num}
                type="number"
                onChange={(e) => setNum(parseInt(e.target.value))}
                placeholder="Number"
            />

            <StyledSelect value={fairPlay} onChange={(e) => setFairPlay(parseInt(e.target.value))}>
                <option value="">Fair Play</option>
                {teamList.map((team) => (
                    <option key={team.id} value={team.id}>
                        {team.abbrev}
                    </option>
                ))}
            </StyledSelect>

            <StyledSelect value={orangeCap} onChange={(e) => setOrangeCap(parseInt(e.target.value))}>
                <option value="">Orange Cap</option>
                {playerList.map((player) => (
                    <option key={player.id} value={player.id}>
                        {player.name}
                    </option>
                ))}
            </StyledSelect>

            <StyledSelect value={purpleCap} onChange={(e) => setPurpleCap(parseInt(e.target.value))}>
                <option value="">Purple Cap</option>
                {playerList.map((player) => (
                    <option key={player.id} value={player.id}>
                        {player.name}
                    </option>
                ))}
            </StyledSelect>
            
            <StyledSelect value={mostValued} onChange={(e) => setMostValued(parseInt(e.target.value))}>
                <option value="">Most Valued</option>
                {playerList.map((player) => (
                    <option key={player.id} value={player.id}>
                        {player.name}
                    </option>
                ))}
            </StyledSelect>

          <StyledButton onClick={handleSubmit}>
            Submit
            {responseStatus === 200 && <TickIcon />}
          </StyledButton>
        </Form>
      </Container>
    )
  );
}

export default SeasonForm;
