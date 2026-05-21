"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';

// A utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// The main pricing component
const AuroraPricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

    const plans = [
        {
            name: 'Starter',
            price: { monthly: 19, yearly: 190 },
            description: 'Perfect for individuals and small projects.',
            features: ['5 Projects', 'Basic Analytics', '24/7 Support', '10GB Storage'],
            isFeatured: false,
        },
        {
            name: 'Pro',
            price: { monthly: 49, yearly: 490 },
            description: 'For growing teams and businesses.',
            features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', '100GB Storage', 'Team Collaboration'],
            isFeatured: true,
        },
        {
            name: 'Enterprise',
            price: { monthly: 99, yearly: 990 },
            description: 'For large organizations with custom needs.',
            features: ['Everything in Pro', 'Dedicated Account Manager', 'Custom Integrations', 'SLA & Security Audits'],
            isFeatured: false,
        },
    ];

    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15 + 0.3,
                duration: 0.6,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <div className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* The interactive gradient background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="aurora-bg">
                    <div className="aurora-shape-1"></div>
                    <div className="aurora-shape-2"></div>
                </div>
            </div>
            <style>{`
                .aurora-bg { position: absolute; inset: 0; filter: blur(100px); }
                .aurora-shape-1, .aurora-shape-2 { position: absolute; border-radius: 50%; }
                .aurora-shape-1 { width: 600px; height: 600px; background-color: rgba(0, 128, 255, 0.5); top: 10%; left: 10%; animation: moveAurora1 20s infinite alternate ease-in-out; }
                .aurora-shape-2 { width: 500px; height: 500px; background-color: rgba(128, 0, 255, 0.5); bottom: 10%; right: 10%; animation: moveAurora2 25s infinite alternate ease-in-out; }
                @keyframes moveAurora1 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(100px, 50px) rotate(180deg); } }
                @keyframes moveAurora2 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(-100px, -50px) rotate(-180deg); } }
            `}</style>

            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-matisse-400 to-matisse-600 dark:from-matisse-300 dark:to-matisse-500 text-[11px] font-bold uppercase tracking-[0.3em] mb-6"
                >
                    <Zap size={14} className="text-matisse-500" />
                    <span>Flexible & Transparent Pricing</span>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
                    className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-slate-900 dark:text-white"
                >
                    Find the Perfect Plan
                </motion.h1>

                {/* Billing Cycle Toggle */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                    className="flex items-center justify-center space-x-4 mb-12"
                >
                    <span className={cn("text-lg font-medium transition-colors", billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500')}>Monthly</span>
                    <div 
                        className="w-14 h-8 flex items-center bg-slate-200 dark:bg-slate-700/50 rounded-full p-1 cursor-pointer transition-colors"
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    >
                        <motion.div 
                            className="w-6 h-6 bg-matisse-500 rounded-full shadow-sm"
                            layout
                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            style={{ marginLeft: billingCycle === 'yearly' ? 'auto' : '0' }}
                        />
                    </div>
                    <span className={cn("text-lg font-medium transition-colors", billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500')}>Yearly</span>
                    <span className="text-sm text-matisse-600 dark:text-matisse-400 font-bold uppercase tracking-wider">(Save 20%)</span>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        custom={index}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -10, scale: 1.02 }}
                        className={cn(
                            "relative p-8 rounded-2xl border overflow-hidden transition-all duration-300",
                            plan.isFeatured 
                                ? 'bg-slate-50 dark:bg-slate-900/40 border-matisse-200 dark:border-matisse-500/30 shadow-xl' 
                                : 'bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/50 backdrop-blur-sm shadow-sm hover:shadow-md'
                        )}
                    >
                        <div className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-500",
                            plan.isFeatured ? 'card-aurora-featured' : 'card-aurora'
                        )}></div>
                         {plan.isFeatured && (
                            <div className="absolute top-0 right-0 text-[10px] font-black uppercase tracking-widest text-white dark:text-matisse-950 bg-matisse-500 dark:bg-matisse-400 px-4 py-2 rounded-bl-xl shadow-sm">
                                MOST POPULAR
                            </div>
                        )}
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{plan.description}</p>
                            
                            <div className="flex items-baseline mt-8">
                                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={billingCycle}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            ${plan.price[billingCycle as 'monthly' | 'yearly']}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 ml-2 font-bold uppercase tracking-widest text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                                        <CheckCircle className="h-5 w-5 text-matisse-500 dark:text-matisse-400 mr-3 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={cn(
                                "w-full mt-10 pt-4 text-sm font-bold uppercase tracking-widest rounded-xl py-4 transition-all duration-300",
                                plan.isFeatured 
                                    ? "bg-matisse-500 text-white hover:bg-matisse-600 shadow-lg shadow-matisse-500/25" 
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                            )}>
                                Choose Plan
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
             <style>{`
                .card-aurora, .card-aurora-featured {
                    background-size: 300% 300%;
                    animation: gradient-animation 10s ease infinite;
                    filter: blur(50px);
                }
                .card-aurora { background-image: linear-gradient(45deg, #0077ff, #00ff77); }
                .card-aurora-featured { background-image: linear-gradient(45deg, #8A2BE2, #4A00E0); }
                [class*="card-aurora"] { transition: opacity 0.5s ease; }
                .group:hover .card-aurora, .group:hover .card-aurora-featured,
                div:hover > .card-aurora, div:hover > .card-aurora-featured {
                    opacity: 0.3;
                }
            `}</style>
        </div>
    );
};

export default AuroraPricing;
