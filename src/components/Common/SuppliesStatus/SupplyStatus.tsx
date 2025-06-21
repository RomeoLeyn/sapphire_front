type SuppliesStatusProps = {
  statusBadge: { label: string };
  badgeColors: { border: string; text: string; bg: string };
};

export const SupplyStatus: React.FC<SuppliesStatusProps> = ({
  statusBadge,
  badgeColors,
}) => {
  return (
    <div className="order-[-1] w-full lg:order-none lg:w-auto flex justify-end items-start">
      <span
        className={`px-4 py-1 rounded-full text-md font-bold border-2 ${badgeColors?.border} ${badgeColors?.text} ${badgeColors?.bg}`}
      >
        {statusBadge.label}
      </span>
    </div>
  );
};
