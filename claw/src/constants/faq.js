export const faqItems = [
  {
    question: 'What is Claw?',
    answer: 'Claw is an AI agent that turns your Android phone into an AI-controlled device. You speak or type a command, and Claw autonomously navigates your apps to complete tasks — ordering food, sending messages, changing settings, and more.',
  },
  {
    question: 'How does Claw work?',
    answer: 'Claw uses Android\'s AccessibilityService to see and interact with your screen. When you give a command, the AI plans a series of steps (tap, type, scroll, etc.) and executes them one by one. It uses vision and text understanding to navigate any app\'s UI.',
  },
  {
    question: 'Which phones are supported?',
    answer: 'Claw works on any Android device running Android 8.0 (Oreo) or later. It doesn\'t require root access. Performance is best on devices with 4GB+ RAM for on-device model support.',
  },
  {
    question: 'Is it safe to use?',
    answer: 'Safety is core to Claw\'s design. Safety Gates require your explicit confirmation before any sensitive action — payments, calls, deletions, and permission changes. The ScreenContentSanitizer defends against prompt injection. You control which apps Claw can access.',
  },
  {
    question: 'What LLMs does Claw use?',
    answer: 'Claw supports multiple LLM providers: Google Gemini for general tasks, Sarvam for Indian language support, Anthropic Claude for complex reasoning, and on-device models for offline/private use. Smart routing selects the best model for each task.',
  },
  {
    question: 'Is Claw free?',
    answer: 'Claw is open source and free to use. You\'ll need your own API keys for cloud LLM providers (Gemini, Claude, etc.). On-device models work completely free with no API costs.',
  },
  {
    question: 'Can I add my own plugins?',
    answer: 'Yes! Claw has a plugin system that lets you create app-specific integrations. Plugins can define custom actions, UI patterns, and workflows for any app. Check the developer documentation for the plugin API.',
  },
  {
    question: 'What actions can Claw perform?',
    answer: 'Currently: opening apps, tapping elements, typing text, scrolling, pressing back/home, and voice input. Coming soon: screenshot analysis, long press, system toggles, file operations, notification handling, and custom gestures.',
  },
  {
    question: 'Does Claw work offline?',
    answer: 'Partially. On-device LLM models work fully offline. Cloud-based models (Gemini, Claude) require an internet connection. The core automation engine and safety gates work regardless of connectivity.',
  },
  {
    question: 'How is my data handled?',
    answer: 'Claw processes screen content locally on your device. When using cloud LLMs, screen text is sent to the selected provider for analysis. On-device models keep everything local. No data is stored on Cerve\'s servers. You can review exactly what data is sent in the app\'s logs.',
  },
];

export const faqCategories = [
  { name: 'General', questions: [0, 1, 5] },
  { name: 'Compatibility', questions: [2, 8] },
  { name: 'Safety & Privacy', questions: [3, 9] },
  { name: 'Technical', questions: [4, 6, 7] },
];
