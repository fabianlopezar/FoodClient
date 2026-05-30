import React from "react";
import { Link } from "react-router-dom";
import style from "./Index.module.scss";

export default function Card({ id, title, img, typeDiet, score }) {
  return (
    <div className={style.card}>
      <Link to={`/recipes/${id}`} rel="noreferrer">
        <h3 className={style.title}>Title: {title}</h3>
      </Link>
      <Link to={`/recipes/${id}`}>
        <img className={style.img} src={img} alt={title} />
      </Link>
      <div>
        <p>{typeDiet?.map((el) => el.name + ". ")}</p>
      </div>
      <h5 className={style.h5}>HealthScore: {score}/100</h5>
    </div>
  );
}
