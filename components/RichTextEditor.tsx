"use client";

import { useEffect, useRef } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Eraser 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInputting = useRef(false);

  // Sync value from parent to editor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !isInputting.current) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInputting.current = true;
      onChange(editorRef.current.innerHTML);
      // Reset inputting flag in next tick
      setTimeout(() => {
        isInputting.current = false;
      }, 0);
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    // Keep focus inside editor
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const addLink = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Underline"
        >
          <Underline size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1 align-self-center my-auto" />
        
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "h2")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Heading 2"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "h3")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Heading 3"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "p")}
          className="p-1.5 px-2.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors text-xs font-bold font-sans"
          title="Paragraph"
        >
          P
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1 align-self-center my-auto" />
        
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1 align-self-center my-auto" />
        
        <button
          type="button"
          onClick={addLink}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          title="Clear Formatting"
        >
          <Eraser size={16} />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[250px] max-h-[400px] overflow-y-auto outline-none prose prose-sm max-w-none bg-white"
        style={{ fontFamily: "inherit" }}
      />
    </div>
  );
}
