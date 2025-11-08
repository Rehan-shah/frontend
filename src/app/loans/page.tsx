"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreditUnion {
  name: string;
  interestRate: number;
  monthlyPayment: number;
  totalSavings: number;
}

interface LoanOption {
  type: "card" | "personal" | "home";
  title: string;
  currentRate: number;
  newRate: number;
  savingsPerYear: number;
  creditUnions: CreditUnion[];
}

const loanOptions: LoanOption[] = [
  {
    type: "card",
    title: "Credit Card Loan",
    currentRate: 24.99,
    newRate: 12.5,
    savingsPerYear: 1250,
    creditUnions: [
      { name: "First Federal Credit Union", interestRate: 12.5, monthlyPayment: 450, totalSavings: 1250 },
      { name: "Community Credit Union", interestRate: 13.2, monthlyPayment: 465, totalSavings: 1180 },
      { name: "State Employees Credit Union", interestRate: 11.9, monthlyPayment: 440, totalSavings: 1310 },
      { name: "Teachers Credit Union", interestRate: 12.8, monthlyPayment: 455, totalSavings: 1220 },
      { name: "Navy Federal Credit Union", interestRate: 11.5, monthlyPayment: 435, totalSavings: 1350 },
    ],
  },
  {
    type: "personal",
    title: "Personal Loan",
    currentRate: 18.5,
    newRate: 8.9,
    savingsPerYear: 1920,
    creditUnions: [
      { name: "First Federal Credit Union", interestRate: 8.9, monthlyPayment: 320, totalSavings: 1920 },
      { name: "Community Credit Union", interestRate: 9.5, monthlyPayment: 335, totalSavings: 1800 },
      { name: "State Employees Credit Union", interestRate: 8.5, monthlyPayment: 315, totalSavings: 1980 },
      { name: "Teachers Credit Union", interestRate: 9.2, monthlyPayment: 330, totalSavings: 1860 },
      { name: "Navy Federal Credit Union", interestRate: 8.2, monthlyPayment: 310, totalSavings: 2040 },
    ],
  },
  {
    type: "home",
    title: "Home Loan",
    currentRate: 7.5,
    newRate: 5.8,
    savingsPerYear: 3400,
    creditUnions: [
      { name: "First Federal Credit Union", interestRate: 5.8, monthlyPayment: 1875, totalSavings: 3400 },
      { name: "Community Credit Union", interestRate: 6.1, monthlyPayment: 1920, totalSavings: 3120 },
      { name: "State Employees Credit Union", interestRate: 5.6, monthlyPayment: 1850, totalSavings: 3600 },
      { name: "Teachers Credit Union", interestRate: 5.9, monthlyPayment: 1890, totalSavings: 3360 },
      { name: "Navy Federal Credit Union", interestRate: 5.5, monthlyPayment: 1835, totalSavings: 3700 },
    ],
  },
];

export default function LoansPage() {
  const router = useRouter();
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);

  if (selectedLoan) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedLoan(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to Loan Options
          </button>

          <h1 className="text-3xl md:text-4xl font-light text-black mb-2">
            {selectedLoan.title} Options
          </h1>
          <p className="text-gray-600 mb-8 text-sm md:text-base">
            Compare credit unions and their interest rates for {selectedLoan.title.toLowerCase()}
          </p>

          <div className="space-y-4">
            {selectedLoan.creditUnions.map((cu, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-sm p-6 hover:border-blue-600 transition-colors"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-black mb-2">
                      {cu.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Interest Rate:</span>{" "}
                        <span className="text-blue-600 font-semibold">{cu.interestRate}%</span>
                      </p>
                      <p>
                        <span className="font-medium">Monthly Payment:</span> ${cu.monthlyPayment.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Annual Savings:</span>{" "}
                        <span className="text-green-600 font-semibold">${cu.totalSavings.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => {
                        // Redirect to credit union website
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(cu.name + " apply loan")}`, '_blank');
                      }}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 text-sm font-medium hover:bg-blue-700 transition-colors duration-200 rounded-sm"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Integrate AI pre-qualification flow
                        // This will ask for info and pre-apply for the user
                        alert(`AI Pre-qualification for ${cu.name} - Coming soon! This feature will collect your information and pre-apply for you.`);
                      }}
                      className="flex-1 bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 text-sm font-medium hover:bg-blue-50 transition-colors duration-200 rounded-sm"
                    >
                      Let AI Pre-qualify for You
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light text-black mb-2">
          Your Loan Options
        </h1>
        <p className="text-gray-600 mb-8 text-sm md:text-base">
          Compare your current rates with better options from credit unions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loanOptions.map((loan) => (
            <div
              key={loan.type}
              onClick={() => setSelectedLoan(loan)}
              className="border border-gray-300 rounded-sm p-6 hover:border-blue-600 transition-colors cursor-pointer"
            >
              <h2 className="text-xl font-medium text-black mb-4">
                {loan.title}
              </h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Rate</span>
                  <span className="text-sm font-medium text-gray-800">{loan.currentRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Rate</span>
                  <span className="text-sm font-medium text-blue-600">{loan.newRate}%</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black">You Save Per Year</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${loan.savingsPerYear.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-blue-600 font-medium">
                  View {loan.creditUnions.length} options →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

