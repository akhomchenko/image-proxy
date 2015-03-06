import React from 'react/addons';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return (
      <img alt="Loaded image" src={this.props.url} className="img-responsive center"/>
    );
  }
});
