"use client";
import { createPortal } from "react-dom";
import FeedbackModal from "@/components/FeedbackModal"
import TimelineModal from "@/components/TimelineModal";
import InfoModal from "@/components/InfoModal";
import AuthModal from "@/components/AuthModal";
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";

import {
    calculateAge,
    calculateRetirement,
    generateProjection,
  } from "./utils/finance";


  
export default function FinancialPlanner() {
  const { data: session } = useSession()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // ============================
  // STATE
  // ============================

  const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
  
  const currencies = [
    { code: "PHP", name: "Philippine Peso", symbol: "₱" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  ];
  const [currency, setCurrency] = useState("PHP");
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showInfo, setShowInfo] = useState(false);
  const [dailyIncomeTarget, setDailyIncomeTarget] = useState<number | "">("");
  const [currentSavings, setCurrentSavings] = useState<number | "">("");
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">("");
  const [expectedReturn, setExpectedReturn] = useState<number | "">("");
  const [inflationRate, setInflationRate] = useState<number | "">("");
  const [feedback, setFeedback] = useState("")
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)


  const currencySymbol =
    currencies.find((c) => c.code === currency)?.symbol || "$";

  const InfoTooltip = ({ text }: { text: string }) => {
    return (
      <div className="relative group inline-block ml-2 cursor-pointer">
        <span className="flex items-center justify-center 
                        w-4 h-4 text-[10px] 
                        text-gray-300 border border-gray-500 
                        rounded-full">
          ?
        </span>

        <div className="absolute z-10 hidden group-hover:block 
                        bg-gray-900 text-xs text-gray-200 
                        p-2 rounded max-w-[80vw] left-0 top-6 shadow-lg">
          {text}
        </div>
      </div>
    );
  };

  // ============================
  // RESET FUNCTION
  // ============================

  const handleClear = () => {
    setCurrency("PHP");          // <-- reset currency picker
    setBirthDate("");  // or "" if you want fully blank

    setDailyIncomeTarget("");
    setCurrentSavings("");
    setMonthlyInvestment("");

    setExpectedReturn("");
    setInflationRate("");
  };

  const handleLoadTimeline = (timeline: any) => {
    setCurrency(timeline.currency)
    setBirthDate(timeline.birthDate)

    setDailyIncomeTarget(timeline.dailyIncomeTarget)
    setCurrentSavings(timeline.currentSavings)
    setMonthlyInvestment(timeline.monthlyInvestment)

    setExpectedReturn(timeline.expectedReturn)
    setInflationRate(timeline.inflationRate)
  }
  // ============================
  // SHARE FUNCTION
  // ============================

  const handleShare = () => {
    if (!retirementResult) return;

    const params = new URLSearchParams({
      years: retirementResult.yearsRequired.toFixed(2),
      wealth: retirementResult.targetWealth.toString(),
    });

    const shareUrl = `${window.location.origin}/share?${params.toString()}`;

    console.log("Share URL:", shareUrl);

    // For now, just copy it
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copiedXD");
  };


  // ============================
  // CALCULATIONS
  // ============================

  const age = calculateAge(birthDate);


  const retirementResult = useMemo(() => {
    if (
      dailyIncomeTarget === "" ||
      currentSavings === "" ||
      monthlyInvestment === "" ||
      expectedReturn === "" ||
      inflationRate === ""
    ) {
      return null;
    }

    return calculateRetirement({
      dailyIncomeTarget: Number(dailyIncomeTarget),
      currentSavings: Number(currentSavings),
      monthlyInvestment: Number(monthlyInvestment),
      expectedReturn: Number(expectedReturn),
      inflationRate: Number(inflationRate),
      
    });

    
  }, [
    dailyIncomeTarget,
    currentSavings,
    monthlyInvestment,
    expectedReturn,
    inflationRate,
  ]);

  const retirementAge = useMemo(() => {
    if (!retirementResult || age === null) return null;

    return age + retirementResult.yearsRequired;
  }, [age, retirementResult]);
  
  const growthData = useMemo(() => {
    if (!retirementResult) return [];

    const safeCurrentSavings =
      typeof currentSavings === "number" ? currentSavings : 0;

    const safeMonthlyInvestment =
      typeof monthlyInvestment === "number" ? monthlyInvestment : 0;

    return generateProjection(
      safeCurrentSavings,
      safeMonthlyInvestment,
      retirementResult.realReturnPercent,
      retirementResult.targetWealth
    );
  }, [
    currentSavings,
    monthlyInvestment,
    retirementResult,
  ]);

    const handleSaveTimeline = async () => {
      if (!session) {
        alert("Sign in first.")
        return
      }

      if (!retirementResult) {
        alert("Nothing to save yet.")
        return
      }

      try {
        const response = await fetch("/api/timelines/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `Freedom Timeline - ${new Date().toLocaleDateString()}`,

            currency,
            birthDate,

            dailyIncomeTarget,
            currentSavings,
            monthlyInvestment,
            expectedReturn,
            inflationRate,

            targetWealth: retirementResult.targetWealth,
            yearsRequired: retirementResult.yearsRequired,
            retirementAge,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to save timeline")
        }

        alert("Timeline saved successfully 🔥")
      } catch (error) {
        console.error(error)
        alert("Something went wrong")
      }
    }


    const handleExport = () => {
    if (!session) {
      alert("Sign in first.")
      return
    }

    if (session.user.role !== "PREMIUM") {
      alert("Export to PDF is locked for premium users.")
      return
    }

    // Premium user
    window.print()
  }

  // ============================
  // UI
  // ============================

  return (
  <>  
  
  <div className="hidden print:block mb-6">
    <h1 className="text-2xl font-bold">Retirement Strategy Report</h1>
    <p>Generated on {new Date().toLocaleDateString()}</p>
  </div>


  <div className="min-h-screen relative flex flex-col items-center bg-slate-900 text-white print-white text-sm py-10 gap-6">


      {/* Main Card Container */}
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col gap-y-5 text-white">

      {/* Card Header */}
      <div className="w-full flex justify-between items-start mb-6">

        {/* Left Side */}
        <div className="flex-1 pr-4">
          <h1 className="text-2xl font-bold">
            Escape the Rat Race
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Your exit strategy starts here.
          </p>


          {session && (
            <p className="text-sm text-emerald-400 mt-2">
              Welcome back, {session.user.name}
            </p>
          )}

          <button
            onClick={() => setShowInfo(true)}
            className="text-sm text-blue-400 hover:underline mt-1"
          >
            What is this? Why this matters?
          </button>

          
          <button
            onClick={() => setShowFeedback(true)}
            className="text-sm text-purple-400 hover:underline mt-1 block"
          >
            Send Us Your Feedback
          </button>


        </div>

        {/* Right Side */}
        <div className="flex-shrink-0">
          {!session ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="no-print text-sm px-3 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>


        <div className="no-print grid grid-cols-[220px_1fr] gap-4 items-center items-center">
          <label className="w-44 text-sm text-gray-300 flex items-center gap-2">
            <InfoTooltip text="Select the currency you want to use for all calculations and projections. This affects display symbols only." />
            Set your currency
          </label>

          <div className="relative flex-1">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>

            {/* Optional subtle dropdown arrow styling */}
            <span className="absolute right-3 top-2 text-gray-400 pointer-events-none">
              ▾
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-4 items-center items-center">
          <label className="w-44 text-sm text-gray-300 flex items-center gap-2">
            <InfoTooltip text="Your exact birth date; This is used to calculate your exact current age." />
            <span>Set your birth date</span>
          </label>

          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="flex-1 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {age && (
          <div className="grid grid-cols-[220px_1fr] gap-4 items-center items-center">
            <div className="w-44" />
            <p className="text-sm text-gray-400">
              You are {age.toFixed(2)} years old. Time is your most powerful asset.
            </p>
          </div>
        )}

        <div className="grid grid-cols-[220px_1fr] gap-4 items-center items-center">
          <label className="w-44 text-sm text-gray-300 flex items-center gap-2">
            <InfoTooltip 
            text="The amount of money you want to receive as allowance each day during financial independence.
            Example: 1,000 per day" />
            <span>Daily allowance target</span>
          </label>

          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-400">
              {currencySymbol}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={
                dailyIncomeTarget !== ""
                  ? Number(dailyIncomeTarget).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
                setDailyIncomeTarget(raw === "" ? "" : Number(raw));
              }}
              className="w-full pl-8 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-4 items-center items-center">
          <label className="w-44 text-sm text-gray-300 flex items-center gap-2">
            <InfoTooltip
              text=
              "The total value of your current investments (if there are any), such as stocks, ETFs, Mutual Funds, etc. Example value: 500,000."
            />
            <span>Current investments amount</span>
          </label>

          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-400">
              {currencySymbol}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={
                currentSavings !== ""
                  ? Number(currentSavings).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
                setCurrentSavings(raw === "" ? "" : Number(raw));
              }}
              className="w-full pl-8 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            
          </div>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-4 items-center items-center">
          <label className="w-44 text-sm text-gray-300 flex items-center gap-2">
            <InfoTooltip text="How much you plan to invest every month toward your goal. Example: 1000 per month" />
            <span>Monthly investment</span>
          </label>

          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-400">
              {currencySymbol}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={
                monthlyInvestment !== ""
                  ? Number(monthlyInvestment).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
                setMonthlyInvestment(raw === "" ? "" : Number(raw));
              }}
              className="w-full pl-8 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-4 items-center items-center">
          <label className="w-44 text-sm text-gray-300 flex items-center gap-2">
            <InfoTooltip text="Estimated average annual investment return before inflation (e.g., 8–10% for long-term index investing)." />
            <span>Investments' annual growth rate (e.g., 10%)</span>
          </label>

          <div className="relative flex-1">
            <input
              type="number"
              value={expectedReturn || ""} 
              onChange={(e) =>
                setExpectedReturn(Number(e.target.value))
              }
              className="w-full pr-8 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <span className="absolute right-3 top-2 text-gray-400">
              %
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-4 items-center items-center">
          <label className="w-44 text-sm text-gray-300 flex items-center gap-2">
            <InfoTooltip text="Estimated average annual inflation rate. This reduces your real purchasing power and is subtracted from your expected return." />
            <span>Your country's inflation rate (e.g., 4%)</span>
          </label>

          <div className="relative flex-1">
            <input
              type="number"
              value={inflationRate}
              onChange={(e) =>
                setInflationRate(Number(e.target.value))
              }
              className="w-full pr-8 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <span className="absolute right-3 top-2 text-gray-400">
              %
            </span>
          </div>
        </div>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className="no-print w-full bg-gray-600 hover:bg-gray-500 transition p-2 rounded font-medium"
        >
          Reset My Exit Strategy
        </button>

        {session && (
          <button
            onClick={() => setShowTimelineModal(true)}
            className="no-print w-full bg-slate-600 hover:bg-slate-500 transition p-2 rounded font-medium"
          >
            View My Saved Exit Strategies
          </button>
        )}



      </div>

    {/* RESULTS CARD */}    
    <div className="relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col gap-y-5 text-white">
        {retirementResult && (
          <>
            <div className="mt-6 space-y-2">
              <h2 className="font-semibold">
                📊 With this pace, this will be your Freedom Timeline:
              </h2>

              <div className="mt-4 pl-13 text-gray-300 space-y-2">
              <p>
                You'd need <span className="font-semibold text-white"> {currencySymbol}
                {retirementResult.targetWealth.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}</span> worth of investments.
              </p>

              <p>
                Starting now, you have to consistently invest <span className="font-semibold text-white">₱{monthlyInvestment.toLocaleString()}</span> monthly, for{" "}
                {retirementResult.yearsRequired.toFixed(2)} years.
              </p>

              {retirementAge !== null && (
                <p>
                  You can retire at age of {retirementAge.toFixed(2)}
                </p>
              )}


              <p>
                (Based on a sustainable{" "}
                {retirementResult.realReturnPercent.toFixed(2)}% withdrawal strategy).
              </p>
              </div>
            </div>

            {growthData.length > 0 && (
              <div className="page-break mt-6">
                <h2 className="font-semibold">
                  📈 Growth Projection
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={growthData}
                    margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        typeof value === "number"
                          ? `${currencySymbol}${value.toLocaleString()}`
                          : value
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="wealth"
                      stroke="#4ade80"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Share Button — now properly at the bottom */}
            <button
              onClick={handleShare}
              className="no-print w-full bg-emerald-600 hover:bg-emerald-500 transition p-2 rounded font-medium mt-6"
            >
              Share My Freedom Timeline
            </button>



            {/* Export Button */}
            <button
              onClick={handleSaveTimeline}
              className="no-print w-full bg-purple-600 hover:bg-purple-500 transition p-2 rounded font-medium mt-4"
            >
              Save This Timeline
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="no-print w-full bg-blue-600 hover:bg-blue-500 transition p-2 rounded font-medium mt-6"
              style={{
                marginTop: "2rem",
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              Export to PDF
            </button>




          </>
        )}
      
    </div>

    </div>




    <div className="print-only hidden print:block text-xs text-gray-500 mt-10 print:mt-4">
      Generated by Escape the Rat Race
    </div>

    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />

    <TimelineModal
      isOpen={showTimelineModal}
      onClose={() => setShowTimelineModal(false)}
      onLoadTimeline={handleLoadTimeline}
    />

    <InfoModal
      isOpen={showInfo}
      onClose={() => setShowInfo(false)}
    />

    <FeedbackModal
      isOpen={showFeedback}
      onClose={() => setShowFeedback(false)}
    />

    </> 
  );
}