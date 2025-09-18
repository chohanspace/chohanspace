export type BlogPost = {
  slug: string;
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
  dataAiHint: string;
};

export type Ticket = {
  id: string;
  createdAt: string;
  status: 'Pending' | 'Verified' | 'Cancelled' | 'Completed';
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  cancellationReason?: string;
  verifiedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  // New project detail fields
  websiteType?: string;
  budget?: string;
  hasDomain?: 'Yes' | 'No';
  hasHosting?: 'Yes' | 'No';
  projectDetails?: string;
};

export type Submission = {
    name: string;
    email: string;
    message: string;
    id: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  dataAiHint: string;
  tags: string[];
};
