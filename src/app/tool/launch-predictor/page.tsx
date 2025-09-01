import { LaunchPredictor } from "@/components/LaunchPredictor";
import { Gauge } from "lucide-react";

export default function LaunchPredictorPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <Gauge size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Launch Success Predictor</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Input mission parameters and our AI will analyze the risks and predict the likelihood of a successful launch.
        </p>
      </div>
      <LaunchPredictor />
    </div>
  );
}
