import { Check, IdCard, Send } from 'lucide-react';

export interface FormStepperProps {
  currentStep: 1 | 2;
  onStepClick: (step: 1 | 2) => void;
  reporterName?: string;
  canGoToStepTwo: boolean;
  stepTwoTitle: string;
  stepTwoSubtitle: string;
}

export function FormStepper({
  currentStep,
  onStepClick,
  reporterName,
  canGoToStepTwo,
  stepTwoTitle,
  stepTwoSubtitle,
}: FormStepperProps) {
  return (
    <div className="border-warm-200 mb-8 rounded-3xl border bg-white p-4 shadow-xs sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Step 1 Pill */}
        <button
          type="button"
          onClick={() => onStepClick(1)}
          className={`flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all ${
            currentStep === 1
              ? 'bg-darknavy-900 text-white shadow-md'
              : currentStep > 1
                ? 'border border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/70'
                : 'bg-warm-100 text-slate-500'
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors ${
              currentStep === 1
                ? 'bg-accent-500 text-white'
                : currentStep > 1
                  ? 'bg-emerald-500 text-white'
                  : 'text-darknavy-900 bg-white'
            }`}
          >
            {currentStep > 1 ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <IdCard className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-extrabold tracking-wider uppercase opacity-80">
                Langkah 1
              </span>
              {currentStep > 1 ? (
                <span className="text-2xs rounded-full bg-emerald-200/60 px-1.5 py-0.5 font-bold text-emerald-800">
                  Selesai
                </span>
              ) : null}
            </div>
            <p className="truncate text-xs font-extrabold sm:text-sm">
              Data Diri &amp; Kartu Tanda Pengenal
            </p>
            <p className="text-2xs truncate opacity-75">
              {reporterName ? reporterName : 'e-KTP Pelapor'}
            </p>
          </div>
        </button>

        {/* Step 2 Pill */}
        <button
          type="button"
          onClick={() => {
            if (canGoToStepTwo) {
              onStepClick(2);
            }
          }}
          disabled={!canGoToStepTwo}
          className={`flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all ${
            currentStep === 2
              ? 'bg-darknavy-900 text-white shadow-md'
              : 'bg-warm-100 hover:bg-warm-200 text-slate-500'
          } ${!canGoToStepTwo ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors ${
              currentStep === 2 ? 'bg-accent-500 text-white' : 'bg-white text-slate-400'
            }`}
          >
            <Send className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="text-2xs font-extrabold tracking-wider uppercase opacity-80">
              Langkah 2
            </span>
            <p className="truncate text-xs font-extrabold sm:text-sm">{stepTwoTitle}</p>
            <p className="text-2xs truncate opacity-75">{stepTwoSubtitle}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
