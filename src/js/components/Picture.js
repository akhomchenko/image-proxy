import is from 'is_js';
import React from 'react/addons';
import Immutable from 'immutable';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    picture: React.PropTypes.instanceOf(Immutable.Record)
  },

  getDefaultProps() {
    return {
      picture: null
    };
  },

  getInitialState() {
    return {
      show: is.existy(this.props.picture)
    };
  },

  componentWillReceiveProps(newProps) {
    this.setState({
      show: is.existy(newProps.picture)
    });
  },

  render() {
    return this.state.show ? this._image() : false;
  },

  _image() {
    return <img alt="Loaded image" className="img-responsive center-block"
      src={this.props.picture.base64}
    />;
  }
});
