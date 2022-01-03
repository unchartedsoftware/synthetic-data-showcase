/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RefObject, useCallback } from 'react'
import { ICsvContent } from '~models'

const downloadExtensions = {
	',': 'csv',
	'\t': 'tsv',
}

function getCsvContentDownloadUrl(
	content: ICsvContent,
	nItems: number,
	delimiter: string,
): string {
	const extension = downloadExtensions[delimiter]
	const selection = content.headers.filter(h => h.use).map(h => h.name)
	const output = content.table.select(selection).toCSV({
		delimiter,
		limit: nItems
	})
	return URL.createObjectURL(
		new Blob(
			[
				output,
			],
			{ type: extension ? `text/${extension}` : 'text/plain' },
		),
	)
}

function getCsvContentDownloadExtension(delimiter: string): string {
	return downloadExtensions[delimiter] ?? 'txt'
}

export function useOnDownloadCsvContent(
	downloadAnchorRef: RefObject<HTMLAnchorElement>,
	content: ICsvContent,
	nItems: number,
	downloadAlias: string,
): () => void {
	return useCallback(() => {
		if (downloadAnchorRef.current) {
			downloadAnchorRef.current.href = getCsvContentDownloadUrl(
				content,
				nItems,
				content.delimiter,
			)
			downloadAnchorRef.current.download = `${downloadAlias}.${getCsvContentDownloadExtension(
				content.delimiter,
			)}`
			downloadAnchorRef.current.click()
		}
	}, [downloadAnchorRef, content, nItems, downloadAlias])
}
