/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useResetEvaluatedResult } from './evaluatedResult'
import { useResetNavigateResult } from './navigateResult'
import { useResetSyntheticContent } from './syntheticContent'

/**
 * Creates a callback that resets all computed output state.
 * @returns
 */
export function useResetOutputs(): () => void {
	const resetEval = useResetEvaluatedResult()
	const resetSynth = useResetSyntheticContent()
	const resetNav = useResetNavigateResult()
	return useCallback(() => {
		resetEval()
		resetSynth()
		resetNav()
	}, [resetEval, resetSynth, resetNav])
}
