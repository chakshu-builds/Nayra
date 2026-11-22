export interface FAQItem {
  id: string
  question: string
  answer: string
}

export type FAQCategoryKey = 'general' | 'features' | 'technology' | 'privacy' | 'availability'

export interface FAQCategory {
  key: FAQCategoryKey
  label: string
  items: FAQItem[]
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    key: 'general',
    label: 'GENERAL',
    items: [
      {
        id: 'gen-1',
        question: 'What is NAYRA?',
        answer:
          'NAYRA is an AI-powered smart glasses project designed to help people understand their surroundings through visual perception and natural voice interaction.',
      },
      {
        id: 'gen-2',
        question: 'How does NAYRA work?',
        answer:
          'The proposed system would combine camera perception and speech interaction. This website illustrates the idea; it does not process live camera or microphone data.',
      },
      {
        id: 'gen-3',
        question: 'Who is NAYRA designed for?',
        answer:
          'NAYRA explores how hands-free, intelligent assistance can make everyday interactions with the world more accessible and convenient.',
      },
      {
        id: 'gen-4',
        question: 'Is NAYRA available to purchase?',
        answer:
          'NAYRA is currently under development. Product availability and future announcements will be shared through the official website.',
      },
    ],
  },
  {
    key: 'features',
    label: 'FEATURES',
    items: [
      {
        id: 'feat-1',
        question: 'What can NAYRA recognize?',
        answer:
          'NAYRA is designed to interpret everyday scenes, identify crosswalks and pedestrian signals, read nearby text, and assist with ambient situational awareness in real time.',
      },
      {
        id: 'feat-2',
        question: 'Can I interact with NAYRA using voice?',
        answer:
          'Voice interaction is a planned capability. The conversation shown on this website is a scripted demo, not live speech recognition.',
      },
      {
        id: 'feat-3',
        question: 'Does NAYRA provide real-time assistance?',
        answer:
          'The product concept targets real-time guidance. No live vision model or real-time assistance is running on this website.',
      },
      {
        id: 'feat-4',
        question: 'What makes NAYRA different from ordinary glasses?',
        answer:
          'NAYRA proposes cameras, open-ear audio and an efficient neural-processing core within eyewear. These are design goals, not verified production specifications.',
      },
    ],
  },
  {
    key: 'technology',
    label: 'TECHNOLOGY',
    items: [
      {
        id: 'tech-1',
        question: 'How does NAYRA process visual information?',
        answer:
          'The proposed design would process camera frames with an on-device vision model. This repository currently implements only the product presentation.',
      },
      {
        id: 'tech-2',
        question: 'What is edge AI?',
        answer:
          'Edge AI performs machine learning inferences locally on the glasses rather than streaming raw imagery to cloud servers, minimizing latency and maximizing responsiveness.',
      },
      {
        id: 'tech-3',
        question: 'Does NAYRA require an internet connection?',
        answer:
          'The proposed architecture considers offline edge perception with optional online features. Offline inference and online integration are not included in the demo.',
      },
      {
        id: 'tech-4',
        question: 'How does NAYRA combine local and connected AI?',
        answer:
          'The planned hybrid architecture would prioritize local latency-sensitive tasks and use connected services only when appropriate. No such routing is deployed here.',
      },
    ],
  },
  {
    key: 'privacy',
    label: 'PRIVACY',
    items: [
      {
        id: 'priv-1',
        question: 'When does NAYRA use its camera?',
        answer:
          'The website does not activate a camera. Future hardware would need explicit consent, clear capture indicators and privacy controls before any recording or perception.',
      },
      {
        id: 'priv-2',
        question: 'How will NAYRA handle personal information?',
        answer:
          'No camera data is collected by this website. Future device storage, encryption and retention policies have not yet been implemented or independently verified.',
      },
      {
        id: 'priv-3',
        question: 'Will users have control over camera and microphone access?',
        answer:
          'Hardware privacy switches and software controls are proposed requirements; they will need implementation and verification before a physical release.',
      },
    ],
  },
  {
    key: 'availability',
    label: 'AVAILABILITY',
    items: [
      {
        id: 'avail-1',
        question: 'What stage of development is NAYRA in?',
        answer:
          'This repository is a frontend concept demo. Hardware build status, user trials and real-world accuracy are separate milestones that are not evidenced here.',
      },
      {
        id: 'avail-2',
        question: 'When will NAYRA be available?',
        answer:
          'Development milestones and pilot availability schedules will be communicated through our official channels as ergonomic and validation standards are fulfilled.',
      },
      {
        id: 'avail-3',
        question: 'How can I receive project updates?',
        answer:
          'Updates and any future early-access opportunities will be announced through official project channels. There is no working sign-up form in this demo.',
      },
    ],
  },
]
