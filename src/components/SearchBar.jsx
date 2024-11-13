import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getTitle } from "../redux/actions.js";
import s from "../styles/SearchBar.module.css";

export default function SearchBar() {
  //----------------------------------
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  //----------------------------------
  function handleInputChange(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }
  //----------------------------------
  function handleSubmit(e) {
    e.preventDefault();
    if (title !== "") {
      dispatch(getTitle(title));
      setTitle(""); // Limpio el input
    } else {
      alert("Debe ingresar el nombre de una receta.");
    }
  }

  return (
    <div>
      <input
        className={s.input}
        type="text"
        placeholder="Insert Recipe Name"
        onChange={(e) => handleInputChange(e)}
      />
      <button className={s.btn} type="submit" onClick={(e) => handleSubmit(e)}>
        Search
      </button>
    </div>
  );
}
