import React from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import SearchBar from "./SearchBar";

function Navbar() {
  const Nav = styled.nav`
    .navbar_list {
      display: flex;
      gap: 7rem;
      align-items: center;
      position: relative;
      li {
        list-style: none;
        .navbar_link {
          &:link,
          &:visited {
            display: inline-block;
            text-decoration: none;
            font-size: 1.8rem;
            font-weight: 501;
            text-transform: uppercase;
            opacity: 0.9;
            color: white;
            transition: color 0.3s linear;
          }
          &:hover {
            color: grey;
          }
          &.active {
            color: white;
            position: relative;
            &:after {
              content: "";
              position: absolute;
              left: 50%;
              bottom: -5px;
              width: 0;
              height: 2px;
              background-color: white;
              transform: translateX(-50%);
            }
            &:after {
              width: 100%;
            }
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
            <NavLink className={"navbar_link"} to="/forms">
              Forms
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
