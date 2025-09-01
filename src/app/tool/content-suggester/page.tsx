import { ContentSuggestionTool } from "@/components/ContentSuggestionTool";
import { Lightbulb } from "lucide-react";

export default function ContentSuggesterPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <Lightbulb size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Content Suggester</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stuck on how to describe your project? Paste in your current description, and our AI will suggest related topics and keywords to help you expand on your ideas.
        </p>
      </div>
      <ContentSuggestionTool />
    </div>
  );
}
