'use client';

import { useState, useRef, useEffect } from 'react';
import { renameForm } from './actions';

export default function TitleEditor({
  formId,
  initialTitle,
}: {
  formId: string;
  initialTitle: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  async function commit() {
    const next = value.trim() || 'Untitled form';
    if (next === initialTitle) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await renameForm(formId, next);
      setEditing(false);
    } catch (err) {
      alert('Rename failed: ' + (err as Error).message);
      setValue(initialTitle);
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setValue(initialTitle);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
        }}
        disabled={saving}
        className="font-medium text-neutral-900 bg-white border border-teal-500 rounded-md px-2 py-0.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-100 max-w-full"
      />
    );
  }

  return (
    <h3
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditing(true);
      }}
      title="Click to rename"
      className="font-medium text-neutral-900 group-hover:text-teal-700 truncate transition-colors cursor-text"
    >
      {value}
    </h3>
  );
}