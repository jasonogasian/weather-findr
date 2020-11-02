import { HashRouter as Router, Route, Switch } from "react-router-dom";
import LocalWeather from "components/LocalWeather/LocalWeather";
import SkiTahoe from "components/SkiTahoe/SkiTahoe";

import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Weather Findr
      </header>

      <Router>
        <Switch>
          <Route exact path="/" component={ LocalWeather } />
          <Route exact path="/ski-slt" component={ SkiTahoe } />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
