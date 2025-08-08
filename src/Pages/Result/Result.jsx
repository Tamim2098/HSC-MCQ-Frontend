import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, totalQuestions, subject, currentQuestions } = location.state || {};

  if (!answers || !subject || !currentQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-red-600 font-semibold text-lg">No result data found. Please take a quiz first.</p>
          <button
            onClick={() => navigate('/subjects')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Go to Subjects
          </button>
        </div>
      </div>
    );
  }

  let correctAnswers = 0;

  currentQuestions.forEach((q, index) => {
    if (answers[index] === q.answer) {
      correctAnswers++;
    }
  });

  const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
  const passed = scorePercentage >= 60;

  return (
    <div className="min-h-screen p-2 bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="bg-purple-700 text-white p-4 text-center">
          <h2 className="text-2xl font-bold capitalize">
            {subject?.replace(/-/g, ' ')} Result
          </h2>
        </div>

        <div className="p-6 text-center">
          <div className="bg-gray-50 rounded-lg p-6 shadow-inner mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Summary</h3>
            <p className="text-lg text-gray-700">
              You scored <span className="font-bold text-purple-700">{correctAnswers}</span> out of <span className="font-bold text-purple-700">{totalQuestions}</span> questions.
            </p>
            <p className={`text-2xl font-extrabold mt-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              Your Score: {scorePercentage}%
            </p>
            <p className="text-lg mt-2">
              {passed ? "Congratulations! You passed the quiz." : "Better luck next time!"}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Review</h3>
            {currentQuestions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.answer;
              const notAnswered = !answers[index];

              return (
                <div key={index} className={`bg-gray-100 rounded-lg p-4 mb-4 text-left transition-all duration-300 ${
                  isCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                }`}>
                  <p className="font-medium text-gray-800 leading-relaxed mb-2">
                    <span className="font-bold mr-2">{index + 1}.</span>{q.question}
                  </p>
                  <p className="text-sm font-semibold mb-1">
                    Your Answer: <span className={`${isCorrect ? 'text-green-600' : 'text-red-600 font-bold'}`}>
                      {notAnswered ? "Not Answered" : userAnswer}
                    </span>
                    {(!isCorrect) && (
                      <span className="text-sm text-green-600 ml-4 font-bold">
                        (Correct Answer: {q.answer})
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/subjects')}
            className="mt-6 px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;