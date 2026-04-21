/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  name: string;
  bio: string;
  image: string;
  title: string;
  email?: string;
  phones?: string[];
  socials?: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Message {
  id: string;
  sender: string;
  text?: string;
  timestamp: string;
  isAdmin: boolean;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Skill {
  name: string;
  level: number;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
  keyPoints?: string[];
  keyPointsTitle?: string;
}

export interface Experience {
  position: string;
  company: string;
  period: string;
  description: string;
  tasks?: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  image?: string;
}

export interface Service {
  title: string;
  desc: string;
  image?: string;
  focus?: string;
  offerings?: string[];
}

export interface DBData {
  user: User;
  projects: Project[];
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  certificates?: Certificate[];
  services: Service[];
  settings: {
    theme: 'dark' | 'light';
  };
}
