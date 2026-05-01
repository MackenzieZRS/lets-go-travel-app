"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
  isEditMode?: boolean;
}

export default function Step2Dates({ state, updateState, onNext, isEditMode }: StepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [departureDate, setDepartureDate] = useState<Date | null>(state.departureDate);
  const [returnDate, setReturnDate] = useState<Date | null>(state.returnDate);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!departureDate || (departureDate && returnDate)) {
      setDepartureDate(selectedDate);
      setReturnDate(null);
    } else {
      if (selectedDate >= departureDate) {
        setReturnDate(selectedDate);
      } else {
        setDepartureDate(selectedDate);
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isDeparture = departureDate?.getTime() === currentDate.getTime();
      const isReturn = returnDate?.getTime() === currentDate.getTime();
      const isInRange = departureDate && returnDate && currentDate > departureDate && currentDate < returnDate;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = currentDate.getTime() < today.getTime();

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => handleDateClick(i)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors
            ${isPast ? 'text-sand/20 cursor-not-allowed' : 'hover:bg-sage/20 text-sand'}
            ${isDeparture || isReturn ? 'bg-sage text-charcoal font-bold hover:bg-sage' : ''}
            ${isInRange ? 'bg-sage/20 text-sand' : ''}
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const handleContinue = () => {
    if (departureDate && returnDate) {
      updateState({ departureDate, returnDate });
      onNext();
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full max-w-lg flex flex-col items-center text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-8">
        When are you free?
      </h2>
      
      <div className="bg-charcoal border border-sand/10 rounded-2xl p-6 w-full shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="p-2 text-sand hover:text-sage transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-lg text-sand">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button onClick={nextMonth} className="p-2 text-sand hover:text-sage transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="w-10 h-10 flex items-center justify-center text-xs font-semibold text-sand/50">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      <div className="mt-8 flex gap-4 text-sm text-sand/70">
        <div>
          <span className="block text-xs uppercase tracking-wider text-sage mb-1">Departure</span>
          {departureDate ? departureDate.toLocaleDateString() : 'Select date'}
        </div>
        <div className="w-px bg-sand/20"></div>
        <div>
          <span className="block text-xs uppercase tracking-wider text-sage mb-1">Return</span>
          {returnDate ? returnDate.toLocaleDateString() : 'Select date'}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!departureDate || !returnDate}
        className="mt-10 px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors"
      >{isEditMode ? "Save & Return to Review →" : "Continue →"}</button>
    </div>
  );
}
