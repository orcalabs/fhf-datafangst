import { useCallback, useMemo } from "react";
import { useQueryParams } from "./useQueryParams";

export enum MyPageSubmenu {
  Trips = "trips",
  Area = "area",
  Facility = "facility",
  Stats = "stats",
  Administrate = "administrate",
}

export type UseMyPageSubmenu = [MyPageSubmenu, (page: MyPageSubmenu) => void];

export function useMyPageSubmenu(): UseMyPageSubmenu {
  const [query, setQuery] = useQueryParams();

  const menu = useMemo(() => {
    return Object.values(MyPageSubmenu).includes(query.menu as any)
      ? (query.menu as MyPageSubmenu)
      : MyPageSubmenu.Trips;
  }, [query.menu]);

  const setMenu = useCallback(
    (menu: MyPageSubmenu) => {
      setQuery({ menu }, { replace: false });
    },
    [setQuery],
  );

  return [menu, setMenu];
}
