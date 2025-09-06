
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, PenTool, Cloud, Lightbulb, BookOpen, FileText, Rocket, Users, BrainCircuit, Bot, Settings } from 'lucide-react';
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
    { 
        href: '/tool/mission-generator', 
        label: 'Mission Idea Generator',
        description: "Brainstorm new space mission concepts from a few keywords.",
        icon: <Rocket />
    },
];

export default function Home() {

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center text-center overflow-hidden bg-background dark:bg-black py-16">
        <div className="container mx-auto px-4 z-10 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline mb-4 tracking-tight text-foreground" style={{fontWeight: 1000}}>
            Building Exceptional Digital Experiences
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
            Chohan Space crafts intelligent, high-performance websites and applications that drive results, in proud collaboration with Butt Networks. Discover our new premier AI tool, the Personalization Engine.
          </p>
          <Button asChild size="lg">
            <Link href="/projects">
              Explore Our AI Tools <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Premier AI Tool Section */}
      <section className="py-16 md:py-24 bg-secondary dark:bg-card scroll-animate">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold uppercase text-primary tracking-widest">A Chohan Space & Butt Networks Collaboration</h2>
            <p className="text-3xl md:text-4xl font-bold font-headline mt-2">Introducing: The Personalization Engine</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative aspect-video bg-background rounded-lg flex items-center justify-center p-8 shadow-2xl overflow-hidden">
              <BrainCircuit className="h-3/5 w-3/5 text-primary animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Dynamically Adapt Your Content</h3>
              <p className="text-muted-foreground">
                Our premier AI tool, developed in partnership with Butt Networks, analyzes user behavior to deliver real-time, personalized content experiences.
                Boost engagement and conversions by showing every visitor exactly what they want to see, when they want to see it.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Real-time user behavior analysis.</li>
                <li>Dynamic content & layout adjustments.</li>
                <li>A/B testing and performance insights.</li>
              </ul>
              <Button asChild>
                <Link href="/tool/personalization-engine">
                  Use The Tool <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ChatForge AI Coming Soon Section */}
      <section className="py-16 md:py-24 bg-background scroll-animate" style={{ animationDelay: '0.2s' }}>
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                 <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase text-primary tracking-widest">The Next Frontier</h2>
                    <p className="text-3xl md:text-4xl font-bold font-headline mt-2">ChatForge AI: Build Your Own Assistant</p>
                    <p className="text-muted-foreground">
                        The next mega-collaboration with Butt Networks is almost here. ChatForge AI will empower you to create and deploy custom-trained AI chatbot assistants directly onto your website. Enhance user engagement, automate customer support, and provide instant answers, all powered by our cutting-edge AI.
                    </p>
                    <Button size="lg" disabled>
                        Coming Soon...
                    </Button>
                </div>
                <div className="relative aspect-video bg-secondary rounded-lg flex items-center justify-center p-8 shadow-2xl overflow-hidden">
                    <Bot className="h-2/5 w-2/5 text-primary opacity-50" />
                    <Settings className="absolute h-1/4 w-1/4 text-primary animate-spin-slow opacity-80" style={{ animationDuration: '5s' }} />
                </div>
            </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 md:py-24 scroll-animate" style={{ animationDelay: '0.4s' }}>
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
      <section className="py-16 md:py-24 bg-secondary dark:bg-card scroll-animate" style={{ animationDelay: '0.6s' }}>
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

      {/* Collaboration Section */}
      <section className="py-16 md:py-24 scroll-animate" style={{ animationDelay: '0.8s' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Users size={32} />
             </div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline">In Collaboration With Butt Networks</h2>
            <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
              Chohan Space is proud to partner with Butt Networks, a leader in innovative web solutions. Led by CEO Shahnawaz Saddam Butt and Co-Owner Wahb Amir, this collaboration combines our strengths to push the boundaries of digital experiences and build the future of the web, together.
            </p>
            <Button asChild size="lg" className="mt-8">
                <a href="https://buttnetworks.com" target="_blank" rel="noopener noreferrer">
                    Visit Butt Networks <ArrowRight className="ml-2" />
                </a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Chohan Space I/O Section */}
      <section className="py-16 md:py-24 bg-background scroll-animate" style={{ animationDelay: '1.0s' }}>
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
      <section className="py-16 md:py-24 bg-white dark:bg-black scroll-animate" style={{ animationDelay: '1.2s' }}>
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
