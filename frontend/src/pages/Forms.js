import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92.5%;
//   background-color: #f0f6fd;
`;

const FormsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  padding: 15px;
  opacity: 0.8;
  border-radius: 10px;
  height: 300px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const FormLink = styled(Link)`
  text-decoration: none;
  background-color: #3498db;
  color: white;
  text-align: center;
  width:100%;
  height:50px;
  padding: 12px 24px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.8rem;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #2980b9;
    transform: scale(1.05);
  }
`;

const Forms = () => {
  return (
    <Container>
      <FormsWrapper>
        <Title>Choose a Form</Title>
        <FormLink to="/playerform">Player Form</FormLink>
        <FormLink to="/teamform">Team Form</FormLink>
        <FormLink to="/seasonform">Season Form</FormLink>
        <FormLink to="/gameform">Game Form</FormLink>
      </FormsWrapper>
    </Container>
  );
};

export default Forms;

