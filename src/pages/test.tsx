import Head from "next/head";
import StockVisualizer from "~/features/graphs/StockVisualizer";

export default function Test() {
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
                    <StockVisualizer />
                </div>
            </main>
        </>
    );
}
