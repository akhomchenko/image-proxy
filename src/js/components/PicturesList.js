import React from 'react/addons';
import Immutable from 'immutable';
import Picture from './Picture';

const {List} = Immutable;

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    pictures: React.PropTypes.instanceOf(List)
  },

  getDefaultProps() {
    return {
      pictures: List()
    };
  },

  getInitialState() {
    return this._getPicturesState(this.props.pictures);
  },

  componentWillReceiveProps(newProps) {
    this.setState(this._getPicturesState(newProps.pictures));
  },

  render() {
    return this.state.show ? this._showPictures() : this._showNothing();
  },

  _showPictures() {
    const picture = this._currentPicture();
    return (
      <div>
        <Picture picture={picture}/>
      </div>
    );
  },

  _showNothing() {
    return <p className="lead">Nothing to show...</p>;
  },

  /**
   * Returns picture to show from `pictures` list based on current `idx`.
   * Returns null if item is not available at `idx`.
   * @private
   */
  _currentPicture() {
    return this.props.pictures.get(this.state.idx, null);
  },

  /**
   * Returns new `idx` and `show` properties based on changes in `pictures` list
   * @param pictures `Immutable.List`
   * @private
   */
  _getPicturesState(pictures) {
    const isList = List.isList(pictures);
    const show = isList ? !pictures.isEmpty(): false;
    const idx = (isList ? pictures.size : 0) - 1; // -1 because size starts with 1
    return {show, idx};
  }
});
