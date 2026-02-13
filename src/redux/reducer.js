import {
  GET_RECIPES,
  GET_BY_TITLE,
  GET_ID,
  RESET_DETAIL,
  GET_BY_DIET,
  FILTER_DIET,
  FILTER_CREATED,
  ORDER_BY_TITLE,
  ORDER_BY_SCORE,
  POST_RECIPES,
} from "./constants";

export const initialState = {
  recipes: [],
  allRecipes: [],
  details: [],
  typeDiet: [],
};

function compareByTitle(a, b, asc) {
  const A = a.title.toLowerCase();
  const B = b.title.toLowerCase();
  if (A > B) return asc ? 1 : -1;
  if (B > A) return asc ? -1 : 1;
  return 0;
}

function compareByHealthScore(a, b, lowFirst) {
  if (a.healthScore > b.healthScore) return lowFirst ? 1 : -1;
  if (b.healthScore > a.healthScore) return lowFirst ? -1 : 1;
  return 0;
}

function rootReducer(state = initialState, action) {
  const allRecipes = state.allRecipes;

  switch (action.type) {
    case RESET_DETAIL:
      return { ...state, details: [] };

    case GET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
        allRecipes: action.payload,
      };

    case GET_BY_TITLE:
      return { ...state, recipes: action.payload };

    case FILTER_DIET: {
      const typeDietFilter =
        action.payload === "all"
          ? allRecipes
          : allRecipes.filter((el) =>
              el.TypeDiet?.some((d) => d.name === action.payload)
            );
      return { ...state, recipes: typeDietFilter };
    }

    case FILTER_CREATED: {
      const createdFilter =
        action.payload === "created"
          ? allRecipes.filter((el) => el.createdInDb)
          : allRecipes.filter((el) => !el.createdInDb);
      return {
        ...state,
        recipes:
          action.payload === "all" ? state.allRecipes : createdFilter,
      };
    }

    case ORDER_BY_TITLE: {
      const asc = action.payload === "asc";
      const ordered = [...state.recipes].sort((a, b) =>
        compareByTitle(a, b, asc)
      );
      return { ...state, recipes: ordered };
    }

    case ORDER_BY_SCORE: {
      const lowFirst = action.payload === "low";
      const ordered = [...state.recipes].sort((a, b) =>
        compareByHealthScore(a, b, lowFirst)
      );
      return { ...state, recipes: ordered };
    }

    case GET_BY_DIET:
      return { ...state, typeDiet: action.payload };

    case POST_RECIPES:
      return { ...state };

    case GET_ID: {
      const payload = action.payload;
      const details = Array.isArray(payload) ? payload : [payload];
      return { ...state, details };
    }

    default:
      return state;
  }
}

export default rootReducer;
