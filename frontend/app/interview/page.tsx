"use client";

import { useState } from "react";
import CommonInput from "@/components/CommonInput";

export default function interviewPage() {
    const [genre, setGenre] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const prompt = `장르 특징 5줄 정리와 인터뷰 질문 8개를 작성해주세요 장르: ${genre}`

    const resetFunc = () => {
        setGenre("");
    }

    const submit = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8000/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    max_tokens: 2000
                })
            });

            const data = await res.json();
            setResult(data.response);
        } catch(err) {
            console.error("에러");
        } finally {
            setLoading(false);
        }
    }

    return (
    <div suppressHydrationWarning>
        <h2 className="text-center pt-[10px] text-[19px] font-bold mb-[20px]">광고 문구 프로그램</h2>
        <div className="content px-4 relative">
            <div className="content__left">
                <h3 className="mb-[20px]">광고 문구 작성</h3>
                <div className="content__left__box border border-solid border-gray-300 w-[50%] px-3 py-3">
                    <CommonInput title="장르" value={genre} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setGenre(e.target.value)} />
                </div>
                <div className="button__wrapper mt-[30px] mb-[10px] flex gap-1 w-[50%]">
                    <button onClick={resetFunc} className="py-2 px-3 flex-1 bg-gray-200 rouned-[3px] cursor-pointer">Clear</button>
                    <button onClick={submit} disabled={loading} className="py-2 px-3 flex-1 bg-orange-400 text-white rouned-[3px] cursor-pointer disabled:opacity-50">
                      {loading ? "생성 중..." : "Submit"}
                    </button>
                </div>
            </div>
            <div className="content__right absolute top-[44px] left-[calc(55%-16px)] w-[45%] h-[300px] px-4 border border-solid border-gray-300 rounded-[3px] p-3 overflow-y-auto">
                <h3 className="mb-[10px] font-bold">AI 장르</h3>
                {result ? (
                    <p className="whitespace-pre-wrap text-sm">{result}</p>
                ) : (
                    <p className="text-gray-400">장르에 대한 설명</p>
                )}
            </div>
        </div>
    </div>
    )
}