'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Globe, 
  Smartphone, 
  Palette, 
  Download,
  Share2,
  Eye,
  Code2,
  FileText,
  FolderOpen
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Compare files and text in milliseconds with our optimized diff algorithm.',
    },
    {
      icon: Eye,
      title: 'Multiple Views',
      description: 'Switch between side-by-side and inline diff views for better readability.',
    },
    {
      icon: Code2,
      title: 'Syntax Highlighting',
      description: 'Support for 20+ programming languages with beautiful syntax highlighting.',
    },
    {
      icon: FileText,
      title: 'File Support',
      description: 'Upload and compare various file types up to 10MB each.',
    },
    {
      icon: FolderOpen,
      title: 'Folder Comparison',
      description: 'Compare entire directory structures with tree-view navigation.',
    },
    {
      icon: Download,
      title: 'Export Results',
      description: 'Export diff results in multiple formats (TXT, PDF, DOCX).',
    },
    {
      icon: Share2,
      title: 'Shareable Links',
      description: 'Generate shareable links for your diff comparisons.',
    },
    {
      icon: Palette,
      title: 'Customizable Themes',
      description: 'Dark and light modes with customizable color schemes.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Fully responsive design that works perfectly on all devices.',
    },
    {
      icon: Globe,
      title: 'Offline Support',
      description: 'Text and code comparisons work offline for better privacy.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your files are processed locally and never stored on our servers.',
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Every Use Case
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you&apos;re comparing code, documents, or entire folders, Diffly provides 
            all the tools you need with a beautiful, intuitive interface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:shadow-xl hover:border-primary-500/20 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div 
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/10 text-primary-500 mb-4 group-hover:bg-primary-500/20 transition-colors relative z-10"
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              <motion.h3 
                className="text-lg font-semibold text-foreground mb-2 relative z-10"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">20+</div>
            <div className="text-muted-foreground">Programming Languages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">10MB</div>
            <div className="text-muted-foreground">Max File Size</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">100%</div>
            <div className="text-muted-foreground">Privacy Focused</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">∞</div>
            <div className="text-muted-foreground">Free to Use</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
