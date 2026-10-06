import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
} from 'lucide-react';

export default function RichEditor({
  value = '',
  onChange,
  placeholder = 'Start writing your thoughts...',
  minHeight = 'min-h-[320px]',
  className = '',
  readOnly = false,
  showStats = true,
}) {
  const editorRef = useRef(null);
  const isUpdatingFromProp = useRef(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Calculate counts from html
  const updateCounts = useCallback((html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    const trimmed = text.trim().replace(/\s+/g, ' ');
    setCharCount(text.length);
    setWordCount(trimmed ? trimmed.split(' ').length : 0);
  }, []);

  // Sync value to contentEditable div only when value differs significantly
  useEffect(() => {
    if (editorRef.current && !isUpdatingFromProp.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
        updateCounts(value || '');
      }
    }
    isUpdatingFromProp.current = false;
  }, [value, updateCounts]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    isUpdatingFromProp.current = true;
    updateCounts(html);
    onChange?.(html);
  };

  const executeCommand = (command, value = null) => {
    if (readOnly) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleHeading = (level) => {
    executeCommand('formatBlock', `<h${level}>`);
  };

  const handleParagraph = () => {
    executeCommand('formatBlock', '<p>');
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    executeCommand('hiliteColor', '#fef08a'); // soft amber highlight
  };

  const handleLink = () => {
    const url = prompt('Enter web link URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertChecklist = () => {
    const html = `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;"><input type="checkbox" style="width:16px;height:16px;accent-color:#1c1917;cursor:pointer;"/><span>&nbsp;Task item</span></div><p><br></p>`;
    executeCommand('insertHTML', html);
  };

  return (
    <div className={`w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 transition-all ${className}`}>
      {/* Editor Toolbar */}
      {!readOnly && (
        <div className="flex items-center flex-wrap gap-1 p-2 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/50 rounded-t-2xl">
          {/* Text Style Group */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Bold (Ctrl+B)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Italic (Ctrl+I)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Underline (Ctrl+U)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleHighlight}
              title="Highlight"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-amber-600 transition-colors"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-0.5 px-2 border-r border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => handleHeading(1)}
              title="Heading 1"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleHeading(2)}
              title="Heading 2"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleHeading(3)}
              title="Heading 3"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Lists and Quote */}
          <div className="flex items-center gap-0.5 px-2 border-r border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertChecklist}
              title="Checklist item"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<blockquote>')}
              title="Quote"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 px-2 border-r border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              title="Align Left"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              title="Align Center"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              title="Align Right"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Links & History */}
          <div className="flex items-center gap-0.5 pl-2">
            <button
              type="button"
              onClick={handleLink}
              title="Insert Link"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('unlink')}
              title="Remove Link"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Unlink className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Editable Area */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        data-placeholder={placeholder}
        className={`p-5 ${minHeight} text-stone-800 dark:text-stone-100 text-sm md:text-base leading-relaxed focus:outline-none overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-stone-400 empty:before:pointer-events-none prose prose-stone dark:prose-invert max-w-none`}
        style={{
          wordBreak: 'break-word',
        }}
      />

      {/* Footer Status Bar: Word & Character Count */}
      {showStats && (
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-stone-100 dark:border-stone-800/80 text-xs text-stone-400 font-medium">
          <div className="flex items-center gap-4">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
          </div>
          <span className="text-[11px] text-stone-400">
            Rich writing canvas
          </span>
        </div>
      )}
    </div>
  );
}

