import axios, { type AxiosResponse } from "axios";
import { z } from "zod";
import { env } from "~/env.mjs";

const ax = axios.create({
    baseURL: "https://www.alphavantage.co/query",
    params: {
        // adding alphavantage api key on each request
        apikey: env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY_1,
    },
});

const API_KEY_ErrorSchema = z.object({
    Note: z.literal(
        "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 100 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency."
    ),
});

const API_KEYS = [
    env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY_1,
    env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY_2,
    env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY_3,
] as const;

let usingApiKey = 0;
let attempts = 0;
const EACH_API_KEY_CALLS_LIMIT = 5;

const getValidResponse = async <P extends object>(
    params: P
): Promise<AxiosResponse<unknown, unknown>> => {
    console.log(`Using API Key: ${usingApiKey}`);

    attempts += 1;
    if (attempts > API_KEYS.length * EACH_API_KEY_CALLS_LIMIT) {
        throw new Error("You have exceeded your api keys limit");
    }

    const response = await ax.get("", {
        params: {
            ...params,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            apikey: API_KEYS.at(usingApiKey),
        },
    });

    if (API_KEY_ErrorSchema.safeParse(response.data).success === false) {
        // when error schema fails, we are using a valid apiKey, and our response should be correct
        return response;
    }

    // when we get the error message, we will use another apiKey
    usingApiKey += 1;

    // when our index is equal the number of apiKeys we have, we set it back to the first apiKey
    if (usingApiKey === API_KEYS.length) {
        usingApiKey = 0;
    }

    // we try to get a valid response again with a different api key
    return getValidResponse({ params });
};

export { ax, getValidResponse };
