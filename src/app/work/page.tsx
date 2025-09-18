import ProjectCard from '@/components/ProjectCard';
import { placeholderProjects } from '@/lib/placeholder-data';

export default function WorkPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Our Work</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We take pride in our craft. Here is a selection of projects that showcase our commitment to quality and innovation in web development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {placeholderProjects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </div>
  );
}
