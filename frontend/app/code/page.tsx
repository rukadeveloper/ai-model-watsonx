"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import CommonInput from "@/components/CommonInput";

export default function codePage() {
    const [code, setCode] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
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
    ${code}

    `

    const resetFunc = () => {
        setCode("");
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
                    <CommonInput isTextArea title="코드 입력" value={code} change={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCode(e.target.value)} />
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
                    <div className="text-sm markdown-content">
                        <ReactMarkdown
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                                p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                code: ({node, ...props}) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />,
                                pre: ({node, ...props}) => <pre className="bg-gray-100 p-2 rounded overflow-x-auto mb-2 text-xs" {...props} />,
                            }}
                        >
                            {result}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-gray-400">장르에 대한 설명</p>
                )}
            </div>
        </div>
    </div>
    )
}