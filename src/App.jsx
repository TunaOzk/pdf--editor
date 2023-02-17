import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import { HOME_PAGE_PATH, PDF_EDIT_PAGE_PATH } from './constants/routePaths';
import HomePage from './pages/HomePage';
import PdfEditPage from './pages/PdfEditPage';

function App() {
  return (
    <Routes>
      <Route path={HOME_PAGE_PATH} element={<HomePage />} />
      <Route path={PDF_EDIT_PAGE_PATH} element={<PdfEditPage />} />
    </Routes>

  );
}

export default App;
