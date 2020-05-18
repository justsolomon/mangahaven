import React from 'react';

class ErrorBoundary extends React.Component {
	constructor() {
		super();
		this.state = {
			hasError: false
		}
	}

	componentDidCatch(error, info) {
		console.log(error);
		console.log(info);
		this.setState({ hasError: true })
	}

	render() {
		if (this.state.hasError) {
			return <h1>An error occurred</h1>
		}
		return this.props.children;
	}
}

export default ErrorBoundary;