export default function ProductLoading() {
  return (
    <main className="bg-ivory">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-linen bg-warm-white px-6 py-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-4 w-10 animate-pulse rounded bg-linen" />
            <span className="text-linen">/</span>
            <div className="h-4 w-10 animate-pulse rounded bg-linen" />
            <span className="text-linen">/</span>
            <div className="h-4 w-40 animate-pulse rounded bg-linen" />
          </div>
        </div>
      </div>

      {/* Product detail skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="lg:flex lg:gap-12">
          {/* Left column: Image skeleton */}
          <div className="lg:w-1/2">
            <div className="aspect-[4/3] animate-pulse rounded-lg bg-linen" />
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 w-20 animate-pulse rounded-md bg-linen"
                />
              ))}
            </div>
          </div>

          {/* Right column: Info skeleton */}
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            {/* Style label */}
            <div className="h-3 w-20 animate-pulse rounded bg-linen" />
            {/* Product name */}
            <div className="mt-3 h-10 w-3/4 animate-pulse rounded bg-linen" />
            {/* Description */}
            <div className="mt-5 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-linen" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-linen" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-linen" />
            </div>
            {/* Price */}
            <div className="mt-6 h-8 w-24 animate-pulse rounded bg-linen" />
            {/* Finish selector */}
            <div className="mt-6">
              <div className="mb-2 h-4 w-12 animate-pulse rounded bg-linen" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 animate-pulse rounded-full bg-linen"
                  />
                ))}
              </div>
            </div>
            {/* Size selector */}
            <div className="mt-6">
              <div className="mb-2 h-4 w-10 animate-pulse rounded bg-linen" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-lg bg-linen"
                  />
                ))}
              </div>
            </div>
            {/* Add to cart button */}
            <div className="mt-8 h-12 animate-pulse rounded-lg bg-linen" />
          </div>
        </div>
      </div>
    </main>
  );
}
