import type { CourseItem, FaqItem, ServiceItem, TestimonialItem } from '../types'

export const services: ServiceItem[] = [
  { title: 'AI Consulting', description: 'Strategy-led AI roadmaps for modern businesses.', icon: 'Brain' },
  { title: 'Corporate AI Training', description: 'Executive and team enablement programs.', icon: 'GraduationCap' },
  { title: 'Generative AI Solutions', description: 'Build custom copilots and automation workflows.', icon: 'Sparkles' },
  { title: 'Data Analytics', description: 'Decision intelligence dashboards and insight systems.', icon: 'BarChart3' },
  { title: 'LLM Development', description: 'Fine-tuned pilots with production-grade UX.', icon: 'Bot' },
  { title: 'Voice AI Solutions', description: 'Conversational voice agents for customers and staff.', icon: 'Mic' },
]

export const features = [
  'Industry Experts',
  'Hands-on Projects',
  'Placement Support',
  'Real Business Solutions',
  'Expert Mentors',
  '24×7 Support',
]

export const stats = [
  { value: '5000+', label: 'Students Trained' },
  { value: '200+', label: 'Enterprise Clients' },
  { value: '50+', label: 'Industry Experts' },
  { value: '95%', label: 'Success Rate' },
]

export const courses: CourseItem[] = [
  {
    title: 'Generative AI & LLM Engineering',
    duration: '12 Weeks',
    description: 'Master prompt engineering, RAG pipelines, safety, and enterprise AI delivery.',
    technologies: ['Python', 'LangChain', 'OpenAI', 'Vector DB'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Data Analytics',
    duration: '8 Weeks',
    description: 'Transform raw business data into strategic intelligence with modern analytics stacks.',
    technologies: ['SQL', 'Power BI', 'Python', 'Excel'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Full Stack AI Development',
    duration: '16 Weeks',
    description: 'Build AI-powered web products from UI to pipelines with production-ready workflows.',
    technologies: ['React', 'TypeScript', 'Node.js', 'API Design'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
]

export const testimonials: TestimonialItem[] = [
  { name: 'Aarav Shah', title: 'Data Product Lead', quote: 'AI Nexus Academy turned our analytics capability into a measurable advantage.' },
  { name: 'Priya Menon', title: 'Learning & Development Head', quote: 'The curriculum is thoughtfully designed, deeply practical, and highly relevant to business outcomes.' },
  { name: 'Daniel Kim', title: 'ML Engineer', quote: 'The guidance from mentors and the lab-driven approach made the transition to production AI smooth.' },
  { name: 'Rina Patel', title: 'Operations Director', quote: 'We onboarded a sophisticated voice automation system in weeks, not quarters.' },
  { name: 'Leo Martinez', title: 'Startup Founder', quote: 'Our team now ships faster with a clear AI roadmap and practical engineering execution.' },
  { name: 'Nadia Hassan', title: 'Talent Manager', quote: 'The placement focus and portfolio coaching gave our learners real momentum in the market.' },
]

export const faqs: FaqItem[] = [
  { question: 'Who should enroll in these programs?', answer: 'These courses are ideal for professionals, graduates, teams, and founders looking to upskill in AI and build measurable outcomes.' },
  { question: 'Do you offer corporate cohorts?', answer: 'Yes. We design tailored training tracks for teams and leadership to accelerate adoption and capability building.' },
  { question: 'Will I work on live projects?', answer: 'Absolutely. Learners experience real business-aligned projects, capstone work, and practical mentor feedback.' },
  { question: 'Do you support job placement?', answer: 'We offer career support, portfolio reviews, interview preparation, and hiring partner connections where applicable.' },
]

export const companies = ['OpenAI', 'HubSpot', 'Notion', 'Salesforce', 'Stripe', 'Slack']
