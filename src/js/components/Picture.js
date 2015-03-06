import is from 'is_js';
import React from 'react/addons';
import Immutable from 'immutable';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    image: React.PropTypes.instanceOf(Immutable.Record)
  },

  getDefaultProps() {
    return {
      image: null
    }
  },

  getInitialState() {
    return {
      show: is.existy(this.props.image)
    }
  },

  componentWillReceiveProps(newProps) {
    this.setState({
      show: is.existy(newProps.image)
    })
  },

  render() {
    return this.state.show ? this._image() : this._howTo();
  },

  _image() {
    return <img alt="Loaded image" className="img-responsive center"
      src={this.props.image.url}
    />;
  },

  _howTo() {
    return <p className="lead">Nothing to show...</p>;
  }
});
