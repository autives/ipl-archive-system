import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import axios from "./Axios";
import { FaCheck } from "react-icons/fa";

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
  padding-top: 0px;
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

function TeamForm() {
  const [teamname, setTeamName] = useState("");
  const [owner, setOwner] = useState("");
  const [abbrev, setAbbrev] = useState("");
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [responseStatus, setResponseStatus] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      data.append("table", "teams");
      data.append("name", teamname);
      data.append("owner", owner);
      data.append("abbrev", abbrev);
      data.append("logo", image);

      console.log("hello");
      const headers = {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      };
      const res = await axios.post("/insert", data, { headers });
      console.log(res.status);
      setResponseStatus(res.status);
      // const res = await axios.post('/addPlayer', {name: "hello"});
    } catch (error) {
      console.error(error.config);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setImageUrl(imageUrl);
    }
  };
  return (
    <Container>
      <Form>
        <Title>Team Form</Title>
        <StyledInput
          value={teamname}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
        />

        <StyledInput
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="Owner Name"
        />

        <StyledInput
          value={abbrev}
          onChange={(e) => setAbbrev(e.target.value.toUpperCase())}
          placeholder="Abbrevation"
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          <ImagePreview src={URL.createObjectURL(image)} alt="Preview" />
        )}

        <StyledButton onClick={handleSubmit}>
          Submit
          {responseStatus === 200 && <TickIcon />}
        </StyledButton>
      </Form>
    </Container>
  );
}

export default TeamForm;
