
export const celcius2Farenheight = (c) => {
  return c * (9/5) + 32;
}


export const meters2Feet = (m) => {
  return m * 3.281;
}


export const km2Mi = (km) => {
  return km / 1.609;
}


export const formatChartTime = (label) => {
  return label.replace(/^0/, '').replace(' AM', 'am').replace(' PM', 'pm');
}
