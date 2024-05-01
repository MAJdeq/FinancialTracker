import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Helmet from "react-helmet";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Helmet>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap"
        rel="stylesheet"
      ></link>
    </Helmet>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
