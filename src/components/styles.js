import styled from "@emotion/styled";
import { events } from "../events";

export const Status = styled("span")`
  text-transform: uppercase;
  display: inline-block;
  padding: 10px;
  color: ${p =>
    (p.status === events.ready && "blue") ||
    (p.status === events.connect && "green") ||
    (p.status === events.incoming && "orange") ||
    "inherit"};
`;

export const MainContainer = styled("div")`
  padding: 20px;
`;

export const Button = styled("button")`
  padding: 10px 15px;
  background: #eee;
  font-size: 14px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #ddd;
  }

  ${p =>
    p.red &&
    `
    background: darkred;
    color: white;
    &:hover {
      background: #333;
    }
  `}
  ${p =>
    p.green &&
    `
    background: darkgreen;
    color: white;
    
    &:hover {
      background: #333;
    }

  `}

  button + & {
    margin-left: 5px;
  }
`;

export const Input = styled("input")`
  padding: 10px;
  margin-bottom: 20px;
`;
