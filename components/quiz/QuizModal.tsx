"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { QuizState } from "@/lib/types";

// Step imports will go here
import Step1Location from "./steps/Step1Location";
import Step2Dates from "./steps/Step2Dates";
import Step3Transport from "./steps/Step3Transport";
import Step4TravelTime from "./steps/Step4TravelTime";
import Step5Vibes from "./steps/Step5Vibes";
import Step6Group from "./steps/Step6Group";
import Step7Budget from "./steps/Step7Budget";
import StepReview from "./steps/StepReview";

const TOTAL_STEPS = 7;

interface QuizModalProps {
  onClose: () => void;
}

const defaultState: QuizState = {
  origin: "",
  departureDate: null,
  returnDate: null,
  transportModes: [],
  maxTravelHours: 4,
  vibes: [],
  groupType: null,
  budget: 1500,
  tripLengthPreference: null,
  hasPassport: null,
};

export default function QuizModal({ onClose }: QuizModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizState, setQuizState] = useState<QuizState>(defaultState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const handleNext = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setDirection(1);
      setCurrentStep(TOTAL_STEPS + 1);
    } else {
      setDirection(1);
      if (currentStep <= TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleEditStep = (step: number) => {
    setIsEditMode(true);
    setDirection(-1);
    setCurrentStep(step);
  };

  const updateState = (updates: Partial<QuizState>) => {
    setQuizState((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Location state={quizState} updateState={updateState} onNext={handleNext} isEditMode={isEditMode} />;
      case 2:
        return <Step2Dates state={quizState} updateState={updateState} onNext={handleNext} isEditMode={isEditMode} />;
      case 3:
        return <Step3Transport state={quizState} updateState={updateState} onNext={handleNext} isEditMode={isEditMode} />;
      case 4:
        return <Step4TravelTime state={quizState} updateState={updateState} onNext={handleNext} isEditMode={isEditMode} />;
      case 5:
        return <Step5Vibes state={quizState} updateState={updateState} onNext={handleNext} isEditMode={isEditMode} />;
      case 6:
        return <Step6Group state={quizState} updateState={updateState} onNext={handleNext} isEditMode={isEditMode} />;
      case 7:
        return <Step7Budget state={quizState} updateState={updateState} onNext={handleNext} isEditMode={isEditMode} />;
      case 8:
        return <StepReview state={quizState} onEdit={handleEditStep} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col bg-charcoal"
    >
      {/* CSS noise texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={handleBack}
          className={`p-2 text-sand/60 hover:text-sand transition-colors ${
            currentStep === 1 ? "invisible" : "visible"
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {currentStep <= TOTAL_STEPS && (
          <div className="flex-1 max-w-md mx-4">
            <div className="h-1 w-full bg-sand/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-terracotta"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-center text-xs font-semibold tracking-widest text-terracotta mt-2 uppercase">
              Step {currentStep} of {TOTAL_STEPS}
            </div>
          </div>
        )}

        <button onClick={onClose} className="p-2 text-sand/60 hover:text-sand transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
