import { Gem } from "lucide-react";

const MainCaption = () => {
  return (
    <div className="flex justify-center w-full bg-gray-50 rounded-lg py-2 items-center gap-2">
      <span className="text-xl uppercase font-extrabold">Салон краси</span>
      <span className="text-3xl uppercase font-extrabold">
        <span className="text-blue-400">S</span>
        <span className="text-blue-400">a</span>
        <span className="text-blue-500">p</span>
        <span className="text-blue-500">p</span>
        <span className="text-blue-600">h</span>
        <span className="text-blue-600">i</span>
        <span className="text-blue-700">r</span>
        <span className="text-blue-700">e</span>
      </span>
      <Gem size={50} className=" bg-white rounded-full text-blue-600" />
    </div>
  );
};

export default MainCaption;
