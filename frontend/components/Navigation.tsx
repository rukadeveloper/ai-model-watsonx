"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "광고 문구" },
  { href: "/code", label: "코드 생성" },
  { href: "/image", label: "이미지 분석" },
  { href: "/interview", label: "인터뷰 생성" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 mb-[20px] border-b border-gray-300 pb-[10px]">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            pathname === item.href
              ? "bg-orange-400 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
