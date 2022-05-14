import React from 'react';
import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";

// components
import { Restaurants } from './containers/Restaurants.jsx';
import { Foods } from './containers/Foods.jsx';
import { Orders } from './containers/Orders.jsx';
import { Home } from './containers/Home';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" exact element={<Restaurants />} />
        {/* <Route
          exact
          path="/restaurants/:restaurantsId/foods"
          render={({ match }) => <Foods match={match} />}
        /> */}
        <Route
          exact
          path="/orders"
          element={<Restaurants />} />
      </Routes>
    </>
  );
}

export default App;
