import React, { forwardRef } from "react";

import { type SVG } from "~/helper/types/common";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/helper/functions/cn";

import LoadingSpinner, {
    type LoadingStylesProps,
} from "~/components/LoadingSpinner";

// button mostly gotten from: https://www.youtube.com/watch?v=d4WvtFEndnc  with some enhacements

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    // className?: string;
    isLoading?: boolean;
    loadingSpinnerVariant?: LoadingStylesProps["variant"];
    IconLeft?: SVG;
    IconRight?: SVG;
    IconLeftClassName?: string;
    IconRightClassName?: string;
} & ButtonStylesProps &
    IconButtonProps;

// https://buildui.com/videos/do-your-react-components-compose
// used to allow this component to play nicley with other components that require forward refs

// eslint-disable-next-line react/display-name
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            type = "button",
            IconLeft,
            IconRight,
            IconLeftClassName,
            IconRightClassName,
            className = "",
            size = "md", // pass in null, to remove default styles
            variant,
            isLoading = false,
            disabled = false,
            loadingSpinnerVariant = "blue",
            ...props
        },
        forwardedRef
    ) => {
        const simplifiedSize: ButtonStylesProps["size"] =
            size === "sm"
                ? "smSquare"
                : size === "md"
                ? "mdSquare"
                : size === "lg"
                ? "lgSquare"
                : size;

        return (
            <button
                ref={forwardedRef}
                type={type}
                disabled={disabled || isLoading}
                // aria-label={ariaLabel}
                className={cn(
                    buttonStyles({
                        size: children === undefined ? simplifiedSize : size,
                        variant,
                        className,
                    })
                )}
                {...props}
            >
                {isLoading && (
                    <div className="absolute flex items-center justify-center">
                        <LoadingSpinner
                            size={size}
                            variant={loadingSpinnerVariant}
                        />
                    </div>
                )}

                {IconLeft && (
                    <IconLeft
                        className={cn(
                            IconButtonStyles({
                                size: size,
                                className: IconLeftClassName,
                            })
                        )}
                    />
                )}

                {children && children}

                {IconRight && (
                    <IconRight
                        className={cn(
                            IconButtonStyles({
                                size: size,
                                className: IconRightClassName,
                            })
                        )}
                    />
                )}
            </button>
        );
    }
);

// cva needs
// size, variant,
export type ButtonStylesProps = VariantProps<typeof buttonStyles>;
export const buttonStyles = cva(
    // styles all buttons will have
    `
    flex items-center justify-center 
    
    select-none 
    focus:outline-none 
    cursor-pointer 
    rounded-md 
    whitespace-nowrap 

    transition 

    focus-visible:ring-2
    focus-visible:ring-offset-2
  
    disabled:cursor-not-allowed 
    ring-offset-slate-100 

   
    disabled:!brightness-100 
    `,
    {
        variants: {
            size: {
                // no size means just default styles

                sm: "text-sm px-1.5 py-0.5 gap-1", // text 14px
                md: "text-base px-2 py-1 gap-2", // text 16px
                lg: "text-lg px-2.5 py-1.5 gap-2.5", // text 18px

                smSquare: "text-sm p-1 gap-1", // text 14px
                mdSquare: "text-base p-1.5 gap-2", // text 16px
                lgSquare: "text-lg p-2 gap-2.5", // text 18px
            },
            variant: {
                // you can ovveride the ring offset colour by passing in a className
                // must mark disabled as important with ! to ensure data-hovered
                // does not override disabled styes
                blue: `
                    bg-blue-600 
                    hover:brightness-110   
                    disabled:!bg-blue-600/50 
                    ring-blue-500 
                    text-white 
                `,
                "blue-light": `
                    bg-blue-400 
                    hover:brightness-110   
                    disabled:!bg-blue-400/50 
                    ring-blue-400 
                    text-white 
                `,
                "blue-outline": `
                    bg-slate-100 
                    disabled:!bg-slate-50 
                    hover:bg-blue-100    
                    ring-blue-500 
                    inner-border-blue-500 
                    inner-border
                    text-blue-700 
                `,
                "blue-text": `
                    bg-slate-100 
                    hover:bg-slate-200
                    disabled:!bg-slate-50 
                    ring-blue-600 
                    text-blue-600
                `,

                red: `
                    bg-rose-500 
                    hover:brightness-110   
                    disabled:!bg-rose-500/50 
                    ring-rose-500 
                    text-white 
                `,
                "red-light": `
                    bg-rose-400 
                    hover:brightness-110   
                    disabled:!bg-rose-400/50 
                    ring-rose-400 
                    text-white 
                `,
                "red-outline": `
                    bg-slate-100 
                    hover:bg-slate-200 
                    disabled:!bg-slate-50 

                    ring-rose-500 
                    inner-border-rose-500 
                    inner-border-2 
                    text-rose-500 
                `,

                white: `
                    bg-slate-100 
                    hover:bg-slate-200
                    disabled:!bg-slate-50 
                    ring-slate-400 
                    text-slate-900
                `,
                "white-light": `
                    bg-slate-200 
                    hover:bg-slate-300
                    disabled:!bg-slate-100 
                    ring-slate-400 
                    text-slate-900 
                `,
                "white-outline": `
                    bg-slate-100 
                    hover:bg-slate-200 
                    disabled:!bg-slate-50 

                    ring-slate-500 
                    inner-border-slate-300 
                    inner-border 
                    text-slate-900 
                `,

                green: `
                    bg-emerald-500 
                    hover:bg-emerald-600
                    disabled:!bg-emerald-500/50 
                    ring-emerald-500 
                    text-white 
                `,
                "green-light": `
                    bg-emerald-400 
                    hover:bg-emerald-500
                    disabled:!bg-emerald-400/50 
                    ring-emerald-400 
                    text-white 
                `,
                "green-outline": `
                    bg-slate-100 
                    hover:bg-slate-200 
                    disabled:!bg-slate-50 

                    ring-emerald-500 
                    inner-border-emerald-500 
                    inner-border-2 
                    text-emerald-500 
                `,
            },
        },
    }
);

export type IconButtonProps = VariantProps<typeof IconButtonStyles>;
export const IconButtonStyles = cva([], {
    variants: {
        size: {
            sm: "h-4 w-4", // 16 x 16 px
            md: "h-5 w-5", // 20 x 20 px
            lg: "h-6 w-6", // 24 x 24 px
        },
    },
});

export default Button;
