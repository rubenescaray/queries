import React, { Component } from 'react';
import SizeMe from 'react-sizeme';

const ComposedWidthProvider = (ComposedComponent) => {
  class ComposeWidthProvider extends Component {
    render() {
      const { width } = this.props.size;
      return <ComposedComponent {...this.props} width={width} />;
    }
  }
  return ComposeWidthProvider;
};

export default (ComposedComponent) => {
  return (
    SizeMe({
      monitorWidth: true
    })(ComposedWidthProvider(ComposedComponent))
  );
};
