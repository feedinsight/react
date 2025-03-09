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

| Prop          | Type                                        | Required | Default | Description                           |
| ------------- | ------------------------------------------- | -------- | ------- | ------------------------------------- |
| projectId     | string                                      | Yes      | -       | Your FeedInsight project ID           |
| theme         | 'dark' \| 'light'                           | No       | 'dark'  | The color theme of the widget         |
| customTheme   | { dark?: ThemeConfig, light?: ThemeConfig } | No       | -       | Custom theme configuration            |
| trigger       | React.ReactNode                             | Yes      | -       | The element that triggers the popover |
| align         | 'top' \| 'bottom' \| 'left' \| 'right'      | No       | -       | Preferred popover position            |
| user          | { email: string, name?: string }            | No       | -       | Pre-filled user information           |
| showPoweredBy | boolean                                     | No       | false   | Show "Powered by FeedInsight" link    |
| textareaPlaceholder| string                                      | No       | 'Your feedback...'| Custom textarea placeholder text      |

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

| Prop          | Type                                        | Required | Default | Description                          |
| ------------- | ------------------------------------------- | -------- | ------- | ------------------------------------ |
| projectId     | string                                      | Yes      | -       | Your FeedInsight project ID          |
| theme         | 'dark' \| 'light'                           | No       | 'dark'  | The color theme of the widget        |
| customTheme   | { dark?: ThemeConfig, light?: ThemeConfig } | No       | -       | Custom theme configuration           |
| trigger       | React.ReactNode                             | Yes      | -       | The element that triggers the dialog |
| user          | { email: string, name?: string }            | No       | -       | Pre-filled user information          |
| showPoweredBy | boolean                                     | No       | false   | Show "Powered by FeedInsight" link   |
| textareaPlaceholder| string                                      | No       | 'Your feedback...'| Custom textarea placeholder text     |

#### Example

```jsx
import FeedbackWidget from '@feedinsight/react';

function App() {
	return <FeedbackWidget.Dialog projectId="your-project-id" theme="light" trigger={<button>Give Feedback</button>} user={{ email: 'user@example.com' }} />;
}
```

## Theme

You can customize the theme of the widget by passing a customTheme prop. The customTheme prop should be an object with two properties: dark and light. Each property should be an object with the following keys:

```jsx
const defaultThemes = {
	dark: {
		primary_muted: '#a8a29e',
		background: '#0c0a09',
		primary: '#fafaf9',
		border: '#292524',
		brand: '#ea580c',
		error: '#f43f5e',
		rounded: '1rem'
	},
	light: {
		primary_muted: '#0c0a09',
		background: '#ffffff',
		primary: '#0c0a09',
		border: '#e7e5e4',
		brand: '#ea580c',
		error: '#f43f5e',
		rounded: '1rem'
	}
};
```
