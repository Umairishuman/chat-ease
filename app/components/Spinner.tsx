interface SpinnerProps {
  // Size and border-width classes
  className?: string;
}

export default function Spinner({ className = "w-12 h-12 border-4" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${className} border-primary-500/20 border-t-primary-500 rounded-full animate-spin`}
    />
  );
}
