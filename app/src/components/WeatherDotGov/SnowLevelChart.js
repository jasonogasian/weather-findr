import { useCallback, useMemo } from "react";
import { meters2Feet } from "lib/conversions";
import Spinner from "components/Spinner/Spinner";
import { Chart } from 'react-charts'


function SnowLevelChart(props) {
  const data = props.data;

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
            [new Date(data.snowLevel.values[0].validTime.replace(/\/.*$/, '')), data.elevation.value],
            [new Date(data.snowLevel.values[data.snowLevel.values.length-1].validTime.replace(/\/.*$/, '')), data.elevation.value],
          ]
        },
        {
          label: 'Snow Level',
          data: data.snowLevel.values.map(v => [new Date(v.validTime.replace(/\/.*$/, '')), meters2Feet(v.value)])
        },
      ]
    }
  },[data]);
  console.log('data', snowLineData)


  const axes = useMemo(() => ([
    { primary: true, type: 'utc', position: 'bottom' },
    { type: 'linear', position: 'left' }
  ]), []);


  if (!props.data) {
    return <Spinner />;
  }

  return (
    <div className="SnowLevelChart Chart">
      <h4>Snow Level (ft)</h4>
      <Chart tooltip data={ snowLineData } axes={ axes } getSeriesStyle={ getColor }/>
    </div>
  )
}

export default SnowLevelChart;
