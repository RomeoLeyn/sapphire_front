interface LoadMoreButtontProps {
  onClick: () => void;
}

export const LoadMoreButtont: React.FC<LoadMoreButtontProps> = ({
  onClick,
}) => {
  return (
    <div className="text-center">
      <button
        onClick={onClick}
        className="text-lg font-semibold text-blue-700 py-1 px-4 rounded-lg hover:bg-blue-700 hover:text-white transition-all duration-150"
      >
        Завантажити ще
      </button>
    </div>
  );
};
