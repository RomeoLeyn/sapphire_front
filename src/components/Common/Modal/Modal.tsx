import React from "react";
import { Plus } from "lucide-react";
import MainCaption from "../MainCaption/MainCaption";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed w-full inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 space-y-0"
      onClick={handleOverlayClick}
    >
      <div className="w-1/2 max-h-[80vh] flex flex-col gap-2">
        <MainCaption />
        <div className="bg-white rounded-xl shadow-xl ">
          <div className="flex justify-between items-center p-4 border-b-2 bg-blue-700 border-blue-700 relative rounded-t-lg">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              className="absolute bg-white p-1 rounded-lg right-3 top-3 cursor-pointer hover:bg-gray-300 transition duration-150"
              onClick={onClose}
            >
              <Plus className="w-7 h-7 rotate-45 transition duration-150 text-blue-700" />
            </button>
          </div>

          <div className="px-6 py-3 overflow-y-auto flex-1">{children}</div>

          {footer && (
            <div className="p-3 border-t-2 border-blue-700 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
