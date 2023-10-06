import axios from "axios";
import { z } from "zod";
import { parseISO } from "date-fns";
import { getValidResponse } from "./axios";

const intraDayReturnSchema = z
    .object({
        "Meta Data": z
            .object({
                "1. Information": z.string(),
                "2. Symbol": z.string(),
                "3. Last Refreshed": z.string(),
                "4. Interval": z.string().optional(),

                "5. Output Size": z.string().optional(),
                "6. Time Zone": z.string().optional(),

                // "4. Output Size": z.string().optional(),
                // "5. Time Zone": z.string().optional(),
            })
            .transform((v) => ({
                information: v["1. Information"],
                symbol: v["2. Symbol"],
                lastRefreshed: v["3. Last Refreshed"],
                // ...(v["4. Interval"] && { interval: v["4. Interval"] }),
                // outputSize: v["5. Output Size"] ?? v["4. Output Size"],
                // timeZone: v["6. Time Zone"] ?? v["5. Time Zone"],
                interval: v["4. Interval"],
                outputSize: v["5. Output Size"],
                timeZone: v["6. Time Zone"],
            })),
        "Time Series (5min)": z
            .record(
                z.string(),
                z
                    .object({
                        // converting strings to floats
                        "1. open": z.string().transform((v) => parseFloat(v)),
                        "2. high": z.string().transform((v) => parseFloat(v)),
                        "3. low": z.string().transform((v) => parseFloat(v)),
                        "4. close": z.string().transform((v) => parseFloat(v)),
                        "5. volume": z.string().transform((v) => parseFloat(v)),
                    })
                    .transform((v) => ({
                        // converting key names
                        open: v["1. open"],
                        high: v["2. high"],
                        low: v["3. low"],
                        close: v["4. close"],
                        volume: v["5. volume"],
                    }))
            )
            .transform((v) =>
                Object.entries(v)
                    .sort(([dateA], [dateB]) => {
                        // comparing date strings to detmine order
                        return dateA > dateB ? 1 : 0;
                    })
                    .map(([date, values]) => ({
                        // date: format(parseISO(item[0]), "dd-MM-yyy hh:mm aaa"),
                        // converting string date to actual date
                        date: parseISO(date),
                        ...values,
                    }))
            ),
    })
    .transform((v) => ({
        metaData: v["Meta Data"],
        timeSeries: v["Time Series (5min)"],
    }));

const dailyReturnSchema = z
    .object({
        "Meta Data": z
            .object({
                "1. Information": z.string(),
                "2. Symbol": z.string(),
                "3. Last Refreshed": z.string(),
                "4. Time Zone": z.string().optional(),

                // "4. Output Size": z.string().optional(),
                // "5. Time Zone": z.string().optional(),
            })
            .transform((v) => ({
                information: v["1. Information"],
                symbol: v["2. Symbol"],
                lastRefreshed: v["3. Last Refreshed"],
                timeZone: v["4. Time Zone"],
            })),
        "Time Series (Daily)": z
            .record(
                z.string(),
                z
                    .object({
                        // converting strings to floats
                        "1. open": z.string().transform((v) => parseFloat(v)),
                        "2. high": z.string().transform((v) => parseFloat(v)),
                        "3. low": z.string().transform((v) => parseFloat(v)),
                        "4. close": z.string().transform((v) => parseFloat(v)),
                        "5. volume": z.string().transform((v) => parseFloat(v)),
                    })
                    .transform((v) => ({
                        // converting key names
                        open: v["1. open"],
                        high: v["2. high"],
                        low: v["3. low"],
                        close: v["4. close"],
                        volume: v["5. volume"],
                    }))
            )
            .transform((v) =>
                Object.entries(v)
                    .sort(([dateA], [dateB]) => {
                        // comparing date strings to detmine order
                        return dateA > dateB ? 1 : 0;
                    })
                    .map(([date, values]) => ({
                        // date: format(parseISO(item[0]), "dd-MM-yyy hh:mm aaa"),
                        // converting string date to actual date
                        date: parseISO(date),
                        ...values,
                    }))
            ),
    })
    .transform((v) => ({
        metaData: v["Meta Data"],
        timeSeries: v["Time Series (Daily)"],
    }));

const weeklyReturnSchema = z
    .object({
        "Meta Data": z
            .object({
                "1. Information": z.string(),
                "2. Symbol": z.string(),
                "3. Last Refreshed": z.string(),
                "4. Time Zone": z.string().optional(),

                // "4. Output Size": z.string().optional(),
                // "5. Time Zone": z.string().optional(),
            })
            .transform((v) => ({
                information: v["1. Information"],
                symbol: v["2. Symbol"],
                lastRefreshed: v["3. Last Refreshed"],
                timeZone: v["4. Time Zone"],
            })),
        "Weekly Time Series": z
            .record(
                z.string(),
                z
                    .object({
                        // converting strings to floats
                        "1. open": z.string().transform((v) => parseFloat(v)),
                        "2. high": z.string().transform((v) => parseFloat(v)),
                        "3. low": z.string().transform((v) => parseFloat(v)),
                        "4. close": z.string().transform((v) => parseFloat(v)),
                        "5. volume": z.string().transform((v) => parseFloat(v)),
                    })
                    .transform((v) => ({
                        // converting key names
                        open: v["1. open"],
                        high: v["2. high"],
                        low: v["3. low"],
                        close: v["4. close"],
                        volume: v["5. volume"],
                    }))
            )
            .transform((v) =>
                Object.entries(v)
                    .sort(([dateA], [dateB]) => {
                        // comparing date strings to detmine order
                        return dateA > dateB ? 1 : 0;
                    })
                    .map(([date, values]) => ({
                        // date: format(parseISO(item[0]), "dd-MM-yyy hh:mm aaa"),
                        // converting string date to actual date
                        date: parseISO(date),
                        ...values,
                    }))
            ),
    })
    .transform((v) => ({
        metaData: v["Meta Data"],
        timeSeries: v["Weekly Time Series"],
    }));

const monthlyReturnSchema = z
    .object({
        "Meta Data": z
            .object({
                "1. Information": z.string(),
                "2. Symbol": z.string(),
                "3. Last Refreshed": z.string(),
                "4. Time Zone": z.string().optional(),
            })
            .transform((v) => ({
                information: v["1. Information"],
                symbol: v["2. Symbol"],
                lastRefreshed: v["3. Last Refreshed"],
                timeZone: v["4. Time Zone"],
            })),
        "Monthly Time Series": z
            .record(
                z.string(),
                z
                    .object({
                        // converting strings to floats
                        "1. open": z.string().transform((v) => parseFloat(v)),
                        "2. high": z.string().transform((v) => parseFloat(v)),
                        "3. low": z.string().transform((v) => parseFloat(v)),
                        "4. close": z.string().transform((v) => parseFloat(v)),
                        "5. volume": z.string().transform((v) => parseFloat(v)),
                    })
                    .transform((v) => ({
                        // converting key names
                        open: v["1. open"],
                        high: v["2. high"],
                        low: v["3. low"],
                        close: v["4. close"],
                        volume: v["5. volume"],
                    }))
            )
            .transform((v) =>
                Object.entries(v)
                    .sort(([dateA], [dateB]) => {
                        // comparing date strings to detmine order
                        return dateA > dateB ? 1 : 0;
                    })
                    .map(([date, values]) => ({
                        // date: format(parseISO(item[0]), "dd-MM-yyy hh:mm aaa"),
                        // converting string date to actual date
                        date: parseISO(date),
                        ...values,
                    }))
            ),
    })
    .transform((v) => ({
        metaData: v["Meta Data"],
        timeSeries: v["Monthly Time Series"],
    }));

const tickerSearchReturnSchema = z.object({
    bestMatches: z.array(
        z
            .object({
                "1. symbol": z.string(),
                "2. name": z.string(),
                "3. type": z.string(),
                "4. region": z.string(),
                "5. marketOpen": z.string(),
                "6. marketClose": z.string(),
                "7. timezone": z.string(),
                "8. currency": z.string(),
                "9. matchScore": z.string().transform((v) => parseFloat(v)),
            })
            .transform((v) => ({
                symbol: v["1. symbol"],
                name: v["2. name"],
                type: v["3. type"],
                region: v["4. region"],
                timezone: v["7. timezone"],
                currency: v["8. currency"],
                matchScore: v["9. matchScore"],
            }))
    ),
});

const getSymbolDataReturnSchema = z.object({
    Symbol: z.string(),
    AssetType: z.string(),
    Name: z.string(),
    Description: z.string(),
    CIK: z.string().transform((v) => parseInt(v)),
    Exchange: z.string(),
    Currency: z.string(),
    Country: z.string(),
    Sector: z.string(),
    Industry: z.string(),
    Address: z.string(),
    FiscalYearEnd: z.string(),
    LatestQuarter: z.string(), //"2023-06-30",
    MarketCapitalization: z.string().transform((v) => parseInt(v)),
    EBITDA: z.string().transform((v) => parseInt(v)),
    PERatio: z.string().transform((v) => parseFloat(v)),
    PEGRatio: z.string().transform((v) => parseFloat(v)),
    BookValue: z.string().transform((v) => parseFloat(v)),
    DividendPerShare: z.string().transform((v) => parseFloat(v)),
    DividendYield: z.string().transform((v) => parseFloat(v)),
    EPS: z.string().transform((v) => parseFloat(v)),
    RevenuePerShareTTM: z.string().transform((v) => parseFloat(v)),
    ProfitMargin: z.string().transform((v) => parseFloat(v)),
    OperatingMarginTTM: z.string().transform((v) => parseFloat(v)),
    ReturnOnAssetsTTM: z.string().transform((v) => parseFloat(v)),
    ReturnOnEquityTTM: z.string().transform((v) => parseFloat(v)),
    RevenueTTM: z.string().transform((v) => parseInt(v)),
    GrossProfitTTM: z.string().transform((v) => parseInt(v)),
    DilutedEPSTTM: z.string().transform((v) => parseFloat(v)),
    QuarterlyEarningsGrowthYOY: z.string().transform((v) => parseFloat(v)),
    QuarterlyRevenueGrowthYOY: z.string().transform((v) => parseFloat(v)),
    AnalystTargetPrice: z.string().transform((v) => parseFloat(v)),
    TrailingPE: z.string().transform((v) => parseFloat(v)),
    ForwardPE: z.string().transform((v) => parseFloat(v)),
    PriceToSalesRatioTTM: z.string().transform((v) => parseFloat(v)),
    PriceToBookRatio: z.string().transform((v) => parseFloat(v)),
    EVToRevenue: z.string().transform((v) => parseFloat(v)),
    EVToEBITDA: z.string().transform((v) => parseFloat(v)),
    Beta: z.string().transform((v) => parseFloat(v)),
    "52WeekHigh": z.string().transform((v) => parseFloat(v)),
    "52WeekLow": z.string().transform((v) => parseFloat(v)),
    "50DayMovingAverage": z.string().transform((v) => parseFloat(v)),
    "200DayMovingAverage": z.string().transform((v) => parseFloat(v)),
    SharesOutstanding: z.string().transform((v) => parseInt(v)),
    DividendDate: z.string(), // "2023-09-09",
    ExDividendDate: z.string(), // "2023-08-09",
});

const testing = true;

const alphaVantage = {
    intraDay: {
        key: "intraDay",
        schema: intraDayReturnSchema,
        query: async ({
            symbol,
            interval = "5min",
        }: {
            symbol?: string;
            interval?: "1min" | "5min" | "15min" | "30min" | "60min";
        }) => {
            if (testing) {
                const response = await axios.get(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo`
                );

                return intraDayReturnSchema.parse(response.data);
            }

            // api key is attached to ax
            // const response = await ax.get("", {
            //     params: {
            //         function: "TIME_SERIES_INTRADAY",
            //         symbol,
            //         interval,
            //     },
            // });

            const response = await getValidResponse({
                function: "TIME_SERIES_INTRADAY",
                symbol,
                interval,
            });

            return intraDayReturnSchema.parse(response.data);
        },
    },
    daily: {
        key: "daily",
        schema: dailyReturnSchema,
        query: async ({
            symbol,
            interval = "5min",
        }: {
            symbol?: string;
            interval?: "1min" | "5min" | "15min" | "30min" | "60min";
        }) => {
            if (testing) {
                const response = await axios.get(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo`
                );

                return dailyReturnSchema.parse(response.data);
            }

            const response = await getValidResponse({
                function: "TIME_SERIES_DAILY",
                symbol,
                interval,
            });

            return dailyReturnSchema.parse(response.data);
        },
    },
    weekly: {
        key: "weekly",
        schema: weeklyReturnSchema,
        query: async ({ symbol }: { symbol?: string }) => {
            if (testing) {
                const response = await axios.get(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=IBM&apikey=demo`
                );

                return weeklyReturnSchema.parse(response.data);
            }

            const response = await getValidResponse({
                function: "TIME_SERIES_WEEKLY",
                symbol,
            });

            return weeklyReturnSchema.parse(response.data);
        },
    },
    monthly: {
        key: "monthly",
        schema: monthlyReturnSchema,
        query: async ({ symbol }: { symbol?: string }) => {
            if (testing) {
                const response = await axios.get(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo`
                );

                return monthlyReturnSchema.parse(response.data);
            }

            const response = await getValidResponse({
                function: "TIME_SERIES_MONTHLY",
                symbol,
            });

            return monthlyReturnSchema.parse(response.data);
        },
    },
    tickerSearch: {
        key: "tickerSearch",
        schema: tickerSearchReturnSchema,
        query: async ({ keywordSearch }: { keywordSearch: string }) => {
            if (testing) {
                const response = await axios.get(
                    "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo"
                );

                return tickerSearchReturnSchema.parse(response.data);
            }

            // api key is attached to ax
            // const response = await ax.get("", {
            //     params: {
            //         function: "SYMBOL_SEARCH",
            //         keywords: keywordSearch,
            //     },
            // });

            const response = await getValidResponse({
                function: "SYMBOL_SEARCH",
                keywords: keywordSearch,
            });

            return tickerSearchReturnSchema.parse(response.data);
        },
    },
    getSymbolData: {
        key: "getSymbolData",
        schema: getSymbolDataReturnSchema,
        query: async ({ symbol }: { symbol: string }) => {
            if (testing) {
                const response = await axios.get(
                    "https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo"
                );

                return getSymbolDataReturnSchema.parse(response.data);
            }

            // api key is attached to ax
            // const response = await ax.get("", {
            //     params: {
            //         function: "OVERVIEW",
            //         symbol,
            //     },
            // });

            const response = await getValidResponse({
                function: "OVERVIEW",
                symbol,
            });

            return getSymbolDataReturnSchema.parse(response.data);
        },
    },
} as const;

export { alphaVantage };
