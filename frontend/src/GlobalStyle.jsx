import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
*{
    margin: 0;
    padding: 0;
    box-sizing : border-box;
    font-family: 'Work Sans', sans-serif;
   
}
body {
  background-color : ${({ theme }) => theme.colors.bg};
}

html {
  font-size : 62.5%;
  overflow-x : hidden;
}

h1 {
  color : white;
  background-color : auto;
  font-size : 5.6rem;
  font-weight : 700; 
  opacity : .7;
}

h2 {
  color : black;
  font-size : 3.5rem;
  font-weight : 500;
  white-space : normal;
  text-transform : uppercase;
  text-align : center;
  background-color : auto;
}

h3 {
  color : black;
  font-size : 2.6rem;
  text-transform : uppercase;
  font-weight : 500;
}

p {
  color : black;
  opacity : .9;
  font-size : 2rem;
  line-height : 1.5;
  margin-top : 1rem;
  font-weight : 400;
}

a {
  text-decoration : none;
}

li {
  list-style : none;
  background-color : auto;
}

`;
