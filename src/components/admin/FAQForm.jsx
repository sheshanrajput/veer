"use client";

import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FAQForm({ faq, onSubmit, onCancel }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // If editing, load current data
  useEffect(() => {
    if (faq) {
      setQuestion(faq.question || '');
      setAnswer(faq.answer || '');
    }
  }, [faq]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error('Both question and answer are required');
      return;
    }

    setLoading(true);
    try {
      const url = faq ? `/api/faqs/${faq.id}` : '/api/faqs';
      const method = faq ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(faq ? 'FAQ updated successfully!' : 'FAQ added successfully!');
        onSubmit(data.faq);
      } else {
        toast.error(data.error || 'Failed to save FAQ');
      }
    } catch (error) {
      console.error('FAQ save error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white">
          {faq ? 'Edit FAQ' : 'Add FAQ'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Question Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="question">
            Question <span className="text-red-400">*</span>
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Do you offer home pickup in Ahmedabad?"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            required
          />
        </div>

        {/* Answer Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="answer">
            Answer / Response <span className="text-red-400">*</span>
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write the detailed answer/response here..."
            rows={6}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm resize-none"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>{faq ? 'Update FAQ' : 'Add FAQ'}</span>
        </button>
      </div>
    </form>
  );
}
