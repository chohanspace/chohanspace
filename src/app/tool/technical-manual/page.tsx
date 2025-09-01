import { TechnicalManualAssistant } from "@/components/TechnicalManualAssistant";
import { BookOpen } from "lucide-react";

export default function TechnicalManualPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <BookOpen size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Technical Manual Assistant</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Paste in a technical document and ask a question. The AI will find the answer for you based only on the text provided.
        </p>
      </div>
      <TechnicalManualAssistant />
    </div>
  );
}
