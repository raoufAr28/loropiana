"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ShoppingBag, Moon, Sun, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { MiniCart } from "./MiniCart";

export function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items, setIsOpen } = useCartStore();
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const safeCartItemsCount = mounted ? cartItemsCount : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const path = window.location.pathname;
    const newLocale = locale === "fr" ? "ar" : "fr";
    const newPath = path.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath || `/${newLocale}`;
  };

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/shop`, label: t("shop") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-6'} px-4 md:px-8`}
    >
      <div className={`mx-auto max-w-7xl transition-all duration-500 rounded-full ${isScrolled ? 'glass-panel-heavy shadow-luxury-dark' : 'bg-transparent'}`}>
        <div className="h-16 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <Link href={`/${locale}`} className="text-2xl font-playfair font-bold tracking-[0.2em] uppercase text-gradient relative group flex flex-col">
              Loro Piana
              <span className="w-0 h-[1px] bg-foreground dark:bg-secondary mt-1 group-hover:w-full transition-all duration-500"></span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-10 text-xs font-semibold uppercase tracking-[0.15em]">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative group overflow-hidden py-1">
                <span className="relative z-10 transition-colors duration-300 group-hover:text-secondary">
                  {link.label}
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-secondary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 md:gap-7">
            <button onClick={toggleLanguage} className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors">
              {locale === "fr" ? "عربي" : "FR"}
            </button>

            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:text-secondary transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
            )}

            <button onClick={() => setIsOpen(true)} className="relative hover:text-secondary transition-colors flex items-center group">
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              {mounted && (
                <AnimatePresence>
                  {safeCartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      key={safeCartItemsCount}
                      className="absolute -top-2 -right-2 bg-foreground dark:bg-secondary text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm"
                    >
                      {safeCartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </button>
          </div>
        </div>
      </div>

      <MiniCart />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            className="md:hidden glass-panel-heavy mt-4 mx-4 rounded-3xl p-6 flex flex-col gap-6 shadow-luxury overflow-hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={link.href}
              >
                <Link href={link.href} className="text-lg uppercase tracking-widest font-semibold block" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
