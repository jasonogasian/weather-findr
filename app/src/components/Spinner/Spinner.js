import './Spinner.scss';


function Spinner(props) {

  return (
    <div className="Spinner">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Spinner;
