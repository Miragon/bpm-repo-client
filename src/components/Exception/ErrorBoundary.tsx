import React, { ErrorInfo } from "react";

export class ErrorBoundary extends React.Component<unknown, { [key: string]: string }> {
    // eslint-disable-next-line
    constructor(props: any) {
        super(props);
        this.state = {
            hasError: ""
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        this.setState({ hasError: error.message });
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <i>Something went wrong. Please reload the page</i>;
        }
        return this.props.children;
    }
}
