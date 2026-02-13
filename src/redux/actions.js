import api from "../services/api";
import {
  GET_RECIPES,
  GET_BY_TITLE,
  GET_ID,
  GET_BY_DIET,
  FILTER_DIET,
  FILTER_CREATED,
  ORDER_BY_TITLE,
  ORDER_BY_SCORE,
  RESET_DETAIL,
} from "./constants";

export function getRecipes() {
  return async function (dispatch) {
    try {
      const { data } = await api.get("/recipes");
      dispatch({ type: GET_RECIPES, payload: data });
    } catch (error) {
      dispatch({ type: GET_RECIPES, payload: [] });
    }
  };
}

export function filterDiet(payload) {
  return { type: FILTER_DIET, payload };
}

export function filterCreated(payload) {
  return { type: FILTER_CREATED, payload };
}

export function orderTitle(payload) {
  return { type: ORDER_BY_TITLE, payload };
}

export function orderScore(payload) {
  return { type: ORDER_BY_SCORE, payload };
}

export function resetDetail() {
  return { type: RESET_DETAIL };
}

export function getTitle(name) {
  return async function (dispatch) {
    try {
      const encoded = encodeURIComponent(name.trim());
      const { data } = await api.get(`/recipes?name=${encoded}`);
      dispatch({ type: GET_BY_TITLE, payload: data });
    } catch (error) {
      dispatch({ type: GET_BY_TITLE, payload: [] });
    }
  };
}

export function getRecipesId(id) {
  return async function (dispatch) {
    try {
      const { data } = await api.get(`/recipes/${id}`);
      dispatch({ type: GET_ID, payload: data });
    } catch (error) {
      dispatch({ type: RESET_DETAIL });
    }
  };
}

export function getTypeDiet() {
  return async function (dispatch) {
    try {
      const { data } = await api.get("/diets");
      dispatch({ type: GET_BY_DIET, payload: data });
    } catch (error) {
      dispatch({ type: GET_BY_DIET, payload: [] });
    }
  };
}

export function postRecipes(payload) {
  return async function () {
    const { data } = await api.post("/recipe", payload);
    return data;
  };
}
