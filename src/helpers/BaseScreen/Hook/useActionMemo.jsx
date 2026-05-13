import React, { useMemo } from 'react'

export const useActionMemo = (actions) => {
  return useMemo(() => actions, [actions]);
}
