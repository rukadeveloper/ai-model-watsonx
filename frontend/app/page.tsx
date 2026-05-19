"use client";

import { useState } from "react";
import CommonInput from "@/components/CommonInput";
import AILayout from "@/components/layouts/AILayout";
import InputSection from "@/components/layouts/InputSection";
import ResultSection from "@/components/layouts/ResultSection";
import { useApiCall } from "@/hooks/useApiCall";

export default function Home() {
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productChc, setProductChc] = useState("");
  const [toneAndManner, setToneAndManner] = useState("");
  const [keyword, setKeyWord] = useState("");
  const [centralValue, setCentralValue] = useState("");
  const [result, setResult] = useState("");

  const { call, loading } = useApiCall();

  const resetFunc = () => {
    setProductName("");
    setBrandName("");
    setProductChc("");
    setToneAndManner("");
    setKeyWord("");
    setCentralValue("");
  };

  const submit = async () => {
    try {
      const prompt = `제품명: ${productName}\n브랜드명: ${brandName}\n제품특징: ${productChc}\n톤앤매너: ${toneAndManner}\n필수포함키워드: ${keyword}\n브랜드핵심가치: ${centralValue}`;
      const data = await call({
        endpoint: "/generate",
        body: { prompt, max_tokens: 200 },
      });
      setResult(data.response);
    } catch {
      setResult("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <AILayout title="광고 문구 프로그램">
      <InputSection
        title="광고 문구 작성"
        loading={loading}
        onSubmit={submit}
        onReset={resetFunc}
      >
        <CommonInput
          title="제품명"
          value={productName}
          change={(e) => setProductName(e.target.value)}
        />
        <CommonInput
          title="브랜드명"
          value={brandName}
          change={(e) => setBrandName(e.target.value)}
        />
        <CommonInput
          title="제품특징"
          value={productChc}
          change={(e) => setProductChc(e.target.value)}
        />
        <CommonInput
          title="톤앤매너"
          value={toneAndManner}
          change={(e) => setToneAndManner(e.target.value)}
        />
        <CommonInput
          title="필수포함키워드"
          value={keyword}
          change={(e) => setKeyWord(e.target.value)}
        />
        <CommonInput
          title="브랜드 핵심 가치"
          value={centralValue}
          change={(e) => setCentralValue(e.target.value)}
        />
      </InputSection>
      <ResultSection
        title="AI 광고 문구 작성"
        result={result}
        emptyMessage="Submit을 클릭하면 AI가 광고 문구를 작성합니다."
        isMarkdown={false}
      />
    </AILayout>
  );
}
