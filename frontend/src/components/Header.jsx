import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import { styled } from "styled-components";
import SearchBar from "./SearchBar";
import logo from "../images/logo.png";

function Header() {
  return (
    <Container>
      <NavLink to="/">
        <img className="logo" src={logo} alt="logo" />
      </NavLink>
      <Navbar />
    </Container>
  );
}

const Container = styled.div`
  height: 7rem;
  background-color:rgba(30, 30, 30, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    height: auto;
    max-width: 55%;
    opacity: 0.9;
  }
  overflow: auto;
`;
export default Header;
