'use client';

import { useState } from 'react';
import Link from 'next/link';
import { saveForm, togglePublish } from './actions';
import {
  ArrowLeft, Save, Check, Trash2, ArrowUp, ArrowDown,
  Type, AlignLeft, Mail, Hash, List, CheckSquare,
} from 'lucide-react';

type BlockType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'number'
  | 'multiple_choice'
  | 'checkbox';

type BlockData = {
  id: string;
  type: BlockType;
  label: string;
  required: boolean;
  options: string[];
};

type Props = {
  formId: string;
  initialTitle: string;
  initialSlug: string;
  initialPublished: boolean;
  initialBlocks: BlockData[];
};

const BLOCK_TYPES: { type: BlockType; label: string; icon: any }[] = [
  { type: 'short_text', label: 'Short text', icon: Type },
  { type: 'long_text', label: 'Long text', icon: AlignLeft },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'multiple_choice', label: 'Multiple choice', icon: List },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
];

export default function Editor(props: Props) {
  const [title, setTitle] = useState(props.initialTitle);
  const [blocks, setBlocks] = useState<BlockData[]>(props.initialBlocks);
  const [published, setPublished] = useState(props.initialPublished);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function addBlock(type: BlockType) {
    setBlocks([
      ...blocks,
      {
        id: crypto.randomUUID(),
        type,
        label: '',
        required: false,
        options:
          type === 'multiple_choice' || type === 'checkbox' ? ['Option 1'] : [],
      },
    ]);
  }

  function updateBlock(id: string, patch: Partial<BlockData>) {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function removeBlock(id: string) {
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  function moveBlock(id: string, dir: 'up' | 'down') {
    const i = blocks.findIndex((b) => b.id === id);
    if (i < 0) return;
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    setBlocks(next);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveForm(props.formId, title, blocks);
      setSavedAt(new Date());
    } catch (err) {
      alert('Save failed: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublishToggle() {
    const next = !published;
    setPublished(next);
    await togglePublish(props.formId, next);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-neutral-100 rounded-md text-neutral-600 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Untitled form"
  className="font-medium text-neutral-900 bg-transparent hover:bg-neutral-50 focus:bg-white border border-transparent hover:border-neutral-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 px-2 py-1 text-base rounded-md transition-all max-w-xs w-full"
/>
          </div>

          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
            <button
              onClick={handlePublishToggle}
              className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
                published
                  ? 'bg-teal-700 text-white border-teal-700 hover:bg-teal-800'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {published ? 'Published' : 'Publish'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white text-sm font-medium px-3.5 py-1.5 rounded-md disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky top-24 bg-white border border-neutral-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide px-2 py-1.5 mb-1">
                Add a question
              </p>
              <div className="space-y-0.5">
                {BLOCK_TYPES.map((bt) => {
                  const Icon = bt.icon;
                  return (
                    <button
                      key={bt.type}
                      onClick={() => addBlock(bt.type)}
                      className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-neutral-700 hover:bg-teal-50 hover:text-teal-700 rounded-md transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {bt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9">
            {blocks.length === 0 ? (
              <div className="border border-dashed border-neutral-300 rounded-2xl py-24 text-center bg-white/50">
                <p className="text-neutral-500 text-sm">
                  Add your first question from the left panel
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, i) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    index={i}
                    total={blocks.length}
                    onUpdate={(patch) => updateBlock(block.id, patch)}
                    onRemove={() => removeBlock(block.id)}
                    onMove={(dir) => moveBlock(block.id, dir)}
                  />
                ))}
              </div>
            )}

            {published && (
              <div className="mt-6 bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-900">
                    Your form is live
                  </p>
                  <p className="text-xs text-teal-700 mt-0.5 font-mono">
                    /f/{props.initialSlug}
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/f/${props.initialSlug}`
                    )
                  }
                  className="text-xs px-3 py-1.5 bg-white border border-teal-200 text-teal-700 rounded-md hover:bg-teal-100"
                >
                  Copy link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockCard({
  block,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  block: BlockData;
  index: number;
  total: number;
  onUpdate: (patch: Partial<BlockData>) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
}) {
  const typeLabel =
    BLOCK_TYPES.find((b) => b.type === block.type)?.label || block.type;

  return (
    <div className="group bg-white border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs text-neutral-400 font-mono">
          {index + 1} · {typeLabel}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded disabled:opacity-30"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === total - 1}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded disabled:opacity-30"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={block.label}
        onChange={(e) => onUpdate({ label: e.target.value })}
        placeholder="Question label"
        className="w-full text-base font-medium text-neutral-900 placeholder-neutral-300 bg-transparent border-0 border-b border-transparent focus:border-teal-500 focus:outline-none py-1"
      />

      <div className="mt-3">
        {block.type === 'short_text' && (
          <input
            disabled
            placeholder="Short answer text"
            className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-md bg-neutral-50 text-neutral-400"
          />
        )}
        {block.type === 'long_text' && (
          <textarea
            disabled
            placeholder="Long answer text"
            className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-md bg-neutral-50 text-neutral-400 resize-none"
            rows={3}
          />
        )}
        {block.type === 'email' && (
          <input
            disabled
            placeholder="name@example.com"
            className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-md bg-neutral-50 text-neutral-400"
          />
        )}
        {block.type === 'number' && (
          <input
            disabled
            placeholder="0"
            className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-md bg-neutral-50 text-neutral-400"
          />
        )}
        {(block.type === 'multiple_choice' || block.type === 'checkbox') && (
          <div className="space-y-1.5">
            {block.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 border border-neutral-300 bg-neutral-50 ${
                    block.type === 'multiple_choice' ? 'rounded-full' : 'rounded'
                  }`}
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...block.options];
                    next[i] = e.target.value;
                    onUpdate({ options: next });
                  }}
                  className="flex-1 text-sm text-neutral-700 bg-transparent border-0 border-b border-transparent focus:border-teal-500 focus:outline-none py-0.5"
                />
                <button
                  onClick={() =>
                    onUpdate({
                      options: block.options.filter((_, k) => k !== i),
                    })
                  }
                  className="text-neutral-300 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                onUpdate({
                  options: [
                    ...block.options,
                    `Option ${block.options.length + 1}`,
                  ],
                })
              }
              className="text-xs text-teal-700 hover:text-teal-800 font-medium ml-6"
            >
              + Add option
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-end">
        <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer">
          <input
            type="checkbox"
            checked={block.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded accent-teal-700"
          />
          Required
        </label>
      </div>
    </div>
  );
}