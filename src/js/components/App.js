import React from 'react/addons';
import Reflux from 'reflux';
import Picture from './Picture';
import AddPictureForm from './AddPictureForm';
import PicturesStore from '../stores/pictures-store';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin, Reflux.connect(PicturesStore, 'pictures')],

  render() {
    const picture = this.state.pictures.last();
    return (
      <div>
        <div className="page-header">
          <AddPictureForm/>
        </div>
        <Picture picture={picture}/>
      </div>
    );
  }
});
