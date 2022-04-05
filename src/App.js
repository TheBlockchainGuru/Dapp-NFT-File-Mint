import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MainPage from './views/MainPage';
import BSCMinter from './views/BSCMinter';
import EtherMinter from './views/EtherMinter';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/bsc" component={BSCMinter} />
        <Route path="/ether" component={EtherMinter} />
      </Switch>
    </Router>
  );
}

export default App;
