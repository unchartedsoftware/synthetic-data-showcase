/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
export type CsvRecord = string[]

export interface ICsvTableHeader {
	name: string
	fieldName: string
	use: boolean
	hasSensitiveZeros: boolean
}

export interface ICsvContent {
	headers: ICsvTableHeader[]
	items: CsvRecord[]
	columnsWithZeros?: number[]
	delimiter: string
	table: ColumnTable
}

export const defaultCsvContent: ICsvContent = {
	headers: [],
	items: [],
	columnsWithZeros: undefined,
	delimiter: ',',
	table: table({}),
}
