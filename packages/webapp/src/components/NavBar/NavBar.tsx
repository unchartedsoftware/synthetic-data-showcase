/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	IStackTokens,
	PartialTheme,
	PrimaryButton,
	Stack,
	useTheme,
} from '@fluentui/react'
import React, { memo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
export interface NavBarProps {
	title: string
	menuItems: {
		key: string
		text: string
		pagePath: string
	}[]
}

export const NavBar: React.FC<NavBarProps> = memo(function NavBar(props) {
	const navigate = useNavigate()
	const theme = useTheme()
	const [currentPagePath, setCurrentPagePath] = useState(useLocation().pathname)
	const menuStackTokens: IStackTokens = {
		childrenGap: theme.spacing.m,
	}
	const menuItemStackTokens: IStackTokens = {
		childrenGap: theme.spacing.s2,
	}
	const menuItems = props.menuItems.map(m => ({
		...m,
		active: m.pagePath === currentPagePath,
	}))

	return (
		<Container>
			<NavBarStack horizontal tokens={menuStackTokens}>
				<Stack horizontal tokens={menuItemStackTokens}>
					{menuItems.map(m => (
						<NavBarStackItem key={m.key}>
							<NavBarPrimaryButton
								style={{
									textDecoration: m.active ? 'underline' : 'none',
									background: theme.palette.accent,
									border: 'none',
								}}
								onClick={() => {
									if (m.pagePath !== currentPagePath) {
										navigate(m.pagePath)
										setCurrentPagePath(m.pagePath)
									}
								}}
							>
								{m.text}
							</NavBarPrimaryButton>
						</NavBarStackItem>
					))}
				</Stack>
			</NavBarStack>
		</Container>
	)
})

const Container = styled.div`
	background: ${({ theme }: { theme: PartialTheme }) => theme.palette?.accent};
	height: 48px;
`

const NavBarStack = styled(Stack)`
	height: 100%;
	margin-left: ${({ theme }: { theme: PartialTheme }) => theme.spacing?.l2};
	margin-right: ${({ theme }: { theme: PartialTheme }) => theme.spacing?.l2}; ;
`

const NavBarStackItem = styled(Stack.Item)`
	align-items: center;
	color: ${({ theme }: { theme: PartialTheme }) => theme.palette?.white};
	display: flex;
	justify-content: center;
	line-height: 22px;
	font-size: 16px;
	margin: 0px;
`

const NavBarPrimaryButton = styled(PrimaryButton)`
	height: 100%;
	padding: 0;
	margin: 0;
	line-height: 14px;
	font-size: 12px;
`
