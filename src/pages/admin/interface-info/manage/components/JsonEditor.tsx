import React, { useEffect, useRef } from "react";
import { message } from "antd";
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

const JsonEditor: React.FC<Props> = ({ value = "{}", onChange }) => {
  const jsonEditorRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<JSONEditor | null>(null);

  useEffect(() => {
    if (!jsonEditorRef.current) return;

    // 创建编辑器实例
    const newEditor = new JSONEditor(jsonEditorRef.current, {
      mode: "tree",
      onChange: () => {
        try {
          const content = newEditor.get();
          onChange?.(JSON.stringify(content));
        } catch (err) {
          console.warn('JSONEditor内容不合法！', err);
        }
      },
    });

    editorRef.current = newEditor;

    // 初始化内容
    try {
      const parsed = JSON.parse(value);
      newEditor.update(parsed);
    } catch (error) {
      message.error('传入的 JSON 格式错误');
    }

    // 清理函数
    return () => {
      if (newEditor) {
        newEditor.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      const parsed = JSON.parse(value);
      editor.update(parsed);
    } catch (error) {
      message.error('传入的 JSON 格式错误');
    }
  }, [value]);

  return <div ref={jsonEditorRef} />;
};

export default JsonEditor;
