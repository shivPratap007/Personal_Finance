import Header from "@/components/Header";
import Navmenu from "@/components/navmenu";
import InputExpense from "./input-expense/page";

export default function Home() {
  return (
    <div className="container max-w-screen min-h-screen">
      <InputExpense />
    </div>
  );
}
