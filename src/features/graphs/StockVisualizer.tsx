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
    pointer,
    bisector,
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

        // svg graph dimensions
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        // tooltip
        const tooltip = select("body").append("div").attr("class", "tooltip");

        const tooltipRawDate = select("body")
            .append("div")
            .attr("class", "tooltipRawData");

        // the range of x values we want out data to occupy
        const xScale = scaleTime()
            .range([0, width])
            .domain(extent(data, (d) => d.date));

        const minimum = min(data, (d) => d.close); // minimum value of data
        const maximum = max(data, (d) => d.close); // maximum value of data

        // yScale = the range of y values we want our data to occupy
        const yScale = scaleLinear()
            .domain([minimum - 0.2, maximum + 0.2])
            .range([height, 0]);

        const xAxis = axisBottom(xScale);
        // adding xAxis to our svg
        // .tickFormat((index) => index + 1);
        svg.select("#x-axis")
            .style("transform", `translateY(${height}px)`)
            .call(xAxis);

        const yAxis = axisRight(yScale);
        // adding y axis to our svg
        svg.select("#y-axis")
            .style("transform", `translateX(${width}px)`)
            .call(yAxis);

        // area generator
        const myArea = area<(typeof data)[number]>()
            .x((d) => xScale(d.date))
            .y0(height)
            .y1((d) => yScale(d.close));

        // adding green area under line
        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", myArea)
            .attr("fill", "#85bb65")
            .attr("opacity", 0.5);

        // const gradient = svg
        //     .append("defs")
        //     .append("linearGradient")
        //     .attr("id", "gradient")
        //     .attr("x1", "0%")
        //     .attr("x2", "0%")
        //     .attr("y1", "0%")
        //     .attr("y2", "100%")
        //     .attr("spreadMethod", "pad");

        // gradient
        //     .append("stop")
        //     .attr("offset", "0%")
        //     .attr("stop-color", "#85bb65")
        //     .attr("stop-opacity", 1);

        // gradient
        //     .append("stop")
        //     .attr("offset", "100%")
        //     .attr("stop-color", "#85bb65")
        //     .attr("stop-opacity", 0);

        // line generator
        const myLine = line<(typeof data)[number]>()
            .x((value) => xScale(value.date))
            .y((value) => yScale(value.close));

        // adding line of closing price
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#85bb65")
            .attr("stroke-width", 1)
            // .attr("opacity", 0.5)
            .attr("d", myLine);

        // adding circle element for tooltip hover
        const circle = svg
            .append("circle")
            .attr("r", 0)
            .attr("fill", "red")
            .style("stroke", "white")
            .attr("opacity", 0.7)
            .style("pointer-events", "none");

        // adding dashed lines that run through the circle
        const tooltipLineX = svg
            .append("line")
            .attr("class", "tooltip-line")
            .attr("id", "tooltip-line-x")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2");

        const tooltipLineY = svg
            .append("line")
            .attr("class", "tooltip-line")
            .attr("id", "tooltip-line-y")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2");

        // create an event listener the same size as our svg
        const listeningRect = svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("opacity", 0);

        listeningRect.on("mousemove", (e) => {
            // trying to find the closest data point from data based on mouse position
            const [xCoord] = pointer(e, this);
            const bisectDate = bisector<(typeof data)[number]>(
                (d) => d.date
            ).left;
            const x0 = xScale.invert(xCoord);
            const i = bisectDate(data, x0, 1);
            const d0 = data[i - 1];
            const d1 = data[i];
            const d = x0 - d0?.date > d1?.date - x0 ? d1 : d0;
            const xPos = xScale(d?.date);
            const yPos = yScale(d?.close);

            // positioning circle based on x and y position of closest data point
            circle.attr("cx", xPos).attr("cy", yPos);

            // Add transition for the circle radius
            circle.transition().duration(50).attr("r", 5);

            // Update the position of the red lines
            tooltipLineX
                .style("display", "block")
                .attr("x1", xPos)
                .attr("x2", xPos)
                .attr("y1", 0)
                .attr("y2", height);
            tooltipLineY
                .style("display", "block")
                .attr("y1", yPos)
                .attr("y2", yPos)
                .attr("x1", 0)
                .attr("x2", width);

            // add in our tooltip
            tooltip
                .style("display", "block")
                .style("left", `${width + margin.left + margin.right - 20}px`)
                .style(
                    "top",
                    `${yPos + margin.top + margin.bottom + 31 + 31}px`
                )
                .html(
                    `$${d?.close !== undefined ? d.close.toFixed(2) : "N/A"}`
                );

            // tooltipRawDate
            //     .style("display", "block")
            //     .style("left", `${xPos + 60}px`)
            //     .style("top", `${height + 53}px`)
            //     .html(
            //         `${
            //             d?.date !== undefined
            //                 ? d.date.toISOString().slice(0, 10)
            //                 : "N/A"
            //         }`
            //     );
        });
    }, [dimensions]);

    return (
        <div
            ref={svgWrapperRef}
            className="h-[500px] w-full max-w-[1200px] bg-slate-100"
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
