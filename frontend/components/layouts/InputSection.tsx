import React from "react";

interface InputSectionProps {
  title: string;
  loading: boolean;
  onSubmit: () => void;
  onReset: () => void;
  children: React.ReactNode;
}

export default function InputSection({
  title,
  loading,
  onSubmit,
  onReset,
  children,
}: InputSectionProps) {
  return (
    <div className="content__left">
      <h3 className="mb-[20px]">{title}</h3>
      <div className="content__left__box border border-solid border-gray-300 w-[50%] px-3 py-3">
        {children}
      </div>
      <div className="button__wrapper mt-[30px] mb-[10px] flex gap-1 w-[50%]">
        <button
          onClick={onReset}
          className="py-2 px-3 flex-1 bg-gray-200 rounded-[3px] cursor-pointer"
        >
          Clear
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="py-2 px-3 flex-1 bg-orange-400 text-white rounded-[3px] cursor-pointer disabled:opacity-50"
        >
          {loading ? "생성 중..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
