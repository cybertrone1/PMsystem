import NavBar from "./NavBar";
import Home from "./Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DataComponent from "./DataComponent";

function App() {

  return (
    <Router>
      <div className="content">
      < NavBar />
        <div className="subContent">
        <Routes>
          <Route path="/" element={ < Home /> } />
          <Route path="/home" element={<DataComponent />} />
        </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
