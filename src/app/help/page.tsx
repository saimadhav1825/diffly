'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle, FileText, Code, Upload, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How do I compare text files?",
      answer: "Simply paste your original text in the left panel and modified text in the right panel. The diff will be calculated automatically in real-time. You can switch between inline and side-by-side views using the toggle buttons."
    },
    {
      id: 2,
      question: "What file types are supported?",
      answer: "Diffly supports text files (.txt), JSON files (.json), XML files (.xml), Word documents (.docx), and PDF files (.pdf). For folder comparison, upload ZIP files containing the folders you want to compare."
    },
    {
      id: 3,
      question: "How large can my files be?",
      answer: "There's no strict limit on file size since all processing happens in your browser. However, very large files (over 10MB) may take longer to process and could impact browser performance."
    },
    {
      id: 4,
      question: "Is my data secure?",
      answer: "Yes! All processing happens locally in your browser. Your files and text are never uploaded to any server, ensuring complete privacy and security."
    },
    {
      id: 5,
      question: "How do I export diff results?",
      answer: "Click the 'Export Diff' button in any diff view to download the results as a text file. For folder comparisons, you can export a detailed comparison report."
    },
    {
      id: 6,
      question: "What keyboard shortcuts are available?",
      answer: "Use Ctrl+Enter to process diffs, Ctrl+C to copy results, Ctrl+K to clear content, Ctrl+E to export, Ctrl+D to toggle dark mode, and Ctrl+Tab to switch between tabs."
    }
  ];

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Text Diff",
      description: "Compare plain text with real-time highlighting"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Code Diff",
      description: "Syntax-highlighted code comparison with Monaco Editor"
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "File Diff",
      description: "Upload and compare various file formats"
    },
    {
      icon: <FolderOpen className="h-6 w-6" />,
      title: "Folder Diff",
      description: "Compare entire folder structures and contents"
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and learn how to use Diffly effectively
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Diffly Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="p-6 bg-background/50 rounded-xl border border-border/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 text-center"
              >
                <motion.div
                  className="p-3 bg-primary-500/10 rounded-lg text-primary-500 mx-auto mb-4 w-fit"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-background/50 rounded-xl border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: expandedFAQ === faq.id ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary-500/5 to-purple-500/5 rounded-2xl border border-primary-500/20">
            <HelpCircle className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="group">
                  Contact Us
                  <motion.div
                    animate={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </motion.div>
                </Button>
              </Link>
              <Link href="/report-bug">
                <Button variant="outline">
                  Report a Bug
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
