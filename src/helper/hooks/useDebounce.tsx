import { useEffect, useState } from "react";

// got from: https://usehooks-ts.com/react-hook/use-debounce
// Below code is slighly modified

export const useDebounce = <T,>({
    value,
    delayInSeconds = 0.5,
}: {
    value: T;
    delayInSeconds?: number;
}): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(
            () => setDebouncedValue(value),
            delayInSeconds * 1000
        );

        return () => {
            clearTimeout(timer);
        };
    }, [value, delayInSeconds]);

    return debouncedValue;
};
