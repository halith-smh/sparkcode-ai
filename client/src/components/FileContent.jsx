import React, { useEffect, useRef } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
// import * as monaco from "mo"

const FileContent = ({ displayEditorFile }) => {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    editor.getAction('editor.action.formatDocument')?.run();
  };

  // Format when file changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(displayEditorFile.value || '');
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  }, [displayEditorFile]);

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
    }
  }, [monaco]);

  return (
    <Editor
      height="100%"
      language={displayEditorFile.type}
      defaultValue={displayEditorFile.value}
      theme="vs-dark"
      onMount={handleEditorMount}
      options={{
        automaticLayout: true,
        fontSize: 14,
        wordWrap: 'on',
        minimap: { enabled: false },
        formatOnType: true,
        formatOnPaste: true,
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        tabSize: 2,
      }}
    />
  );
};

export default FileContent;
