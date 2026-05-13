import React, { useMemo } from 'react'

export const useColumnMemo = (columns) => {
 
    return useMemo(() => columns, [columns]);
}
