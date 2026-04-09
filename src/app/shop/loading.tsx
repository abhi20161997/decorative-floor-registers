export default function ShopLoading() {
  return (
    <main className="bg-ivory">
      {/* Page header skeleton */}
      <div className="border-b border-linen bg-warm-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto h-3 w-20 animate-pulse rounded bg-linen" />
          <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded bg-linen" />
          <div className="mx-auto mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-linen" />
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Filter bar skeleton */}
          <div className="mb-6 flex gap-3">
            <div className="h-10 w-28 animate-pulse rounded-lg bg-linen" />
            <div className="h-10 w-28 animate-pulse rounded-lg bg-linen" />
          </div>

          {/* Cards grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="aspect-square animate-pulse bg-linen" />
                <div className="p-5">
                  <div className="h-3 w-16 animate-pulse rounded bg-linen" />
                  <div className="mt-2 h-6 w-3/4 animate-pulse rounded bg-linen" />
                  <div className="mt-2 h-4 w-20 animate-pulse rounded bg-linen" />
                  <div className="mt-3 flex gap-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-4 w-4 animate-pulse rounded-full bg-linen"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
