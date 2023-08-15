import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

// twMerge helps ensure the last className will be the style that is used
// clsx allows us to easily append classNames together, without template strings
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export { cn };
