
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, PenTool, Cloud, Handshake, Laptop, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProjectCard from '@/components/ProjectCard';
import { placeholderProjects } from '@/lib/placeholder-data';

const services = [
  { title: 'Web Development', description: 'Robust product experiences tailored for speed, clarity, and growth.', icon: Code },
  { title: 'UI/UX Design', description: 'Elegant interfaces that feel effortless on every device.', icon: PenTool },
  { title: 'Cloud Solutions', description: 'Reliable infrastructure that scales with your ambition.', icon: Cloud },
];

const process = [
  { title: '1. Consultation', description: 'We understand your goals, audience, and the experience you want to create.', icon: Handshake },
  { title: '2. Build', description: 'We craft polished systems with deliberate detail and measurable performance.', icon: Laptop },
  { title: '3. Launch', description: 'We refine, test, and ship with the confidence of a premium release.', icon: Rocket },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden px-3 pb-14 pt-8 md:px-4 md:pb-24 md:pt-12">
        <div className="ambient-orb left-[-4rem] top-[-2rem] h-48 w-48 bg-sky-400/30" />
        <div className="ambient-orb bottom-[-2rem] right-[-2rem] h-56 w-56 bg-blue-400/20" />

        <div className="glass-panel relative mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center shadow-[0_30px_120px_rgba(37,99,235,0.18)] md:px-10 md:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-sm text-foreground/80 backdrop-blur dark:border-white/10 dark:bg-white/10">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Premium digital experiences, thoughtfully engineered.
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl md:text-7xl">
            We build modern products that feel unmistakably premium.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Chohan Space combines design, strategy, and development to create sites and products that feel intuitive, fast, and unmistakably refined.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6 shadow-[0_16px_60px_rgba(37,99,235,0.2)]">
              <Link href="/work">
                Explore our work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6">
              <Link href="/contact">Start a project</Link>
            </Button>
          </div>
          <div className="mt-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/40 bg-white/70 p-2 shadow-[0_25px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <Image src="https://i.ibb.co/q3ktqWX1/Purple-Black-Modern-Marketing-Plan-Presentation-20250918-160326-0000.png" alt="Chohan Space showcase" width={1400} height={760} className="h-auto w-full rounded-[22px] object-cover" priority />
          </div>
        </div>
      </section>

      <section className="px-3 py-10 md:px-4 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center md:mb-10">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">What we do</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">From polished marketing experiences to high-performance web products, every touchpoint is crafted to feel effortless.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="group border-white/45 bg-white/70 p-0 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(37,99,235,0.12)] dark:border-white/10 dark:bg-black/35">
                  <CardHeader className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/45 bg-white/80 text-foreground shadow-sm dark:border-white/10 dark:bg-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-[0.95rem] leading-7">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-3 py-10 md:px-4 md:py-16">
        <div className="section-shell mx-auto max-w-6xl p-6 md:p-8 lg:p-10">
          <div className="mb-8 text-center md:mb-10">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">Our process</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">A clear, transparent path from the first conversation to a final launch.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {process.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-[24px] border border-white/45 bg-white/70 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-black/35">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/45 bg-white/80 text-foreground shadow-sm dark:border-white/10 dark:bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-7 text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-3 py-10 md:px-4 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center md:mb-10">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">Selected work</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">A few recent experiences designed to feel elevated and purposeful.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {placeholderProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/work">View all projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-3 py-10 md:px-4 md:py-16">
        <div className="section-shell mx-auto max-w-6xl px-6 py-10 text-center md:px-10 md:py-16">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">Have a project in mind?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">Let&apos;s shape a digital experience that feels as intentional as it is effective.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/contact">Get in touch</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6">
              <Link href="/blog">Read the blog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
