import React, { type ComponentProps, forwardRef } from "react";

import { type SVG } from "~/helper/types/common";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/helper/functions/cn";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type InputProps = Omit<ComponentProps<"input">, "id" | "size"> & {
    id: string;
    label?: string;
    error?: string;
    hideError?: boolean;
    link?: {
        label: string;
        href: string;
    };
    IconLeft?: SVG;
    IconRight?: SVG;
    IconLeftClassName?: string;
    IconRightClassName?: string;
    wrapperClassName?: string;
} & InputStylesProps &
    IconInputProps;

// https://buildui.com/videos/do-your-react-components-compose
// used to allow this component to play nicley with other components that require forward refs

// eslint-disable-next-line react/display-name
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            id,
            type = "text",
            label,
            error,
            link,
            IconLeft,
            IconRight,
            hideError = false,
            IconLeftClassName = "",
            IconRightClassName = "",
            size = "md",
            withIconLeft,
            withIconRight,
            IconSize,
            IconLeftMargin,
            IconRightMargin,
            className = "",
            wrapperClassName = "",
            variant = "default",
            ...props
        },
        forwardedRef
    ) => {
        const inputId = `${id}-input`;

        return (
            <div className={cn("flex w-full flex-col", wrapperClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1 font-semibold text-slate-800"
                    >
                        {label}
                    </label>
                )}

                <div className="relative flex items-center">
                    {IconLeft && (
                        <IconLeft
                            className={cn(
                                "pointer-events-none absolute left-0 text-zinc-500",
                                IconInputStyles({
                                    IconSize: IconSize ?? size,
                                    IconLeftMargin: IconLeftMargin ?? size,
                                }),
                                IconLeftClassName
                            )}
                        />
                    )}
                    <input
                        id={inputId}
                        ref={forwardedRef}
                        type={type}
                        aria-invalid={error ? true : false}
                        autoComplete="off"
                        className={cn(
                            inputStyles({
                                variant,
                                size: size,
                                ...(IconLeft && {
                                    withIconLeft: withIconLeft ?? size,
                                }),
                                ...(IconRight && {
                                    withIconRight: withIconRight ?? size,
                                }),
                            }),
                            className
                        )}
                        {...props}
                    />
                    {IconRight && (
                        <IconRight
                            className={cn(
                                "pointer-events-none absolute right-0 text-zinc-500",
                                IconInputStyles({
                                    IconSize: IconSize ?? size,
                                    IconRightMargin: IconRightMargin ?? size,
                                }),
                                IconRightClassName
                            )}
                        />
                    )}
                </div>

                {!hideError && (
                    <div className={cn("mt-1 text-sm", !error && "invisible")}>
                        <div className="flex justify-between pr-2">
                            <div className="flex items-center gap-1 text-rose-600">
                                <XCircleIcon className="h-3.5 w-3.5" />
                                <span>{error ?? "no errors"}</span>
                            </div>
                            {link !== undefined && (
                                <Link
                                    href={link.href}
                                    className="text-blue-600 underline"
                                >
                                    {link.label}
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

export type InputStylesProps = VariantProps<typeof inputStyles>;
export const inputStyles = cva(
    `
    w-full 
    appearance-none 
    border-none 
    outline-none 
    rounded-md 
    shadow-inner 
    ring-1 
    focus:ring-2 
    disabled:cursor-not-allowed 
    `,
    {
        variants: {
            size: {
                sm: "px-2 py-1 text-xs",
                md: "px-2.5 py-1.5 text-sm",
                lg: "px-3 py-2 text-base",
            },
            withIconLeft: {
                sm: "pl-7",
                md: "pl-9",
                lg: "pl-11",
            },
            withIconRight: {
                sm: "pr-7",
                md: "pr-9",
                lg: "pr-11",
            },
            variant: {
                default: `
                    ring-gray-900/10 
                    bg-slate-200 
                    text-zinc-900 
                    placeholder:text-zinc-500 
                    focus:ring-blue-600 
                    disabled:bg-gray-200/40 
                    aria-[invalid=true]:focus:ring-rose-600 
                    `,
                white: `
                    ring-gray-900/10 
                    bg-slate-100 
                    text-zinc-900 
                    placeholder:text-zinc-500 
                    focus:ring-blue-600 
                    disabled:bg-gray-200/40 
                    aria-[invalid=true]:focus:ring-rose-600 
                    `,
            },
        },
    }
);

type IconInputProps = VariantProps<typeof IconInputStyles>;
export const IconInputStyles = cva([], {
    variants: {
        IconSize: {
            sm: "h-3.5 w-3.5", // 16 x 16 px
            md: "h-[18px] w-[18px]",
            lg: "h-[22px] w-[22px]", // 24 x 24 px
        },
        IconLeftMargin: {
            sm: "ml-2",
            md: "ml-2.5",
            lg: "ml-3",
        },
        IconRightMargin: {
            sm: "mr-2",
            md: "mr-2.5",
            lg: "mr-3",
        },
    },
});

export default Input;
