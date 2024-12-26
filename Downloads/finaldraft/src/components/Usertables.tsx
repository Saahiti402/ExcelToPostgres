"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function UsersTable() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [message, setMessage] = useState("");

  function previewData() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  async function saveData() {
    if (!jsonData) {
      setMessage("Please preview data first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: JSON.parse(jsonData) }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Success! ${result.message}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('Failed to save data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function clearData() {
    setFile(null);
    setJsonData("");
    setMessage("");
  }

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center gap-8">
        <div className="">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <button
          onClick={previewData}
          className="py-2 px-6 rounded bg-gray-300 text-slate-900"
        >
          Preview Data
        </button>
        <button
          onClick={saveData}
          disabled={loading}
          className="py-2 px-6 rounded bg-purple-600 text-slate-100 disabled:bg-purple-400"
        >
          {loading ? 'Saving...' : 'Save Data'}
        </button>
        <button
          onClick={clearData}
          className="py-2 px-6 rounded bg-red-600 text-slate-100"
        >
          Clear Data
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded ${
          message.startsWith('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <pre >
        {jsonData}
      </pre>
    </div>
  );
}

