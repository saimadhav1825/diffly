'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Github, Twitter, Heart, Code, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Advanced Diff Engine",
      description: "Powered by industry-standard diff algorithms for accurate comparisons"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Processing",
      description: "Instant results with live updates as you type or upload files"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description: "All processing happens locally - your data never leaves your device"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Developer Friendly",
      description: "Built by developers, for developers with modern tools and APIs"
    }
  ];

  const stats = [
    { number: "10+", label: "Supported Languages" },
    { number: "4", label: "Diff Types" },
    { number: "100%", label: "Client-side" },
    { number: "∞", label: "File Size Limit" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <Button variant="outline" size="sm" className="group">
              <motion.div
                animate={{ x: 0 }}
                whileHover={{ x: -3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
              </motion.div>
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-6">
            About Diffly
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The next-generation diff checker that makes comparing text, code, files, and folders 
            fast, accurate, and beautifully designed.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="text-center p-6 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl font-bold text-primary-500 mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Diffly?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="p-6 bg-background/50 rounded-xl border border-border/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 bg-primary-500/10 rounded-lg text-primary-500"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary-500/5 to-purple-500/5 rounded-2xl border border-primary-500/20">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              To provide developers, writers, and professionals with the most intuitive and powerful 
              diff checking tools. We believe that comparing content should be effortless, accurate, 
              and visually appealing.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Built with modern web technologies and designed with user experience in mind, 
              Diffly represents the future of content comparison tools.
            </p>
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Built With Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Monaco Editor', 'Diff Algorithm', 'JSZip'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="p-4 bg-muted/30 rounded-lg border border-border/50 text-center hover:bg-muted/50 transition-all duration-300 hover:scale-105"
              >
                <div className="font-semibold text-foreground">{tech}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-muted-foreground">Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="h-5 w-5 text-red-500 fill-current" />
            </motion.div>
            <span className="text-muted-foreground">by the Diffly team</span>
          </div>
          <div className="flex items-center justify-center gap-4">
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
      </div>
    </div>
  );
}
