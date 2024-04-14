import './App.css';
import UserPage from './components/UserPage';
import NewUserForm from './components/NewUserForm';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/new" element={< NewUserForm />} />
        <Route path="/users/:username" element={< UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
