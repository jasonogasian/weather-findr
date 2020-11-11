import { useState } from "react";

import './Tabbed.scss';


function Tabbed(props) {
  const [ chosen, setChosen ] = useState(props.activeIndex || 0);
  const tabs = props.tabs;
  const chosenChild = props.children[chosen];
  
  return (
    <div className="Tabbed">
      <div className="tabs">
        { tabs.map((t,i) => {
          const className = `tab ${chosen === i ? ' active' : ''}`
          return (
            <div key={i} className={ className } onClick={ () => setChosen(i) }>
              { t.label }
            </div>
          )
        })}
      </div>
      <div className="content">
        { chosenChild }
      </div>
    </div>
  )
}

export default Tabbed;