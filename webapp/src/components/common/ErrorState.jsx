import Button from "./Button";

const ErrorState = ({ message = "Kutilmagan xatolik", onRetry }) => {
  return (
    <div className="rounded-3xl bg-rose-50 p-6 text-center ring-1 ring-rose-200">
      <h3 className="font-display text-xl font-semibold text-rose-700">Xatolik</h3>
      <p className="mt-2 text-sm text-rose-600">{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Qayta urinish
        </Button>
      ) : null}
    </div>
  );
};

export default ErrorState;
