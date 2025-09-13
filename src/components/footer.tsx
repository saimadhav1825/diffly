'use client';

import { Github, Twitter, Heart, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 backdrop-blur-sm">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-slate-800 font-bold text-lg">D</span>
              </motion.div>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Diffly
              </motion.span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The next-generation diff checker for text, code, files, and folders. 
              Fast, accurate, and beautifully designed with modern UI/UX.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/saimadhav1825/diffly"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-5 w-5 text-foreground" />
              </motion.a>
              <motion.a
                href="#"
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-5 w-5 text-foreground" />
              </motion.a>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground text-lg">Features</h3>
            <ul className="space-y-3 text-sm">
              {['Text Comparison', 'Code Diff', 'File Upload', 'Folder Comparison', 'Syntax Highlighting', 'Export Results'].map((feature, index) => (
                <motion.li 
                  key={feature}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground text-lg">Support</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Help Center', href: '/help' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Report Bug', href: '/report-bug' }
              ].map((item, index) => (
                <motion.li 
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={item.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
          </div>
        </div>

        <motion.div 
          className="mt-12 pt-8 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.p 
              className="text-sm text-muted-foreground"
              whileHover={{ scale: 1.02 }}
            >
              © 2024 Diffly. All rights reserved.
            </motion.p>
            <motion.div 
              className="text-sm text-muted-foreground flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              Made with 
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </motion.div>
              for developers
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll to Top Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
          aria-label="Scroll to top"
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowUp className="h-5 w-5 text-slate-100" />
          </motion.div>
        </Button>
      </motion.div>
    </footer>
  );
}
