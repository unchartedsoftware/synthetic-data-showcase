/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Stack,
	IStackStyles,
	useTheme,
	IStackTokens,
	Spinner,
	IIconProps,
	IconButton,
	Separator,
} from '@fluentui/react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { IAttributesIntersection, ISelectedAttributesByColumn } from 'sds-wasm'
import {
	ColumnAttributeSelectorGrid,
	HeaderSelector,
	SelectedAttributes,
} from '~components/AttributeSelector'
import { PipelineStep } from '~models'
import {
	useWasmWorkerValue,
	useSelectedPipelineStepSetter,
	useSyntheticHeaders,
} from '~states'

const backIcon: IIconProps = { iconName: 'Back' }

const initiallySelectedHeaders = 6

const viewHeight = 'calc(100vh - 225px)'

const chartHeight = `calc((${viewHeight} / 2) - 20px)`

export type SetSelectedAttributesCallback = (
	headerIndex: number,
	item: IAttributesIntersection | undefined,
) => Promise<void>

export type ClearSelectedAttributesCallback = () => Promise<void>

export const DataNavigation: React.FC = memo(function DataNavigation() {
	const [isLoading, setIsLoading] = useState(true)
	const [selectedAttributesByColumn, setSelectedAttributesByColumn] =
		useState<ISelectedAttributesByColumn>({})
	const worker = useWasmWorkerValue()
	const setSelectedPipelineStep = useSelectedPipelineStepSetter()
	const isMounted = useRef(true)
	const headers = useSyntheticHeaders()
	const [selectedHeaders, setSelectedHeaders] = useState<boolean[]>(
		headers.map((_, i) => i < initiallySelectedHeaders),
	)
	const theme = useTheme()

	const mainStackStyles: IStackStyles = {
		root: {
			display: 'flex',
			marginTop: theme.spacing.s2,
			marginLeft: theme.spacing.l1,
			marginRight: theme.spacing.l1,
		},
	}

	const mainStackTokens: IStackTokens = {
		childrenGap: theme.spacing.m,
	}

	const subStackTokens: IStackTokens = {
		childrenGap: theme.spacing.s1,
	}

	const setNewSelectedAttributesByColumn = useCallback(
		async (newSelectedAttributesByColumn: ISelectedAttributesByColumn) => {
			if (worker) {
				setIsLoading(true)
				const result = await worker.selectAttributes(
					newSelectedAttributesByColumn,
				)

				if (isMounted.current && result) {
					setSelectedAttributesByColumn(newSelectedAttributesByColumn)
					setIsLoading(false)
				}
			}
		},
		[worker, setIsLoading, isMounted, setSelectedAttributesByColumn],
	)

	const onSetSelectedAttributes = useCallback(
		async (headerIndex: number, item: IAttributesIntersection | undefined) => {
			setNewSelectedAttributesByColumn({
				...selectedAttributesByColumn,
				[headerIndex]:
					item !== undefined
						? new Set<string>([item.value])
						: new Set<string>(),
			})
		},
		[setNewSelectedAttributesByColumn, selectedAttributesByColumn],
	)

	const onClearSelectedAttributes = useCallback(async () => {
		setNewSelectedAttributesByColumn({})
	}, [setNewSelectedAttributesByColumn])

	const onGoBack = useCallback(() => {
		setSelectedPipelineStep(PipelineStep.Evaluate)
	}, [setSelectedPipelineStep])

	const onToggleSelectedHeader = useCallback(
		async index => {
			const newSelectedHeaders = [...selectedHeaders]
			newSelectedHeaders[index] = !newSelectedHeaders[index]
			await setSelectedHeaders(newSelectedHeaders)
		},
		[setSelectedHeaders, selectedHeaders],
	)

	useEffect(() => {
		if (worker) {
			setIsLoading(true)
			worker.navigate().then(result => {
				if (isMounted.current && result) {
					setSelectedHeaders(
						headers.map((_, i) => i < initiallySelectedHeaders),
					)
					setIsLoading(false)
				}
			})
		}
	}, [setIsLoading, worker, isMounted, setSelectedHeaders, headers])

	useEffect(() => {
		return () => {
			isMounted.current = false
		}
	}, [])

	return (
		<Stack styles={mainStackStyles} tokens={mainStackTokens}>
			<Stack horizontal verticalAlign="center" tokens={subStackTokens}>
				<IconButton iconProps={backIcon} onClick={onGoBack} />
				<h3>Compare sensitive and synthetic results</h3>
			</Stack>

			<SelectedAttributes
				headers={headers}
				selectedAttributesByColumn={selectedAttributesByColumn}
				onSetSelectedAttributes={onSetSelectedAttributes}
				onClearSelectedAttributes={onClearSelectedAttributes}
			/>

			<Stack horizontal tokens={subStackTokens} horizontalAlign="center">
				{isLoading ? (
					<Spinner />
				) : (
					<>
						<Stack.Item
							styles={{
								root: {
									overflow: 'auto',
									paddingRight: '20px',
									height: viewHeight,
									minWidth: '80px',
								},
							}}
						>
							<HeaderSelector
								headers={headers}
								selectedHeaders={selectedHeaders}
								onToggle={onToggleSelectedHeader}
							/>
						</Stack.Item>

						<Separator
							vertical={true}
							styles={{ root: { height: viewHeight } }}
						/>

						<Stack.Item grow={1}>
							<ColumnAttributeSelectorGrid
								viewHeight={viewHeight}
								headers={headers}
								selectedHeaders={selectedHeaders}
								chartHeight={chartHeight}
								chartWidth={400}
								chartBarHeight={40}
								chartMinHeight={150}
								selectedAttributesByColumn={selectedAttributesByColumn}
								onSetSelectedAttributes={onSetSelectedAttributes}
							/>
						</Stack.Item>
					</>
				)}
			</Stack>
		</Stack>
	)
})
