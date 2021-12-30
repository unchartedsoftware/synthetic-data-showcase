/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fromCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { CsvRecord, ICsvTableHeader } from '~models'

/**
 * Create a table from a set of compute results.
 * This comes from either papaparse or the worker
 * @param results
 * @returns
 */
export function fromRows(rows?: CsvRecord[]): ColumnTable | undefined {
    if (rows) {
        // TEMP: we're re-creating the raw text so arquero can auto-detect types
        const csv = rows.map(d => d.join(',')).join('\n')
        return fromCSV(csv)
    }
}

/**
 * Returns a list of column indices that contain at least one 0.
 * @param table
 */
export function columnIndexesWithZeros(table?: ColumnTable): number[] {
    if (!table) {
        return []
    }
	return table.columnNames().reduce((acc, name, idx) => {
		const values = table.array(name)
		if (values.some(v => v === 0)) {
			acc.push(idx)
		}
		return acc
	}, [] as number[])
}

/**
 * Creates a default set of header config based on the table
 * @param table
 * @returns
 */
export function tableHeaders(table?: ColumnTable): ICsvTableHeader[] {
    if (!table) {
        return []
    }
	return table.columnNames().map(
		(h, i) =>
			({
				name: h,
				fieldName: i.toString(),
				use: true,
				hasSensitiveZeros: false,
			} as ICsvTableHeader),
	)
}

/**
 * Creates a set of csv-compatible rows from the table.
 * This is a bit inefficient because arquero is columnar.
 * TODO: Note that we are also turning all values into strings to comply with worker interface.
 * TODO: there are many ways to manipulate this data in arquero, experiment to find the most efficient
 * @param table
 */
export function rows(table?: ColumnTable, includeHeader = false): CsvRecord[] {
    if (!table) {
        return []
    }
	const rows = includeHeader ? [table.columnNames()] : []
	table.scan(idx => {
		const row: string[] = []
		for (let i = 0; i < table.numCols(); i++) {
			const value = table.columnAt(i)?.get(idx)
			if (value !== null) {
				row.push(`${value}`)
			} else {
				row.push('')
			}
		}
		rows.push(row)
	})
	return rows
}
