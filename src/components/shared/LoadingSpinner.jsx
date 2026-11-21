export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
