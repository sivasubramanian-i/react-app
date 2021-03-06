import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {Routes}
      </div>
    </BrowserRouter>
  );
}

export default App;
