import { TextCategory } from '@/backend';

export const textSoftlyMessages: Record<TextCategory, string[]> = {
  [TextCategory.pullAway]: [
    "I've been thinking, and I need a little space to focus on myself right now. I hope you understand.",
    "I'm feeling a bit overwhelmed and need some time to recharge. Can we reconnect in a few days?",
    "I value what we have, but I need to take a step back for a moment to clear my head.",
    "I'm going through something personal right now and need some time alone. I'll reach out when I'm ready.",
    "I care about you, but I need to prioritize my own well-being for a bit. Thank you for understanding."
  ],
  [TextCategory.flirty]: [
    "I can't stop thinking about you... and I'm not even mad about it 😊",
    "You have this way of making me smile even when you're not around.",
    "I'm starting to think you might be trouble... the best kind of trouble.",
    "Just wanted to let you know you've been on my mind today.",
    "I love the way you make me feel when we talk. It's like everything else fades away."
  ],
  [TextCategory.apology]: [
    "I'm really sorry for how I acted. I didn't mean to hurt you, and I want to make things right.",
    "I've been thinking about what happened, and I realize I was wrong. Can we talk about it?",
    "I'm sorry for not being more understanding. You deserve better, and I want to do better.",
    "I regret what I said. It came from a place of frustration, not truth. I hope you can forgive me.",
    "I'm truly sorry. I value you and our relationship, and I don't want to lose that over my mistake."
  ],
  [TextCategory.missingYou]: [
    "I miss you more than I thought I would. Can't wait to see you again.",
    "It's been too long since I've seen your smile. I miss you.",
    "I keep thinking about the last time we were together. Missing you a lot right now.",
    "You've been on my mind all day. I miss the way you make me feel.",
    "I didn't realize how much I'd miss you until you weren't here. Come back soon?"
  ],
  [TextCategory.boundaries]: [
    "I need to be honest with you—I'm not comfortable with that. I hope you can respect my boundary.",
    "I appreciate you, but I need you to understand that this is something I'm not okay with.",
    "I value our relationship, but I need to set a boundary here. I hope you can understand.",
    "I've been thinking, and I need to communicate something important: I need you to respect my space on this.",
    "I care about you, but I need to be clear about what I'm comfortable with. Can we talk about this?"
  ]
};
