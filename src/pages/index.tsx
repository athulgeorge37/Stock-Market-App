import Head from "next/head";
import { useState } from "react";
import Input from "~/components/Input";

export default function Home() {
    const [total, setTotal] = useState(0);
    const [text, setText] = useState("");

    return (
        <>
            <Head>
                <title>Stock Market App</title>
                <meta
                    name="description"
                    content="Visualize Stocks"
                />
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </Head>
            <main className="flex min-h-screen flex-col">
                <div className="mx-auto my-16 flex w-full max-w-7xl flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder={"TSLA"}
                            id="find-a-stock-input"
                            error="ivalid ticker symbol"
                            onChange={(e) => setText(e.target.value)}
                        />
                        <span>{text}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setTotal(total + 1)}
                    >
                        Add + 1
                    </button>

                    <span>{total}</span>
                </div>
            </main>
        </>
    );
}
