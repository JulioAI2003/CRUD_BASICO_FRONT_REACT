import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowPersonas from './components/ShowPersonas';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route  path='/' element={<ShowPersonas></ShowPersonas>}>   </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
