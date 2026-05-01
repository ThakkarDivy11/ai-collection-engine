/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, BrainCircuit, Zap, Shield, BarChart3, Users, Globe, BookOpen, LifeBuoy, Info } from "lucide-react";
import collectAILogo from "../../assets/images/collectai-logo.png";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

// Navigation links with rich submenus
const navigationLinks = [
  {
    label: "Features",
    submenu: true,
    type: "description" as const,
    items: [
      {
        href: "#features",
        label: "AI Collection Engine",
        description: "Neural churn prediction & autonomous negotiation.",
        icon: BrainCircuit,
      },
      {
        href: "#features",
        label: "Smart Analytics",
        description: "Real-time dashboards and recovery insights.",
        icon: BarChart3,
      },
      {
        href: "#features",
        label: "Multi-Channel Outreach",
        description: "Email, voice, and SMS recovery automation.",
        icon: Zap,
      },
    ],
  },
  {
    label: "Solutions",
    submenu: true,
    type: "simple" as const,
    items: [
      { href: "#features", label: "Enterprise Collections", icon: Shield },
      { href: "#features", label: "SMB Recovery", icon: Users },
      { href: "#features", label: "Global Operations", icon: Globe },
    ],
  },
  { href: "#how-it-works", label: "How it Works" },
  {
    label: "Resources",
    submenu: true,
    type: "icon" as const,
    items: [
      { href: "#!", label: "Documentation", icon: BookOpen },
      { href: "#!", label: "Support", icon: LifeBuoy },
      { href: "#!", label: "About CollectAI", icon: Info },
    ],
  },
  { href: "#pricing", label: "Pricing" },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
        isScrolled
          ? "bg-white/80 dark:bg-[#112740]/80 backdrop-blur-xl border-b border-slate-200 dark:border-matisse-800/20 py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="w-full px-5 md:px-8 flex h-16 items-center justify-between gap-4">
        {/* Left column: Logo */}
        <div className="flex-1 flex justify-start items-center">
          <Link
            to="/"
            className="flex items-center group flex-shrink-0 navbar-brand"
          >
            <div className="flex items-center gap-3 py-1">
              <img
                src="/logo.png"
                alt="CollectAI"
                className="logo h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>

        {/* Center column: Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navigationLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  {"submenu" in link && link.submenu ? (
                    <>
                      <NavigationMenuTrigger className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent px-3 py-2 font-semibold text-xs uppercase tracking-[0.2em] whitespace-nowrap data-[state=open]:bg-transparent">
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 bg-white dark:bg-[#112740] border-slate-200 dark:border-matisse-800/20 w-[480px]">
                          {link.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <NavigationMenuLink asChild>
                                <a
                                  href={item.href}
                                  className="group/item flex items-start gap-3 select-none rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-matisse-50 dark:hover:bg-white/5"
                                >
                                  {"icon" in item && item.icon && (
                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-matisse-50 dark:bg-matisse-500/10 text-matisse-600 dark:text-matisse-300 group-hover/item:bg-matisse-500 group-hover/item:text-white transition-colors">
                                      <item.icon size={18} />
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">
                                      {item.label}
                                    </div>
                                    {"description" in item && item.description && (
                                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <a
                        href={"href" in link ? link.href : "#!"}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-matisse-600 dark:hover:text-matisse-300 px-3 py-2 transition-colors uppercase tracking-[0.2em] whitespace-nowrap"
                      >
                        {link.label}
                      </a>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
            <NavigationMenuViewport className="bg-white dark:bg-[#112740] border-slate-200 dark:border-matisse-800/30 shadow-xl" />
          </NavigationMenu>
        </div>

        {/* Right column: Actions + Mobile trigger */}
        <div className="flex-1 flex justify-end items-center gap-3">
          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-matisse-300 hover:text-matisse-600 hover:bg-slate-100 dark:hover:bg-matisse-900/50 rounded-xl"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          {/* Access/Start Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-matisse-600 dark:hover:text-matisse-300 uppercase tracking-[0.2em]">
              <Link to="/login">Access</Link>
            </Button>
            <Button asChild size="sm" className="bg-[#2d84ca] text-white font-semibold rounded-xl px-6 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2d84ca]/20 text-xs uppercase tracking-[0.1em] border-0">
              <Link to="/login">Start</Link>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-9 md:hidden text-slate-700 dark:text-white"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85(.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2 md:hidden bg-white dark:bg-[#112740] border-slate-200 dark:border-matisse-800/30">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      {"submenu" in link && link.submenu ? (
                        <>
                          <div className="text-slate-400 dark:text-matisse-400 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider">
                            {link.label}
                          </div>
                          <ul>
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink
                                  href={item.href}
                                  className="flex items-center gap-2 px-2 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-matisse-600 dark:hover:text-matisse-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                >
                                  {"icon" in item && item.icon && <item.icon size={16} className="text-matisse-500" />}
                                  {item.label}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <NavigationMenuLink
                          href={"href" in link ? link.href : "#!"}
                          className="block px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-matisse-600 dark:hover:text-matisse-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          {link.label}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
