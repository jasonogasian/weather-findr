import './Locations.scss';


const Locations = (props) => {
  const className = `Locations ${props.active ? 'active' : ''}`;


  const renderGroup = group => {
    return (
      <div key={group.groupLabel} className="group">
        <div className="group-label">{ group.groupLabel }</div>
        { group.values.map(l => (
          <button key={ getKey(l.geo) } className="location" onClick={ () => props.onChoose(l) }>
            { l.label }
          </button>
        ))}
      </div>
    )
  }


  return (
    <div className={ className }>
      <h4>Choose a Summit</h4>
      { props.data.map(renderGroup) }
    </div>
  );
}

export default Locations;


function getKey(geo) {
  return `${geo.lat},${geo.lng}`;
}