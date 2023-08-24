import { type ElementRef, useRef, useEffect } from "react";
import { type z } from "zod";
import { type api } from "~/api";
import { select } from "d3";

interface StockVisualizerProps {
    metaData: z.infer<typeof api.alphaVantage.daily.schema>["metaData"];
    data: z.infer<typeof api.alphaVantage.daily.schema>["timeSeries"];
}

const testData = [25, 30, 45, 60, 20];

const StockVisualizer = () => {
    // using a ref to let d3 handle rendering of the svg
    const svgRef = useRef<ElementRef<"svg">>(null);

    useEffect(() => {
        const svg = select(svgRef.current);

        svg.selectAll("circle")
            .data(testData)
            // .join(
            //     (enter) => enter.append("circle"),
            //     (update) => update.attr("class", "updated"),
            //     (exit) => exit.remove()
            // )
            .join("circle") // this line and the above line do the same
            .attr("r", (v) => v) // v represents the data from testData
            .attr("cx", (v) => v * 2)
            .attr("cy", (v) => v * 2)
            .attr("stroke", "red");
    }, []);

    return (
        <div className="w-fit rounded-md border-2 border-emerald-600">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default StockVisualizer;
