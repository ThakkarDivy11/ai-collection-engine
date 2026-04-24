import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Menu, X, Sun, Moon } from "lucide-react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Theme initialization
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

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 py-6 ${
      isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="bg-[#16a34a] p-2.5 rounded-2xl text-white group-hover:scale-110 transition-transform duration-500">
            <BrainCircuit size={24} />
          </div>
          <span className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tighter">CollectAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-14">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#16a34a] dark:hover:text-[#16a34a] transition-colors uppercase tracking-[0.2em]"
            >
              {link.name}
            </a>
          ))}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#16a34a] transition-all"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <Link 
            to="/login" 
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#16a34a] transition-colors uppercase tracking-[0.2em]"
          >
            Access
          </Link>
          <Link 
            to="/login"
            className="px-10 py-3.5 bg-slate-950 dark:bg-white dark:text-black text-white text-sm font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Start
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-lg font-semibold text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Link 
            to="/login"
            className="w-full py-4 bg-[#16a34a] text-white text-center font-semibold rounded-2xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
