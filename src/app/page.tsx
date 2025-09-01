import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, PenTool, Cloud, Lightbulb, BookOpen, FileText } from 'lucide-react';
import Link from 'next/link';

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
    },
];

export default function Home() {

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center text-center text-white overflow-hidden bg-background dark:bg-black py-16">
        <div className="absolute inset-0 z-0">
          <ul className="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
          </ul>
        </div>
        <div className="container mx-auto px-4 z-10 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline mb-4 tracking-tight text-foreground" style={{fontWeight: 1000}}>
            Building Exceptional Digital Experiences
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
            Chohan Space crafts intelligent, high-performance websites and applications that drive results.
          </p>
          <Button asChild size="lg">
            <Link href="/projects">
              Explore Our AI Tools <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 md:py-24 scroll-animate" style={{ animationDelay: '0.2s' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">What We Do</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              From sleek marketing sites to complex web applications, we build solutions for the modern web.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Code size={32} />
                </div>
                <CardTitle>Web Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Crafting robust, scalable, and secure web applications tailored to your needs.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <PenTool size={32} />
                </div>
                <CardTitle>UI/UX Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Designing intuitive and beautiful user interfaces that captivate your audience.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Cloud size={32} />
                </div>
                <CardTitle>Cloud Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Leveraging cloud infrastructure to deliver reliable and scalable applications.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Projects Section */}
      <section className="py-16 md:py-24 bg-background scroll-animate" style={{ animationDelay: '0.4s' }}>
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Our AI-Powered Tools</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
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
            <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/projects">
                        View All AI Tools <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
      </section>
      
      {/* Chohan Space I/O Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-black scroll-animate" style={{ animationDelay: '0.6s' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Chohan Space I/O
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Experience our next-generation I/O optimized AI tools, designed for high-throughput data processing and creative generation.
          </p>
          <Button asChild size="lg">
            <Link href="/io">Explore I/O Features</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background scroll-animate" style={{ animationDelay: '0.8s' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Have a Project?</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto mb-8">
            Let's collaborate to bring your next digital product to life.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">
              Get in Touch
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
