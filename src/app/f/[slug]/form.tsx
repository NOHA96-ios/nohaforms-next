'use client';

import { useState } from 'react';
import { submitForm } from './actions';
import { Check } from 'lucide-react';

type BlockType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'number'
  | 'multiple_choice'
  | 'checkbox';

type Block = {
  id: string;
  type: BlockType;
  label: string;
  required: boolean;
  options: string[];
};

type Props = {
  formId: string;
  title: string;
  blocks: Block[];
};

export default function PublicForm({ formId, title, blocks }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setValue(id: string, val: any) {
    setValues((v) => ({ ...v, [id]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    for (const b of blocks) {
      if (b.required) {
        const v = values[b.id];
        if (
          v === undefined ||
          v === '' ||
          (Array.isArray(v) && v.length === 0)
        ) {
          setError(`"${b.label}" is required`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      await submitForm(formId, values);
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-teal-700" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Thanks!
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Your response has been recorded.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setValues({});
            }}
            className="text-sm text-teal-700 hover:text-teal-800 font-medium"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 py-12 px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
            {title}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {blocks.map((b) => (
            <div key={b.id}>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                {b.label}
                {b.required && <span className="text-teal-700 ml-1">*</span>}
              </label>

              {b.type === 'short_text' && (
                <input
                  type="text"
                  value={values[b.id] || ''}
                  onChange={(e) => setValue(b.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              )}

              {b.type === 'long_text' && (
                <textarea
                  value={values[b.id] || ''}
                  onChange={(e) => setValue(b.id, e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-none transition-all"
                />
              )}

              {b.type === 'email' && (
                <input
                  type="email"
                  value={values[b.id] || ''}
                  onChange={(e) => setValue(b.id, e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              )}

              {b.type === 'number' && (
                <input
                  type="number"
                  value={values[b.id] || ''}
                  onChange={(e) => setValue(b.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              )}

              {b.type === 'multiple_choice' && (
                <div className="space-y-2">
                  {b.options.map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 border border-neutral-200 rounded-lg text-sm cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all"
                    >
                      <input
                        type="radio"
                        name={b.id}
                        value={opt}
                        checked={values[b.id] === opt}
                        onChange={() => setValue(b.id, opt)}
                        className="accent-teal-700"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {b.type === 'checkbox' && (
                <div className="space-y-2">
                  {b.options.map((opt, i) => {
                    const current: string[] = values[b.id] || [];
                    const checked = current.includes(opt);
                    return (
                      <label
                        key={i}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 border border-neutral-200 rounded-lg text-sm cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? current.filter((v) => v !== opt)
                              : [...current, opt];
                            setValue(b.id, next);
                          }}
                          className="accent-teal-700 rounded"
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>

          <p className="text-center text-xs text-neutral-400 pt-4">
            Made with JustForms
          </p>
        </form>
      </div>
    </div>
  );
}