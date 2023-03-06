import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import {
  HOME_PAGE_PATH, PDF_MERGE_PAGE_PATH, OPERATION_PAGE_PATH, EDIT_PDF_PAGE_PATH,
} from './constants/routePaths';
import EditPdfPage from './pages/EditPdfPage';
import HomePage from './pages/HomePage';
import OperationPage from './pages/OperationPage';
import PdfMergePage from './pages/PdfMergePage';

function App() {
  return (
    <Routes>
      <Route path={HOME_PAGE_PATH} element={<HomePage />} />
      <Route path={PDF_MERGE_PAGE_PATH} element={<PdfMergePage />} />
      <Route path={OPERATION_PAGE_PATH} element={<OperationPage />} />
      <Route path={EDIT_PDF_PAGE_PATH} element={<EditPdfPage />} />
    </Routes>

  );
}

export default App;
