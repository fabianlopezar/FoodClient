import React, { useEffect, useCallback } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../../components/Shared/SearchBar/Index";
import NavBar from "../../components/NavBar/Index";
import Paginado from "../../components/Paginado/Index";
import Card from "../../components/Card/Index";
import Loading from "../../components/Shared/Loading/Index";
import Footer from "../../components/Shared/Footer/Index";
import { orderScore, orderTitle, getRecipes } from "../../redux/actions";
import { useOptimizedList } from "../../hooks/useOptimizedList";
import { useAuth } from "../../hooks/useAuth";
import s from "./Index.module.scss";

export default function Home() {
  const allRecipes = useSelector((state) => state.recipes);
  const dispatch = useDispatch();
  const { user, logout, isAdmin } = useAuth();
  const [orden, setOrden] = React.useState("");
  const itemsPerPage = 9;

  const { currentItems, goToPage, resetPage } = useOptimizedList(
    allRecipes,
    itemsPerPage
  );

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  const handleSort = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(orderTitle(e.target.value));
      resetPage();
      setOrden(`Ordenado ${e.target.value}`);
    },
    [dispatch, resetPage]
  );

  const handleScore = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(orderScore(e.target.value));
      resetPage();
      setOrden(`Ordenado ${e.target.value}`);
    },
    [dispatch, resetPage]
  );

  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <div className={s.fondo}>
          <div className={s.nav}>
            <div className={s.container}>
              <Link to="/">
                <img
                  src="https://images.vexels.com/media/users/3/235848/isolated/preview/4b62529b242dcef2dbc6719899ecdd6e-gorro-de-cocinero-de-cocina.png"
                  alt="Gorro de chef"
                  width="100"
                  height="80"
                />
              </Link>

              <select className={s.select} onChange={handleSort}>
                <option>Order Alphabetic</option>
                <option value="asc">Ascendent ( A - Z )</option>
                <option value="des">Descendent ( Z - A )</option>
              </select>

              <select className={s.select} onChange={handleScore}>
                <option>Order Score Health</option>
                <option value="low">Low Health</option>
                <option value="high">High Health</option>
              </select>

              <NavBar />
              <SearchBar />

              <Link to="/recipe">
                <button type="button" className={s.button}>
                  Recipe Creator
                </button>
              </Link>
              <Link to="/notifications/settings">
                <button type="button" className={s.button}>
                  Notificaciones
                </button>
              </Link>
              <Link to="/map">
                <button type="button" className={s.button}>
                  Mapa
                </button>
              </Link>
              <Link to="/chat">
                <button type="button" className={s.button}>
                  Chat
                </button>
              </Link>

              <div className={s.userBar}>
                {user ? (
                  <>
                    <span className={s.userName}>Hola, {user.displayName || user.email}</span>
                    {isAdmin && (
                      <Link to="/admin">
                        <button type="button" className={s.button}>
                          Admin
                        </button>
                      </Link>
                    )}
                    <button type="button" className={s.button} onClick={() => logout()}>
                      Salir
                    </button>
                  </>
                ) : (
                  <Link to="/login">
                    <button type="button" className={s.button}>
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {orden && <p style={{ textAlign: "center" }}>{orden}</p>}

            <div className={s.paginadoWrapper}>
              <Paginado
                itemsPerPage={itemsPerPage}
                allItems={allRecipes.length}
                paginado={goToPage}
              />
            </div>
          </div>

          <div className={s.containerCards}>
            {currentItems.length > 0 ? (
              currentItems.map((el) => (
                <div key={el.id}>
                  <Card
                    title={el.title}
                    img={el.img}
                    typeDiet={el.TypeDiet}
                    score={el.healthScore}
                    id={el.id}
                  />
                </div>
              ))
            ) : (
              <div className={s.load}>
                <Loading />
              </div>
            )}
          </div>
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
}
