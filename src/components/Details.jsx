
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecipesId } from "../redux/actions.js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./Footer.jsx";

import { resetDetail } from "../redux/actions.js";

import s from "../styles/Details.module.css";
//import s2 from "../styles/Home.module.css"

export default function Details(props) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getRecipesId(id));

    return () => {
      dispatch(resetDetail());
    };
  }, []);

  const myRecipe = useSelector((state) => state.details);
  return (
    <div className={s.fondo}>
      <div>
        <Link to="/home">
          <button className={s.button}>Home</button>
        </Link>
        {/*--------------- fondo blanco -----------*/ }
        <div className={s.container}>
          
          {myRecipe.length > 0 ? (
            <div>
              <div className={s.columna}>
                <h1 className={s.title}>{myRecipe[0].title}</h1>
                <img alt="No hay" className={s.img} src={myRecipe[0].img? myRecipe[0].img: "https://st.depositphotos.com/1036708/2191/i/600/depositphotos_21918797-stock-photo-knife-and-fork-with-plate.jpg"}/>
                <h1 className={s.subtitulos}>Type Diet</h1>
                <p> {myRecipe[0].TypeDiet?.map((el) => el.name+", ")}</p>
              </div>
            <div>
                {/*
                <h2>Dish Types</h2>
                <p> {myRecipe[0].dishTypes[0].name?myRecipe[0].dishTypes[0].name:"not have"}</p>

                funciona y no funciona
                 */}
              </div>
              
              <h1 className={s.subtitulo}>Summary</h1>  
              <p> {myRecipe[0].summary}</p>
              
              <hr></hr>
              <h1 className={s.subtitulos}>HealthScore</h1>
              <h5>{myRecipe[0].healthScore}/100</h5>
              <h1 className={s.subtitulos}>Analyzed Instructions:</h1>
                {Array.isArray(myRecipe[0].analyzedInstructions)
                  ? myRecipe[0].analyzedInstructions.map((el) =>
                      el.steps.map((elem) =><div> <p>{elem.step}</p></div>)
                    )
                  : "No hay por el momento."}
           
            </div>
          ) : (
            <Loading />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

