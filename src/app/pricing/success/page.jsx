"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Load Stripe server-side to avoid leaking API keys
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    if (!paymentIntentId) return;

    const checkPaymentStatus = async () => {
      try {
        // Fetch payment status from server
        const response = await fetch("/api/checkout_sessions/payment-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId })
        });

        const data = await response.json();

        if (data.success) {
          console.log("Payment successful:", data);
          // You can redirect to dashboard or show success message
        } else {
          console.error("Payment failed:", data);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    checkPaymentStatus();
  }, [paymentIntentId]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Thank You!</h1>
        <p className="text-zinc-400">
          {paymentIntentId ? "Processing your payment..." : "Waiting for payment confirmation..."}
        </p>
        {paymentIntentId && (
          <div className="mt-4 text-zinc-500">
            <p>Payment Intent: {paymentIntentId}</p>
          </div>
        )}
      </div>
    </div>
  );
}