import { Editor } from "@monaco-editor/react";
import { Radio } from "antd";
import { RadioChangeEvent } from "antd/es/radio/interface";
import React, { useState } from "react";

const exampleCode: Record<string, string> = {
  java: `class Main {

    public static void main(String[] args) {
        String jsonStr = "{\\"name\\":\\"阿狸\\"}";

        Gson gson = new Gson();
        com.yy.yyapiclientsdk.model.User user = gson.fromJson(jsonStr, com.yy.yyapiclientsdk.model.User.class);
        // 创建API调用客户端（输入AK、SK）
        YyApiClient yyApiClient = new YyApiClient( "7fbd0ed36482f8f4abf19061e3b995ac", "111bd3c9d96caf079ba183f095ef091d");
        String result = yyApiClient.getNameByPost(user);

        System.out.println("调用结果=======>" + result);
    }
}`,
  javascript: 'console.log("功能暂未开发，敬请期待！")',
  python: 'print("功能暂未开发，敬请期待！")',
  csharp: 'Console.WriteLine("功能暂未开发，敬请期待！");',
  php: 'echo "功能暂未开发，敬请期待！";',
};

const CodeEditorView: React.FC = () => {
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
  const [language, setLanguage] = useState<string>("java");
  const [code, setCode] = useState<string>(exampleCode[language]);

  const handleLanguageChange = ({ target }: RadioChangeEvent) => {
    setLanguage(target.value);
    setCode(exampleCode[target.value]);
  };

  return (
    <>
      <div className="margin8">
        <Radio.Group value={language} onChange={handleLanguageChange}>
          <Radio.Button value="java">Java</Radio.Button>
          <Radio.Button value="javascript">Javascript</Radio.Button>
          <Radio.Button value="python">Python</Radio.Button>
          <Radio.Button value="csharp">C#</Radio.Button>
          <Radio.Button value="php">PHP</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{ height: "700px", width: "100%" }}>
        <Editor
          language={language}
          value={code}
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
