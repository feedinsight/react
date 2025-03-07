'use client';

export const useFeedInsight = (projectId: string) => {
	const submit = async (params: { content: string; user: { email: string; name?: string } }) =>
		new Promise((resolve, reject) => {
			const metadata = {
				browser: (() => {
					const ua = navigator.userAgent;
					if (ua.includes('Firefox/')) {
						const version = ua.match(/Firefox\/([\d.]+)/)?.[1];
						return `Firefox ${version}`;
					}
					if (ua.includes('Chrome/')) {
						const version = ua.match(/Chrome\/([\d.]+)/)?.[1];
						return `Chrome ${version}`;
					}
					if (ua.includes('Safari/')) {
						const version = ua.match(/Version\/([\d.]+)/)?.[1];
						return `Safari ${version}`;
					}
					if (ua.includes('Edge/')) {
						const version = ua.match(/Edg\/([\d.]+)/)?.[1];
						return `Edge ${version}`;
					}
					return 'Unknown';
				})(),
				os: (() => {
					const ua = navigator.userAgent;
					if (ua.includes('Windows')) {
						const version = ua.match(/Windows NT ([\d.]+)/)?.[1];
						const windowsVersions: Record<string, string> = {
							'10.0': 'Windows 11/10',
							'6.3': 'Windows 8.1',
							'6.2': 'Windows 8',
							'6.1': 'Windows 7',
							'6.0': 'Windows Vista'
						};
						return version && version in windowsVersions ? windowsVersions[version] : 'Windows';
					}
					if (ua.includes('Mac OS')) {
						const version = ua.match(/Mac OS X ([\d._]+)/)?.[1]?.replace(/_/g, '.');
						return version ? `macOS ${version}` : 'macOS';
					}
					if (ua.includes('Linux')) return 'Linux';
					if (ua.includes('Android')) {
						const version = ua.match(/Android ([\d.]+)/)?.[1];
						return version ? `Android ${version}` : 'Android';
					}
					if (ua.includes('iOS')) {
						const version = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.');
						return version ? `iOS ${version}` : 'iOS';
					}
					return 'Unknown';
				})()
			};

			fetch('https://feedinsight.xyz/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, metadata, ...params }) })
				.then(resolve)
				.catch(reject);
		});

	return { submit } as const;
};
