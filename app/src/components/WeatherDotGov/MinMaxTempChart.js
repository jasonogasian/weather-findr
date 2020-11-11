import { useCallback, useMemo } from "react";
import { celcius2Farenheight } from "lib/conversions";
import Spinner from "components/Spinner/Spinner";
import { Chart } from 'react-charts'


function MinMaxTempChart(props) {
  const data = props.data;

  const getColor = useCallback(
    series => ({
      color: series.label.match(/high/i) ? '#BB2222' : '#2277DD',
    }),[]
  );


  const minMaxTempData = useMemo(() => {
    if (data === null) {
      return [];
    }
    else {
      return [
          {
          label: 'High Temp',
          data: data.maxTemperature.values.map(v => [new Date(v.validTime.replace(/\/.*$/, '')), celcius2Farenheight(v.value)])
        },
        {
          label: 'Low Temp',
          data: data.minTemperature.values.map(v => [new Date(v.validTime.replace(/\/.*$/, '')), celcius2Farenheight(v.value)])
        },
      ]
    }
  },[data]);


  const axes = useMemo(() => ([
    { primary: true, type: 'utc', position: 'bottom' },
    { type: 'linear', position: 'left' }
  ]), []);


  if (!props.data) {
    return <Spinner />;
  }

  return (
    <div className="MinMaxTempChart Chart">
      <h4>Temperatures (&deg;F)</h4>
      <Chart tooltip data={ minMaxTempData } axes={ axes } getSeriesStyle={ getColor }/>
    </div>
  )
}



export default MinMaxTempChart;