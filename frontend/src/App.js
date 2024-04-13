import './App.css';
import Test from './components/Test'
import NewUserForm from './components/NewUserForm'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

// Example of a component that takes a parameterized route
function UserPage() {
  // Access route parameters using the useParams hook
  const params = useParams();
  // The params object will contain a property with the name of your route parameter
  return <h2>User ID: {params.username}</h2>;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/new" element={< NewUserForm />} />
        <Route path="/users/:username" element= {< UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
