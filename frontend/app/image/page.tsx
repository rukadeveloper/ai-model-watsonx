"use client";

import { useState } from "react";
import AILayout from "@/components/layouts/AILayout";
import ResultSection from "@/components/layouts/ResultSection";
import { useApiCall } from "@/hooks/useApiCall";

export default function ImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");

  const { call, loading } = useApiCall();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetFunc = () => {
    setFile(null);
    setPreview("");
    setResult("");
  };

  const submit = async () => {
    if (!file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await call({
        endpoint: "/generate-img",
        body: formData,
        isFormData: true,
      });

      setResult(data.response?.result?.choices[0]?.message?.content || "분석 결과를 표시할 수 없습니다.");
    } catch (err) {
      console.log("에러:", err);
      setResult("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <AILayout title="이미지 분석 프로그램">
      <div className="content__left">
        <h3 className="mb-[20px]">이미지 분석</h3>
        <div className="content__left__box border border-solid border-gray-300 w-[50%] px-3 py-3">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">이미지 선택</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-[200px] object-contain rounded"
              />
            </div>
          )}
        </div>
        <div className="button__wrapper mt-[30px] mb-[10px] flex gap-1 w-[50%]">
          <button
            onClick={resetFunc}
            className="py-2 px-3 flex-1 bg-gray-200 rounded-[3px] cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={submit}
            disabled={loading || !file}
            className="py-2 px-3 flex-1 bg-orange-400 text-white rounded-[3px] cursor-pointer disabled:opacity-50"
          >
            {loading ? "분석 중..." : "Submit"}
          </button>
        </div>
      </div>
      <ResultSection
        title="AI 분석 결과"
        result={result}
        emptyMessage="이미지를 선택한 후 Submit을 클릭하세요."
        isMarkdown={true}
      />
    </AILayout>
  );
}
