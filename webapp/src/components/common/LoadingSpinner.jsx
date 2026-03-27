const LoadingSpinner = ({ label = "Yuklanmoqda..." }) => {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="mt-3 text-sm text-slate-600">{label}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
