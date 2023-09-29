import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import Button, { type ButtonProps } from "~/components/Button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { cn } from "~/helper/functions/cn";

interface usePopOverProps {
    onPopOverOpen?: () => void;
    onPopOverClose?: () => void;
    openPopOverOnInitialRender?: boolean;
    clickOutsideToClosePopOver?: boolean;
    preventAutoFocusOnPopOverOpen?: boolean;
}

export const usePopOver = (props?: usePopOverProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const onPopOverOpen = () => {
        if (props?.onPopOverOpen) {
            props.onPopOverOpen();
        }
    };

    const onPopOverClose = () => {
        if (props?.onPopOverClose) {
            props.onPopOverClose();
        }
    };

    const openPopOver = () => {
        setIsOpen(true);
        onPopOverOpen();
    };

    const closePopOver = () => {
        setIsOpen(false);
        onPopOverClose();
    };

    const setPopOverTo = (open: boolean) => {
        if (open) {
            openPopOver();
        } else {
            closePopOver();
        }
    };

    return {
        isOpen,
        setPopOverTo,
        openPopOverOnInitialRender: props?.openPopOverOnInitialRender ?? false,
        clickOutsideToClosePopOver: props?.clickOutsideToClosePopOver ?? true,
        preventAutoFocusOnPopOverOpen:
            props?.preventAutoFocusOnPopOverOpen ?? false,
        openPopOver,
        closePopOver,
    };
};

export type usePopOverReturnType = ReturnType<typeof usePopOver>;

interface PopOverProps {
    popOver: usePopOverReturnType;
    children: React.ReactNode;

    align?: Popover.PopoverContentProps["align"];
    side?: Popover.PopoverContentProps["side"];
    sideOffset?: Popover.PopoverContentProps["sideOffset"];

    showArrow?: boolean;
    arrowClassName?: string;

    className?: string;

    trigger?: React.ReactNode; // optionally pass PopOver.Trigger component which handles opening it
    // useful when u want to keep the trigger alongside the PopOver
}

const PopOver = ({
    popOver,
    trigger,
    children,
    className = "",
    align = "start",
    side = "bottom",
    sideOffset = 4,
    showArrow = false,
    arrowClassName = "",
}: PopOverProps) => {
    useEffect(() => {
        // opens popOver on initial render
        // must do it this way to prevent nextjs hydration error
        if (popOver.openPopOverOnInitialRender) {
            popOver.setPopOverTo(true);
        }
    }, []);

    return (
        <Popover.Root
            open={popOver.isOpen}
            onOpenChange={popOver.setPopOverTo}
        >
            {trigger}

            <Popover.Portal>
                <Popover.Content
                    align={align}
                    side={side}
                    sideOffset={sideOffset}
                    onPointerDownOutside={(e) => {
                        // preventing click outside
                        if (popOver.clickOutsideToClosePopOver === false) {
                            e.preventDefault();
                        }
                    }}
                    onOpenAutoFocus={(e) => {
                        if (popOver.preventAutoFocusOnPopOverOpen === true) {
                            e.preventDefault();
                        }
                    }}
                    className={cn(
                        "radix-side-bottom:animate-slide-down radix-side-top:animate-slide-up",
                        "z-[101] flex flex-col rounded-md bg-slate-100 shadow outline-none",
                        className
                    )}
                >
                    {showArrow && (
                        <Popover.Arrow
                            className={cn(
                                "fill-current text-slate-100",
                                arrowClassName
                            )}
                        />
                    )}

                    {children}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

// eslint-disable-next-line react/display-name
PopOver.Trigger = (btnProps: ButtonProps) => {
    return (
        <Popover.Trigger asChild>
            <Button {...btnProps} />
        </Popover.Trigger>
    );
};

// eslint-disable-next-line react/display-name
PopOver.Close = (btnProps: ButtonProps) => {
    // pass any button props to override these ones

    // to prevent close button from being absolutley positioned, add className="block"

    // add <PopOver.Close/> component to children if you want to render this
    return (
        <Popover.Close asChild>
            <Button
                IconLeft={XMarkIcon}
                variant={"white"}
                className="absolute right-1 top-1"
                {...btnProps}
            />
        </Popover.Close>
    );
};

// example popover:

// const popOver = usePopOver();

// <PopOver
//     popOver={popOver}
//     trigger={<PopOver.Trigger variant={"green"}>Open Sesame</PopOver.Trigger>}
//     showArrow
// >
//     <PopOver.Close />
//     <span>Random Heading</span>
//     <Button variant={"blue"}>Btn 1</Button>
//     <Button variant={"blue"}>Btn 2</Button>
//     <Button variant={"blue"}>Btn 3</Button>
// </PopOver>;

export default PopOver;
