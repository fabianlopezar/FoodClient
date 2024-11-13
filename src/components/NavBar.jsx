import React from "react";
import { useDispatch } from "react-redux";
import { filterDiet, filterCreated } from "../redux/actions";

import s from "../styles/Home.module.css";

export default function NavBar() {
  const dispatch = useDispatch();
  

  function handleDiet(e) {
    dispatch(filterDiet(e.target.value));
  }
  
  function handleFilterCreated(e){
    dispatch(filterCreated(e.target.value));
  }
 
  return (
    <div>
      <div>
        <select className={s.select} onChange={(el) => handleDiet(el)}>
          <option value="all">All Diets</option>
          <option value="gluten free">Gluten Free</option>
          <option value="ketogenic">Ketogenic</option>
          <option value="lacto ovo vegetarian">Ovo-Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="pescatarian">Pescatarian</option>
          <option value="paleolithic">Paleolithic</option>
          <option value="primal">Primal</option>
          <option value="whole 30">Whole 30</option>
        </select>

        <select className={s.select} onChange={(el)=>handleFilterCreated(el)}>
          <option value="all">Created-Existing</option>
          <option value="created">Created</option>
          <option value="existing">Existing</option>
        </select>
        
      </div>
    </div>
  );
}
