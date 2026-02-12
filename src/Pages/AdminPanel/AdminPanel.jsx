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
    explanation: '', // Integrated explanation field
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

  // Ensure this matches your production/local backend URL
  const backendUrl = 'http://localhost:5000';

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
      explanation: '', // Clear explanation
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
          explanation: row.explanation || '', // Map from CSV
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
      explanation: question.explanation || '', // Load explanation into edit mode
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
    <div className="min-h-screen bg-gray-950 p-8 flex flex-col items-center relative">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl flex flex-col items-center"
      >
        <div className="w-full flex justify-between items-center mb-8">
          <motion.h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Admin Dashboard
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 text-sm"
          >
            Logout
          </motion.button>
        </div>

        <motion.div variants={containerVariants} className="w-full bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700/50">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center text-purple-400 mb-6">
            {isEditMode ? 'Edit Question' : 'Add New Question'}
          </motion.h2>

          <motion.form onSubmit={isEditMode ? handleUpdateQuestion : handleAddQuestion} className="space-y-6">
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 p-3 bg-gray-700 rounded-lg text-gray-100 border border-gray-600 focus:border-purple-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Year</label>
                <input type="text" name="year" value={formData.year} onChange={handleChange} required className="mt-1 p-3 bg-gray-700 rounded-lg text-gray-100 border border-gray-600 focus:border-purple-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Board</label>
                <input type="text" name="board" value={formData.board} onChange={handleChange} required className="mt-1 p-3 bg-gray-700 rounded-lg text-gray-100 border border-gray-600 focus:border-purple-500" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">Question</label>
              <textarea name="question" value={formData.question} onChange={handleChange} rows="3" required className="mt-1 p-3 bg-gray-700 rounded-lg text-gray-100 border border-gray-600 focus:border-purple-500"></textarea>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.options.map((option, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-300">Option {String.fromCharCode(65 + index)}</label>
                  <input type="text" value={option} onChange={(e) => handleOptionChange(index, e)} required className="mt-1 p-3 bg-gray-700 rounded-lg text-gray-100 border border-gray-600 focus:border-purple-500" />
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Correct Answer</label>
                <input type="text" name="answer" value={formData.answer} onChange={handleChange} required placeholder="Example: A" className="mt-1 p-3 bg-gray-700 rounded-lg text-gray-100 border border-gray-600 focus:border-purple-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Image URL (Optional)</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="mt-1 p-3 bg-gray-700 rounded-lg text-gray-100 border border-gray-600 focus:border-purple-500" />
              </div>
            </motion.div>

            {/* Answer Explanation Section */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="text-sm font-medium text-gray-300">Answer Explanation (ব্যাখ্যা)</label>
              <textarea 
                name="explanation" 
                value={formData.explanation} 
                onChange={handleChange} 
                rows="4" 
                placeholder="কেন উত্তরটি সঠিক তা এখানে ব্যাখ্যা করুন..." 
                className="mt-1 p-3 bg-gray-700 border border-gray-600 focus:border-indigo-500 rounded-lg text-gray-100 transition-all"
              ></textarea>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4">
              <motion.button type="submit" disabled={loading} className={`w-full py-3 text-white font-bold rounded-full shadow-lg ${isEditMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                {loading ? 'Processing...' : (isEditMode ? 'Update Question' : 'Add Question')}
              </motion.button>
              {isEditMode && (
                <button type="button" onClick={clearForm} className="w-full py-3 bg-gray-500 text-white font-bold rounded-full">Cancel</button>
              )}
            </motion.div>
          </motion.form>
        </motion.div>

        {/* CSV Bulk Upload Section */}
        <motion.div variants={containerVariants} className="w-full bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 mb-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-center text-purple-400 mb-4">Bulk Upload (CSV)</h2>
          <p className="text-xs text-gray-400 mb-4 text-center">Required Headers: <code className="text-indigo-300">subject, year, board, question, option1, option2, option3, option4, answer, image, explanation</code></p>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input type="file" accept=".csv" onChange={handleFileChange} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-purple-900 file:text-purple-300 border-none" />
            <button onClick={handleCsvUpload} disabled={loading || !csvFile} className="w-full md:w-auto px-8 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 disabled:opacity-50">Upload CSV</button>
          </div>
        </motion.div>

        {/* Existing Questions List */}
        {questions.length > 0 && (
          <motion.div variants={listVariants} className="w-full bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-xl font-bold text-gray-200 mb-6">Existing Questions ({questions.length})</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {questions.map((question) => (
                  <motion.div key={question._id} variants={cardItemVariants} layout className="p-4 border border-gray-700 rounded-lg bg-gray-700/50">
                    <p className="font-bold text-gray-200">{question.question}</p>
                    <p className="text-xs text-gray-400 mt-1">Ans: <span className="text-green-400">{question.answer}</span></p>
                    {question.explanation && (
                      <p className="text-xs text-indigo-300 mt-1 italic line-clamp-2">Exp: {question.explanation}</p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => handleEdit(question)} className="px-3 py-1 bg-indigo-500 text-xs text-white rounded-full hover:bg-indigo-600">Edit</button>
                      <button onClick={() => handleDeleteClick(question._id)} className="px-3 py-1 bg-red-500 text-xs text-white rounded-full hover:bg-red-600">Delete</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Message and Confirmation Modals remain as per original implementation */}
      <AnimatePresence>
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`bg-gray-900 p-6 rounded-xl border-t-4 ${isSuccess ? 'border-green-500' : 'border-red-500'}`}>
              <h3 className={`font-bold ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{isSuccess ? 'Success' : 'Error'}</h3>
              <p className="text-gray-300 my-4">{message}</p>
              <button onClick={closeMessageModal} className="w-full py-2 bg-gray-700 text-white rounded-lg">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-white font-bold">Confirm Delete?</h3>
              <p className="text-gray-400 my-4">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;