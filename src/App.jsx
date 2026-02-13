import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./vistas/Landing.jsx";
import Home from "./vistas/Home.jsx";
import { Create } from "./components/Create";
import Details from "./components/Details";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/recipes/:id" component={Details} />
          <Route exact path="/recipe" component={Create} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
