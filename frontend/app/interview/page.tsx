"use client";

import { useState } from "react";
import CommonInput from "@/components/CommonInput";
import AILayout from "@/components/layouts/AILayout";
import InputSection from "@/components/layouts/InputSection";
import ResultSection from "@/components/layouts/ResultSection";
import { useApiCall } from "@/hooks/useApiCall";

export default function InterviewPage() {
  const [genre, setGenre] = useState("");
  const [result, setResult] = useState("");

  const { call, loading } = useApiCall();

  const resetFunc = () => {
    setGenre("");
  };

  const submit = async () => {
    try {
      const prompt = `장르 특징 5줄 정리와 인터뷰 질문 8개를 작성해주세요 장르: ${genre}`;

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
    <AILayout title="인터뷰 생성 프로그램">
      <InputSection
        title="장르 입력"
        loading={loading}
        onSubmit={submit}
        onReset={resetFunc}
      >
        <CommonInput
          title="장르"
          value={genre}
          change={(e) => setGenre(e.target.value)}
        />
      </InputSection>
      <ResultSection
        title="AI 인터뷰 생성"
        result={result}
        emptyMessage="장르를 입력하고 Submit을 클릭하세요."
        isMarkdown={false}
      />
    </AILayout>
  );
}