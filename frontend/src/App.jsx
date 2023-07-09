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
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyle";

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
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/players/:id" element={<Players />} />
          <Route path="/team/:id" element={<Team />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
