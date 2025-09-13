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
  status: 'Pending' | 'Verified' | 'Cancelled';
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  cancellationReason?: string;
  verifiedAt?: string;
  cancelledAt?: string;
};
