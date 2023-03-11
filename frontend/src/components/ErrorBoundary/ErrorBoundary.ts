import React from "react";

type iProps = {
	fallback: string | JSX.Element;
	children: JSX.Element;
};

type iState = {
	hasError: boolean;
};

class ErrorBoundary extends React.Component<iProps, iState> {
	state = { hasError: false };

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static getDerivedStateFromError(error: unknown) {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		// For reporting system
		console.log({ error, errorInfo });
	}

	render() {
		if (this.state.hasError) return this.props.fallback;
		return this.props.children;
	}
}

export default ErrorBoundary;
