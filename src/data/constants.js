import { Mail, Briefcase, FileText, Send } from 'lucide-react';

export const WRITING_TYPES = [
  { 
    value: 'cold_email', 
    label: 'Cold Email to HR',
    description: 'Direct outreach to hiring manager',
    icon: Mail,
    lengthOptions: [50,75, 100, 130, 150, 180, 200, 250]
  },
  { 
    value: 'cover_letter', 
    label: 'Cover Letter',
    description: 'Formal application document',
    icon: FileText,
    lengthOptions: [100, 150, 200, 250, 300, 350, 400, 450, 500]
  },
  { 
    value: 'linkedin_message', 
    label: 'LinkedIn Message',
    description: 'Short professional connection',
    icon: Briefcase,
    lengthOptions: [3, 5, 10, 15, 30, 40, 50, 60, 75, 100, 120, 150]
  },
  { 
    value: 'follow_up', 
    label: 'Follow-up Email',
    description: 'After application or interview',
    icon: Send,
    lengthOptions: [10,20,40,50, 75,100, 120, 150, 180, 200, 250]
  }
];

export const ROLE_LEVELS = [
  { value: 'intern', label: 'Intern' },
  { value: 'junior', label: 'Junior Software Engineer' },
  { value: 'software_engineer', label: 'Software Engineer' },
  { value: 'associate', label: 'Associate Software Engineer' },
  { value: 'senior', label: 'Senior Software Engineer' }
];

export const TONES = {
  email: [
    { value: 'professional', label: 'Professional', description: 'Clear and business-appropriate' },
    { value: 'warm', label: 'Warm', description: 'Friendly and approachable' },
    { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate' },
    { value: 'humble', label: 'Humble', description: 'Respectful and grateful' }
  ],
  linkedin: [
    { value: 'casual_professional', label: 'Casual Professional', description: 'Friendly but professional' },
    { value: 'conversational', label: 'Conversational', description: 'Natural and approachable' },
    { value: 'direct', label: 'Direct', description: 'Straight to the point' },
    { value: 'warm', label: 'Warm', description: 'Friendly and genuine' },
    { value: 'respectful', label: 'Respectful', description: 'Polite and courteous' }
  ]
};
