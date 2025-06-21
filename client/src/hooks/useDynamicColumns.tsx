import { useMemo } from "react";

type DynamicColumnOptions<T extends object> = {
  labels?: Partial<Record<keyof T, string>>;
  exclude?: (keyof T)[];
};

export default function useDynamicColumns<T extends object>(
  data: T[],
  options: DynamicColumnOptions<T> = {}
) {
  const { labels, exclude } = options;

  return useMemo(() => {
    if (!data || data.length === 0) return [];

    const sample = data[0];

    return Object.keys(sample)
      .filter((key) => !exclude?.includes(key as keyof T))
      .map((key) => ({
        key: key as keyof T,
        header: labels?.[key as keyof T] ?? capitalize(key),
      }));
  }, [data, labels, exclude]);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
