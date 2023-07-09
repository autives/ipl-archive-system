import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import { styled } from "styled-components";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <Container>
      <NavLink to="/">
        <img className="logo" src="./images/logo.png" alt="logo" />
      </NavLink>
      <Navbar />
    </Container>
  );
}

const Container = styled.div`
  height: 6rem;
  background-color: ${({ theme }) => theme.colors.heading};
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    height: auto;
    max-width: 55%;
  }
  overflow: auto;
`;
export default Header;
