import { useCallback, useMemo, useContext } from "react";
import { celcius2Farenheight, formatChartTime } from "lib/conversions";
import Spinner from "components/Spinner/Spinner";
import { Chart } from 'react-charts'
import { DarkModeContext } from "components/App/App";


function FutureTempChart(props) {
  const darkMode = useContext(DarkModeContext);
  const data = props.data;

  const getColor = useCallback(
    series => ({ color: '#2299DD' }),[]
  );


  const tempData = useMemo(() => {
    if (data === null) {
      return [];
    }
    else {
      return [
        {
          label: 'Temperature',
          data: data.temperature.values.map(v => [new Date(v.validTime.replace(/\/.*$/, '')), celcius2Farenheight(v.value)])
        },
      ]
    }
  },[data]);


  const axes = useMemo(() => ([
    { primary: true, type: 'utc', position: 'bottom', format: formatChartTime },
    { type: 'linear', position: 'left' }
  ]), []);


  if (!props.data) {
    return <Spinner />;
  }

  return (
    <div className="FutureTempChart Chart">
      <Chart tooltip dark={ darkMode } data={ tempData } axes={ axes } getSeriesStyle={ getColor }/>
    </div>
  )
}

export default FutureTempChart;
