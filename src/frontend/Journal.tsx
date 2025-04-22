import { useState, useEffect } from "react";
import ThemeToggle from "./components/ThemeToggle";

type Entry = {
  id: number;
  text: string;
  date: string;
  ai?: string; // we'll add this later
};

export default function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("journal_entries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage every time entries update
  useEffect(() => {
    localStorage.setItem("journal_entries", JSON.stringify(entries));
  }, [entries]);

  const saveEntry = () => {
    if (!text.trim()) return;

    const newEntry: Entry = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString(),
    };

    setEntries([newEntry, ...entries]);
    setText("");
  };
  const askAI = async () => {
    console.log("Asking AI...");
    if (!text.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      const newEntry: Entry = {
        id: Date.now(),
        text,
        date: new Date().toLocaleString(),
        ai: data.ai_reply,
      };

      setEntries([newEntry, ...entries]);
      setText("");
    } catch (err) {
      console.error("AI call failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6 dark:bg-gray-800 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold mb-4 text-center dark:text-white">🧠 My AI Journal</h1>
          <ThemeToggle />
      </div>

      <textarea
        className="w-full p-4 rounded-md border dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        placeholder="What’s on your mind?"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-between mt-4">
        <button
          onClick={saveEntry}
          className="bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Save
        </button>

        <button
          onClick={askAI}
          className="bg-purple-600 text-white px-6 py-2 rounded  hover:bg-purple-700"
        >
          Ask AI 🧠
        </button>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2 dark:text-white">📝 Entries</h2>

      <div className="flex flex-col gap-4">
        {entries.length === 0 && (
          <p className="text-gray-500 text-center">No entries yet.</p>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className="bg-white p-4 rounded shadow dark:bg-gray-700">
            <div className="text-sm text-gray-400 mb-1 dark:text-white">{entry.date}</div>
            <p className="text-lg dark:text-white">{entry.text}</p>
            {entry.ai && (
              <div className="mt-2 p-2 bg-gray-100 rounded dark:bg-gray-600 dark:text-white">
                <strong>AI:</strong> {entry.ai}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
