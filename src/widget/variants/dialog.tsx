'use client';

import { themeConfig as defaultThemeConfig } from '../theme';
import React, { Fragment, useEffect, useState } from 'react';
import packageJson from '../../../package.json';
import { useFeedInsight } from '../service';
import type { ThemeConfig } from '../theme';

export interface Props {
	projectId: string;
	theme?: 'dark' | 'light';
	customTheme?: {
		dark?: Partial<ThemeConfig>;
		light?: Partial<ThemeConfig>;
	};
	trigger: React.ReactNode;
	showPoweredBy?: boolean;
	textareaPlaceholder?: string;
	user?: {
		email: string;
		name?: string;
	};
}

const style_key = 'feedinsight-widget-dialog';

const Style = (theme: ThemeConfig) => `
	.${style_key}-overlay {
		position: fixed;
		display: flex;
		transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: rgba(0,0,0,.8);
		backdrop-filter: blur(2px);
		justify-content: center;
		align-items: center;
		visibility: hidden;
		z-index: 9999;
		opacity: 0;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;

		&.${style_key}-open {
			visibility: visible;
			opacity: 1;
		}
	}

	.${style_key} * {
		box-sizing: border-box;
		font-family: inherit;
		outline: none;
		border: none;
		padding: 0;
		margin: 0;
	}

	.${style_key} {
		position: relative;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		transform: scale(0.95) translateY(10px);
		border: 1px solid ${theme.border};
		border-radius: ${theme.rounded};
		background: ${theme.background};
		height: fit-content;
		max-width: 450px;
		padding: 1.5rem;
		z-index: 9999;
		width: 100%;
		opacity: 0;

		&.${style_key}-open {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
		
		.${style_key}-header {
			display: flex;
			flex-direction: column;
			gap: .4rem;

			.${style_key}-heading {
				color: ${theme.primary};
				font-size: 1.125rem;
				font-weight: 600;
				line-height: 1;
			}
			
			.${style_key}-subheading {
				color: ${theme.primary_muted};
				line-height: 1.25rem;
				font-size: .875rem;
				text-align: left;
				max-width: 80%;
			}
		}

		.${style_key}-content {
			display: flex;
			flex-direction: column;
			margin-top: 1.5rem;
			gap: 1.3rem;

			.${style_key}-field {
				border-radius: calc(${theme.rounded} - 7.5px);
				border: 1px solid ${theme.border};
				background: ${theme.background};
				color: ${theme.primary};
    			padding-right: .75rem;
				padding-left: .75rem;
				font-size: .875rem;
				height: 2.5rem;
				width: 100%;

				&::placeholder {
					color: ${theme.primary_muted};
					font-size: .875rem;
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
				margin-top: -.80rem;
    			line-height: 1rem;
				text-align: right;
				font-size: .75rem;
			}
		}

		.${style_key}-error {
			color: ${theme.error};
			margin-top: -.80rem;
			font-size: .75rem;
			line-height: 1rem;
			text-align: left;
		}
		
		.${style_key}-footer {
			display: flex;
			postion: relative;
			justify-content: flex-end;
			align-items: center;
			margin-top: 1.5rem;
			gap: .8rem;

			.${style_key}-poweredby {
				position: absolute;
				color: ${theme.primary_muted};
				font-family: inherit;
				font-size: .78rem;
				font-weight: 400;
				left: 1.5rem;

				a {
					text-decoration: none;
					color: ${theme.brand};
					font-family: inherit;
					font-size: .78rem;
					font-weight: 400;
				}
			}

			.${style_key}-button {
				border-radius: calc(${theme.rounded} - 7.5px);
				background: ${theme.brand};
				color: ${theme.background};
    			padding-bottom: .5rem;
    			line-height: 1.25rem;
    			padding-right: 1rem;
				font-size: .875rem;
			    padding-top: .5rem;
				padding-left: 1rem;
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

			.${style_key}-button-outline {
				border: 1px solid ${theme.border};
				background: transparent;
				color: ${theme.primary};

				&:hover {
					background: ${theme.border};
				}
			}
		}
	}
`;

const Dialog = ({ projectId, theme = 'dark', customTheme, user, trigger, showPoweredBy, textareaPlaceholder = 'Your feedback...' }: Props) => {
	const service = useFeedInsight(projectId);

	const getDomainRef = () => {
		if (typeof window === 'undefined') return '';
		return window.location.hostname.replace('www.', '');
	};

	const [isStylesLoaded, setIsStylesLoaded] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [opened, setOpened] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
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
		try {
			setLoading(true);
			setError(false);

			await service.submit({ content: fields.content, user: { email: fields.email, name: fields.name } });
			setFields({ email: '', name: '', content: '' });

			setOpened(false);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

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
			<span onClick={() => setOpened(true)}>{trigger}</span>

			{isStylesLoaded && (
				<div className={`${style_key}-overlay ${opened ? `${style_key}-open` : ''}`} onClick={() => setOpened(false)}>
					<div className={`${style_key} ${opened ? `${style_key}-open` : ''}`} onClick={(e) => e.stopPropagation()}>
						<div className={`${style_key}-header`}>
							<h2 className={`${style_key}-heading`}>Feedback</h2>
							<p className={`${style_key}-subheading`}>Share your thoughts and help us improve</p>
						</div>

						<div className={`${style_key}-content`}>
							{!user?.name && (
								<input type="text" className={`${style_key}-field`} placeholder="Name" onChange={(e) => setFields((prev) => ({ ...prev, name: e.target.value }))} value={fields.name} />
							)}

							{!user?.email && (
								<input
									onChange={(e) => setFields((prev) => ({ ...prev, email: e.target.value }))}
									className={`${style_key}-field`}
									placeholder="Email address"
									value={fields.email}
									type="email"
								/>
							)}

							<textarea
								onChange={(e) => setFields((prev) => ({ ...prev, content: e.target.value }))}
								className={`${style_key}-field ${style_key}-textarea`}
								placeholder={textareaPlaceholder}
								value={fields.content}
							/>

							<div className={`${style_key}-textarea-count`}>{fields.content.length}/500</div>
						</div>

						{error && <div className={`${style_key}-error`}>Oops! Please try again</div>}

						<div className={`${style_key}-footer`}>
							{showPoweredBy && (
								<div className={`${style_key}-poweredby`}>
									Powered by{' '}
									<a href={`https://feedinsight.xyz?ref=${getDomainRef()}`} target="_blank">
										FeedInsight
									</a>
								</div>
							)}

							<button onClick={() => setOpened(false)} className={`${style_key}-button ${style_key}-button-outline`}>
								Cancel
							</button>
							<button className={`${style_key}-button`} disabled={!validateForm() || loading} onClick={handleSubmit}>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default Dialog;
