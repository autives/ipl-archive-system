import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/Header";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Team from "./pages/Team";
import TeamForm from './pages/TeamForm';
import PlayerForm from  "./pages/PlayerForm";
import GameForm from "./pages/GameForm"
import { ThemeProvider, styled } from "styled-components";
import { GlobalStyle } from "./GlobalStyle";


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(60, 60, 60, 1); /* Adjust the color and transparency as needed */
  z-index: -1;
  overflow: auto;
`

function App() {

  const theme = {
    colors: {
      heading: "rgb(24, 24, 179)",
      bg: "rgb(10, 10, 107)",
      text_color: "white",
      activeColor: "white",
    },
    media: { mobile: "768px", tab: "998px" },
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Overlay>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/players/:id" element={<Players />} />
          <Route path="/team/:id" element={<Team />} />
          <Route path="/form" element={<PlayerForm />} />
          <Route path="/gameform" element={<GameForm />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/playerform" element={<PlayerForm />} />
          <Route path="/teamform" element={<TeamForm />} />
          <Route path="/playerform" element={<PlayerForm />} />
          <Route path="/teamform" element={<TeamForm />} />
        </Routes>
      </BrowserRouter>
      </Overlay>
    </ThemeProvider>
  );
}

export default App;
