export interface Requester {
  id: string;
  username: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requester: Requester;
  status: string;
  created_at: string;
}
