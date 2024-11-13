const GET_RECIPES = "GET_RECIPES";

const FILTER_DIET = "FILTER_DIET";
const GET_BY_DIET = "GET_BY_DIET";

const FILTER_CREATED= "FILTER_CREATED"
const ORDER_BY_TITLE = "ORDER_BY_TITLE";
const ORDER_BY_SCORE = "ORDER_BY_SCORE";
const GET_BY_TITLE = "GET_BY_TITLE";

const POST_RECIPES= "POST_RECIPES";

const GET_ID = "GET_ID";
const RESET_DETAIL="RESET_DETAIL"

export const initialState = {
  recipes: [],
  allRecipes: [],
  details: [],
  typeDiet: [],
};

function rootReducer(state = initialState, action) {
  const allRecipes = state.allRecipes
  switch (action.type) {
    

//---------------------
case RESET_DETAIL:
  return{
    ...state,
    details:[]
  }
//---------------------
    case GET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
        allRecipes: action.payload,
      };
//---------------------
    case GET_BY_TITLE:
      return { 
        ...state, 
        recipes: action.payload,
      }
//---------------------
    case FILTER_DIET:      
    console.log("soy el.TypeDiet",allRecipes[0].TypeDiet)  
    console.log("soy el TypeDiet.name",allRecipes[0].TypeDiet[0].name)// ketogenic
      const typeDietFilter = action.payload==="all"
      ?allRecipes 
      :allRecipes.filter(el=>el.TypeDiet?.find(el=>el.name===action.payload))
      //:allRecipes.map(el=>el.TypeDiet.filter(el=>el.name===action.payload))
      return {
        ...state,
        recipes:typeDietFilter
      }
//---------------------
    case FILTER_CREATED:
      const createdFilter=action.payload==="created"
      ?allRecipes.filter(el=>el.createdInDb)
      :allRecipes.filter(el=>!el.createdInDb)
      return{
        ...state,
        recipes: action.payload==="all"
        ?state.allRecipes
        :createdFilter
      }
//-------- ORDENAR ALFABETICAMENTE -----------------------------------------
      case ORDER_BY_TITLE:
        //-1, se va a situar en un indice menor a b.
        //1, b se va a situar en un indice menor a a.
        //0, no hay cambios.
        let order = action.payload === "asc"
        ?state.recipes.sort(function(a,b){
          if(a.title.toLowerCase() > b.title.toLowerCase()){
            return 1;
          }
        if(b.title.toLowerCase() > a.title.toLowerCase()){
          return -1;
          }
          return 0;
        }):
        state.recipes.sort(function(a,b){
          if(a.title.toLowerCase() > b.title.toLowerCase()){
            return -1;
          }
          if(b.title.toLowerCase() > a.title.toLowerCase()){
            return 1;
          }
          return 0;
        })
        return {
          ...state,
          recipes:order
      }
//---------------------
case ORDER_BY_SCORE:
  //-1, se va a situar en un indice menor a b.
  //1, b se va a situar en un indice menor a a.
  //0, no hay cambios.
  let orderScor = action.payload === 'low' ? 
  state.recipes.sort(function(a,b) {
      if(a.healthScore > b.healthScore) {
          return 1
      }
      if( b.healthScore > a.healthScore){
          return -1
      }
      return 0
  }) : 
  state.recipes.sort(function(a,b) {
      if(a.healthScore > b.healthScore) {
          return -1
      }
      if( b.healthScore > a.healthScore){
          return 1
      }
      return 0
  })
  return{
      ...state ,
      recipes : orderScor
}
//---------------------
case GET_BY_DIET:
  return {
    ...state,
    typeDiet:action.payload
  }
//---------------------
case POST_RECIPES:
  return {
    ...state,
  }
//---------------------
case GET_ID:
console.log("deberia funcionar reducer by id")  
return {
    ...state,
    details:action.payload
  }
//---------------------
    default:
      return state;
  }
}

export default rootReducer;
