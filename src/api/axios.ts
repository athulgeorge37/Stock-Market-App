import axios from "axios";
import { env } from "~/env.mjs";

const ax = axios.create({
    baseURL: "https://www.alphavantage.co/query",
    params: {
        // adding alphavantage api key on each request
        apikey: env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
    },
});

export { ax };
