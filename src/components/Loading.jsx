import React from "react";
import s from "../styles/Loading.module.css";
import loading from "../img/loading.gif"

export default function Loading() {
  return (
    <div className={s.load}>
      <h1>⌛ Loading Recipes... ⌛</h1>
      <img src={loading}alt =""/>
      
    </div>
  );
}
