import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  padding: 3rem;
  background-color: rgba(60, 60, 60, 1);
  color: white;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #ffce54;
`;

const Description = styled.p`
  font-size: 2rem;
  color:white;
  line-height: 2.5rem;
  margin-bottom: 2rem;
`;

const ListContainer = styled.div`
  margin-bottom: 2.5rem;
`;

const ListItem = styled.li`
  font-size: 2rem;
  line-height: 2.5rem;
  margin-bottom: 1rem;
`;

const Emphasize = styled.span`
  font-weight: bold;
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <Title>About Our Archive System</Title>
      <Description>
        Welcome to our Cricket Tournament Archive System! We're dedicated to providing a comprehensive archival solution for cricket tournaments organized in a league-based format. Our system caters to management professionals and cricket enthusiasts, offering an efficient way to manage and retrieve valuable information from various matches and events.
      </Description>

      <ListContainer>
        <Title>Key Features</Title>
        <ul>
          <ListItem><Emphasize>Match Records:</Emphasize> Our system stores and organizes match records, making it easy to track and retrieve details about past matches, scores, and outcomes.</ListItem>
          <ListItem><Emphasize>Player Statistics:</Emphasize> Stay updated on player performance with detailed statistics such as runs scored, wickets taken, and more.</ListItem>
          <ListItem><Emphasize>Team Performances:</Emphasize> Analyze team-based performances, including win-loss records, rankings, and trends over time.</ListItem>
        </ul>
      </ListContainer>

      <Description>
        Our archive system is accessible through a user-friendly web-based interface. Whether you're a cricket enthusiast looking for historical match data or a management professional seeking insights into team and player performance, our platform provides an intuitive and seamless experience.
      </Description>

      <Description>
        We've harnessed advanced technology to develop this system. The database architecture is built upon PostgreSQL, a powerful relational database management system. The backend is powered by GoLang, ensuring robust and efficient data processing. For the frontend, we've used ReactJS to create a visually appealing and user-centric interface.
      </Description>

      <Description>
        Explore the world of cricket history, statistics, and performances with our Archive System. We're committed to providing an encompassing experience for cricket enthusiasts, players, and management professionals alike. Discover the magic of cricket through data, insights, and a seamless online platform.
      </Description>

      <Description>
        Feel free to navigate through our website, and don't hesitate to reach out if you have any questions or suggestions. Thank you for being a part of our Cricket Tournament Archive System!
      </Description>
    </AboutContainer>
  );
};

export default AboutPage;

