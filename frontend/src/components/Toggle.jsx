import styled from "styled-components";

const Togglebutton = styled.button`
    text-decoration : none;
    max-width: auto;
    background-color : ${(props) =>
      props.active ? props.theme.colors.activeColor : props.theme.colors.bg};
    color: ${(props) => (props.active ? "black" : "white")};  
    padding: 0.5rem 1rem;
    text-transform : uppercase;
    text-align : center;
    border: none;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    cursor: pointer;
    margin-right: 0.5rem;
    .label {
        color = black;
    }
    font-size : 2.6rem;
    text-transform : uppercase;
    font-weight : 500;
`;

const ToggleButton = ({ active, onClick, label }) => {
  return (
    <Togglebutton active={active} onClick={onClick}>
      {label}
    </Togglebutton>
  );
};

export default ToggleButton;
