import { Component, type ReactNode } from 'react'

type SpaghettiEditorBoundaryProps = {
  children: ReactNode
}

type SpaghettiEditorBoundaryState = {
  hasError: boolean
  message: string
}

export class SpaghettiEditorBoundary extends Component<
  SpaghettiEditorBoundaryProps,
  SpaghettiEditorBoundaryState
> {
  public state: SpaghettiEditorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: unknown): SpaghettiEditorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown Spaghetti editor error.',
    }
  }

  componentDidCatch(error: unknown) {
    console.error('Spaghetti editor render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="V15Error">
          Spaghetti editor crashed: {this.state.message}
        </div>
      )
    }
    return this.props.children
  }
}
