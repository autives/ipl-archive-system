import React, { useState, useEffect, useRef } from "react";
import axios from "../pages/Axios";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Container= styled.div`
  padding-top:20rem;
`

const Search = styled.div`
  background-color: white;
  width: 100rem;
  // border-top-left-radius: 10px;
  border-radius: 10px;
  // border-top-right-radius: 10px;
  height: 4.2rem;
  padding: 0rem 1rem 0rem 1rem;
  box-shadow: 0px 0px 0px white;
  display: flex;
  position:relative;
  align-items: center;
  justify-items: flex-start;
  position: ;
  .icon {
    color: red;
    justify-self: start;
    align-self: center;
    height: 2.8rem;
    width: 4rem;
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
  max-height: 21rem;
  overflow-y: auto;
  margin-top: 5px;
  // width: 20%;
  .SearchResultItem {
    background-color: white;
    color: black;
    height: 4.2rem;
    position:relative;
    padding: 1rem 0rem 0rem 3rem;
    font-size: 1.7rem;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    border: 1px solid #ccc;
    &:hover {
      background: rgba(255,255,255,0.7);
    }
  }
`;

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/playerSearch?name=${searchTerm}`);
        setSearchResults(response.data.matches);
        setIsFetched(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchTerm) {
      fetchData();
    } else {
      setSearchResults([]);
      setIsFetched(false);
    }
  }, [searchTerm]);

  //god chatgpt
  const handleKeyPress = (event) => {
    if (event.keyCode === 8 && searchTerm.length === 1) {
      // Handle backspace key and clear search results
      setSearchResults([]);
      setIsFetched(false);
    }
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSelected(false);
      setIsFetched(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredResults = searchResults
    ? searchResults.filter((result) =>
        result.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  {
    isFetched && console.log(searchResults);
  }

  return (
    <Container >
      <Search ref={searchRef} onClick={() => setSelected(true)}>
        <FaSearch className="icon" id="search-icon" />
        <input
          placeholder="Search by player's name"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </Search>
      {isFetched && selected && (
        <SearchResults>
          {filteredResults && filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <NavLink
                className="SearchResultItem"
                key={result.id}
                to={`/players/${result.id}`}
              >
                {result.name}
              </NavLink>
            ))
          ) : (
            <h3 className="SearchResultItem" id>
              No results found.
            </h3>
          )}
        </SearchResults>
      )}
    </Container>
  );
}

export default SearchBar;
