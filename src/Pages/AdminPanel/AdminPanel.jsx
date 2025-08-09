{/* CSV Upload Section */}
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
      </motion.div>
