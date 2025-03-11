import { link } from "fs";
import Link from "next/link";
import React from "react";

const navMenu = [
  {
    title: "Input Expense",
    link: "/input-expense",
  },
  {
    title: "Transactions",
    link: "/transactions",
  },
  {
    title: "Categeory Charts",
    link: "/categeory-charts",
  },
  {
    title: "Summary",
    link: "/summary",
  },
  {
    title: "Set Limits",
    link: "/set-limits",
  },
  {
    title: "Comparision Chart",
    link: "/comparision-charts",
  },
];

export default function Navmenu() {
  return (
    <div className="mt-4 flex justify-center flex-wrap">
      {navMenu.map((item, index) => {
        return (
          <Link href={item?.link} key={index}>
            <div
              key={index}
              className="mx-2 mb-2 px-5 py-3 bg-white shadow-md cursor-pointer hover:scale-110 transition-transform duration-300 font-bold"
            >
              {item.title}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
