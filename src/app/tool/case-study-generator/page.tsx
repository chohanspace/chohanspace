import { CaseStudyGenerator } from "@/components/CaseStudyGenerator";
import { FileText } from "lucide-react";

export default function CaseStudyGeneratorPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <FileText size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Case Study Generator</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Describe your project, and our AI will write a professional case study for your portfolio.
        </p>
      </div>
      <CaseStudyGenerator />
    </div>
  );
}
