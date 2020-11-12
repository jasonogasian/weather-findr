import { useCallback, useMemo, useContext } from "react";
import { celcius2Farenheight, formatChartTime } from "lib/conversions";
import Spinner from "components/Spinner/Spinner";
import { Chart } from 'react-charts'
import { DarkModeContext } from "components/App/App";


function MinMaxTempChart(props) {
  const darkMode = useContext(DarkModeContext);
  const data = props.data;

  const getColor = useCallback(
    series => ({
      color: series.label.match(/high/i) ? '#BB2222' : '#2299DD',
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
    { primary: true, type: 'utc', position: 'bottom', format: formatChartTime },
    { type: 'linear', position: 'left' }
  ]), []);


  if (!props.data) {
    return <Spinner />;
  }

  return (
    <div className="MinMaxTempChart Chart">
      <Chart tooltip dark={ darkMode } data={ minMaxTempData } axes={ axes } getSeriesStyle={ getColor }/>
    </div>
  )
}

export default MinMaxTempChart;
