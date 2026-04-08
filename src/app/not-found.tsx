import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-4 text-center">
      <p className="font-display text-[8rem] leading-none text-linen select-none">
        404
      </p>

      <h1 className="mt-2 font-display text-display-lg text-espresso">
        Page Not Found
      </h1>

      <p className="mt-4 max-w-md text-umber">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-block rounded bg-espresso px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-espresso/90"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="inline-block rounded border border-espresso px-6 py-3 text-sm font-medium text-espresso transition-colors hover:bg-espresso hover:text-ivory"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
