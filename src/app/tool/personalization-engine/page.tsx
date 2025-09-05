
import { PersonalizationEngine } from "@/components/PersonalizationEngine";
import { BrainCircuit } from "lucide-react";

export default function PersonalizationEnginePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <BrainCircuit size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Personalization Engine</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Our premier AI tool, developed with Butt Networks. Simulate user behavior to see how our AI dynamically adapts website content for a personalized experience.
        </p>
      </div>
      <PersonalizationEngine />
    </div>
  );
}
