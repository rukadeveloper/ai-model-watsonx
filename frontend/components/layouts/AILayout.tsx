import React from "react";

interface AILayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AILayout({ title, children }: AILayoutProps) {
  return (
    <div suppressHydrationWarning>
      <h2 className="text-center pt-[10px] text-[19px] font-bold mb-[20px]">
        {title}
      </h2>
      <div className="content px-4 relative">
        {children}
      </div>
    </div>
  );
}
