import {bin, brushX, extent, max, scaleLinear, scaleTime, select, sum, timeFormat, timeMonths} from 'd3';
import React, {useEffect, useMemo, useRef} from "react";
import {AxisLeft} from "../AxisLeft";
import {AxisBottom} from "../AxisBottom";
import {Marks} from "./Marks";

const xAxisTickFormat = timeFormat('%m/%d/%Y');

const margin = {top: 0, right: 30, bottom: 20, left: 50};
const xAxisLabelOffset = 54;
const yAxisLabelOffset = 30;

const xAxisLabel = 'Time';
const yValue = d => d['Total Dead and Missing'];
const yAxisLabel = 'Total Dead and Missing';

const DateHistogram = ({data, width, height, setBrushExtent, xValue}) => {
  const brushRef = useRef()



  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xScale = useMemo(() => scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice(), [data, xValue, innerWidth])


  const binnedData = useMemo(() => {
    const [start, stop] = xScale.domain();
    return bin()
      .value(xValue)
      .domain(xScale.domain())
      .thresholds(timeMonths(start, stop))(data)
      .map(array => ({
        y: sum(array, yValue),
        x0: array.x0,
        x1: array.x1
      }))
  }, [xValue, xScale, data, yValue]);

  const yScale = useMemo(() => scaleLinear()
    .domain([0, max(binnedData, d => d.y)])
    .range([innerHeight, 0]), [binnedData, innerHeight]);

  useEffect(() => {
    const brush = brushX()
      .extent([[0, 0], [innerWidth, innerHeight]]);

    brush(select(brushRef.current));
    brush.on('brush end', (event) => {
      setBrushExtent(event.selection ? event.selection.map(xScale.invert) : null);
    });
  }, [innerWidth, innerHeight])

  return (
    <>
      <rect width={width} height={height} fill='white'/>
      <g transform={`translate(${margin.left},${margin.top})`}>

        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
          tickOffset={5}
        />
        <text
          className="axis-label"
          textAnchor="middle"
          transform={`translate(${-yAxisLabelOffset},${innerHeight /
          2}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>
        <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5}/>
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          {xAxisLabel}
        </text>
        <Marks
          binnedData={binnedData}
          xScale={xScale}
          yScale={yScale}
          tooltipFormat={d => d}
          circleRadius={2}
          innerHeight={innerHeight}
        />
        <g ref={brushRef}/>
      </g>
    </>
  )
}
export default DateHistogram