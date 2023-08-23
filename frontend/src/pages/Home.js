import React from 'react';
import SearchBar from '../components/SearchBar';
import styled from 'styled-components';

const Body= styled.body`
  background-image: linear-gradient(to bottom, white, rgba(40,40,40,1));
  height:100%;
  width:100%;
`
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 3rem 0;
  // min-height: 100vh;
`;

const Welcome = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  opacity:1;
`;

const Title = styled.h1`
  color: white;
  font-size: 5rem;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  color: white;
  font-size: 2rem;
  margin-bottom: 0rem;
`;

const Home = () => {
  return (
    <PageContainer>
      <Welcome>
        <Title>Welcome to IPL Archive</Title>
         <Subtitle>Your source for all things IPL history.</Subtitle> 
      </Welcome>
      <SearchBar />
    </PageContainer>
  );
};

export default Home;



