/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	IStackTokens,
	PrimaryButton,
	Stack,
	TextField,
	useTheme,
} from '@fluentui/react'
import { Form, useFormik, FormikProvider } from 'formik'
import { memo, useEffect } from 'react'
import * as yup from 'yup'
import { useFixedWidthBinning } from './hooks'
import { useSensitiveContent } from '~states'
import { findMinMax, stringToNumber } from '~utils'

export interface FixedWidthDataBinningProps {
	headerIndex: number
}

const validationSchema = yup.object().shape({
	binWidth: yup.number().positive().required(),
	minValue: yup.number().required(),
	maxValue: yup.number().required().min(yup.ref('minValue')),
})

export const FixedWidthDataBinning: React.FC<FixedWidthDataBinningProps> = memo(
	function FixedWidthDataBinning({ headerIndex }: FixedWidthDataBinningProps) {
		const [csvContent, setCsvContent] = useSensitiveContent()
		const onRun = useFixedWidthBinning(csvContent, headerIndex, setCsvContent)

		const formik = useFormik({
			validationSchema,
			initialValues: {
				binWidth: 2,
				minValue: 0,
				maxValue: 10,
			},
			onSubmit: onRun,
		})

		const theme = useTheme()

		const stackTokens: IStackTokens = {
			childrenGap: theme.spacing.m,
		}

		useEffect(() => {
			const minMax = findMinMax(
				csvContent.items
					.map(row => stringToNumber(row[headerIndex]))
					.filter(v => v !== null) as number[],
			)

			formik.setFieldValue('minValue', minMax.minValue ?? '').then(() => {
				formik.setFieldValue('maxValue', minMax.maxValue ?? '')
			})
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [csvContent, headerIndex])

		return (
			<FormikProvider value={formik}>
				<Form>
					<Stack horizontal tokens={stackTokens} wrap verticalAlign="start">
						<TextField
							type="number"
							label="Bin width"
							name="binWidth"
							value={formik.values.binWidth?.toString() ?? ''}
							onChange={formik.handleChange}
							errorMessage={formik.errors.binWidth}
						/>
						<TextField
							type="number"
							label="Min value"
							name="minValue"
							value={formik.values.minValue?.toString() ?? ''}
							onChange={formik.handleChange}
							errorMessage={formik.errors.minValue}
						/>
						<TextField
							type="number"
							label="Max value"
							name="maxValue"
							value={formik.values.maxValue?.toString() ?? ''}
							onChange={formik.handleChange}
							errorMessage={formik.errors.maxValue}
						/>
						<Stack.Item
							styles={{
								root: {
									marginTop: 37,
								},
							}}
						>
							<PrimaryButton type="submit" disabled={!formik.isValid}>
								Run
							</PrimaryButton>
						</Stack.Item>
					</Stack>
				</Form>
			</FormikProvider>
		)
	},
)
