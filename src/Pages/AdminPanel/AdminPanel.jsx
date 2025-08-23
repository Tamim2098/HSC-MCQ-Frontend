import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    subject: '',
    year: '',
    board: '',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    image: '',
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const navigate = useNavigate();

  const backendUrl = 'https://hsc-mcq-backend.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    } else {
      fetchQuestions();
    }
  }, [navigate]);

  const fetchQuestions = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/admin/questions`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      setMessage('Error fetching questions.');
      setIsSuccess(false);
      setShowMessageModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...formData.options];
    newOptions[index] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      options: newOptions,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const clearForm = () => {
    setFormData({
      subject: '',
      year: '',
      board: '',
      question: '',
      options: ['', '', '', ''],
      answer: '',
      image: '',
    });
    setIsEditMode(false);
    setEditingQuestionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/admin/addQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add question');
      }

      await response.json();
      setMessage('Question added successfully!');
      setIsSuccess(true);
      clearForm();
      fetchQuestions();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
      setShowMessageModal(true);
    }
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      setMessage('Please select a CSV file.');
      setIsSuccess(false);
      setShowMessageModal(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const questionsToAdd = results.data.map((row) => ({
          subject: row.subject || '',
          year: row.year || '',
          board: row.board || '',
          question: row.question || '',
          options: [row.option1 || '', row.option2 || '', row.option3 || '', row.option4 || ''],
          answer: row.answer || '',
          image: row.image || '',
        }));

        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
          const response = await fetch(`${backendUrl}/api/admin/add-questions-bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(questionsToAdd),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add questions from CSV');
          }

          await response.json();
          setMessage('Questions from CSV added successfully!');
          setIsSuccess(true);
          setCsvFile(null);
          fetchQuestions();
        } catch (error) {
          setMessage(`Error: ${error.message}`);
          setIsSuccess(false);
        } finally {
          setLoading(false);
          setShowMessageModal(true);
        }
      },
      error: (error) => {
        setMessage(`Error parsing CSV file: ${error.message}`);
        setIsSuccess(false);
        setLoading(false);
        setShowMessageModal(true);
      },
    });
  };

  const handleEdit = (question) => {
    setFormData({
      subject: question.subject,
      year: question.year,
      board: question.board,
      question: question.question,
      options: question.options,
      answer: question.answer,
      image: question.image,
    });
    setIsEditMode(true);
    setEditingQuestionId(question._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/admin/update-question/${editingQuestionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update question');
      }

      await response.json();
      setMessage('Question updated successfully!');
      setIsSuccess(true);
      clearForm();
      fetchQuestions();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
      setShowMessageModal(true);
    }
  };

  const handleDeleteClick = (questionId) => {
    setQuestionToDelete(questionId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    const questionId = questionToDelete;
    setShowConfirmModal(false);
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setMessage('Not authorized. Please log in.');
      setIsSuccess(false);
      setLoading(false);
      setShowMessageModal(true);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/admin/delete-question/${questionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      await response.json();
      setMessage('Question deleted successfully!');
      setIsSuccess(true);
      fetchQuestions();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
      setQuestionToDelete(null);
      setShowMessageModal(true);
    }
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-500 p-8 flex flex-col items-center relative">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-purple-700/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-700/10 blur-3xl animate-pulse-slow"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl flex flex-col items-center"
      >
        <div className="w-full flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.2 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text animate-text-gradient"
          >
            Admin Dashboard
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          className="w-full bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden p-8 mb-8 border border-gray-700/50"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center text-purple-400 mb-6">
            {isEditMode ? 'Edit Question' : 'Add New Question'}
          </motion.h2>

          <motion.form onSubmit={isEditMode ? handleUpdateQuestion : handleAddQuestion} className="space-y-6">
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 p-3 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-700 text-gray-100"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="year" className="text-sm font-medium text-gray-300">Year</label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="mt-1 p-3 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-700 text-gray-100"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="board" className="text-sm font-medium text-gray-300">Board</label>
                <input
                  type="text"
                  id="board"
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  required
                  className="mt-1 p-3 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-700 text-gray-100"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col">
              <label htmlFor="question" className="text-sm font-medium text-gray-300">Question</label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows="4"
                required
                className="mt-1 p-3 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-700 text-gray-100"
              ></textarea>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col">
              <label htmlFor="image" className="text-sm font-medium text-gray-300">Image URL (optional)</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 p-3 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-700 text-gray-100"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.options.map((option, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-300">Option {String.fromCharCode(65 + index)}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e)}
                    required
                    className="mt-1 p-3 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-700 text-gray-100"
                  />
                </div>
              ))}
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col">
              <label htmlFor="answer" className="text-sm font-medium text-gray-300">Correct Answer</label>
              <input
                type="text"
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                required
                className="mt-1 p-3 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-700 text-gray-100"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 text-white font-bold rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isEditMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {loading ? 'Processing...' : (isEditMode ? 'Update Question' : 'Add Question')}
              </motion.button>
              {isEditMode && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={clearForm}
                  className="w-full py-3 px-6 bg-gray-500 text-white font-bold rounded-full shadow-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel Edit
                </motion.button>
              )}
            </motion.div>
          </motion.form>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="w-full bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden p-8 mb-8 border border-gray-700/50"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center text-purple-400 mb-6">
            Bulk Upload (from CSV)
          </motion.h2>
          <motion.div variants={itemVariants} className="space-y-4">
            <p className="text-gray-400 text-center">
              You can upload multiple questions at once using a CSV file. The CSV file must have the following headers: <br />
              <code className="bg-gray-700 p-1 rounded-md text-sm font-mono text-gray-200">subject, year, board, question, option1, option2, option3, option4, answer, image</code>
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-900 file:text-purple-300
                  hover:file:bg-purple-800"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCsvUpload}
                disabled={loading || !csvFile}
                className="w-full md:w-auto py-3 px-6 text-white font-bold rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Uploading...' : 'Upload CSV'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {questions.length > 0 && (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="w-full bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700/50"
          >
            <h3 className="text-2xl font-bold text-center text-gray-200 mb-6">Existing Questions ({questions.length})</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {questions.map((question) => (
                  <motion.div
                    key={question._id}
                    variants={cardItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    className="p-4 border border-gray-700 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 transition-colors"
                  >
                    <p className="font-bold text-gray-200">{question.question}</p>
                    <p className="text-sm text-gray-400">Subject: {question.subject} | Year: {question.year} | Board: {question.board}</p>
                    <div className="mt-2 space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(question)}
                        className="py-1 px-4 bg-indigo-500 text-white rounded-full text-sm hover:bg-indigo-600"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteClick(question._id)}
                        className="py-1 px-4 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-sm"
            >
              <h3 className="text-lg font-bold text-gray-100 mb-4">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-sm ${isSuccess ? 'border-green-500 border-t-4' : 'border-red-500 border-t-4'}`}
            >
              <h3 className={`text-lg font-bold mb-2 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {isSuccess ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeMessageModal}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;