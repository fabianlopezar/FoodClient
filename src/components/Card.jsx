import React from "react";
import { Link } from "react-router-dom";
import style from "../styles/Card.module.css"

export default function Card({id,title,img,typeDiet,score}) {
  return (
    <div className={style.card} key={id}>
      <Link to={`/recipes/${id}`} rel="noreferrer">    
        <h3 className={style.title}>Title: {title}</h3>
      </Link>
      <Link to={`/recipes/${id}`}>
        <img className={style.img} src={img} alt="🍽️not img🍽️" width="200px" height="250px"/>
      </Link>
      <div>
        <p>
      {typeDiet?.map(el=> el.name+". ")}
        </p>
      </div>   
      <h5 className={style.h5}>HealthScore: {score}/100</h5>
    </div>
    
  );
}

///recipes/:id