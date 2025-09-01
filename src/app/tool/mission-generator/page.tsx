import { MissionIdeaGenerator } from "@/components/MissionIdeaGenerator";
import { Rocket } from "lucide-react";

export default function MissionGeneratorPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <Rocket size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Mission Idea Generator</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
           Need inspiration for a new space mission? Enter a few keywords (like "Mars, exploration, water") and let our AI generate a complete mission concept for you.
        </p>
      </div>
      <MissionIdeaGenerator />
    </div>
  );
}
