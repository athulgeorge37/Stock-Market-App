import Head from "next/head";

export default function Home() {
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
            <main className="flex min-h-screen flex-col">Hello World</main>
        </>
    );
}
