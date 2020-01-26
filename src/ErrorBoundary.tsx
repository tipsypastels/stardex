import React, { Component, ReactNode, createContext } from 'react'

type Props = {
  children: ReactNode,
}

type State = {
  error: Error | undefined,
}

type ErrorContextProps = [Error | undefined, (error: Error | undefined) => void];
export const ErrorContext = createContext<ErrorContextProps>(null as any);

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    error: undefined,
  }
  
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    return (
      <ErrorContext.Provider value={[this.state.error, this.setError]}>
        {this.props.children}
      </ErrorContext.Provider>
    )
  }

  setError = (error: Error | undefined) => {
    this.setState({ error });
  }
}
