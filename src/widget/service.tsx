'use client';

import { useState } from 'react';

export const useFeedInsight = (projectId: string) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [processing, setProcessing] = useState<Boolean>(false);

	const submit = async (params: { content: string; user: { email: string; name?: string } }) => {
		try {
			setProcessing(true);
			setErrorMessage(null);

			const metadata = {
				currentPage: window.location.href,
				device: /Mobi|Android|iPhone|iPad|Windows Phone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
				browser: (() => {
					const ua = navigator.userAgent;
					if (ua.includes('Firefox/')) return `Firefox ${ua.match(/Firefox\/(\d+)/)?.[1]}`;
					if (ua.includes('Chrome/')) return `Chrome ${ua.match(/Chrome\/(\d+)/)?.[1]}`;
					if (ua.includes('Safari/')) return `Safari ${ua.match(/Version\/(\d+)/)?.[1]}`;
					if (ua.includes('Edge/')) return `Edge ${ua.match(/Edge\/(\d+)/)?.[1]}`;
					return 'Unknown';
				})(),
				os: (() => {
					const ua = navigator.userAgent;
					if (ua.includes('Windows')) return 'Windows';
					if (ua.includes('Mac OS')) return 'MacOS';
					if (ua.includes('Linux')) return 'Linux';
					if (ua.includes('Android')) return 'Android';
					if (ua.includes('iOS')) return 'iOS';
					return 'Unknown';
				})(),
				screen: {
					width: window.screen.width,
					height: window.screen.height,
					pixelRatio: window.devicePixelRatio
				}
			};

			await fetch('https://feedinsight.xyz/api/feedback', { method: 'POST', body: JSON.stringify({ projectId, metadata, ...params }) });

			return true;
		} catch (error) {
			setErrorMessage((error as Error).message);
		} finally {
			setProcessing(false);
		}
	};

	return { submit, processing, errorMessage } as const;
};
