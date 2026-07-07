import * as React from "react";
import { cn } from "../../lib/utils";

export interface AreaChartPoint {
  x: number | string;
  y: number;
}

export interface AreaChartProps extends React.SVGAttributes<SVGSVGElement> {
  data: AreaChartPoint[];
  width?: number;
  height?: number;
}

export function AreaChart({ data, width = 240, height = 64, className, ...props }: AreaChartProps) {
  if (data.length === 0) {
    return <svg width={width} height={height} className={cn(className)} {...props} />;
  }

  const max = Math.max(...data.map((d) => d.y));
  const min = Math.min(...data.map((d) => d.y));
  const range = max - min || 1;
  const stepX = width / Math.max(1, data.length - 1);

  const points = data.map((d, i) => {
    const px = i * stepX;
    const py = height - ((d.y - min) / range) * height;
    return [px, py] as const;
  });

  const linePath = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px},${py}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn(className)} {...props}>
      <path d={areaPath} className="fill-primary/15 stroke-none" />
      <path d={linePath} className="fill-none stroke-primary" strokeWidth={2} />
    </svg>
  );
}

export interface MiniBarsProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
}

export function MiniBars({ data, width = 120, height = 32, className, ...props }: MiniBarsProps) {
  const max = Math.max(...data, 1);
  const gap = 2;
  const barWidth = data.length > 0 ? (width - gap * (data.length - 1)) / data.length : 0;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn(className)} {...props}>
      {data.map((value, i) => {
        const barHeight = (value / max) * height;
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={1}
            className="fill-primary"
          />
        );
      })}
    </svg>
  );
}
