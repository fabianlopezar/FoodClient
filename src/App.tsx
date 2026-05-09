import './App.css';
import type { FC } from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Landing from './vistas/Landing.jsx';
import Home from './vistas/Home.jsx';
import { Create } from './components/Create';
import Details from './components/Details';
import NotificationSettings from './pages/NotificationSettings';

/**
 * Raíz de rutas Ionic + React Router.
 * La pantalla de notificaciones vive en `/notifications/settings`.
 */
const App: FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/recipes/:id" component={Details} />
          <Route exact path="/recipe" component={Create} />
          <Route
            exact
            path="/notifications/settings"
            component={NotificationSettings}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
