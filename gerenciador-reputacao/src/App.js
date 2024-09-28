import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './map/MapComponent';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/map" element={
              <MapComponent />
          } />

        </Routes>
      </Router>
   );
};

export default App;
