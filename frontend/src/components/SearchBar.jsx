import React, { useState, useEffect, useRef } from "react";
import axios from "../pages/Axios";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Search = styled.div`
  background-color: white;
  width: 20%;
  // border-top-left-radius: 10px;
  border-radius: 10px;
  // border-top-right-radius: 10px;
  height: 4.2rem;
  padding: 0rem 1rem 0rem 1rem;
  box-shadow: 0px 0px 0px white;
  display: flex;
  align-items: center;
  justify-items: flex-start;
  position: ;
  .icon {
    color: red;
    justify-self: start;
    align-self: center;
    height: 100%;
    width: 5%;
  }

  input {
    background-color: transparent;
    display: flex;
    font-size: 1.7rem;
    font-weight: 500;
    justify-items: flex-start;
    padding: 0rem 0rem 0rem 1rem;
    width: 100%;
    height: 100%;
    border: none;
    margin-left: 0px;
    &:focus {
      outline: none;
    }
  }
`;

const SearchResults = styled.div`
  // padding: 0;
  display: flex;
  top: 100%;
  flex-direction: column;
  max-height: 20rem;
  overflow-y: auto;
  margin-top: 5px;
  width: 20%;
  height: 20rem;
  overflow: auto;
  .SearchResultItem {
    background-color: white;
    color: black;
    height: 4rem;
    padding: 1rem 0rem 0rem 3rem;
    font-size: 1.7rem;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    &:hover {
      background-color: grey;
    }
  }
`;

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(false);
  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/Player?term=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchTerm) {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  //god chatgpt
  const handleKeyPress = (event) => {
    if (event.keyCode === 8 && searchTerm.length === 1) {
      // Handle backspace key and clear search results
      setSearchResults([]);
    }
  };


  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSelected(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const filteredResults = searchResults.filter((result) =>
    result.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Search  ref={searchRef} onClick={() => setSelected(true)}>
        <FaSearch className="icon" id="search-icon" />
        <input
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </Search>
      {(selected && filteredResults.length > 0) > 0 && (
        <SearchResults>
          {filteredResults.map((result) => (
            <NavLink
              className={"SearchResultItem"}
              key={result.id}
              to={`/players/${result.id}`}
            >
              {result.name}
            </NavLink>
          ))}
        </SearchResults>
      )}
    </div>
  );
}

export default SearchBar;
