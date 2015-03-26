import is from 'is_js';
import cx from 'classnames';
import React from 'react/addons';
import Immutable from 'immutable';

const propTypes = React.PropTypes;

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    picture: propTypes.instanceOf(Immutable.Record),
    classes: propTypes.oneOfType([
      propTypes.string,
      propTypes.object,
      propTypes.arrayOf(propTypes.string),
      propTypes.arrayOf(propTypes.object)
    ])
  },

  getDefaultProps() {
    return {
      picture: null,
      classes: 'img-responsive'
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
    const imgClasses = cx(this.props.classes);
    return (
      <img alt="Loaded image" className={imgClasses} src={this.props.picture.base64}/>
    );
  }
});
