import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/helper/functions/cn";

// animation from: https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/ring-resize.svg

type LoadingSpinnerProps = LoadingStylesProps & {
    className?: string;
};

const LoadingSpinner = ({
    size = "md",
    variant = "blue",
    className = "",
}: LoadingSpinnerProps) => {
    return (
        <div
            id="loading"
            // className="h-6 w-6 stroke-blue-500"
            className={cn(
                loadingStyles({
                    size,
                    variant,
                    className,
                })
            )}
        >
            <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g className="spinner_V8m1">
                    <circle
                        cx="12"
                        cy="12"
                        r="9.5"
                        fill="none"
                        strokeWidth="3"
                    />
                </g>
            </svg>
        </div>
    );
};

export type LoadingStylesProps = VariantProps<typeof loadingStyles>;
const loadingStyles = cva(
    // styles all buttons will have
    undefined,
    {
        variants: {
            size: {
                sm: "h-3 w-3", // 12px
                md: "h-4 w-4", // 16px
                lg: "h-5 w-5", // 20px
            },
            variant: {
                blue: "stroke-blue-500",
                white: "stroke-slate-100",
            },
        },
    }
);
export default LoadingSpinner;
