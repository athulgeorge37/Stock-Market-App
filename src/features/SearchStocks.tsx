import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/api";
import Button from "~/components/Button";
import Input from "~/components/Input";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useDebounce } from "~/helper/hooks/useDebounce";

interface SearchStocksProps {
    setSelectedStockSymbol: (symbol: string) => void;
}

const SearchStocks = ({ setSelectedStockSymbol }: SearchStocksProps) => {
    const [tickerSearch, setTickerSearch] = useState("");

    const debouncedTickerSearch = useDebounce({
        value: tickerSearch,
        delayInSeconds: 0.5,
    });

    const tickerSymbols = useQuery({
        queryKey: [api.alphaVantage.tickerSearch.key, debouncedTickerSearch],
        queryFn: () =>
            api.alphaVantage.tickerSearch.query({
                keywordSearch: debouncedTickerSearch,
                testing: true,
            }),
        enabled: z.string().min(1).safeParse(debouncedTickerSearch).success,
    });

    return (
        <div className="relative flex flex-col gap-2">
            <Input
                id="search-stock"
                // placeholder="TSLA"
                label="Find A stock"
                className="w-[400px]"
                hideError
                value={tickerSearch}
                onChange={(e) => setTickerSearch(e.target.value)}
            />

            <div className="absolute inset-0 translate-y-full pt-2">
                {tickerSymbols.isFetching ? (
                    <div className="flex flex-col rounded-md border border-slate-300 p-2 shadow-md">
                        <LoadingSpinner />
                    </div>
                ) : tickerSymbols.data ? (
                    <div className="flex flex-col rounded-md border border-slate-300 bg-white shadow-md">
                        {tickerSymbols.data.bestMatches.map((symbol) => {
                            return (
                                <Button
                                    key={symbol.symbol}
                                    variant={"white"}
                                    className="justify-start bg-white"
                                    onClick={() => {
                                        setSelectedStockSymbol(symbol.symbol);
                                        setTickerSearch("");
                                    }}
                                >
                                    {symbol.symbol}
                                </Button>
                            );
                        })}
                    </div>
                ) : (
                    debouncedTickerSearch !== "" && (
                        <div className="flex flex-col rounded-md border border-slate-300 p-2 shadow-md">
                            <span className="text-rose-600">
                                No Results Found
                            </span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchStocks;
