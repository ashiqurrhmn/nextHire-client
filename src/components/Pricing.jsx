"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Check,
  Star,
  ShieldCheck,
  Diamond,
  ChevronDown,
  Briefcase,
  Person,
} from "@gravity-ui/icons";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function Pricing({ embedded = false }) {
  const { data: session } = useSession();
  const userRole = session?.user?.role; // "seeker" or "recruiter"

  const [activeTab, setActiveTab] = useState("seekers");
  const [openFaq, setOpenFaq] = useState(null);

  // Auto-select the correct tab based on user role
  useEffect(() => {
    if (userRole === "recruiter") setActiveTab("recruiters");
    else if (userRole === "seeker") setActiveTab("seekers");
  }, [userRole]);

  // Check if user is viewing plans that don't match their role
  const isWrongRole = userRole && (
    (activeTab === "seekers" && userRole !== "seeker") ||
    (activeTab === "recruiters" && userRole !== "recruiter")
  );

  const [dbPlans, setDbPlans] = useState({ seeker: [], recruiter: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/plans`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const seeker = data.filter((p) => p.role === "seeker");
          const recruiter = data.filter((p) => p.role === "recruiter");
          setDbPlans({ seeker, recruiter });
        } else {
          console.error("API returned non-array data:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch plans", err);
        setLoading(false);
      });
  }, []);

  const getPlanDetails = (plan) => {
    // Add UI specific properties that are not in DB
    const isFree = plan.price === "$0" || plan.price === 0;
    
    let icon, buttonVariant, gradient, buttonText;
    
    if (plan.name === "Free") {
      icon = <Star size={24} className="text-zinc-400" />;
      buttonVariant = "bordered";
      buttonText = "Current Plan";
    } else if (plan.name === "Pro" || plan.name === "Growth") {
      icon = <ShieldCheck size={24} className="text-[#0088FF]" />;
      buttonVariant = "solid";
      buttonText = `Upgrade to ${plan.name}`;
      gradient = "from-[#0088FF] to-[#0055FF]";
    } else if (plan.name === "Premium" || plan.name === "Enterprise") {
      icon = <Diamond size={24} className="text-purple-400" />;
      buttonVariant = "solid";
      buttonText = `Upgrade to ${plan.name}`;
      gradient = "from-purple-500 to-indigo-600";
    }

    return {
      ...plan,
      icon,
      buttonVariant,
      buttonText,
      gradient
    };
  };

  const seekerPlans = dbPlans.seeker.map(getPlanDetails);
  const recruiterPlans = dbPlans.recruiter.map(getPlanDetails);


  const faqs = [
    {
      question: "How does the cancellation process work?",
      answer:
        "You can cancel your subscription at any time from your account settings. Once canceled, you will retain access to your premium features until the end of your current billing cycle.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "We offer a 14-day money-back guarantee for all our paid plans. If you're not completely satisfied within your first two weeks, simply contact support for a full refund.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support PayPal and Apple Pay for your convenience.",
    },
    {
      question: "Can I switch plans later?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time. If you upgrade, the prorated difference will be charged immediately. If you downgrade, the new rate will apply at your next billing cycle.",
    },
  ];

  const currentPlans = activeTab === "seekers" ? seekerPlans : recruiterPlans;

  return (
    <section className={`relative overflow-hidden ${embedded ? 'py-8' : 'pb-24 sm:py-32'} px-4 sm:px-6 w-full ${embedded ? 'bg-transparent' : 'bg-black'}`}>
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#0088FF]/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-500/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {!embedded && (
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white"
          >
            Choose your{" "}
            <span className="bg-gradient-to-r from-[#0088FF] to-purple-500 bg-clip-text text-transparent">
              path to success
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Unlock more opportunities and hire faster with our flexible pricing
            plans.
          </motion.p>
        </div>
        )}

        {/* Custom Toggle Switch */}
        <div className="flex justify-center mb-16">
          <div className="bg-zinc-900/80 p-1.5 rounded-full border border-zinc-800 flex items-center shadow-lg relative">
            <button
              onClick={() => setActiveTab("seekers")}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === "seekers" ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <Person size={18} />
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab("recruiters")}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === "recruiters" ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <Briefcase size={18} />
              For Recruiters
            </button>

            {/* Animated Highlight */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 bg-zinc-800 rounded-full border border-zinc-700 shadow-sm"
              initial={false}
              animate={{
                left: activeTab === "seekers" ? "0.375rem" : "50%",
                width: "calc(50% - 0.375rem)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto mb-24">
          {loading ? (
             <div className="col-span-1 md:col-span-3 flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#0088FF] border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
          <AnimatePresence>
            {currentPlans.map((plan, index) => (
              <motion.div
                key={activeTab + plan.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 80,
                  duration: 0.4,
                }}
                className={`relative bg-[#121214]/80 backdrop-blur-xl border rounded-3xl p-8 flex flex-col transition-all hover:-translate-y-2 duration-300 ${
                  plan.popular
                    ? "border-[#0088FF]/50 shadow-[0_0_40px_rgba(0,136,255,0.15)] md:scale-105 z-10"
                    : "border-zinc-800 opacity-90 hover:opacity-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <p className="text-zinc-400 text-sm mb-4 min-h-[40px]">
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-zinc-500 font-medium mb-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-emerald-500/20 p-1 shrink-0">
                        <Check size={12} className="text-emerald-400" />
                      </div>
                      <span className="text-zinc-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.gradient && (
                  <form action="/api/checkout_sessions" method="POST">
                    <input type="hidden" name="price_id" value={plan.id} />
                    <section>
                      <button
                        type="submit"
                        role="link"
                        disabled={isWrongRole || !session?.user}
                        className={`w-full h-12 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-white shadow-[0_4px_20px_rgba(0,136,255,0.3)] hover:shadow-[0_4px_25px_rgba(0,136,255,0.5)]"
                            : plan.gradient
                              ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                              : "bg-zinc-800 hover:bg-zinc-700 text-white"
                        }`}
                      >
                        {!session?.user
                          ? "Sign in to Upgrade"
                          : isWrongRole
                            ? `Only for ${activeTab === "seekers" ? "Job Seekers" : "Recruiters"}`
                            : "Checkout"}
                      </button>
                    </section>
                  </form>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-zinc-400">
              Everything you need to know about the product and billing.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-zinc-800 rounded-2xl bg-[#121214]/50 backdrop-blur-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-zinc-400 shrink-0 ml-4"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 pt-0 text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
