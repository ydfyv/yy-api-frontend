import { Editor } from "@monaco-editor/react";
import { Select } from "antd";
import React, { useState } from "react";

interface Props {
  code?: string;
  languageProp?: string;
}

const CodeEditorView: React.FC<Props> = ({ code, languageProp = "java" }) => {
  const handleEditorDidMount = (editor: any, monaco: any) => {
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs",
      inherit: true,
      rules: [{ background: "EDF9FA" }],
      colors: {
        "editor.background": "#f0f0f0",
      },
    });
  };
  const [language, setLanguage] = useState<string>(languageProp);

  return (
    <>
      <Select
        value={language}
        onChange={(value) => setLanguage(value)}
        style={{ marginBottom: "10px", width: "150px" }}
      >
        <Select.Option value="java">Java</Select.Option>
        <Select.Option value="javascript">JavaScript</Select.Option>
        <Select.Option value="python">Python</Select.Option>
        <Select.Option value="csharp">C#</Select.Option>
        <Select.Option value="php">PHP</Select.Option>
      </Select>
      <div style={{ height: "700px", width: "100%" }}>
        <Editor
          language={language}
          defaultValue={code}
          options={{
            minimap: {
              enabled: true,
              side: "right",
              size: "proportional",
              showSlider: "mouseover",
              renderCharacters: true,
              maxColumn: 120,
            },
          }}
          onMount={handleEditorDidMount}
          theme="vs-dark"
        />
      </div>
    </>
  );
};

export default CodeEditorView;
