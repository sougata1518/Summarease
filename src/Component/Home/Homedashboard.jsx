import React from "react";

const Homedashboard = () => {
  return (
    <div className="min-full-screen rounded-2xl cursor-default bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-20">

      {/* Center Hero Section */}
      <div className="max-w-6xl mx-auto bg-slate-800/80 rounded-3xl p-10 border border-slate-700 shadow-xl backdrop-blur-md">

        {/* Header Section */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-wide">
            Welcome to <span className="text-blue-400">Summarease</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg">
            Your AI-powered real-time collaborative document editor.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-900/70 transition">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">Real-Time Collaboration</h2>
            <p className="text-gray-300 text-sm">
              Work together with instant updates powered by WebSockets.
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-900/70 transition">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">AI Summary</h2>
            <p className="text-gray-300 text-sm">
              Instantly generate short and precise summaries for long content.
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-900/70 transition">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">Key-Point Extraction</h2>
            <p className="text-gray-300 text-sm">
              Extract important points and structured insights automatically.
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex justify-center mt-10">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-900/70 transition w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">Grammar & Clarity Enhancer</h2>
            <p className="text-gray-300 text-sm">
              Improve grammar, readability, and writing tone effortlessly.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Homedashboard;
