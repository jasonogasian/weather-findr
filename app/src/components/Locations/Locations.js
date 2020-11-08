import './Locations.scss';


const Locations = (props) => {
  const className = `Locations ${props.active ? 'active' : ''}`;

  return (
    <div className={ className }>
      {
        props.data.map(l => (
          <button key={ getKey(l.geo) } className="location" onClick={ () => props.onChoose(l) }>
            { l.label }
          </button>
        ))
      }
    </div>
  );
}

export default Locations;


function getKey(geo) {
  return `${geo.lat},${geo.lng}`;
}