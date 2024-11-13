import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postRecipes, getTypeDiet } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import s from "../styles/Create.module.css"
import Footer from "./Footer.jsx"

function controlForm(input){
  const lim = new RegExp("^[0-9]+$")
  let errors = {}
  if(!input.title) errors.title = "You should enter a title";
  //if(!input.summary) errors.summary = "You should enter a summary";
  if(input.healthScore < 0 || input.healthScore > 100 || !lim.test(input.healthScore))errors.healthScore="You should enter a number between 0 - 100";


  return errors;
}
export function Create() {
  const dispatch = useDispatch();
  const diets = useSelector((state) => state.typeDiet);
  const [errors,setErrors] = useState({});
  const [input,setInput] = useState({
    title:"",
    summary:"",
    healthScore:"",
    analyzedInstructions:"",
    typeDiet:[] 
 })

  useEffect(()=>{
    dispatch(getTypeDiet())
  },[dispatch])

//-------------------- MANEJADORES --------------------------------------------------
//----------- CHANGE -----------------------
function handleChange(e){
  setInput({
    ...input,
    [e.target.name]:e.target.value
  })

  setErrors(controlForm({
    ...input,
    [e.target.name]:e.target.value
  }))
}
//-------- SELECT -----------------------------------
function handleSelect(e){
  setInput({
    ...input,
    typeDiet:[...input.typeDiet, e.target.value]
  })
}
//------- SUBMIT ----------------------------------------------
function handleSubmit(e){
  e.preventDefault();
  dispatch(postRecipes(input))
  if(!input.title && !input.summary) {
    alert("Deberia escribir algo X")
  }else{ alert("The recipe was created successfully. ✔️")
    setInput({
    title:"",
    summary:"",
    healthScore:"",
    analyzedInstructions:"",
    typeDiet:[] 
  })}
 
}
function handleDelete(e){
  setInput({
    ...input,
    typeDiet:input.typeDiet.filter(el=>el!==e)
  })
}

//-------------------- RENDERIZADO -----------------------------------------------------------------------------------
return (
  <div id={s.fondo}>

    <Link to="/home">
      <button className={s.btn}>BACK</button>
    </Link>

    <div className={s.card}>
      <h1 className={s.title}>Recipe Creator</h1>
      <form className={s.ent} onSubmit={(e)=>{handleSubmit(e)}}>
      
      <div>
        <label className={s.label}>Title:</label>
        <input placeholder="Title of Recipe" className={s.input} type="text" value={input.title} name="title" onChange={(e)=>{handleChange(e)}}/>
        {errors.title && (<p className={s.labelError}>{errors.title}</p>)}
      </div>

      <div>
        <label className={s.label}>Summary:</label>
        <input placeholder="Summary of Recipe" className={s.input} type="text" name="summary" value={input.summary} onChange={(e)=>{handleChange(e)}}/>
        {errors.sumary && (<p className={s.labelError}>{errors.summary}</p>)}
      </div>

      <div>
        <label className={s.label}>Health Score:</label>
        <input placeholder=" 0 - 100" className={s.input} min="0" max="100" type="number" name="healthScore" value={input.healthScore} onChange={(e)=>handleChange(e)} size="6"/>
        {errors.healthScore&&(<p className={s.labelError}>{errors.healthScore}</p>)}
      </div>

      <div>
        <label className={s.label}>Analyzed Instructions:</label>
        <input  placeholder="Steps of Recipe" className={s.input} type="text" name="analyzedInstructions" value={input.analyzedInstructions} onChange={(e)=>{handleChange(e)}} />
      </div>

      <label className={s.label}>Diet:</label>
      <select className={s.select} onChange={(e)=>{handleSelect(e)}}>
        {diets?.map((el)=>{
          return <option key={el}value={el}>{el}</option>
        })}
      </select>
      {
      errors.hasOwnProperty("title") || errors.hasOwnProperty("summary") ||errors.hasOwnProperty("healthScore")? 
      <h2 className={s.labelError}>You should complete all the inputs</h2>
      :<button className={s.btn} type="submit">Create new Recipe</button>
      }
      </form>
      {input.typeDiet.map((el)=>{
      return(
        <div key={el}>
          <h5 className={s.label}>{el}</h5>
          <button   className={s.button} onClick={()=>handleDelete(el)}>X</button>
        </div>
        )
      })}

    </div>
    <Footer/>
  </div>
  
  )
}
