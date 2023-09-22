import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
    add,
    compareAsc,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    parse,
    startOfMonth,
    startOfToday,
    startOfWeek,
} from "date-fns";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useState } from "react";

import Button from "~/components/Button";
import ResizablePanel from "~/components/ResizablePanel";

import { cn } from "~/helper/functions/cn";

// let transition = { type: "tween", ease: "easeOut", duration: 0.25 };
const transition = { type: "spring", bounce: 0, duration: 0.3 }; // 0.3
const variants = {
    enter: (direction: 1 | -1) => {
        return { x: `${100 * direction}%`, opacity: 0 };
    },
    middle: { x: "0%", opacity: 1 },
    exit: (direction: 1 | -1) => {
        return { x: `${-100 * direction}%`, opacity: 0 };
    },
};

const DatePicker = () => {
    const today = startOfToday();

    const [monthAndYear, setMonthAndYear] = useState(
        format(new Date(), "MM-yyyy")
    );
    const [currentDaySelected, setCurrentDaySelected] = useState(today);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const month = parse(monthAndYear, "MM-yyyy", new Date());

    const setMonthTo = (monthToSet: "next-month" | "previous-month") => {
        if (isAnimating) return;

        const newMonth = add(month, {
            months: monthToSet === "next-month" ? 1 : -1,
        });

        setMonthAndYear(format(newMonth, "MM-yyyy"));
        setDirection(monthToSet === "next-month" ? 1 : -1);
        setIsAnimating(true);
    };

    const weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

    const calendarDaysForCurrentMonth = eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), {
            weekStartsOn,
        }),
        end: endOfWeek(endOfMonth(month), {
            weekStartsOn,
        }),
    });

    const currentWeek = eachDayOfInterval({
        start: startOfWeek(month, {
            weekStartsOn,
        }),
        end: endOfWeek(month, {
            weekStartsOn,
        }),
    });

    return (
        <MotionConfig transition={transition}>
            <div className="w-fit overflow-hidden rounded-md border border-slate-300 bg-white text-center">
                <ResizablePanel>
                    <AnimatePresence
                        mode="popLayout"
                        initial={false}
                        custom={direction}
                        onExitComplete={() => setIsAnimating(false)}
                    >
                        <motion.div
                            key={monthAndYear}
                            initial="enter"
                            animate="middle"
                            exit="exit"
                        >
                            <header className="relative flex justify-between overflow-hidden border-b border-slate-300 p-2 pb-1">
                                <Button
                                    IconLeft={ChevronLeftIcon}
                                    variant={"white"}
                                    onClick={() => setMonthTo("previous-month")}
                                    className="z-10 rounded-full bg-white hover:bg-slate-200 focus-visible:ring-offset-0"
                                    IconLeftClassName="-translate-x-px"
                                />
                                <motion.p
                                    variants={variants}
                                    custom={direction}
                                    className="absolute inset-0 inset-x-2 flex items-center justify-center font-semibold"
                                >
                                    {format(month, "MMM yyyy")}
                                </motion.p>

                                <Button
                                    IconRight={ChevronRightIcon}
                                    variant={"white"}
                                    onClick={() => setMonthTo("next-month")}
                                    className="z-10 rounded-full bg-white hover:bg-slate-200 focus-visible:ring-offset-0"
                                    IconLeftClassName="translate-x-px"
                                />
                                <div
                                    className="absolute inset-0 rounded-md"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(to right, white 15%, transparent 30%, transparent 70%, white 85%)",
                                    }}
                                />
                            </header>

                            <motion.div className="flex flex-col overflow-hidden px-4 pb-2 pt-1">
                                <motion.div className="grid grid-cols-7 gap-1 text-sm">
                                    {currentWeek.map(
                                        (dayOfWeek, dayOfWeekIndex) => (
                                            <span
                                                key={`${format(
                                                    dayOfWeek,
                                                    "iiiiii"
                                                )}-${dayOfWeekIndex}`}
                                                className="flex h-8 w-8 items-center justify-center rounded-md p-1 font-medium text-slate-400"
                                            >
                                                {format(dayOfWeek, "iiiiii")}
                                            </span>
                                        )
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={variants}
                                    custom={direction}
                                    className="grid grid-cols-7 gap-1 text-sm"
                                >
                                    {calendarDaysForCurrentMonth.map((day) => {
                                        const id = format(day, "dd-MM-yyyy");
                                        return (
                                            <Button
                                                key={id}
                                                id={id}
                                                className={cn(
                                                    "h-8 w-8 rounded-md p-1 hover:bg-slate-200/60 focus-visible:ring-blue-300 focus-visible:ring-offset-0",

                                                    !isSameMonth(day, month) &&
                                                        "text-slate-400",
                                                    isSameDay(day, today) &&
                                                        "bg-rose-600 text-white hover:bg-rose-600 hover:brightness-110",
                                                    isSameDay(
                                                        day,
                                                        currentDaySelected
                                                    ) &&
                                                        "bg-blue-600 text-white hover:bg-blue-600 hover:brightness-110"
                                                )}
                                                onClick={() => {
                                                    setCurrentDaySelected(day);
                                                    if (
                                                        !isSameMonth(day, month)
                                                    ) {
                                                        if (
                                                            compareAsc(
                                                                day,
                                                                startOfMonth(
                                                                    month
                                                                )
                                                            ) === -1
                                                        ) {
                                                            setMonthTo(
                                                                "previous-month"
                                                            );
                                                        }

                                                        if (
                                                            compareAsc(
                                                                day,
                                                                endOfMonth(
                                                                    month
                                                                )
                                                            ) === 1
                                                        ) {
                                                            setMonthTo(
                                                                "next-month"
                                                            );
                                                        }
                                                    }
                                                }}
                                            >
                                                {format(day, "d")}
                                            </Button>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </ResizablePanel>
            </div>
        </MotionConfig>
    );
};

export default DatePicker;

{
    /* <div className="bg-white rounded-md border-2 border-slate-300 px-2 py-1 flex gap-1">
<input
	type="text"
	className="outline-none w-10 rounded-md px-1"
	placeholder="dd"
	// only numbers allowed
	// when user type 1, 2, 3   keep focus , after 2nd digit is entered, move focus to next input
	// anything higher should focus on next input
/>
<span>{"/"}</span>
<input
	type="text"
	className="outline-none w-10 rounded-md px-1"
	placeholder="mm"
	// only numbers allowed
	// when user types 1 first, keep focus, only valid inputs after is 0, 1, 2   then move focus to next input
	// anytthing higher than 1, should focus on next input
/>
<span>{"/"}</span>
<input
	type="text"
	className="outline-none w-10 rounded-md px-1"
	placeholder="yyyy"
	// only numbers allowed
	// only 4 digits allowed
	// on 5 digit, reset back to 0000
/>

<div
// should open popover
>
	Icon
</div>
</div>

<input type="date" /> */
}
