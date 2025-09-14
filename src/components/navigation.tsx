'use client';

import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useState } from 'react';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { useKeyboardShortcuts, DIFF_SHORTCUTS } from '@/hooks/use-keyboard-shortcuts';
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
    <nav 
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-sm"
      suppressHydrationWarning={true}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300">
                <span className="text-slate-800 font-bold text-lg">D</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Diffly
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-all duration-300 font-medium rounded-lg hover:bg-muted/50 group"
                suppressHydrationWarning={true}
              >
                <span>{item.name}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Keyboard Shortcuts */}
            <KeyboardShortcuts className="hidden sm:flex" />
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 border border-border/50 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
              aria-label="Toggle theme"
              suppressHydrationWarning={true}
            >
              <div className="transition-transform duration-300">
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label="Toggle mobile menu"
              suppressHydrationWarning={true}
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
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
