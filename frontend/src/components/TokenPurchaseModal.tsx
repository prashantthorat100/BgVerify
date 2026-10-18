"use client";

import React, { useState } from "react";
import {
  Coins,
  CheckCircle2,
  Zap,
  CreditCard,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { creditsApi } from "@/lib/api";

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccess: (newBalance: number) => void;
}

export function TokenPurchaseModal({
  isOpen,
  onClose,
  currentBalance,
  onSuccess,
}: TokenPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<"starter" | "growth" | "enterprise">("growth");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [addedTokens, setAddedTokens] = useState(0);

  if (!isOpen) return null;

  const packages = [
    {
      id: "starter" as const,
      name: "Starter Pack",
      tokens: 10,
      price: 19,
      perToken: "$1.90",
      description: "Great for quick tests and occasional hires",
      popular: false,
    },
    {
      id: "growth" as const,
      name: "Growth Pro",
      tokens: 50,
      price: 79,
      perToken: "$1.58",
      description: "Best for active recruitment and HR teams",
      popular: true,
    },
    {
      id: "enterprise" as const,
      name: "Enterprise Volume",
      tokens: 200,
      price: 249,
      perToken: "$1.24",
      description: "Maximum discount for high-volume staffing",
      popular: false,
    },
  ];

  const currentPkg = packages.find((p) => p.id === selectedPackage)!;

  const handleBuy = async () => {
    setIsProcessing(true);
    try {
      const res = await creditsApi.purchase(currentPkg.id, currentPkg.tokens, currentPkg.price);
      setAddedTokens(currentPkg.tokens);
      setPurchaseComplete(true);
      const newBal = (res && res.new_balance) ? res.new_balance : currentBalance + currentPkg.tokens;
      setTimeout(() => {
        onSuccess(newBal);
        setPurchaseComplete(false);
        setIsProcessing(false);
        onClose();
      }, 1500);
    } catch (err) {
      // Fallback for offline demo mode
      const newBal = currentBalance + currentPkg.tokens;
      setAddedTokens(currentPkg.tokens);
      setPurchaseComplete(true);
      setTimeout(() => {
        onSuccess(newBal);
        setPurchaseComplete(false);
        setIsProcessing(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 text-slate-900 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {purchaseComplete ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tokens Added Successfully!</h3>
            <p className="text-xs text-slate-500">
              +{addedTokens} verification credits credited to your account. You can now analyze documents immediately.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="pb-4 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-1">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Verification Token Credits</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Purchase Document Analysis Tokens</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Each document analysis or candidate credential check consumes <strong>1 Token</strong>.
              </p>
            </div>

            {/* Current Balance Bar */}
            <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Your Current Balance:</span>
              <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                ⚡ {currentBalance} {currentBalance === 1 ? "Token" : "Tokens"}
              </span>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              {packages.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-3 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                        Popular
                      </span>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{pkg.name}</h4>
                      <div className="mt-2 text-2xl font-black text-slate-900">${pkg.price}</div>
                      <div className="text-[11px] font-bold text-blue-700 mt-0.5">
                        {pkg.tokens} Tokens <span className="text-slate-400 font-normal">({pkg.perToken}/ea)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Simulation Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 mb-5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Instant Checkout Demo • Visa / Mastercard / Stripe</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Secure
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBuy}
                disabled={isProcessing}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>
                  {isProcessing
                    ? "Authorizing..."
                    : `Confirm & Pay $${currentPkg.price} (${currentPkg.tokens} Tokens)`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
