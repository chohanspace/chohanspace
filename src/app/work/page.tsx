import ProjectCard from '@/components/ProjectCard';
import { placeholderProjects } from '@/lib/placeholder-data';

export default function WorkPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="section-shell px-6 py-10 text-center md:px-10 md:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Selected work</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">Our work</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              We take pride in our craft. This collection highlights the thoughtful detail, product focus, and polished execution behind each experience.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {placeholderProjects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
}
