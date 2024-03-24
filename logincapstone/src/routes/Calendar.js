import React, { useEffect, useRef } from "react";
import { format, addMonths, startOfWeek, addDays } from "date-fns";
import { endOfWeek, isSameDay, isSameMonth, startOfMonth, endOfMonth } from "date-fns";
import uuid from "react-uuid";
import "./_style.css";

const RenderHeader = ({ currentMonth }) => {
    return (
        <div className="header row">
            {currentMonth.toLocaleString("en-US", { month: "long" })}
        </div>
    );
};

const RenderDays = () => {
    const days = [];
    const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="col" key={i}>
                {date[i]}
            </div>,
        );
    }
    return <div className="days row">{days}</div>;
};

const RenderCells = ({ currentMonth, selectedDate }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const today = new Date(); // Get today's date

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, "d");
            const isToday = isSameDay(day, today); // Check if the current day is today

            days.push(
                <div
                    className={`col cell ${
                        !isSameMonth(day, monthStart)
                            ? "disabled gray-text"
                            : isSameDay(day, selectedDate)
                            ? "selected"
                            : ""
                    } ${
                        format(day, "EEEE") === "Sunday"
                            ? "red-text"
                            : format(day, "EEEE") === "Saturday"
                            ? "blue-text"
                            : ""
                    } ${isToday ? "today" : ""}`} // Add a class if it's today's date
                    key={uuid()}
                >
                    <span
                        className={
                            isSameDay(day, selectedDate)
                                ? "text today"
                                : isSameMonth(day, monthStart)
                                ? ""
                                : "text not-valid"
                        }
                    >
                        {formattedDate}
                    </span>
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row" key={uuid()}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="body">{rows}</div>;
};

const isLastDayOfMonth = (date, monthEnd) => {
    return format(date, "yyyy-MM-dd") === format(monthEnd, "yyyy-MM-dd");
};

const Calendar = () => {
    useEffect(() => {
        console.log("Calendar component mounted");
    }, []);

    const currentDate = new Date();
    const selectedDate = new Date();

    let currentMonth = new Date(format(currentDate, "yyyy"));
    let months = [];

    const monthRef = useRef(null);

    for (let i = 0; i < 12; i++) {
        months.push(
            <div
                className="calendar__item"
                key={uuid()}
                ref={
                    format(currentMonth, "MM") === format(selectedDate, "MM")
                        ? monthRef
                        : null
                }
            >
                <RenderHeader currentMonth={currentMonth} />
                <RenderCells
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                />
            </div>,
        );
        currentMonth = addMonths(currentMonth, 1);
    }

    useEffect(() => {
        if (monthRef.current !== null) {
            monthRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, []);

    function scrollCurrentMonth() {
        if (monthRef.current !== null) {
            monthRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div className="schedule-calendar">
            <div className="text-today">
                <p className="text-current" onClick={scrollCurrentMonth}>
                    {currentDate.toLocaleString("en-US", { month: "long" })}
                    {format(currentDate, " dd")}
                </p>
                <p className="text-year">{format(currentDate, " yyyy")}</p>
            </div>
            <RenderDays />
            <div className="calendar-list">{months}</div>
        </div>
    );
};

export default Calendar;