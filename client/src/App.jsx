import { useState } from "react";

function App(){
  const [role, setRole] = useState('Frontend Developer');
  const [techStack, setTechStack] = useState('React & Tailwind');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  const generateInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const response = await fetch( "http://localhost:5000/api/interviews/generate", 
        { method: "POST", 
          headers: {"Content-Type": "application/json"}, 
          body: JSON.stringify({role, techStack}),
    },
  );
  if(!response.ok) throw new Error("Failed to fetch from server")

    const data = await response.json();
    setQuestions(data);
    } catch (error) {
        setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4 pt-10">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Last-Minute <span className="text-black">Prep</span>
          </h1>
          <p className="text-slate-900 text-lg">
            AI-powered mock interview questions to sharpen your skills
            instantly.
          </p>
        </header>

        {/* Input Form */}
        <form
          onSubmit={generateInterview}
          className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Target Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="e.g., Full Stack Engineer"
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Tech Stack Focus
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="e.g., MERN Stack"
              required
            />
          </div>
          <div className="flex items-end pb-2px">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>

        {/* Error Handling */}
        {error && (
          <div className="p-4 bg-red-950/50 border border-red-900 text-red-200 rounded-lg text-center">
            {error} - Make sure your backend server is running!
          </div>
        )}

        {/* Bento Grid Results */}
        {questions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {questions.map((item, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors flex flex-col"
              >
                <div className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  Concept: {item.concept}
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {item.question}
                </h3>
                <div className="mt-auto pt-4 border-t border-slate-800/50">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-300 block mb-1">
                      Ideal Answer Framework:
                    </span>
                    {item.idealAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;