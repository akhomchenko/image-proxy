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
      show: !!this.props.image
    }
  },

  render() {
    const result = this.state.show
      ? <img alt="Loaded image" className="img-responsive center"
          src={this.props.image.url}
        />
      : false;
    return (result);
  }
});
