"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ShopFilters } from "@/types";

export function useFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters: ShopFilters = useMemo(
    () => ({
      style: searchParams.get("style") || undefined,
      finish: searchParams.get("finish") || undefined,
      size: searchParams.get("size") || undefined,
      search: searchParams.get("search") || undefined,
      sort: (searchParams.get("sort") as ShopFilters["sort"]) || undefined,
    }),
    [searchParams]
  );

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, setFilter, clearFilters };
}
