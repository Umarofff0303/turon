const options = [
  { value: "cash", label: "Naqd" },
  { value: "card", label: "Karta" },
];

const PaymentSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-2xl p-3 text-sm font-bold ring-1 transition ${
            value === option.value
              ? "bg-emerald-600 text-white ring-emerald-600"
              : "bg-white text-slate-700 ring-slate-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PaymentSelector;
