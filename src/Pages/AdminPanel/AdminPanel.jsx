import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse'; // PapaParse লাইব্রেরি ইম্পোর্ট করা হলো

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
  const [csvFile, setCsvFile] = useState(null); // CSV ফাইল হ্যান্ডেল করার জন্য নতুন state

  const navigate = useNavigate();
  
  const backendUrl = 'https://hsc-mcq-backend.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
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
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
      console.log('Questions fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage('Error fetching questions.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
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
          'Authorization': `Bearer ${token}`
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
      console.error('Submission Error:', error);
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      setMessage('Please select a CSV file.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const questionsToAdd = results.data.map(row => ({
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
          // নতুন বাল্ক আপলোড API endpoint
          const response = await fetch(`${backendUrl}/api/admin/add-questions-bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
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
          setCsvFile(null); // ফাইল রিসেট করা
          fetchQuestions();
        } catch (error) {
          console.error('CSV Upload Error:', error);
          setMessage(`Error: ${error.message}`);
          setIsSuccess(false);
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('PapaParse Error:', error);
        setMessage(`Error parsing CSV file: ${error.message}`);
        setIsSuccess(false);
        setLoading(false);
      }
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
          'Authorization': `Bearer ${token}`
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
      console.error('Update Error:', error);
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (questionId) => {
    setQuestionToDelete(questionId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    const questionId = questionToDelete;
    setShowConfirmModal(false);
    
    console.log(`handleDelete called for questionId: ${questionId}`);
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('No token found. Cannot delete question.');
      setMessage('Not authorized. Please log in.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/admin/delete-question/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      await response.json();
      setMessage('Question deleted successfully!');
      setIsSuccess(true);
      fetchQuestions();
    } catch (error) {
      console.error('Delete Error:', error);
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setQuestionToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      {/* Add/Edit Question Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 mb-8"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          {isEditMode ? 'Edit Question' : 'Add New Question'}
        </h2>

        <form onSubmit={isEditMode ? handleUpdateQuestion : handleAddQuestion} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="year" className="text-sm font-medium text-gray-700">Year</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="board" className="text-sm font-medium text-gray-700">Board</label>
              <input
                type="text"
                id="board"
                name="board"
                value={formData.board}
                onChange={handleChange}
                required
                className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="question" className="text-sm font-medium text-gray-700">Question</label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label htmlFor="image" className="text-sm font-medium text-gray-700">Image URL (optional)</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.options.map((option, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Option {String.fromCharCode(65 + index)}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e)}
                  required
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <label htmlFor="answer" className="text-sm font-medium text-gray-700">Correct Answer</label>
            <input
              type="text"
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              required
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 text-white font-bold rounded-full shadow-lg transition-colors disabled:bg-gray-400 ${isEditMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'}`}
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
          </div>
        </form>
      </motion.div>

      {/* CSV Upload Section - This is the new section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 mb-8"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Bulk Upload (from CSV)</h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            You can upload multiple questions at once using a CSV file. The CSV file must have the following headers: <br />
            <code className="bg-gray-200 p-1 rounded-md text-sm font-mono">subject, year, board, question, option1, option2, option3, option4, answer, image</code>
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCsvUpload}
              disabled={loading || !csvFile}
              className="w-full md:w-auto py-3 px-6 text-white font-bold rounded-full shadow-lg transition-colors disabled:bg-gray-400 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Uploading...' : 'Upload CSV'}
            </motion.button>
          </div>
        </div>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg text-center font-semibold ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
      
      {/* Existing Questions List */}
      {questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Existing Questions ({questions.length})</h3>
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <p className="font-bold">{question.question}</p>
                <p className="text-sm text-gray-600">Subject: {question.subject} | Year: {question.year} | Board: {question.board}</p>
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
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
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
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
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

    </div>
  );
};

export default AdminPanel;
