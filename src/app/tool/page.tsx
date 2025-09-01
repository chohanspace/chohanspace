import { ContentSuggestionTool } from "@/components/ContentSuggestionTool";
import { MissionIdeaGenerator } from "@/components/MissionIdeaGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lightbulb, Rocket, BookOpen, AlertTriangle } from "lucide-react";
import Link from "next/link";

const aiFeatures = [
    { 
        href: '/tool/content-suggester', 
        label: 'Content Suggester',
        description: "Get help writing project descriptions and finding keywords.",
        icon: <Lightbulb />
    },
    { 
        href: '/tool/mission-generator', 
        label: 'Mission Idea Generator',
        description: "Brainstorm new space mission concepts from a few keywords.",
        icon: <Rocket />
    },
    {
        href: '/tool/technical-manual',
        label: 'Technical Manual Assistant',
        description: 'Ask questions about a technical document and get instant answers.',
        icon: <BookOpen />
    },
    {
        href: '/tool/crisis-communicator',
        label: 'Crisis Communicator',
        description: 'Generate public relations statements for mission anomalies.',
        icon: <AlertTriangle />
    }
];

export default function AiToolPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
            <Lightbulb size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">AI-Powered Tools</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Leverage our custom AI models to spark creativity and assist with your aerospace projects.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {aiFeatures.map(feature => (
            <Link href={feature.href} key={feature.href}>
                <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
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
