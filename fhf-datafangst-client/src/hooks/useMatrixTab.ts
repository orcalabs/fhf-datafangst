import { useCallback, useMemo } from "react";
import { useQueryParams } from "./useQueryParams";

export enum MatrixTab {
  Ers = "ers",
  Landing = "landing",
}

export type UseMatrixTab = [MatrixTab, (page: MatrixTab) => void];

export function useMatrixTab(): UseMatrixTab {
  const [query, setQuery] = useQueryParams();

  const tab = useMemo(() => {
    return Object.values(MatrixTab).includes(query.tab as any)
      ? (query.tab as MatrixTab)
      : MatrixTab.Ers;
  }, [query.tab]);

  const setTab = useCallback(
    (tab: MatrixTab) => {
      setQuery({ tab }, { replace: false });
    },
    [setQuery],
  );

  return [tab, setTab];
}
