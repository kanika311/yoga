export type Program = {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  description?: string;
  image?: string;
  highlights?: string[];
  benefits?: string[];
  focusAreas?: string[];
  published?: boolean;
};

export type BlogPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category?: string;
  author?: string;
  published?: boolean;
};

export type Inquiry = {
  _id: string;
  type: "contact" | "demo";
  name: string;
  email: string;
  phone?: string;
  status: "new" | "contacted" | "scheduled" | "closed";
};

export type FAQ = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote: string;
  image?: string;
  rating?: number;
};
