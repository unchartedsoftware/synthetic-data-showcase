/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { SetterOrUpdater } from 'recoil'
import { ICsvContent } from '~models'
import { useResetOutputs } from '~states'
import { InplaceBinning } from '~utils'

export function useFixedWidthBinning(csvContent: ICsvContent, headerIndex: number, setCsvContent: SetterOrUpdater<ICsvContent>) {
        const resetOutputs = useResetOutputs()
    return useCallback(
        values => {
            const newItems = [...csvContent.items.map(item => [...item])]

            new InplaceBinning()
                .fixedBinWidth(values.binWidth, values.minValue, values.maxValue)
                .run(newItems, headerIndex)

            setCsvContent({
                ...csvContent,
                items: newItems,
            })
            resetOutputs()
        },
        [
            csvContent,
            headerIndex,
            setCsvContent,
            resetOutputs
        ],
    )
}