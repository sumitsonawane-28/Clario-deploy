import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Clario</div>
          <div className="space-x-6">
            <Link to="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link>
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Mind care that <span className="text-cyan-400">fits you</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Your personal companion for mental wellness, focus, and productivity. 
            Designed to help you thrive in a world full of distractions.
          </p>
          <div className="space-x-4">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Your Journey
            </Link>
            <Link 
              to="/login" 
              className="border border-slate-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-800/50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How Clario Helps You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Focus",
                description: "Tailored tools to help you maintain focus and reduce distractions.",
                icon: "🎯"
              },
              {
                title: "Mindfulness Tools",
                description: "Guided exercises to help you stay present and reduce stress.",
                icon: "🧘"
              },
              {
                title: "Productivity Tracking",
                description: "Monitor your progress and build better habits over time.",
                icon: "📊"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-800/50 p-8 rounded-xl hover:bg-slate-800/80 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400">© {new Date().getFullYear()} Clario. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
