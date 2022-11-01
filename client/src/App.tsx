import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "pages/Home";
import Room from "pages/Room";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomIdx" element={<Room />} />
    </Routes>
  );
}

export default App;
