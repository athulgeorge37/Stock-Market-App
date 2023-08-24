import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

const StockVisualizer = () => {
    const stockData = useQuery({
        queryKey: [api.alphaVantage.daily.key],
        queryFn: () =>
            api.alphaVantage.daily.query({
                testing: true,
            }),
    });

    if (stockData.isLoading) {
        return <span>Loading...</span>;
    }

    //const k = stockData.data?.["Time Series (5min)"].at(0)

    return (
        <div>
            <pre className={"w-full max-w-xs text-clip"}>
                {JSON.stringify(stockData.data ?? stockData.error, null, 4)}
            </pre>
        </div>
    );
};

export default StockVisualizer;
