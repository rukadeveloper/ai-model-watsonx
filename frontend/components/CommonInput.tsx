"use client";

export default function CommonInput({ title, value, change, isTextArea } : { title: string, value: string, change: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, isTextArea?:boolean }) {
    return (
        <div className="common__input mb-[16px] flex flex-col">
            <label className="text-gray-600 text-[14px] mb-[10px] inline-block">{title}</label>
            {
                isTextArea ?
                <textarea value={value} onChange={change} className="border border-solid border-gray-300 outline-none p-2" /> :
                <input value={value} onChange={change} type="text" className="w-full px-3 py-1 text-[14px] border border-solid border-gray-300 outline-none" />
            }
        </div>
    )
}