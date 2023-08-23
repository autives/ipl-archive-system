import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import axios from "./Axios";
import { FaCheck } from 'react-icons/fa';

const TickIcon = styled(FaCheck)`
  color: green;
  margin-left: 5px;
`;

const Title= styled.h2`
    font-size:2rem;
    margin:1rem;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position:relative;
  height: 92.5%;
  background-color: #f0f6fd;
`;

const Form = styled.form`
  background-color: white;
  border-radius: 10px;
  padding-top:0px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
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



function  PlayerForm () {
    const [name, setName] = useState("");
    const [bYear, setbYear] = useState(2000);
    const [country, setCountry] = useState("");
    const [playerType, setPlayerType] = useState("");
    const [battingType, setBattingType] = useState("");
    const [bowlingType, setBowlingType] = useState("");
    const [image, setImage] = useState();
    const [id, setId] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [responseStatus,setResponseStatus]=useState(0);
    const [teamData, setTeamData] = useState([]);
    const [isErr, setIsErr] = useState("");

    const [enums, setEnums] = useState({});
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
      const GetEnums = async () => {
        const playerAff = await axios.get(`/getEnum?enum=PlayerAffinity`);
        setEnums((prev) => ({
            ...prev,
            "PlayerAffinity": playerAff.data,
        }));

        const battingAff = await axios.get(`/getEnum?enum=BattingAffinity`);
        setEnums((prev) => ({
            ...prev,
            "BattingAffinity": battingAff.data,
        }));

        const bowlingAff = await axios.get(`/getEnum?enum=BowlingAffinity`);
        setEnums((prev) => ({
            ...prev,
            "BowlingAffinity": bowlingAff.data,
        }));
        setIsFetched(true)
      }

      GetEnums();
      const getTeamData = async () => {
        try {
          const res = await axios.get(`/teams`);
          setTeamData(res.data["teams"]);
            }
           catch (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.header);
            setIsErr(error.message);
          } else {
            console.log("Error :"+`${error.message}`);
          }
        }
      };
      getTeamData();

    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = new FormData();
            data.append('table', 'players')
            data.append('name', name);
            data.append('bYear', bYear);
            data.append('country', country);
            data.append('playerAffinity', playerType);
            data.append('battingAffinity', battingType);
            data.append('bowlingAffinity', bowlingType);
            data.append('image', image)
            data.append('id',id);

            console.log("hello");
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            };
            const res = await axios.post('/insert', data, {headers});
            console.log(res.status);
            setResponseStatus(res.status);
            // const res = await axios.post('/addPlayer', {name: "hello"});
        }
        catch (error) {
            console.error(error.config);
        }
        
    }

    const handleImageChange = e => {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
  
      if (selectedImage) {
        const imageUrl = URL.createObjectURL(selectedImage);
        setImageUrl(imageUrl);
      }
    };
    
    {isFetched && (console.log(teamData))}

    return (
        isFetched && ( 
        <Container>

          <Form>
          <Title>
                Player Form
            </Title>
            <StyledInput
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
            />
    
            <StyledInput
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="Country"
            />
    
            <StyledInput
              value={bYear}
              onChange={e => setbYear(e.target.value)}
              type="number"
              placeholder="Birth Year"
            />
    
            <StyledSelect
              value={playerType}
              onChange={e => setPlayerType(e.target.value)}
            >
              <option value="">Select Player Type</option>
              {enums.PlayerAffinity.map(aff => (
                <option key={aff} value={aff}>{aff}</option>
              ))}
            </StyledSelect>
    
            <StyledSelect
              value={battingType}
              onChange={e => setBattingType(e.target.value)}
            >
              <option value="">Select Batting Type</option>
              {enums.BattingAffinity.map(aff => (
                <option key={aff} value={aff}>{aff}</option>
              ))}
            </StyledSelect>
    
            <StyledSelect
              value={bowlingType}
              onChange={e => setBowlingType(e.target.value)}
            >
              <option value="">Select Bowling Type</option>
              {enums.BowlingAffinity.map(aff => (
                <option key={aff} value={aff}>{aff}</option>
              ))}
            </StyledSelect>

            <StyledSelect
              value={id}
              onChange={e => setId(e.target.value)}
            >
              <option value="">Team</option>
              {teamData.map(team => (
                <option key={team.id} value={team.id}>{team.abbrev}</option>
              ))}
            </StyledSelect>
    
            <input
              type="file"
              onChange={handleImageChange}
            />
            {image && <ImagePreview src={URL.createObjectURL(image)} alt="Preview" />}

            <StyledButton onClick={handleSubmit}>
          Submit
          {responseStatus === 200 && <TickIcon />}
        </StyledButton>
          </Form>
        </Container>
      )
    );
}

export default PlayerForm