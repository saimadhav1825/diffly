import { HeroSection } from '@/components/hero-section';
import { TextDiff } from '@/components/text-diff';
import { CodeDiff } from '@/components/code-diff';
import { FileDiff } from '@/components/file-diff';
import { FolderDiff } from '@/components/folder-diff';
import { FeaturesSection } from '@/components/features-section';
import { Footer } from '@/components/footer';
import { Tabs } from '@/components/ui/tabs';
import { GlobalShortcuts } from '@/components/global-shortcuts';
import { FileText, Code, Upload, FolderOpen } from 'lucide-react';

export default function Home() {
  const tabs = [
    {
      id: 'text',
      label: 'Text Diff',
      icon: <FileText className="h-4 w-4" />,
      content: <TextDiff />,
    },
    {
      id: 'code',
      label: 'Code Diff',
      icon: <Code className="h-4 w-4" />,
      content: <CodeDiff />,
    },
    {
      id: 'file',
      label: 'File Diff',
      icon: <Upload className="h-4 w-4" />,
      content: <FileDiff />,
    },
    {
      id: 'folder',
      label: 'Folder Diff',
      icon: <FolderOpen className="h-4 w-4" />,
      content: <FolderDiff />,
    },
  ];

  return (
    <div className="min-h-screen">
      <GlobalShortcuts />
      <HeroSection />
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs tabs={tabs} defaultTab="text" />
      </section>

      <FeaturesSection />
      <Footer />
    </div>
  );
}
