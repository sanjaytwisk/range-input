import React from 'react'

export interface RangeFillProps {
  start: number
  end: number
}

export const RangeFill: React.FunctionComponent<RangeFillProps> = ({
  start,
  end,
}) => (
  <div
    className="range-fill"
    style={{
      width: `${end - start}%`,
      left: `${start}%`,
    }}
  />
)
