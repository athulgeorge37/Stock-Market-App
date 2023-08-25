import {
    type ElementRef,
    useRef,
    useEffect,
    useState,
    type RefObject,
} from "react";
import { type z } from "zod";
import { type api } from "~/api";
import {
    select,
    line,
    curveCardinal,
    axisBottom,
    scaleLinear,
    axisRight,
    scaleTime,
    extent,
    max,
    area,
    min,
} from "d3";

interface StockVisualizerProps {
    metaData: z.infer<typeof api.alphaVantage.daily.schema>["metaData"];
    data: z.infer<typeof api.alphaVantage.daily.schema>["timeSeries"]; // use the close value as the number to use
}

const useResizeObserver = (ref: RefObject<ElementRef<"div">>) => {
    const [dimensions, setDimensions] = useState<DOMRect | null>(null);

    useEffect(() => {
        const observeTarget = ref.current;

        if (!observeTarget) return;

        const resizeObserver = new ResizeObserver((entries) => {
            // console.log({ entries });
            entries.forEach((entry) => setDimensions(entry.contentRect));
        });

        resizeObserver.observe(observeTarget);

        return () => resizeObserver.unobserve(observeTarget);
    }, [ref]);

    return dimensions;
};

const margin = {
    top: 70,
    right: 60,
    bottom: 50,
    left: 80,
} as const;

const StockVisualizer = ({ data }: StockVisualizerProps) => {
    // using a ref to let d3 handle rendering of the svg
    const svgRef = useRef<ElementRef<"svg">>(null);
    const svgWrapperRef = useRef<ElementRef<"div">>(null);

    const dimensions = useResizeObserver(svgWrapperRef);

    useEffect(() => {
        const svg = select(svgRef.current);

        if (dimensions === null) return;

        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const xScale = scaleTime()
            .range([0, width])
            .domain(extent(data, (d) => d.date));

        const minimum = min(data, (d) => d.close);
        const maximum = max(data, (d) => d.close);
        const yScale = scaleLinear()
            .domain([minimum - 0.2, maximum + 0.2])
            .range([height, 0]);

        const xAxis = axisBottom(xScale);
        // .tickFormat((index) => index + 1);
        svg.select("#x-axis")
            .style("transform", `translateY(${height}px)`)
            .call(xAxis);

        const yAxis = axisRight(yScale);
        svg.select("#y-axis")
            .style("transform", `translateX(${width}px)`)
            .call(yAxis);

        const myLine = line<(typeof data)[number]>()
            .x((value) => xScale(value.date))
            .y((value) => yScale(value.close));

        const myArea = area<(typeof data)[number]>()
            .x((d) => xScale(d.date))
            .y0(height)
            .y1((d) => d.close);

        // svg.append("path")
        //     .datum(data)
        //     .attr("class", "area")
        //     .attr("d", myArea)
        //     .attr("fill", "#85bb65")
        //     .attr("opacity", 0.5);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1)
            .attr("opacity", 0.5)
            .attr("d", myLine);
    }, [dimensions]);

    return (
        <div
            ref={svgWrapperRef}
            className="h-[700px] w-full max-w-[1200px] bg-slate-100"
        >
            <svg
                ref={svgRef}
                className="block w-full overflow-visible"
            >
                <g id="x-axis" />
                <g id="y-axis" />
            </svg>
        </div>
    );
};

export default StockVisualizer;
