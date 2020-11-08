import './Locations.scss';


const Locations = (props) => {

  return (
    <div className="Locations">
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