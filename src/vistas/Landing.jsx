import React from "react";
import { Link } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import style from "../styles/Landing.module.css";
import Footer from "../components/Footer";
import video from "../img/trailer.mp4";

export default function Landing() {
  return (
    <IonPage>
      <IonContent fullscreen className="ion-no-padding">
        <div className={style.fondo}>
          <video src={video} autoPlay muted loop className={style.video} />
          <div className={style.div}>
            <h1 className={style.title}>¡ 🥣Welcome🥣 !</h1>
            <h1 className={style.subTitle}>🍳 Proyecto 🥗 Final 🥗 UAO 🍳</h1>
            <Link to="/home">
              <button type="button" className={style.botonLanding}>
                Enter
              </button>
            </Link>
            <Footer />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
