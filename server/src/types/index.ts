export type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  price: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  interest?: string | null;
  source?: string | null;
  createdAt: Date;
};

export type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  message: string;
  createdAt: Date;
};

export type Admin = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type CallLog = {
  id: string;
  leadId?: string | null;
  note?: string | null;
  createdAt: Date;
};
