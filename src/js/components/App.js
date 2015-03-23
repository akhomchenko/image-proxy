import React from 'react/addons';
import Reflux from 'reflux';
import Gallery from './Gallery';
import AddPictureForm from './AddPictureForm';
import PicturesStore from '../stores/pictures-store';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin, Reflux.connect(PicturesStore, 'pictures')],

  render() {
    return (
      <div>
        <div className="page-header">
          <AddPictureForm/>
        </div>
        <Gallery pictures={this.state.pictures}/>
      </div>
    );
  }
});
