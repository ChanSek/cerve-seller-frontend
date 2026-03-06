export const features = [
  {
    icon: 'mic',
    title: 'Voice & Text Commands',
    description: 'Speak naturally or type your request. Claw understands context and executes multi-step tasks across apps.',
    detail: 'Powered by advanced speech-to-text with support for multiple languages. Just say what you want done — no menus, no tapping, no learning curve.',
  },
  {
    icon: 'brain',
    title: 'Multi-LLM Intelligence',
    description: 'Choose from Gemini, Sarvam, Claude, or on-device models. Claw picks the best one for each task.',
    detail: 'Smart routing analyzes task complexity and selects the optimal LLM. Use cloud models for complex reasoning or on-device models for privacy-sensitive tasks.',
  },
  {
    icon: 'smartphone',
    title: 'App Automation',
    description: 'Navigate any Android app autonomously. Claw sees your screen and interacts like a human would.',
    detail: 'Using AccessibilityService, Claw can tap buttons, fill forms, scroll, navigate menus, and complete complex workflows across any installed app.',
  },
  {
    icon: 'shield',
    title: 'Safety Gates',
    description: 'Never auto-approves payments, calls, or deletions. You stay in control of sensitive actions.',
    detail: 'Every risky action requires explicit confirmation. Financial transactions, outgoing communications, and destructive operations are all gated by default.',
  },
  {
    icon: 'puzzle',
    title: 'Plugin System',
    description: 'Extensible with app-specific plugins for Zomato, WhatsApp, and more. Build your own too.',
    detail: 'Plugins add deep integration with specific apps — understanding their UI patterns, shortcuts, and optimal workflows for faster, more reliable automation.',
  },
  {
    icon: 'route',
    title: 'Smart Routing',
    description: 'Auto-selects the best LLM for each task based on complexity, speed, and cost.',
    detail: 'Simple tasks use fast, lightweight models. Complex multi-step reasoning uses powerful cloud models. You can override routing or set preferences per task type.',
  },
];

export const detailedFeatures = [
  {
    category: 'Intelligence',
    items: [
      { title: 'Multi-LLM Support', description: 'Gemini, Sarvam, Claude, and on-device models', icon: 'brain' },
      { title: 'Smart Task Planning', description: 'Breaks complex commands into executable steps', icon: 'list' },
      { title: 'Context Awareness', description: 'Understands what\'s on screen and app state', icon: 'eye' },
      { title: 'Learning from Patterns', description: 'Remembers your preferences and common workflows', icon: 'sparkle' },
    ],
  },
  {
    category: 'Automation',
    items: [
      { title: 'Cross-App Workflows', description: 'Chain actions across multiple apps seamlessly', icon: 'workflow' },
      { title: 'Form Filling', description: 'Automatically fills forms with your data', icon: 'form' },
      { title: 'Navigation', description: 'Finds and opens any screen in any app', icon: 'compass' },
      { title: 'Batch Operations', description: 'Perform repetitive tasks in bulk', icon: 'layers' },
    ],
  },
  {
    category: 'Safety & Privacy',
    items: [
      { title: 'Safety Gates', description: 'Mandatory confirmation for sensitive actions', icon: 'shield' },
      { title: 'Screen Sanitizer', description: 'Defends against prompt injection attacks', icon: 'lock' },
      { title: 'App Allowlist', description: 'Control which apps Claw can access', icon: 'checklist' },
      { title: 'Local Processing', description: 'On-device models for private data', icon: 'device' },
    ],
  },
  {
    category: 'Extensibility',
    items: [
      { title: 'Plugin API', description: 'Build custom plugins for any app', icon: 'puzzle' },
      { title: 'Custom Commands', description: 'Create shortcuts for common workflows', icon: 'terminal' },
      { title: 'Webhook Integration', description: 'Trigger actions from external services', icon: 'webhook' },
      { title: 'Open Source', description: 'Full source code available on GitHub', icon: 'github' },
    ],
  },
];
