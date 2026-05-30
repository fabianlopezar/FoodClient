import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getTitle } from "../../../redux/actions";
import s from "./Index.module.scss";

export default function SearchBar() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() !== "") {
      dispatch(getTitle(title));
      setTitle("");
    } else {
      alert("Debe ingresar el nombre de una receta.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <input
        className={s.input}
        type="text"
        placeholder="Insert Recipe Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Recipe name"
      />
      <button className={s.btn} type="submit">
        Search
      </button>
    </form>
  );
}
