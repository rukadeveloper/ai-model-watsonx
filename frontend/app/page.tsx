"use client";

import { useState } from "react";
import CommonInput from "@/components/CommonInput";


export default function Home() {
  const [productName, setProductName] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [productChc, setProductChc] = useState<string>("");
  const [toneAndManner, setToneAndManner] = useState<string>("");
  const [keyword, setKeyWord] = useState<string>("");
  const [centralValue, setCentralValue] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const resetFunc = () => {
    setProductName("");
    setBrandName("");
    setProductChc("");
    setToneAndManner("");
    setKeyWord("");
    setCentralValue("");
  }

  const submit = async () => {
    try {
      setLoading(true);
      const prompt = `제품명: ${productName}\n브랜드명: ${brandName}\n제품특징: ${productChc}\n톤앤매너: ${toneAndManner}\n필수포함키워드: ${keyword}\n브랜드핵심가치: ${centralValue}`;

      const response = await fetch(`http://localhost:8000/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.response);
    } catch(err) {
      console.error(err);
      setResult("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-center pt-[10px] text-[19px] font-bold mb-[20px]">광고 문구 프로그램</h2>
      <div className="content px-4 relative">
        <div className="content__left">
          <h3 className="mb-[20px]">광고 문구 작성</h3>
          <div className="content__left__box border border-solid border-gray-300 w-[50%] px-3 py-3">
            <CommonInput title="제품명" value={productName} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProductName(e.target.value)} />
            <CommonInput title="브랜드명" value={brandName} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBrandName(e.target.value)} />
            <CommonInput title="제품특징" value={productChc} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProductChc(e.target.value)} />
            <CommonInput title="톤앤매너" value={toneAndManner} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setToneAndManner(e.target.value)} />
            <CommonInput title="필수포함키워드" value={keyword} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setKeyWord(e.target.value)} />
            <CommonInput title="브랜드 핵심 가치" value={centralValue} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCentralValue(e.target.value)} />
          </div>
          <div className="button__wrapper mt-[30px] mb-[10px] flex gap-1 w-[50%]">
            <button onClick={resetFunc} className="py-2 px-3 flex-1 bg-gray-200 rouned-[3px] cursor-pointer">Clear</button>
            <button onClick={submit} disabled={loading} className="py-2 px-3 flex-1 bg-orange-400 text-white rouned-[3px] cursor-pointer disabled:opacity-50">
              {loading ? "생성 중..." : "Submit"}
            </button>
          </div>
        </div>
        <div className="content__right absolute top-[44px] left-[calc(55%-16px)] w-[45%] h-[300px] px-4 border border-solid border-gray-300 rounded-[3px] p-3 overflow-y-auto">
          <h3 className="mb-[10px] font-bold">AI 광고 문구 작성</h3>
          {result ? (
            <p className="whitespace-pre-wrap text-sm">{result}</p>
          ) : (
            <p className="text-gray-400">Submit을 클릭하면 AI가 광고 문구를 작성합니다.</p>
          )}
        </div>
      </div>
    </>
  );
}
