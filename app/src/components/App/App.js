import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { createContext } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import LocalWeather from "components/LocalWeather/LocalWeather";
import SkiTahoe from "components/SkiTahoe/SkiTahoe";

import './App.scss';


// Icons
library.add(faSnowflake);


// Dark Mode
let darkMode = false;
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkMode = true;
  document.body.classList.add('dark-mode');
  document.documentElement.classList.add('dark-mode');
}


export const DarkModeContext = createContext(darkMode);


function App() {
  return (
    <div className="App">
      <header className="App-header">
        Tahoe Weather Findr&nbsp;&nbsp;
        <FontAwesomeIcon icon={faSnowflake} />
      </header>

      <DarkModeContext.Provider value={ darkMode }>
        <Router>
          <Switch>
            <Route exact path="/" component={ LocalWeather } />
            <Route exact path="/ski-slt" component={ SkiTahoe } />
          </Switch>
        </Router>
      </DarkModeContext.Provider>
    </div>
  );
}

export default App;
