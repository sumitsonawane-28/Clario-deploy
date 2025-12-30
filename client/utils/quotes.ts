export const motivationalQuotes = [
  // Focus and productivity quotes
  "Your focus is your superpower. Use it wisely.",
  "Progress, not perfection. Keep moving forward.",
  "Every completed task is a victory. Celebrate it!",
  "You've got this! Your brain works best with breaks.",
  "Focus on what matters. Ignore the rest.",
  "Small steps lead to big achievements.",
  "Your effort today is creating a better tomorrow.",
  "You're stronger than your distractions.",
  "One task at a time. You can do this!",
  "Consistency beats perfection every time.",
  
  // ADHD-specific encouragement
  "Your different brain is an advantage. Own it!",
  "Hyperfocus is your hidden talent. Use it strategically.",
  "You're not lazy. You're just operating differently.",
  "Your challenges don't define your worth.",
  "You're doing better than you think.",
  "Break it down, breathe, and believe in yourself.",
  
  // Streak and consistency
  "This streak represents real progress. Keep it alive!",
  "Another day, another win. You're building something great.",
  "Showing up for yourself is powerful.",
  "Your streak is proof that you're capable.",
  
  // Rest and self-care
  "Rest is productive. You deserve this break.",
  "Taking time to breathe makes you stronger.",
  "Self-care isn't selfish. It's essential.",
  "Your mental health matters. Prioritize it.",
  
  // Motivation
  "You're capable of more than you know.",
  "Today is a fresh start. Make it count.",
  "Your potential is limitless.",
  "Success is a journey, not a destination.",
  "You're exactly where you need to be.",
  "Every moment is an opportunity to do better.",
  "You're building the life you want, one task at a time.",
  "Your future self will thank you for your effort today.",
  
  // Overcoming challenges
  "Challenges are just opportunities in disguise.",
  "You've overcome obstacles before. You can do it again.",
  "Difficult things often lead to extraordinary results.",
  "Your struggles are making you stronger.",
];

export function getRandomQuote(): string {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}

export function getQuoteByContext(context: "focus" | "break" | "achievement" | "general"): string {
  let contextQuotes = motivationalQuotes;
  
  if (context === "focus") {
    contextQuotes = [
      "Your focus is your superpower. Use it wisely.",
      "Focus on what matters. Ignore the rest.",
      "You've got this! Your brain works best with breaks.",
      "One task at a time. You can do this!",
      "You're stronger than your distractions.",
      "Small steps lead to big achievements.",
    ];
  } else if (context === "break") {
    contextQuotes = [
      "Rest is productive. You deserve this break.",
      "Taking time to breathe makes you stronger.",
      "Your mind is recharging. That's important.",
      "Breaks are part of the process. Enjoy yours!",
    ];
  } else if (context === "achievement") {
    contextQuotes = [
      "Progress, not perfection. Keep moving forward.",
      "Every completed task is a victory. Celebrate it!",
      "Your effort today is creating a better tomorrow.",
      "This streak represents real progress. Keep it alive!",
      "You're building something great!",
    ];
  }
  
  const randomIndex = Math.floor(Math.random() * contextQuotes.length);
  return contextQuotes[randomIndex];
}
