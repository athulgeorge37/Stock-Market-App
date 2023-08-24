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
} from "d3";

interface StockVisualizerProps {
    metaData: z.infer<typeof api.alphaVantage.daily.schema>["metaData"];
    data: z.infer<typeof api.alphaVantage.daily.schema>["timeSeries"];
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

const testData = [0, 30, 40, 60, 20, 60, 75];

const StockVisualizer = () => {
    // using a ref to let d3 handle rendering of the svg
    const svgRef = useRef<ElementRef<"svg">>(null);
    const svgWrapperRef = useRef<ElementRef<"div">>(null);

    const dimensions = useResizeObserver(svgWrapperRef);

    useEffect(() => {
        const svg = select(svgRef.current);

        if (dimensions === null) return;

        console.log({ height: dimensions.height, width: dimensions.width });

        // xScale will take a domain value and scale it linearly to the range
        // for example, domain 0 --> 0 range and domain 6 --> 300 range
        const xScale = scaleLinear()
            .domain([0, testData.length - 1])
            .range([0, dimensions.width]);

        // axis bottom only positions the ticks on the bottom side of the horizontal line
        const xAxis = axisBottom(xScale).ticks(testData.length);
        // .tickFormat((index) => index + 1);
        svg.select("#x-axis")
            .style("transform", `translateY(${dimensions.height}}px)`)
            .call(xAxis);

        const yScale = scaleLinear()
            .domain([0, 150])
            .range([dimensions.height, 0]);
        const yAxis = axisRight(yScale);
        svg.select("#y-axis")
            .style("transform", `translateX(${dimensions.width}}px)`)
            .call(yAxis);

        // creating a function that takes a number a applies the scales to each line
        const myLine = line<(typeof testData)[number]>()
            .x((value, index) => xScale(index))
            .y((value) => yScale(value))
            .curve(curveCardinal);

        // creating the line from the data
        svg.selectAll("#line")
            // since we dont want a path for every data point, we put our array into another array
            .data([testData])
            .join("path")
            .attr("id", "line")
            .attr("d", (v) => myLine(v))
            .attr("fill", "none")
            .attr("stroke", "blue");
    }, [dimensions]);

    return (
        <div
            ref={svgWrapperRef}
            className="w-full max-w-[600px] px-10"
        >
            <svg
                ref={svgRef}
                className="block w-full overflow-visible bg-slate-100"
            >
                <g id="x-axis" />
                <g id="y-axis" />
            </svg>
        </div>
    );
};

export default StockVisualizer;
