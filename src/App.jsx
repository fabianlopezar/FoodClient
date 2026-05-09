import "./App.css";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import Landing from "./vistas/Landing.jsx";
import Home from "./vistas/Home.jsx";
import { Create } from "./components/Create";
import Details from "./components/Details";

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/recipes/:id" component={Details} />
          <Route exact path="/recipe" component={Create} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
