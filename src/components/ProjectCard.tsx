
import Link from 'next/link';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/data';
import { cn } from '@/lib/utils';

const CardWrapper = ({ project, children }: { project: Project, children: React.ReactNode }) => {
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
       <Card className={cn(
        "flex flex-col overflow-hidden h-full",
        project.link ? "transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer" : "cursor-default"
      )}>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle>{title}</CardTitle>
            {status === 'Coming Soon' && <Badge variant="outline">Coming Soon</Badge>}
          </div>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <div className="flex-grow" />
        <CardFooter className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </CardFooter>
      </Card>
    </CardWrapper>
  );
}
