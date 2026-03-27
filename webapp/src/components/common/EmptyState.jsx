const EmptyState = ({ title, description, action }) => {
  return (
    <div className="rounded-3xl bg-white/80 p-6 text-center shadow-card ring-1 ring-slate-200/60">
      <h3 className="font-display text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
