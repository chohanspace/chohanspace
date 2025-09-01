import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BookOpen, FileText } from "lucide-react";
import Link from "next/link";

const aiFeatures = [
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
    }
];

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Our AI-Powered Tools</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our suite of intelligent tools designed to accelerate your web development workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {aiFeatures.map((feature) => (
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
