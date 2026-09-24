import { CourseData } from '../types';

export const COURSES: CourseData[] = [
  {
    id: 'computer-training',
    title: 'Computer Training',
    category: 'Digital Literacy',
    shortDescription: 'Comprehensive practical computer education including basic operations, MS Office, and digital transactions.',
    overview: 'Equips students and community members with essential computer skills required for academic and workplace productivity.',
    modules: [
      'Basic computer operations',
      'MS Office (Word, Excel, PowerPoint)',
      'Internet usage & research',
      'Digital transactions & online safety',
      'Tally (Accounting fundamentals)',
      'Graphic design essentials'
    ],
    icon: 'Monitor',
    eligibility: 'Open to youth, students, and community members seeking computer literacy'
  },
  {
    id: 'tailoring-stitching',
    title: 'Tailoring & Stitching',
    category: 'Vocational Skills',
    shortDescription: 'Hands-on training in tailoring, garment making, embroidery, and modern fashion design techniques.',
    overview: 'A vocational initiative empowering individuals with practical craftsmanship for livelihood and self-reliance.',
    modules: [
      'Tailoring fundamentals & cutting',
      'Stitching techniques & machine operation',
      'Embroidery & decorative craft',
      'Fashion design basics',
      'Garment making & finishing'
    ],
    icon: 'Scissors',
    eligibility: 'Open to women and youth interested in vocational stitching and garment craft'
  },
  {
    id: 'mehndi-beauty-wellness',
    title: 'Mehndi / Beauty & Wellness',
    category: 'Creative Arts & Care',
    shortDescription: 'Professional training in Mehndi designing, basic grooming, personal hygiene, and beauty course modules.',
    overview: 'Specialized skill-development program providing practical training in traditional and contemporary beauty arts.',
    modules: [
      'Mehndi designing & intricate patterns',
      'Basic grooming & skincare essentials',
      'Personal hygiene & wellness standards',
      'Beauty course modules',
      'Hands-on practical training'
    ],
    icon: 'Sparkles',
    eligibility: 'Open to candidates seeking creative self-employment and aesthetic craft skills'
  },
  {
    id: 'seerat-moral-education',
    title: 'Seerat & Educational Programs',
    category: 'Educational & Moral',
    shortDescription: 'Educational workshops, character development sessions, and competitive Seerat-un-Nabi study programs.',
    overview: 'Fostering moral values, community responsibility, ethical leadership, and dedicated learning through study circles.',
    modules: [
      'Seerat-un-Nabi life lessons & character building',
      'Moral guidance & community ethics',
      'Annual competitive examination study modules',
      'Interactive youth workshops'
    ],
    icon: 'BookOpen',
    eligibility: 'Open to all age groups, students, and community participants'
  }
];
