import { Project, Experience, SocialLink } from './types';

export const NAV_LINKS = [
  { name: 'Über mich', href: '#about' },
  { name: 'Arbeit', href: '#work' },
  { name: 'Kontakt', href: '#contact' },
];

export const HERO_CONTENT = {
  greeting: "Hallo, ich bin",
  name: "Michael Förtsch",
  role: "Journalist, Photograph & Tech-Experte",
  tagline: "Kultur-, Entertainment- und Tech-Journalist aus dem Münchner Speckgürtel. Co-Founder von 1E9.",
};

export const ABOUT_CONTENT = `
Michael Förtsch ist Journalist und Hobby-Photograph. Er lebt und arbeitet im Speckgürtel von München. Von dort aus schreibt er Sachen ins Internet. Meist sind es Artikel, Features und Reportagen über Technologie, Kunst, Kultur, das Internet, Videospiele, die Videospielbranche, Film und Fernsehen. 

Dafür experimentiert er auch ganz gerne mit "neuen Technologien" wie Künstlicher Intelligenz, Web3-Applikationen, Virtual Reality und vielem mehr. Er bezeichnet sich daher ganz gerne als Kultur-, Entertainment- und Tech-Journalist. Jedoch photographiert er ebenso ganz gerne. Unter anderem Architektur, Landschaften und Menschen.
`;

export const EXPERIENCES: Experience[] = [
  {
    id: '1',
    role: 'Co-Founder & Redakteur',
    company: '1E9',
    period: '2019 - Heute',
    description: 'Gründungsmitglied des spirituellen Nachfolgers von WIRED Germany. Arbeit an einem gleichnamigen Magazin und regelmäßig stattfindenden Konferenzen und Festivals rund um Kunst, Kultur, Technologie und Zukunft.',
  },
  {
    id: '2',
    role: 'Redakteur',
    company: 'WIRED Germany',
    period: '2018 - 2019',
    description: 'Festangestellter Redakteur bei Condé Nast Germany bis zur Auflösung der Redaktion.',
  },
  {
    id: '3',
    role: 'Freier Journalist',
    company: 'Diverse Publikationen',
    period: '2014 - Heute',
    description: 'Artikel für Zeit.de, GQ, FOCUS, Rolling Stone, Spiegel.de, Golem.de uvm. Tech- und Science-Fiction-Experte unter anderem bei der Tagesschau, Bremen Zwei, BR24, dem NDR und den VOX Nachrichten.',
  },
  {
    id: '4',
    role: 'Redakteur / Stv. Chefredakteur',
    company: 'Airmotion Verlag',
    period: '2008 - 2014',
    description: 'Vom Praktikanten zum leitenden Redakteur für Magazine wie 360 Live, PS3M und GamesTM. Begleitende Ausbildung an der Akademie der Bayerischen Presse.',
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: '1E9 Magazin',
    description: 'Community und Magazin für Zukunftsoptimisten. Fokus auf Kunst, Kultur, Technologie und wie diese unser Leben verändern.',
    technologies: ['Journalismus', 'Community', 'Events'],
    link: 'https://1e9.community',
  },
  {
    id: 'p2',
    title: 'XPLR: MEDIA Studien',
    description: 'Federführende Beteiligung an Studien zu Themen wie Web3 und Künstlicher Intelligenz in den Medien.',
    technologies: ['Forschung', 'Generative KI', 'Web3'],
    link: '#',
  },
  {
    id: 'p3',
    title: 'Photographie',
    description: 'Architektur-, Landschafts- und Portraitphotographie.',
    technologies: ['Photographie', 'Kunst', 'Architektur'],
    link: '#',
  },
];

export const SOCIALS: SocialLink[] = [
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { platform: 'Twitter/X', url: 'https://twitter.com', icon: 'twitter' },
  { platform: '1E9', url: 'https://1e9.community', icon: 'globe' },
];