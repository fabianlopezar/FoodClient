import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import Paginado from "../components/Paginado";
import Card from "../components/Card";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { orderScore, orderTitle, getRecipes } from "../redux/actions";
import Footer from "../components/Footer";

import s from "../styles/Home.module.css";

export default function Home() {
  const allRecipes = useSelector((state) => state.recipes);
  //currentPage = pagina actual
  //     valor estado | actualizar estado
  const [currentPage, setCurrentPage] = useState(1);
  //itemsPerPage = catidad de items por pagina
  const [itemsPerPage, setItemsPerPage] = useState(9);
  //                           1          9
  const indexOfLastItem = currentPage * itemsPerPage; // 9
  //                         9                9
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 0
  //                                     0                     9
  const currentItems = allRecipes.slice(indexOfFirstItem, indexOfLastItem);
  //
  const [orden, setOrden] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function handleSort(e) {
    e.preventDefault();
    dispatch(orderTitle(e.target.value));
    setCurrentPage(1);
    setOrden(`Ordenado ${e.target.value}`);
  }

  function handleScore(e) {
    e.preventDefault();
    dispatch(orderScore(e.target.value));
    setCurrentPage(1);
    setOrden(`Ordenado ${e.target.value}`);
  }

  return (
    <div className={s.fondo}>
      <div className={s.Nav}>
        <div className={s.container}>
          <Link to="/">
            <img
              src="https://images.vexels.com/media/users/3/235848/isolated/preview/4b62529b242dcef2dbc6719899ecdd6e-gorro-de-cocinero-de-cocina.png"
              alt="deberia estar un gorro de shef"
              width="100"
              height="80"
            ></img>
          </Link>
          <select className={s.select} onChange={(el) => handleSort(el)}>
            <option>Order Alphabetic</option>
            <option value="asc">Ascendent ( A - Z )</option>
            <option value="des">Descendent ( Z - A )</option>
          </select>

          <select className={s.select} onChange={(el) => handleScore(el)}>
            <option>Order Score Health</option>
            <option value="low">Low Health</option>
            <option value="high">High Health</option>
          </select>

          <NavBar setCurrentPage={setCurrentPage} />
          <SearchBar />

          <Link to="/recipe" >
            <button className={s.button}>Recipe Creator</button>
          </Link>
        </div>

        <div>
          <Paginado
            itemsPerPage={itemsPerPage}
            allItems={allRecipes.length}
            paginado={paginado}
          />
        </div>
      </div>

      <div className={s.ContainerCards}>
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
  );
}
