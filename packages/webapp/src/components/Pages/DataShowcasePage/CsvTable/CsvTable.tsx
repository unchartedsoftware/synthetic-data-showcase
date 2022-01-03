/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList } from '@data-wrangling-components/react'
import { IconButton, IIconProps, Stack, useTheme } from '@fluentui/react'
import { memo, useRef } from 'react'
import { ICsvContent } from 'src/models/csv'
import styled from 'styled-components'
import { useOnDownloadCsvContent } from './hooks'

const downloadIcon: IIconProps = { iconName: 'Download' }

export interface ICsvTableProps {
	content: ICsvContent
	downloadAlias: string
	takeFirstItems?: number
}

export const CsvTable: React.FC<ICsvTableProps> = memo(function CsvTable({
	content,
	downloadAlias,
	takeFirstItems,
}) {
	const downloadAnchorRef = useRef<HTMLAnchorElement>(null)

	const theme = useTheme()

	const nItems = takeFirstItems
		? Math.min(content.items.length, takeFirstItems)
		: content.items.length

	let items = content.items

	if (nItems !== items.length) {
		items = items.slice(0, nItems)
	}

	const onDownload = useOnDownloadCsvContent(
		downloadAnchorRef,
		content,
		nItems,
		downloadAlias,
	)

	if (!content.table) {
		return null
	}

	return (
		<Stack>
			<Stack
				horizontal
				horizontalAlign="end"
				tokens={{ childrenGap: theme.spacing.s1 }}
			>
				<Stack.Item align="end">
					<Stack horizontal tokens={{ childrenGap: theme.spacing.s1 }}>
						<IconButton iconProps={downloadIcon} onClick={onDownload} />
						<DownloadAnchor ref={downloadAnchorRef} />
					</Stack>
				</Stack.Item>
			</Stack>
			<ArqueroDetailsList
				table={content.table}
				features={{
					histogramColumnHeaders: true,
					statsColumnHeaders: true,
				}}
				isSortable
				showColumnBorders
			/>
		</Stack>
	)
})

const DownloadAnchor = styled.a`
	display: none;
`
