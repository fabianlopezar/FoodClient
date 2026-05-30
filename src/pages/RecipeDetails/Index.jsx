import React, { useEffect } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecipesId, resetDetail } from "../../redux/actions";
import Loading from "../../components/Shared/Loading/Index";
import Footer from "../../components/Shared/Footer/Index";
import { useAuth } from "../../hooks/useAuth";
import { syncFavoriteTransaction } from "../../services/firebase/firestoreService";
import { isFirebaseConfigured } from "../../config/firebase";
import s from "./Index.module.scss";

export default function RecipeDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const myRecipe = useSelector((state) => state.details);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getRecipesId(id));
    return () => {
      dispatch(resetDetail());
    };
  }, [id, dispatch]);

  async function handleSaveFavorite() {
    if (!user || !myRecipe[0]) return;
    if (!isFirebaseConfigured()) {
      alert("Configura Firebase para sincronizar favoritos.");
      return;
    }
    try {
      await syncFavoriteTransaction(user.uid, String(id), myRecipe[0].title);
      alert("Receta guardada en favoritos (transacción Firestore).");
    } catch {
      alert("No se pudo sincronizar el favorito.");
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <div className={s.fondo}>
          <div>
            <Link to="/home">
              <button className={s.button} type="button">
                Home
              </button>
            </Link>
            {user && (
              <button className={s.button} type="button" onClick={handleSaveFavorite}>
                Guardar favorito
              </button>
            )}
            <div className={s.container}>
              {myRecipe.length > 0 ? (
                <div>
                  <div className={s.columna}>
                    <h1 className={s.title}>{myRecipe[0].title}</h1>
                    <img
                      alt={myRecipe[0].title}
                      className={s.img}
                      src={
                        myRecipe[0].img ||
                        "https://st.depositphotos.com/1036708/2191/i/600/depositphotos_21918797-stock-photo-knife-and-fork-with-plate.jpg"
                      }
                    />
                    <h1 className={s.subtitulos}>Type Diet</h1>
                    <p>{myRecipe[0].TypeDiet?.map((el) => el.name + ", ")}</p>
                  </div>
                  <h1 className={s.subtitulo}>Summary</h1>
                  <p>{myRecipe[0].summary}</p>
                  <hr />
                  <h1 className={s.subtitulos}>HealthScore</h1>
                  <h5>{myRecipe[0].healthScore}/100</h5>
                  <h1 className={s.subtitulos}>Analyzed Instructions:</h1>
                  {Array.isArray(myRecipe[0].analyzedInstructions)
                    ? myRecipe[0].analyzedInstructions.map((el, i) =>
                        el.steps.map((elem, j) => (
                          <div key={`${i}-${j}`}>
                            <p>{elem.step}</p>
                          </div>
                        ))
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
      </IonContent>
    </IonPage>
  );
}
