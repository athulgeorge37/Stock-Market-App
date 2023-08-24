import { sleep } from "~/helper/functions/time";
import { ax } from "./axios";
import axios from "axios";
import { z } from "zod";
import { format, parseISO } from "date-fns";

const dailyReturnSchema = z
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

const alphaVantage = {
    daily: {
        key: "daily",
        schema: dailyReturnSchema,
        query: async ({
            symbol = "IBM",
            interval = "5min",

            // period = "TIME_SERIES_INTRADAY",
            testing = true,
        }: {
            symbol?: string;
            // period?:
            //     | "TIME_SERIES_INTRADAY"
            //     | "TIME_SERIES_DAILY"
            //     | "TIME_SERIES_WEEKLY"
            //     | "TIME_SERIES_MONTHLY";
            interval?: "1min" | "5min" | "15min" | "30min" | "60min";

            testing?: boolean;
        }) => {
            if (testing) {
                const response = await axios.get(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo`
                );

                return dailyReturnSchema.parse(response.data);
            }

            // api key is attached to ax
            const response = await ax.get("", {
                params: {
                    // function: period,
                    symbol,
                    //...(period === "TIME_SERIES_INTRADAY" && { interval }),
                    // adjusted,
                },
            });

            return dailyReturnSchema.parse(response.data);
        },
    },
} as const;

export { alphaVantage };
