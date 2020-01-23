import React from "react";
import { CallControls } from "./CallControls";
import { Header } from "./Header";
import { Input, MainContainer } from "./styles";

export const Main = () => {
  return (
    <MainContainer>
      <Header />
      <CallControls />
    </MainContainer>
  );
};
