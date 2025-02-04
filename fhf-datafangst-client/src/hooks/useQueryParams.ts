import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";

export type QueryValue = string | number | boolean | Date;

export type Query = Record<
  string,
  QueryValue | QueryValue[] | undefined | null
>;

export interface SetQueryOptions {
  replace?: boolean;
}

export type NextQuery = Query | ((nextQuery: Record<string, string>) => Query);

export type UseQueryParams = [
  Record<string, string>,
  (query: NextQuery, options?: SetQueryOptions) => void,
];

export function useQueryParams() {
  const navigate = useNavigate();

  const [search, _] = useSearchParams();

  const query = useMemo(() => toQuery(search), [search]);

  const setQuery = useCallback(
    (nextQuery: NextQuery, options?: SetQueryOptions) => {
      const search = new URLSearchParams(
        options?.replace === false ? location.search : "",
      );

      const query =
        typeof nextQuery === "function"
          ? nextQuery(toQuery(search))
          : nextQuery;

      for (const [key, value] of Object.entries(query)) {
        if (
          value === null ||
          value === undefined ||
          (value instanceof Array && value.length === 0)
        ) {
          search.delete(key);
        } else {
          search.set(
            key,
            value instanceof Array
              ? value.map(toString).join(",")
              : toString(value),
          );
        }
      }

      navigate("?" + search);
    },
    [navigate],
  );

  return [query, setQuery] as UseQueryParams;
}

function toQuery(search: URLSearchParams): Record<string, string> {
  return Object.fromEntries(
    Array.from(search.keys()).map((key) => [key, search.get(key)!]),
  );
}

function toString(value: QueryValue): string {
  return typeof value === "string"
    ? value
    : value instanceof Date
      ? value.toISOString()
      : value.toString();
}
