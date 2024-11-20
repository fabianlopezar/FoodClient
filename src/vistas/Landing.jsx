import React from "react";
import { Link } from "react-router-dom";
import style from "../styles/Landing.module.css";
import Footer from "../components/Footer";
import video from "../img/trailer.mp4"

export default function Landing() {
  return (
    <div>
      <video src={video} autoPlay muted loop className={style.video}></video>
      <div className={style.div} >
        <h1 className={style.title}>¡ 🥣Welcome🥣 !</h1>
        <h1 className={style.subTitle}>🍳 Proyecto 🥗 Final 🥗 UAO 🍳</h1>
        <Link to="/home">
          <button className={style.botonLanding}>Enter</button>
        </Link>
        <Footer/>
        </div>
    </div>
  );
}
