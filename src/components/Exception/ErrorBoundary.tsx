import React, {ErrorInfo} from "react";

export class ErrorBoundary extends React.Component<unknown, { [key: string]: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasError: ""
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Display fallback UI
        this.setState({ hasError: error.message });
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, info);
        console.log(error)
        console.log(info)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <i>Something went wrong. Please reload the page</i>;
        }
        return this.props.children;
    }
}
