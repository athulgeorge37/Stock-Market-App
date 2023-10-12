import axios from "axios";
import { z } from "zod";

const loginInputSchema = z.object({
    email: z.string().min(1, "Required").email(),
    password: z.string().min(1, "Required"),
});

const loginOutputSchema = z.object({
    success: z.literal(true),
    message: z.string(),
});

const authentication = {
    login: {
        key: "login",
        inputSchema: loginInputSchema,
        returnSchema: loginOutputSchema,
        mutation: async ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => {
            // if u want to simulate delay and see loading spinner, uncomment line below
            // await sleep(2);
            loginInputSchema.parse({
                email,
                password,
            });

            // making a post request to our Next API route
            const response = await axios.post("/api/login", {
                email,
                password,
            });

            // using zod to validate response from request,
            // parse will throw an error if it is invalid
            return loginOutputSchema.parse(response.data);
        },
    },
};

export { authentication };
