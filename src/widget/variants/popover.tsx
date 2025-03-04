'use client';

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { themeConfig as defaultThemeConfig } from '../theme';
import packageJson from '../../../package.json';
import type { ThemeConfig } from '../theme';
import { useFeedInsight } from '../service';

export interface Props {
	projectId: string;
	theme?: 'dark' | 'light';
	customTheme?: {
		dark?: Partial<ThemeConfig>;
		light?: Partial<ThemeConfig>;
	};
	trigger: React.ReactNode;
	align?: 'top' | 'bottom' | 'left' | 'right';
	user?: {
		email: string;
		name?: string;
	};
}

const style_key = 'feedinsight-widget-popover';

const Style = (theme: ThemeConfig) => `
	.${style_key} * {
		box-sizing: border-box;
		font-family: inherit;
		outline: none;
		border: none;
		padding: 0;
		margin: 0;
	}

	.${style_key} {
		position: fixed;
		border: 1px solid ${theme.border};
		background: ${theme.background};
		border-radius: ${theme.rounded};
		height: fit-content;
		max-width: 340px;
		padding: .6rem;
		z-index: 9999;
		width: 100%;

		.${style_key}-content {
			display: flex;
			flex-direction: column;
			gap: 0.6rem;

			.${style_key}-field {
				border-radius: calc(${theme.rounded} - 7.5px);
				border: 1px solid ${theme.border};
				background: ${theme.background};
				color: ${theme.primary};
    			padding-right: .75rem;
				padding-left: .75rem;
				height: 2.5rem;
				width: 100%;

				&::placeholder {
					color: ${theme.primary_muted};
				}

				&:focus {
					border-color: ${theme.brand};
				}
			}

			.${style_key}-textarea {
    			padding-bottom:	.5rem;
        		line-height: 1.25rem;
				font-size: .875rem;
				padding-top: .5rem;
			    max-height: 12rem;
				min-height: 5rem;
				resize: vertical;
			}

			.${style_key}-textarea-count {
				color: ${theme.primary_muted};
				margin-top: -.2rem;
    			line-height: 1rem;
				text-align: right;
				font-size: .75rem;
			}
		}
		
		.${style_key}-footer {
			display: flex;
			justify-content: flex-end;
			margin-top: 0.6rem;
			gap: .4rem;

			.${style_key}-button {
				border-radius: calc(${theme.rounded} - 7.5px);
				background: ${theme.brand};
				color: ${theme.background};
    			padding-bottom: .5rem;
    			padding-right: .75rem;
				padding-left: .75rem;
			    padding-top: .5rem;
				font-size: .75rem;
    			line-height: 1rem;
			    font-weight: 500;
				cursor: pointer;

				&:hover {
					opacity: .8;
				}

				&:disabled {
					cursor: not-allowed;
					opacity:.5;
				}
			}
		}
	}
`;

const Popover = ({ projectId, theme = 'dark', customTheme, user, trigger, align }: Props) => {
	const service = useFeedInsight(projectId);

	const [position, setPosition] = useState<{ top?: number; left?: number; transform: string; opacity: number }>({ transform: 'translate(0, 0)', opacity: 0 });
	const [isStylesLoaded, setIsStylesLoaded] = useState<boolean>(false);
	const [opened, setOpened] = useState<boolean>(false);
	const triggerRef = useRef<HTMLSpanElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [fields, setFields] = useState({
		email: user?.email || '',
		name: user?.name || '',
		content: ''
	});

	const validateForm = () => {
		if (!user?.email && !fields.email) return false;
		if (!user?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return false;
		if (!user?.name && !fields.name) return false;
		if (!fields.content || fields.content.length > 500 || fields.content.length < 10) return false;
		return true;
	};

	const handleSubmit = async () => {
		if (service.processing) return;

		try {
			await service.submit({
				content: fields.content,
				user: {
					email: fields.email,
					name: fields.name
				}
			});
			setFields({ email: '', name: '', content: '' });
			setOpened(false);
		} catch (error) {
			alert('Something went wrong');
		}
	};

	const calculatePosition = useCallback(() => {
		if (!triggerRef.current || !popoverRef.current) return;

		const triggerRect = triggerRef.current.getBoundingClientRect();
		const popoverRect = popoverRef.current.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Calculate available space in each direction
		const spaceAbove = triggerRect.top;
		const spaceBelow = viewportHeight - triggerRect.bottom;
		const spaceLeft = triggerRect.left;
		const spaceRight = viewportWidth - triggerRect.right;

		const spaces = [
			{ dir: 'top', space: spaceAbove },
			{ dir: 'bottom', space: spaceBelow },
			{ dir: 'left', space: spaceLeft },
			{ dir: 'right', space: spaceRight }
		].sort((a, b) => b.space - a.space);

		// Find the direction with most space or use manual align if specified
		let bestDirection = align || spaces[0].dir;

		// Check if manual position has enough space, if not find best alternative
		if (align) {
			const minSpace = 10;
			const hasSpace = {
				top: spaceAbove >= popoverRect.height + minSpace,
				bottom: spaceBelow >= popoverRect.height + minSpace,
				left: spaceLeft >= popoverRect.width + minSpace,
				right: spaceRight >= popoverRect.width + minSpace
			};

			if (!hasSpace[align as keyof typeof hasSpace]) {
				const spaces = [
					{ dir: 'top', space: spaceAbove },
					{ dir: 'bottom', space: spaceBelow },
					{ dir: 'left', space: spaceLeft },
					{ dir: 'right', space: spaceRight }
				].sort((a, b) => b.space - a.space);
				bestDirection = spaces[0].dir;
			}
		}

		let newPosition = { top: 0, left: 0, transform: '', opacity: 1 };
		const spaceBelowTrigger = 40;

		switch (bestDirection) {
			case 'top':
				newPosition = {
					top: triggerRect.top - popoverRect.height - 25,
					left: triggerRect.left + (triggerRect.width - popoverRect.width) / 2,
					transform: 'translateY(25px)',
					opacity: 1
				};
				break;
			case 'bottom':
				newPosition = {
					top: triggerRect.bottom + spaceBelowTrigger,
					left: triggerRect.left + (triggerRect.width - popoverRect.width) / 2,
					transform: 'translateY(-25px)',
					opacity: 1
				};
				break;
			case 'left':
				newPosition = {
					top: triggerRect.top + (triggerRect.height - popoverRect.height) / 2,
					left: triggerRect.left - popoverRect.width - 25,
					transform: 'translateX(25px)',
					opacity: 1
				};
				break;
			case 'right':
				newPosition = {
					top: triggerRect.top + (triggerRect.height - popoverRect.height) / 2,
					left: triggerRect.right + spaceBelowTrigger,
					transform: 'translateX(-25px)',
					opacity: 1
				};
				break;
		}

		// Adjust position to keep popover within viewport
		if (newPosition.left < 10) newPosition.left = 10;
		if (newPosition.top < 10) newPosition.top = 10;
		if (newPosition.left + popoverRect.width > viewportWidth - 10) {
			newPosition.left = viewportWidth - popoverRect.width - 10;
		}
		if (newPosition.top + popoverRect.height > viewportHeight - 10) {
			newPosition.top = viewportHeight - popoverRect.height - 10;
		}

		setPosition(newPosition);
	}, []);

	useEffect(() => {
		if (opened) {
			requestAnimationFrame(() => {
				calculatePosition();
			});
			calculatePosition();
			window.addEventListener('resize', calculatePosition);
			window.addEventListener('scroll', calculatePosition);

			const handleClickOutside = (event: MouseEvent) => {
				if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
					setOpened(false);
				}
			};

			document.addEventListener('mousedown', handleClickOutside);

			return () => {
				window.removeEventListener('resize', calculatePosition);
				window.removeEventListener('scroll', calculatePosition);
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [opened, calculatePosition]);

	useEffect(() => {
		setIsStylesLoaded(false);
		let style = document.querySelector('style[data-feedinsight="widget"]');

		if (!style) {
			style = document.createElement('style');
			style.setAttribute('data-feedinsight', 'widget');
			style.setAttribute('data-version', packageJson.version);
			document.head.appendChild(style);
		}

		const config = defaultThemeConfig({
			dark: customTheme?.dark || {},
			light: customTheme?.light || {}
		});
		style.innerHTML += Style(config[theme]);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setIsStylesLoaded(true);
			});
		});
	}, [theme, customTheme]);

	return (
		<Fragment>
			<span ref={triggerRef} onClick={() => setOpened(true)}>
				{trigger}
			</span>

			{isStylesLoaded && (
				<div
					ref={popoverRef}
					className={style_key}
					style={{
						position: 'fixed',
						transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
						pointerEvents: opened ? 'auto' : 'none',
						transform: position.transform,
						opacity: opened ? 1 : 0,
						left: position.left,
						top: position.top
					}}
				>
					<div className={`${style_key}-content`}>
						{!user?.name && (
							<div>
								<input type="text" className={`${style_key}-field`} placeholder="Name" onChange={(e) => setFields((prev) => ({ ...prev, name: e.target.value }))} value={fields.name} />
							</div>
						)}

						{!user?.email && (
							<div>
								<input
									onChange={(e) => setFields((prev) => ({ ...prev, email: e.target.value }))}
									className={`${style_key}-field`}
									placeholder="Email address"
									value={fields.email}
									type="email"
								/>
							</div>
						)}

						<div>
							<textarea
								onChange={(e) => setFields((prev) => ({ ...prev, content: e.target.value }))}
								className={`${style_key}-field ${style_key}-textarea`}
								placeholder="Your feedback..."
								value={fields.content}
							/>
							<div className={`${style_key}-textarea-count ${fields.content.length > 500 ? `${style_key}-textarea-count-error` : ''}`}>{fields.content.length}/500</div>
						</div>
					</div>

					<div className={`${style_key}-footer`}>
						<button className={`${style_key}-button`} disabled={!validateForm() || (service.processing as boolean)} onClick={handleSubmit}>
							Submit
						</button>
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default Popover;
