import Hamburger from "./Hamburger";

export default function Header() {
  return (
    <div className="relative w-full h-16 md:h-20 bg-black text-white flex items-center justify-between sm:justify-center px-4 shadow-md">
      <h1 className="font-bold text-xl sm:text-2xl">
        Personal Finance Visualizer
      </h1>
      <Hamburger />
    </div>
  );
}
