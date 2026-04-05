const ProblemSection = () => {
  const problems = [
    {
      icon: "🔴",
      title: "Trust Breakdown",
      description: "Members delay payments, default on loans, and manipulate records, causing groups to collapse"
    },
    {
      icon: "📉",
      title: "No Financial Discipline",
      description: "Poor visibility into contribution history, penalties, and payment patterns leads to confusion"
    },
    {
      icon: "⚖️",
      title: "Manual Dispute Resolution",
      description: "No structured system for resolving conflicts, leading to unfair outcomes and group breakdown"
    },
    {
      icon: "🧾",
      title: "Unreliable Records",
      description: "Most chamas rely on WhatsApp messages and Excel sheets that can't be trusted or verified"
    },
    {
      icon: "🚫",
      title: "No Credit Reputation",
      description: "Defaulters simply move to new groups with no consequences or reputation tracking"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Real Problems in Chamas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Despite digital platforms, chamas still face fundamental trust and accountability challenges that threaten their survival
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-4xl mb-4">{problem.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-red-900 mb-4">
            The Cost of Trust Issues
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">67%</div>
              <p className="text-gray-700">Chamas fail due to trust breakdown</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">KES 2.5M</div>
              <p className="text-gray-700">Average lost per failed chama</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">40%</div>
              <p className="text-gray-700">Members experience default losses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
