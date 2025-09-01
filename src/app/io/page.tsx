import { StoryWriter } from "@/components/StoryWriter";
import { PenSquare } from "lucide-react";

export default function IoPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-primary-foreground p-4 rounded-full mb-4">
            <PenSquare size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">I/O: Creative Content Writer</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Provide a simple prompt and our I/O-optimized AI will generate creative content for you, complete with a title and body.
        </p>
      </div>
      <StoryWriter />
    </div>
  );
}
