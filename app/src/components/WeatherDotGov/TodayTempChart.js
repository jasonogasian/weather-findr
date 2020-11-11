import { useCallback, useMemo } from "react";
import { celcius2Farenheight } from "lib/conversions";
import Spinner from "components/Spinner/Spinner";
import { Chart } from 'react-charts'


function TodayTempChart(props) {
  const data = props.data;

  const getColor = useCallback(
    series => ({ color: '#2299DD' }),[]
  );


  const tempData = useMemo(() => {
    const eod = new Date();
    eod.setHours(23,59,59,999);

    const today = data.temperature.values.filter(d => new Date(d.validTime.replace(/\/.*$/, '')) <= eod);
    if (data === null) {
      return [];
    }
    else {
      return [
        {
          label: 'Temperature',
          data: today.map(v => [new Date(v.validTime.replace(/\/.*$/, '')), celcius2Farenheight(v.value)])
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
    <div className="TodayTempChart Chart">
      <Chart tooltip data={ tempData } axes={ axes } getSeriesStyle={ getColor }/>
    </div>
  )
}

export default TodayTempChart;
