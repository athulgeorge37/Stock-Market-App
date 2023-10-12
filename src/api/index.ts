import { alphaVantage } from "./alphaVantage";
import { authentication } from "./authentication";

const api = {
    alphaVantage,
    authentication,
} as const;

export { api };
