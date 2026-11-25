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
          'NAYRA combines camera-based perception, intelligent processing, and conversational assistance to interpret visual information and respond to user questions.',
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
          'Yes. Directional noise-cancelling microphones and open-ear audio allow you to converse naturally with NAYRA without reaching for a separate device.',
      },
      {
        id: 'feat-3',
        question: 'Does NAYRA provide real-time assistance?',
        answer:
          'NAYRA prioritizes immediate perception. On-frame processing analyzes video frames continuously to deliver prompt audio and visual cues when you need them most.',
      },
      {
        id: 'feat-4',
        question: 'What makes NAYRA different from ordinary glasses?',
        answer:
          'NAYRA integrates dual spatial cameras, open-ear acoustics, and a dedicated neural processing core directly inside an ergonomic, lightweight eyewear chassis.',
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
          'Dual forward-facing sensors feed live frames to an on-device neural vision pipeline, extracting geometric depth, object labels, and contextual scene dynamics.',
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
          'Essential safety perception and immediate object identification operate locally. Extended conversational depth and complex knowledge queries seamlessly leverage connected AI when online.',
      },
      {
        id: 'tech-4',
        question: 'How does NAYRA combine local and connected AI?',
        answer:
          'A hybrid architecture routes immediate time-sensitive perceptual queries to the on-device processor while dispatching broader conversational reasoning to paired cloud infrastructure.',
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
          'NAYRA activates camera sensors solely upon user voice request or when explicitly enabled in active assistance modes. Visible status indicators signal when perception is active.',
      },
      {
        id: 'priv-2',
        question: 'How will NAYRA handle personal information?',
        answer:
          'Real-time perception frames are processed transiently in memory on the glasses without permanent recording. Any transmitted data is protected with end-to-end encryption.',
      },
      {
        id: 'priv-3',
        question: 'Will users have control over camera and microphone access?',
        answer:
          'Always. Physical privacy controls and quick software muting ensure users retain complete, unambiguous authority over optical and acoustic sensors at all times.',
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
          'NAYRA is in active engineering prototyping and user testing phases, rigorously refining battery efficiency, weight distribution, and real-world perceptual accuracy.',
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
          'You can register for early developmental briefings and testing opportunities via the early access form on this website to follow our ongoing milestones.',
      },
    ],
  },
]
