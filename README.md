# FeedInsight React

This is offical React & Next.Js libraty for FeedInsight.
A lightweight and customizable React component library for collecting user feedback through elegant popover and dialog widgets.

[Check out FeedInsight's offerings](https://feedinsight.xyz/)

## Installation

```bash
npm install @feedinsight/react
```

## Components

### Popover

A floating feedback form that appears next to a trigger element.

#### Props

| Prop        | Type                                        | Required | Default | Description                           |
| ----------- | ------------------------------------------- | -------- | ------- | ------------------------------------- |
| projectId   | string                                      | Yes      | -       | Your FeedInsight project ID           |
| theme       | 'dark' \| 'light'                           | No       | 'dark'  | The color theme of the widget         |
| customTheme | { dark?: ThemeConfig, light?: ThemeConfig } | No       | -       | Custom theme configuration            |
| trigger     | React.ReactNode                             | Yes      | -       | The element that triggers the popover |
| align       | 'top' \| 'bottom' \| 'left' \| 'right'      | No       | -       | Preferred popover position            |
| user        | { email: string, name?: string }            | No       | -       | Pre-filled user information           |

#### Example

```jsx
import FeedbackWidget from '@feedinsight/react';

function App() {
	return <FeedbackWidget.Popover projectId="your-project-id" theme="dark" align="right" trigger={<button>Feedback</button>} user={{ email: 'user@example.com', name: 'John Doe' }} />;
}
```

### Dialog

A modal feedback form that appears in the center of the screen.

#### Props

| Prop        | Type                                        | Required | Default | Description                          |
| ----------- | ------------------------------------------- | -------- | ------- | ------------------------------------ |
| projectId   | string                                      | Yes      | -       | Your FeedInsight project ID          |
| theme       | 'dark' \| 'light'                           | No       | 'dark'  | The color theme of the widget        |
| customTheme | { dark?: ThemeConfig, light?: ThemeConfig } | No       | -       | Custom theme configuration           |
| trigger     | React.ReactNode                             | Yes      | -       | The element that triggers the dialog |
| user        | { email: string, name?: string }            | No       | -       | Pre-filled user information          |

#### Example

```jsx
import FeedbackWidget from '@feedinsight/react';

function App() {
	return <FeedbackWidget.Dialog projectId="your-project-id" theme="light" trigger={<button>Give Feedback</button>} user={{ email: 'user@example.com' }} />;
}
```

## Theme Customization

Both components support theme customization through the `customTheme` prop:

```jsx
const customTheme = {
	dark: {
		background: '#1a1a1a',
		primary: '#ffffff',
		primary_muted: '#a1a1aa',
		border: '#27272a',
		brand: '#3b82f6',
		rounded: '1rem'
	},
	light: {
		background: '#ffffff',
		primary: '#18181b',
		primary_muted: '#71717a',
		border: '#e4e4e7',
		brand: '#3b82f6',
		rounded: '1rem'
	}
};
```
