import cx from 'classnames';
import React from 'react/addons';
import Immutable from 'immutable';
import Picture from './Picture';
import Thumbnails from './Thumbnails';

const {List, is} = Immutable;
const {PureRenderMixin} = React.addons;

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    pictures: React.PropTypes.instanceOf(List).isRequired
  },

  getDefaultProps() {
    return {
      pictures: List()
    };
  },

  getInitialState() {
    return this._getListState(this.props.pictures);
  },

  componentWillReceiveProps(newProps) {
    this.setState(this._getListState(newProps.pictures));
  },

  render() {
    return this.state.show ? this._showPictures() : this._showNothing();
  },

  _showPictures() {
    const pictures = this.props.pictures;
    const picture = this._currentPicture();
    const previousClasses = cx({disabled: is(picture, pictures.first())});
    const nextClasses = cx({disabled: is(picture, pictures.last())});

    return (
      <div>
        <Picture picture={picture} classes='img-responsive center-block main-picture'/>
        <nav>
          <ul className="pager">
            <li className={previousClasses}><a href="#previous" onClick={this._handlePreviousClick}>Prev</a></li>
            {' '}
            <li className={nextClasses}><a href="#next" onClick={this._handleNextClick}>Next</a></li>
          </ul>
        </nav>
        <hr/>
        <Thumbnails pictures={pictures} current={picture}/>
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
  _getListState(pictures) {
    const isList = List.isList(pictures);

    const show = isList ? !pictures.isEmpty() : false;
    const idx = (isList ? pictures.size : 0) - 1; // -1 because size starts with 1

    return {show, idx};
  },

  _handlePreviousClick(e) {
    e.preventDefault();
    const prevIdx = this.state.idx;
    const idx = prevIdx <= 1 ? 0 : prevIdx - 1;
    this.setState({idx});
  },

  _handleNextClick(e) {
    e.preventDefault();
    const lastAvailableIdx =  this.props.pictures.size - 1;
    const prevIdx = this.state.idx;
    const idx = prevIdx >= (lastAvailableIdx) ? lastAvailableIdx : prevIdx + 1;
    this.setState({idx});
  }
});
