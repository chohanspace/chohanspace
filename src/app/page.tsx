

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, PenTool, Cloud, Monitor, Laptop } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProjectCard from '@/components/ProjectCard';
import { placeholderProjects } from '@/lib/placeholder-data';


const codeSnippets = [
  { char: '{...}', delay: 0, x: '-150px', y: '120px' },
  { char: '</>', delay: 1, x: '150px', y: '-100px' },
  { char: '() =>', delay: 2, x: '180px', y: '80px' },
  { char: 'npm i', delay: 3, x: '-180px', y: '-90px' },
  { char: 'CSS', delay: 4, x: '-100px', y: '-150px' },
  { char: 'git push', delay: 5, x: '100px', y: '150px' },
]

export default function Home() {

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center text-center overflow-hidden bg-background py-16">
        <div className="animation-container">
            <div className="gradient-circle gradient-circle-top-left"></div>
            <div className="gradient-circle gradient-circle-bottom-right"></div>
            <Laptop className="anim-element anim-laptop" strokeWidth={0.5} />
            <Monitor className="anim-element anim-monitor" strokeWidth={0.5} />
            {codeSnippets.map(snippet => (
                <span 
                    key={snippet.char}
                    className="anim-element anim-code" 
                    style={{
                        top: '50%',
                        left: '50%',
                        // @ts-ignore
                        '--delay': snippet.delay,
                        '--start-x': snippet.x,
                        '--start-y': snippet.y,
                    }}
                >
                    {snippet.char}
                </span>
            ))}
        </div>

        <div className="container mx-auto px-4 z-10 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline mb-4 tracking-tight text-foreground" style={{fontWeight: 1000}}>
            We Build Websites And Landing Pages
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
            Chohan Space crafts intelligent, high-performance websites and applications that drive results.
          </p>

          <div className="my-8">
            <Image 
              src="https://i.ibb.co/VvWjQ6Q/chohan-space-banner.png" 
              alt="Chohan Space Banner"
              width={1200}
              height={630}
              className="rounded-lg shadow-lg mx-auto"
              priority
            />
          </div>

          <Button asChild size="lg">
            <Link href="/work">
              Explore Our Work <ArrowRight className="ml-2" />
            </Link>
          </Button>
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
            <Card className="text-center hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
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
            <Card className="text-center hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
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
            <Card className="text-center hover:shadow-lg hover:-translatey-1 transition-transform duration-300">
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

       {/* Our Work Section */}
      <section className="py-16 md:py-24 bg-secondary dark:bg-card scroll-animate" style={{ animationDelay: '0.6s' }}>
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Work</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Here's a glimpse of some of the projects we've brought to life.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {placeholderProjects.slice(0,3).map((project) => (
                    <ProjectCard key={project.slug} {...project} />
                ))}
            </div>
            <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/work">
                        View All Projects <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 scroll-animate" style={{ animationDelay: '1.2s' }}>
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
