import cx from 'classnames';
import React from 'react/addons';
import Picture from './Picture';
import Immutable from 'immutable';

const {is, List, Record} = Immutable;
const propTypes = React.PropTypes;
const {PureRenderMixin} = React.addons;

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    pictures: propTypes.instanceOf(List).isRequired,
    current: propTypes.instanceOf(Record)
  },

  getDefaultProps() {
    return {
      pictures: List()
    };
  },

  render() {
    const {current, pictures} = this.props;
    const currentIdx = pictures.indexOf(current);

    const isFirst = is(pictures.first(), current);

    const previous = isFirst ? null : pictures.get(currentIdx - 1);
    const next = is(pictures.last(), current) ? null : pictures.get(currentIdx + 1);

    const centerDivClasses = cx('col-md-4 col-sm-6', {'.col-md-offset-4': isFirst});
    return (
      <div className='row thumbnails hidden-xs'>
        <div className='col-md-4 col-sm-6'>
          <Picture picture={previous} classes='img-responsive img-thumbnail center-block'/>
        </div>
        <div className={centerDivClasses}>
          <Picture picture={current} classes='img-responsive img-thumbnail center-block'/>
        </div>
        <div className='col-md-4 col-sm-6'>
          <Picture picture={next} classes='img-responsive img-thumbnail center-block'/>
        </div>
      </div>
    );
  }
});
