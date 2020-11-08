import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import LocalWeather from "components/LocalWeather/LocalWeather";
import SkiTahoe from "components/SkiTahoe/SkiTahoe";

import './App.scss';


// Icons
library.add(faSnowflake);


function App() {
  return (
    <div className="App">
      <header className="App-header">
        Tahoe Weather Findr&nbsp;&nbsp;
        <FontAwesomeIcon icon={faSnowflake} />
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
