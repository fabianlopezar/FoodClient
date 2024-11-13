import React from "react";
import {useDispatch } from "react-redux";
import Card from "./Card";
import { getRecipes } from "../redux/actions";
import { useEffect } from "react";

export default function ContainerCards({currentItems}) {
  //let allRecipes = useSelector((state) => state.recipes);
  const dispatch = useDispatch();   

  useEffect(()=>{
    dispatch(getRecipes())
  },[dispatch]);

  return(<div>
    {currentItems.length>0?(
        currentItems.map((el)=>(
            <div key={el.id} >
                <Card title={el.title}img={el.img}typeDiet={el.TypeDiet} score={el.healthScore}/>
            </div>
        ))
    ):(<h1>⌛ Loading Recipes... ⌛</h1>)}
  </div>)
}
