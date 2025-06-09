import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGlobalLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  return useMemo(
    () => isFetching > 0 || isMutating > 0,
    [isFetching, isMutating]
  );
};
