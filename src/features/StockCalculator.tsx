import { CalendarIcon } from "@heroicons/react/24/outline";
import { format, startOfToday } from "date-fns";
import { useState } from "react";
import DatePicker from "~/components/DatePicker";
import Input from "~/components/Input";
import PopOver, { usePopOver } from "~/components/PopOver";

// interface StockCalculatorProps {}

const StockCalculator = () => {
    const datePickerPopOver = usePopOver();

    const today = startOfToday();
    const [currentDaySelected, setCurrentDaySelected] = useState(today);
    const [investmentAmount, setInvestmentAmount] = useState("");

    return (
        <div className="mb-8 mt-4 flex flex-col gap-2 rounded-md border border-slate-300 p-4 shadow-md">
            <h2 className="text-3xl font-semibold">Stock Calculator</h2>
            {/* <h3 className="text-2xl font-medium">How Does it work?</h3> */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <p>
                        1. First select a date in the past as your inital
                        investment date.
                    </p>
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="inital-investment-date"
                            className="font-medium"
                        >
                            Inital Investment Date:
                        </label>

                        <PopOver
                            popOver={datePickerPopOver}
                            trigger={
                                <PopOver.Trigger
                                    variant={"white-outline"}
                                    // onClick={() => updateCurrentWeekTo("today")}
                                    IconRight={CalendarIcon}
                                >
                                    {format(
                                        currentDaySelected,
                                        "dd - MMM - yyyy"
                                    )}
                                </PopOver.Trigger>
                            }
                        >
                            <DatePicker
                                currentDaySelected={currentDaySelected}
                                setCurrentDaySelected={setCurrentDaySelected}
                            />
                        </PopOver>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <p>
                        2. Then select an amount you would like to invest at
                        that particular time.
                    </p>
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="inital-investment-amount-input"
                            className="whitespace-nowrap font-medium"
                        >
                            Inital Investment Amount:
                        </label>

                        <Input
                            id="inital-investment-amount"
                            hideError
                            className="w-full max-w-sm"
                            type="text"
                            value={investmentAmount}
                            onChange={(e) => {
                                const result = e.target.value.replace(
                                    /\D/g,
                                    ""
                                );

                                setInvestmentAmount(result);
                            }}
                        />
                    </div>
                </div>
                <p>
                    3. Finally, see how much profit / loss you would have if you
                    were to sell today.
                </p>
            </div>
        </div>
    );
};

export default StockCalculator;
