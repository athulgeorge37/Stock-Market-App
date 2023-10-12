import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/api";
import { Form, useForm } from "~/components/Form";
import Input from "~/components/Input";

export default function Login() {
    const router = useRouter();

    const form = useForm({
        schema: api.authentication.login.inputSchema,
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const login = useMutation({
        mutationFn: api.authentication.login.mutation,
        onSuccess: async (data) => {
            // since we have used zod to validate data in loginPostRequest, it is correctly typed
            console.log({ data });

            if (!data.success) {
                console.log();
                alert("Unable to login");
            }

            alert(data.message);
            // redirect somewhere after log in, must make this function async
            // and uncomment line 45 for it to work
            await router.push("/");
        },
        onError: (error) => {
            // when api request fails or zod validation for loginPostRequest fails, this callback is executed
            console.log({ error });

            if (
                typeof error === "object" &&
                error !== null &&
                "message" in error
            ) {
                alert(error.message);
            }
        },
    });

    return (
        <>
            <Head>
                <title>Stock Market App Login</title>
                <meta
                    name="description"
                    content="Login to Visualize Stocks"
                />
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </Head>
            <main
                className="flex min-h-screen flex-col items-center justify-center"
                style={{
                    background: "url('stock.jpg')no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                <Form
                    form={form}
                    onSubmit={(data) => {
                        console.log({ data });
                        login.mutate({
                            email: data.email,
                            password: data.password,
                        });
                    }}
                    className="flex w-96 flex-col  rounded-2xl border-2 border-white/50 bg-transparent px-10 py-16 text-white backdrop-blur-lg"
                >
                    <h2 className="mx-auto mb-6 text-4xl font-semibold">
                        Login
                    </h2>

                    <div className="flex flex-col gap-2">
                        <Input
                            {...form.register("email")}
                            id="email"
                            label="Email"
                            labelClassName="text-white"
                            className="rounded-b-none bg-transparent text-white shadow-none ring-0 focus-visible:ring-white"
                            inputWrapperClassName="border-b-2"
                            IconRight={EnvelopeIcon}
                            IconRightClassName="text-white"
                            error={form.formState.errors.email?.message}
                        />
                        <Input
                            {...form.register("password")}
                            id="password"
                            label="Password"
                            // type="password"
                            labelClassName="text-white"
                            className="rounded-b-none bg-transparent text-white shadow-none ring-0 focus-visible:ring-white"
                            inputWrapperClassName="border-b-2"
                            IconRight={LockClosedIcon}
                            IconRightClassName="text-white"
                            error={form.formState.errors.password?.message}
                        />
                    </div>

                    <Form.Submit
                        isLoading={login.isLoading}
                        loadingSpinnerVariant={"blue"}
                        variant={"white"}
                        className="mt-3 w-full rounded-full font-semibold ring-white ring-offset-blue-600"
                    >
                        Log in
                    </Form.Submit>
                    <p className="mt-2 flex justify-between">
                        <span>Don&apos;t have a account</span>
                        <Link
                            href="/register"
                            tabIndex={0}
                        >
                            Register
                        </Link>
                    </p>
                </Form>
            </main>
        </>
    );
}
