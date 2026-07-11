import Link from 'next/link';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

const CardWrapper = ({ project, children }: { project: Project; children: React.ReactNode }) => {
  if (project.link) {
    return (
      <Link href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {children}
      </Link>
    );
  }
  return <>{children}</>;
};

export default function ProjectCard(project: Project) {
  const { title, description, tags, status } = project;

  return (
    <CardWrapper project={project}>
      <Card
        className={cn(
          'group flex h-full flex-col overflow-hidden border-white/45 bg-white/70 p-0 shadow-[0_25px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(37,99,235,0.14)] dark:border-white/10 dark:bg-black/35',
          project.link ? 'cursor-pointer' : 'cursor-default',
        )}
      >
        <CardHeader className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            {status === 'Coming Soon' ? (
              <Badge variant="outline" className="rounded-full">Coming Soon</Badge>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/70 text-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            )}
          </div>
          <CardDescription className="line-clamp-3 text-[0.95rem] leading-7">{description}</CardDescription>
        </CardHeader>
        <div className="flex-grow" />
        <CardFooter className="flex flex-wrap gap-2 p-6 pt-0">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full border-transparent bg-black/5 px-3 py-1 text-[0.72rem] uppercase tracking-[0.2em] text-foreground/80 dark:bg-white/10">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </CardWrapper>
  );
}
