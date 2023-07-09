import React from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import SearchBar from "./SearchBar";

function Navbar() {
  const Nav = styled.nav`
    .navbar_list {
      display: flex;
      gap: 5rem;
      align-items: center;
      li {
        list-style: none;
        .navbar_link {
          &:link,
          &:visited {
            display: inline-block;
            text-decoration: none;
            font-size: 1.8rem;
            text-transform: uppercase;
            color: white;
            transition: color 0.3s linear;
          }
          &:hover,
          &:active {
            color: grey;
          }
        }
      }
    }
  `;
  return (
    <Nav>
      <div className="menuIcon">
        <ul className="navbar_list">
          <li>
            <NavLink className={"navbar_link"} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={"navbar_link"} to="/teams">
              Teams
            </NavLink>
          </li>
          <li>
            <NavLink className={"navbar_link"} to="/about">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </Nav>
  );
}

export default Navbar;
