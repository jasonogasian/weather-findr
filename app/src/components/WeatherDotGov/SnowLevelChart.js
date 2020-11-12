import { useCallback, useMemo, useContext } from "react";
import { formatChartTime, meters2Feet } from "lib/conversions";
import Spinner from "components/Spinner/Spinner";
import { Chart } from 'react-charts'
import { DarkModeContext } from "components/App/App";


function SnowLevelChart(props) {
  const darkMode = useContext(DarkModeContext);
  const data = props.data;
  const elevation = meters2Feet(data.elevation.value);

  const getColor = useCallback(series => ({
    color: series.label.match(/elevation/i) ? '#BB2222' : '#22DDDD',
  }),[]);


  const snowLineData = useMemo(() => {
    if (data === null) {
      return [];
    }
    else {
      return [
        {
          label: 'Summit Elevation',
          data: [
            [new Date(data.snowLevel.values[0].validTime.replace(/\/.*$/, '')), elevation],
            [new Date(data.snowLevel.values[data.snowLevel.values.length-1].validTime.replace(/\/.*$/, '')), elevation],
          ]
        },
        {
          label: 'Snow Level',
          data: data.snowLevel.values.map(v => [new Date(v.validTime.replace(/\/.*$/, '')), meters2Feet(v.value)])
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
    <div className="SnowLevelChart Chart">
      <Chart tooltip dark={ darkMode } data={ snowLineData } axes={ axes } getSeriesStyle={ getColor }/>
    </div>
  )
}

export default SnowLevelChart;
