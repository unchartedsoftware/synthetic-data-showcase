/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { from } from 'arquero'
import { parse } from 'papaparse'
import { useCallback, ChangeEvent } from 'react'
import { SetterOrUpdater } from 'recoil'
import { ICsvContent } from '~models'
import { useResetOutputs } from '~states'
import { columnIndexesWithZeros, rows, tableHeaders } from '~utils/arquero'

/**
 * When a file is opened, reset the data state and instantiate a new table to work with.
 * @param setIsProcessing 
 * @param setSyntheticContent 
 * @returns 
 */
export function useOnFileChange(setIsProcessing: SetterOrUpdater<boolean>,
    setSensitiveContent: SetterOrUpdater<ICsvContent>): (e: ChangeEvent<HTMLInputElement>) => void {
        const resetOutputs = useResetOutputs()
    return useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0]
    
            if (f) {
                setIsProcessing(true)
                resetOutputs()
                parse<Array<string>>(f, {
                    dynamicTyping: true,
                    header: true,
                    complete: async results => {
                        const table = from(results.data)
                        setIsProcessing(false)
                        setSensitiveContent({
                            headers: tableHeaders(table),
                            items: rows(table),
                            columnsWithZeros: columnIndexesWithZeros(table),
                            delimiter: results.meta.delimiter,
                            table,
                        })
                    },
                })
            }
        },
        [
            setIsProcessing,
            resetOutputs,
            setSensitiveContent,
        ],
    )
}
