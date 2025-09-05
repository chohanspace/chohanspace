
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BookOpen, FileText, Rocket, AlertTriangle, Gauge, BrainCircuit } from "lucide-react";
import Link from "next/link";

const aiFeatures = [
    {
        href: '/tool/personalization-engine',
        label: 'Personalization Engine',
        description: 'Our premier tool! Dynamically adapts content based on user behavior.',
        icon: <BrainCircuit />,
        premier: true,
    },
    { 
        href: '/tool/content-suggester', 
        label: 'Content Suggester',
        description: "Get help writing project descriptions and finding keywords.",
        icon: <Lightbulb />
    },
    {
        href: '/tool/technical-manual',
        label: 'Technical Manual Assistant',
        description: 'Ask questions about a technical document and get instant answers.',
        icon: <BookOpen />
    },
    {
        href: '/tool/case-study-generator',
        label: 'Case Study Generator',
        description: 'Generate professional case studies for your web projects.',
        icon: <FileText />
    },
    { 
        href: '/tool/mission-generator', 
        label: 'Mission Idea Generator',
        description: "Brainstorm new space mission concepts from a few keywords.",
        icon: <Rocket />
    },
    {
        href: '/tool/crisis-communicator',
        label: 'Crisis Communicator',
        description: 'Generate public relations statements for mission anomalies.',
        icon: <AlertTriangle />
    },
    {
        href: '/tool/launch-predictor',
        label: 'Launch Success Predictor',
        description: 'Analyze risks and predict the likelihood of a successful launch.',
        icon: <Gauge />
    }
];

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Our AI-Powered Tools</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our suite of intelligent tools designed to accelerate your web development workflow, including our premier Personalization Engine developed with Butt Networks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {aiFeatures.map((feature) => (
            <Link href={feature.href} key={feature.href}>
                <Card className={`h-full hover:shadow-lg transition-all duration-300 ${feature.premier ? 'border-primary hover:border-primary ring-2 ring-transparent hover:ring-primary/50' : 'hover:border-primary'}`}>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className={`p-3 rounded-full ${feature.premier ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                            {feature.icon}
                        </div>
                        <div>
                            <CardTitle>{feature.label}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
