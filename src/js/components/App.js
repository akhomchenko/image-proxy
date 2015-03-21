import React from 'react/addons';
import Reflux from 'reflux';
import PicturesList from './PicturesList';
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
        <PicturesList pictures={this.state.pictures}/>
      </div>
    );
  }
});
