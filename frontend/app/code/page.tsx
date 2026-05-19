"use client";

import { useState } from "react";
import CommonInput from "@/components/CommonInput";
import AILayout from "@/components/layouts/AILayout";
import InputSection from "@/components/layouts/InputSection";
import ResultSection from "@/components/layouts/ResultSection";
import { useApiCall } from "@/hooks/useApiCall";

export default function CodePage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  const { call, loading } = useApiCall();

  const resetFunc = () => {
    setCode("");
  };

  const submit = async () => {
    try {
      const prompt = `
    요구사항에 맞는 코드를 입력해주세요.

    [규칙]
    1. 반드시 코드 블록 형식으로 작성
    2. 코드에는 적절한 주석 포함
    3. 필요한 라이브러리가 있다면 함께 설명
    4. 코드 동작 원리 설명
    5. 오류 가능성이 있는 부분은 주의사항 추가
    6. 사용자의 요청언어에 맞춰 작성
    7. 불필요하게 긴 설명은 피하고 핵심 위주로 작성

    [응답 형식]
    1. 기능 설명
    2. 코드
    3. 코드 설명
    4. 실행결과 혹은 사용 예시

    [프롬프트]
    ${code}`;

      const data = await call({
        endpoint: "/generate",
        body: { prompt, max_tokens: 2000 },
      });
      setResult(data.response);
    } catch (err) {
      console.error("에러");
    }
  };

  return (
    <AILayout title="코드 생성 프로그램">
      <InputSection
        title="코드 입력"
        loading={loading}
        onSubmit={submit}
        onReset={resetFunc}
      >
        <CommonInput
          isTextArea
          title="코드 입력"
          value={code}
          change={(e) => setCode(e.target.value)}
        />
      </InputSection>
      <ResultSection
        title="AI 코드 생성"
        result={result}
        emptyMessage="코드 요구사항을 입력하고 Submit을 클릭하세요."
        isMarkdown={true}
      />
    </AILayout>
  );
}