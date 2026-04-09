export default function HomeLoading() {
  return (
    <main className="bg-ivory">
      {/* Hero skeleton */}
      <section className="px-6 py-12 md:py-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:gap-12">
          {/* Left content skeleton */}
          <div className="flex flex-1 flex-col items-start">
            <div className="h-3 w-48 animate-pulse rounded bg-linen" />
            <div className="mt-4 h-12 w-full max-w-md animate-pulse rounded bg-linen" />
            <div className="mt-2 h-12 w-3/4 max-w-md animate-pulse rounded bg-linen" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full max-w-[440px] animate-pulse rounded bg-linen" />
              <div className="h-4 w-5/6 max-w-[380px] animate-pulse rounded bg-linen" />
            </div>
            <div className="mt-6 flex gap-4">
              <div className="h-12 w-40 animate-pulse rounded bg-linen" />
              <div className="h-12 w-40 animate-pulse rounded bg-linen" />
            </div>
          </div>

          {/* Right image skeleton */}
          <div className="flex flex-1 items-center justify-center">
            <div className="h-[320px] w-full max-w-[480px] animate-pulse rounded-2xl bg-linen md:h-[420px]" />
          </div>
        </div>
      </section>

      {/* Trust strip skeleton */}
      <div className="border-y border-linen bg-warm-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl justify-center gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-24 animate-pulse rounded bg-linen" />
          ))}
        </div>
      </div>

      {/* Collections skeleton */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mx-auto h-3 w-24 animate-pulse rounded bg-linen" />
            <div className="mx-auto mt-4 h-10 w-56 animate-pulse rounded bg-linen" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-xl bg-linen"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
