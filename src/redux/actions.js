import axios from "axios";

const GET_RECIPES = "GET_RECIPES";

const FILTER_DIET = "FILTER_DIET";
const FILTER_CREATED = "FILTER_CREATED";

const ORDER_BY_TITLE = "ORDER_BY_TITLE";
const ORDER_BY_SCORE = "ORDER_BY_SCORE";

const GET_BY_TITLE = "GET_BY_TITLE";
const GET_BY_DIET = "GET_BY_DIET";
const GET_ID = "GET_ID"

const RESET_DETAIL="RESET_DETAIL"

//----------------------------------------------------------------------
export function getRecipes() {
  return async function (dispatch) {
    let pedidoApi = await axios.get("/recipes");
    return dispatch({
      type: GET_RECIPES,
      payload: pedidoApi.data,
    });
  };
}
//-------------- FUNCION FILTRAR POR DIETA ----------------------
export function filterDiet(payload) {
  return {
    type: FILTER_DIET,
    payload,
  };
}
//--------------- FUNCION FILTRADO POR CREACION---------------------
export function filterCreated(payload) {
  return {
    type: FILTER_CREATED,
    payload,
  };
}

//--------------- FUNCION ORDENAR POR TITULO(ALFABETICAMENTE) -----
export function orderTitle(payload) {
  return {
    type: ORDER_BY_TITLE,
    payload,
  };
}
//------------------------------------------------------------------
export function resetDetail(){
  return{
    type:RESET_DETAIL 
  }
}
//------------------------------------------------------------------
export function orderScore(payload) {
  return {
    type: ORDER_BY_SCORE,
    payload,
  };
}
//------------- FUNCION PARA EL SEARCH BAR--------------------------
export function getTitle(name) {
  return async function (dispatch) {
    try {
      let pedidoApi = await axios.get(`/recipes?name=${name}`);
      return dispatch({
        type: GET_BY_TITLE,
        payload: pedidoApi.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
//------------------------------------------------------------------
export function getRecipesId(id) {
  return async function (dispatch) {
    try {
      
      let pedidoApi = await axios.get(`/recipes/${id}`);
      console.log("soy la data del action: ", pedidoApi.data)
      return dispatch({
        type: GET_ID,
        payload: pedidoApi.data,
      });
    } catch (error) {
      console.log("", error);
    }
  };
}
//------------------------------------------------------------------
export function getTypeDiet() {
  return async function (dispatch) {
    try {
      let pedidoApi = await axios.get("/diets");
      return dispatch({
        type: GET_BY_DIET,
        payload: pedidoApi.data,
      });
    } catch (error) {
      console.log("", error);
    }
  };
}
//------------------------------------------------------------------
export function postRecipes(payload) {
  return async function () {
    let pedidoApi = await axios.post("/recipe", payload);
    return pedidoApi;
  };
}
//------------------------------------------------------------------
