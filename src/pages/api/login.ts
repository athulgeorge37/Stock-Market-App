import type { NextApiHandler } from "next";
import { z } from "zod";

const users: {
    id: number;
    email: string;
    password: string;
}[] = [
    { id: 1, email: "test@gmail.com", password: "hello" },
    { id: 2, email: "test2@gmail.com", password: "hello2" },
];

const handler: NextApiHandler = (req, res) => {
    // request must be a post request
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" });
        return;
    }

    // using zod schema to parse body and get it correctly typed
    const body = z
        .object({
            email: z.string().min(1, "Required").email(),
            password: z.string().min(1, "Required"),
        })
        .safeParse(req.body);

    if (!body.success) {
        // if not successful, we send zod error message
        res.status(400).send({
            message: JSON.stringify(body.error),
        });
        return;
    } else {
        // we have received the data, with successful validation and is typed correctly
        const { email, password } = body.data;
        console.log({
            dataFromBackend: body.data,
        });

        const user = users.find((person) => person.email === email);

        if (user === undefined) {
            res.status(400).send({
                message: "User does not exist",
            });
            return;
        }

        if (user.password !== password) {
            res.status(400).send({
                message: "User Credentials are invalid",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Successfully logged in",
        });
        return;
    }
};

export default handler;
