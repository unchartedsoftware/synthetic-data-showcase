/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	getTheme,
	IStackStyles,
	IStackTokens,
	PrimaryButton,
	Stack,
	TextField,
} from '@fluentui/react'
import { memo, useCallback } from 'react'
import { CsvTable } from './CsvTable'
import {
	defaultCsvContent,
	defaultEvaluatedResult,
	defaultNavigateResult,
} from '~models'
import {
	useCacheSize,
	useIsProcessing,
	useRecordLimitValue,
	useResolution,
	useSensitiveContentValue,
	useSyntheticContent,
} from '~states'
import {
	useEvaluatedResultSetter,
	useNavigateResultSetter,
	useProcessingProgressSetter,
	useWasmWorkerValue,
} from '~states/dataShowcaseContext'
import { fromRows, rows, tableHeaders } from '~utils/arquero'

export const DataSynthesis: React.FC = memo(function DataSynthesis() {
	const worker = useWasmWorkerValue()
	const recordLimit = useRecordLimitValue()
	const [resolution, setResolution] = useResolution()
	const [cacheSize, setCacheSize] = useCacheSize()
	const [isProcessing, setIsProcessing] = useIsProcessing()
	const sensitiveContent = useSensitiveContentValue()
	const [syntheticContent, setSyntheticContent] = useSyntheticContent()
	const setEvaluatedResult = useEvaluatedResultSetter()
	const setNavigateResult = useNavigateResultSetter()
	const setProcessingProgress = useProcessingProgressSetter()

	const theme = getTheme()

	const mainStackStyles: IStackStyles = {
		root: {
			display: 'flex',
			marginTop: theme.spacing.s2,
			marginLeft: theme.spacing.l1,
			marginRight: theme.spacing.l1,
		},
	}

	const mainStackTokens: IStackTokens = {
		childrenGap: theme.spacing.s1,
	}

	const subStackTokens: IStackTokens = {
		childrenGap: theme.spacing.s1,
	}

	const onRunGenerate = useCallback(async () => {
		setIsProcessing(true)
		setSyntheticContent(defaultCsvContent)
		setEvaluatedResult(defaultEvaluatedResult)
		setNavigateResult(defaultNavigateResult)
		setProcessingProgress(0.0)

		const response = await worker?.generate(
			rows(sensitiveContent.table, true),
			sensitiveContent.headers.filter(h => h.use).map(h => h.name),
			sensitiveContent.headers
				.filter(h => h.hasSensitiveZeros)
				.map(h => h.name),
			recordLimit,
			resolution,
			cacheSize,
			p => {
				setProcessingProgress(p)
			},
		)

		setIsProcessing(false)

		const table = fromRows(response)

		setSyntheticContent({
			headers: tableHeaders(table),
			items: rows(table),
			delimiter: sensitiveContent.delimiter,
			table,
		})
	}, [
		worker,
		setIsProcessing,
		setSyntheticContent,
		setEvaluatedResult,
		setNavigateResult,
		sensitiveContent,
		recordLimit,
		resolution,
		cacheSize,
		setProcessingProgress,
	])

	return (
		<Stack styles={mainStackStyles} tokens={mainStackTokens}>
			<Stack.Item>
				<h3>Data synthesis parameters</h3>
			</Stack.Item>
			<Stack.Item>
				<Stack tokens={subStackTokens} horizontal>
					<Stack.Item>
						<TextField
							label="Resolution"
							type="number"
							value={resolution.toString()}
							disabled={isProcessing}
							required
							onChange={(_, newValue) => setResolution(+(newValue ?? 0))}
						/>
					</Stack.Item>
					<Stack.Item>
						<TextField
							label="Cache size"
							type="number"
							value={cacheSize.toString()}
							disabled={isProcessing}
							required
							onChange={(_, newValue) => setCacheSize(+(newValue ?? 0))}
						/>
					</Stack.Item>
					<Stack.Item align="end">
						<PrimaryButton
							type="submit"
							onClick={onRunGenerate}
							disabled={isProcessing}
						>
							Run
						</PrimaryButton>
					</Stack.Item>
				</Stack>
			</Stack.Item>

			{syntheticContent.table.numCols() > 0 && (
				<>
					<Stack.Item>
						<h3>Synthetic data</h3>
					</Stack.Item>
					<Stack tokens={subStackTokens}>
						<Stack.Item>
							<CsvTable
								content={syntheticContent}
								downloadAlias="synthetic_data"
							/>
						</Stack.Item>
					</Stack>
				</>
			)}
		</Stack>
	)
})
