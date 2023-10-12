/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// creating resuable form component with zod and react-hook-form
// https://omkarkulkarni.vercel.app/blog/reusable-form-component-in-react-using-react-hook-form-and-zod
import { zodResolver } from "@hookform/resolvers/zod";

import { type ComponentProps } from "react";

import {
    // we import useForm hook as useHookForm
    useForm as useHookForm,
    // typescript types of useHookForm props
    type UseFormProps as UseHookFormProps,
    // context provider for our form
    FormProvider,
    // return type of useHookForm hook
    type UseFormReturn,
    // typescript type of form's field values
    type FieldValues,
    // type of submit handler event
    type SubmitHandler,
    // hook that would return errors in current instance of form
    // useFormContext,
} from "react-hook-form";

// Type of zod schema
import { type ZodSchema, type TypeOf } from "zod";
import Button, { type ButtonProps } from "./Button";
import { cn } from "~/helper/functions/cn";
import LoadingSpinner from "./LoadingSpinner";
import { type OmitStrict } from "~/helper/types/common";

interface UseFormProps<T extends ZodSchema<any>>
    extends UseHookFormProps<TypeOf<T>> {
    schema: T;
}

const useForm = <T extends ZodSchema<any>>({
    schema,
    ...formConfig
}: UseFormProps<T>) => {
    return useHookForm({
        ...formConfig,
        resolver: zodResolver(schema),
    });
};

// form props extends the html tag form, but without the onSubmit
interface FormProps<T extends FieldValues = any>
    extends OmitStrict<ComponentProps<"form">, "onSubmit" | "className"> {
    form: UseFormReturn<T>;
    onSubmit: SubmitHandler<T>;
    className?: string;
    wrapperClassName?: string;
}

const Form = <T extends FieldValues>({
    form,
    onSubmit,
    children,
    className = "",
    wrapperClassName = "",
    ...props
}: FormProps<T>) => {
    return (
        <FormProvider {...form}>
            {/* the `form` passed here is return value of useForm() hook */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={wrapperClassName}
                {...props}
            >
                <fieldset
                    //  We disable form inputs when we are submitting the form
                    disabled={form.formState.isSubmitting}
                    className={className}
                >
                    {children}
                </fieldset>
            </form>
        </FormProvider>
    );
};

// eslint-disable-next-line react/display-name
Form.Submit = (
    btnProps: OmitStrict<ButtonProps, "children" | "isLoading"> & {
        children: string;
        isLoading: boolean;
    }
) => {
    const isSubmtting = btnProps.isLoading || btnProps?.disabled;

    const loadingClassName = cn(
        "transition",
        isSubmtting ? "opacity-0" : "opacity-100"
    );

    return (
        <Button
            type="submit"
            IconLeftClassName={loadingClassName}
            IconRightClassName={loadingClassName}
            variant={btnProps?.variant ?? "blue"}
            {...btnProps}
        >
            {isSubmtting && (
                <div className="absolute flex items-center justify-center">
                    <LoadingSpinner
                        size={btnProps?.size}
                        variant={btnProps?.loadingSpinnerVariant ?? "white"}
                    />
                </div>
            )}

            <span className={loadingClassName}>{btnProps.children}</span>
        </Button>
    );
};

export { useForm, Form };
