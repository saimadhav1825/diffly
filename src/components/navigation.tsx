'use client';

import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useState } from 'react';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { useKeyboardShortcuts, DIFF_SHORTCUTS } from '@/hooks/use-keyboard-shortcuts';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      ...DIFF_SHORTCUTS.TOGGLE_THEME,
      action: toggleTheme,
    },
  ]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Help', href: '/help' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-slate-800 font-bold text-lg">D</span>
              </motion.div>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Diffly
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium rounded-lg hover:bg-slate-100/50 group dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50"
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <motion.span
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
                <motion.div
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Keyboard Shortcuts */}
            <KeyboardShortcuts className="hidden sm:flex" />
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-slate-100/50 hover:bg-slate-200 transition-all duration-300 border border-slate-200/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:border-slate-700/50 dark:hover:border-blue-400/50"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-900 dark:text-slate-100" />
              ) : (
                <Menu className="h-5 w-5 text-slate-900 dark:text-slate-100" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium px-2 py-1 dark:text-slate-400 dark:hover:text-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
