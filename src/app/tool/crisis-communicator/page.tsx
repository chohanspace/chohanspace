import { CrisisCommunicator } from "@/components/CrisisCommunicator";
import { AlertTriangle } from "lucide-react";

export default function CrisisCommunicatorPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <AlertTriangle size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Crisis Communicator</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          When things go wrong, clear communication is key. Describe the anomaly, and our AI will draft a professional public statement.
        </p>
      </div>
      <CrisisCommunicator />
    </div>
  );
}
