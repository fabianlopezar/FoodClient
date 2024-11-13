import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";


import { Provider } from "react-redux";
import { store } from "./redux/store.js";

import axios from "axios";
//---- Local ----
//axios.defaults.baseURL = "http://localhost:3001";
//---- deploy ----
axios.defaults.baseURL = "https://apifood-pi-production.up.railway.app/";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
