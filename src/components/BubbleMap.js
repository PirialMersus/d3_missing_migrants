import {max, scaleSqrt} from "d3";
import {Marks} from "./Marks";
import React, {useMemo} from "react";

const sizeValue = (d) => d['Total Dead and Missing'];
const maxRadius = 15

const BubbleMap = ({data, filteredData, worldAtlas}) => {

  const sizeScale = useMemo(() => scaleSqrt()
    .domain([0, max(data,sizeValue)])
    .range([0, maxRadius]), [data, maxRadius, sizeValue])

  return (
    <Marks
      data={filteredData}
      worldAtlas={worldAtlas}
      sizeScale={sizeScale}
      sizeValue={sizeValue}
    />
  )
}
export default BubbleMap