import {BrowserRouter} from "react-router-dom";
import {AppRouter} from './Router'
import "./style.scss"
import './index.css'
import './style.css'



function App() {
  return (    
    <div className="app">       
        <BrowserRouter>
          <AppRouter/>
        </BrowserRouter>      
    </div>
  );
}

export default App;