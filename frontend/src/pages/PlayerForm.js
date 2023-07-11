import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import axios from "./Axios";

function  PlayerForm () {
    const [name, setName] = useState("");
    const [age, setAge] = useState(25);
    const [country, setCountry] = useState("");
    const [playerType, setPlayerType] = useState("");
    const [battingType, setBattingType] = useState("");
    const [bowlingType, setBowlingType] = useState("");
    const [image, setImage] = useState();
    const [imageUrl, setImageUrl] = useState();

    const [enums, setEnums] = useState({});
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
      const GetEnums = async () => {
        const playerAff = await axios.get(`/getEnum?enum=PlayerAffinity`);
        setEnums((prev) => ({
            ...prev,
            "PlayerAffinity": playerAff.data,
        }));

        const battingAff = await axios.get(`/getEnum?enum=BattingAffinity`);
        setEnums((prev) => ({
            ...prev,
            "BattingAffinity": battingAff.data,
        }));

        const bowlingAff = await axios.get(`/getEnum?enum=BowlingAffinity`);
        setEnums((prev) => ({
            ...prev,
            "BowlingAffinity": bowlingAff.data,
        }));

        setIsFetched(true)
      }

      GetEnums();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = new FormData();
            data.append('name', name);
            data.append('age', age);
            data.append('country', country);
            data.append('playerAffinity', playerType);
            data.append('battingAffinity', battingType);
            data.append('bowlingAffinity', bowlingType);
            data.append('image', image)

            console.log("hello");
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            };
            const res = await axios.post('/addPlayer', data, {headers});
            console.log(res);

            // const res = await axios.post('/addPlayer', {name: "hello"});
        }
        catch (error) {
            console.error(error.config);
        }
        
    }

    const addImage = async (e) => {
        setImage(e.target.files[0]);
    }
    

    return (isFetched === true && (
        <form>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                value={country}
                onChange={e => setCountry(e.target.value)}
            />
            <input
                value={age}
                onChange={e => setAge(e.target.value)}
                type="number"
            />

            <select value={playerType} onChange={e => setPlayerType(e.target.value)}>
                {enums.PlayerAffinity.map(aff => (
                    <option value={aff}>{aff}</option>
                ))}
            </select>

            <select value={battingType} onChange={e => setBattingType(e.target.value)}>
                {enums.BattingAffinity.map(aff => (
                    <option value={aff}>{aff}</option>
                ))}
            </select>

            <select value={bowlingType} onChange={e => setBowlingType(e.target.value)}>
                {enums.BowlingAffinity.map(aff => (
                    <option value={aff}>{aff}</option>
                ))}
            </select>

            <input type="file"
                onChange={e => setImage(e.target.files[0])}
            />
            <img src={imageUrl} />

            <button onClick={handleSubmit}>Submit</button>

        </form>
        
    ));
}

export default PlayerForm