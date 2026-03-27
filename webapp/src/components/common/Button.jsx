import clsx from "clsx";

const Button = ({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) => {
  const styles = clsx(
    "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    {
      "bg-[var(--tg-button)] text-[var(--tg-button-text)] shadow-card": variant === "primary",
      "bg-white/80 text-slate-900 ring-1 ring-slate-200": variant === "secondary",
      "bg-rose-100 text-rose-700": variant === "danger",
    },
    className
  );

  return (
    <button type={type} disabled={disabled} className={styles} {...props}>
      {children}
    </button>
  );
};

export default Button;
