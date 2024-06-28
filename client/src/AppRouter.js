import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PersonShowPage from './pages/PersonShowPage';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/people/:id" element={<PersonShowPage />} />
    </Routes>
  </Router>
);

export default AppRouter;



