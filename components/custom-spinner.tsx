import { Spinner } from "./ui/spinner";

export function CustomSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Spinner className="size-12" />
    </div>
  );
}
