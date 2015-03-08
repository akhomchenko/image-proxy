import React from 'react/addons';
import Reflux from 'reflux';
import Picture from './Picture';
import AddPictureForm from './AddPictureForm';
import PicturesStore from '../stores/pictures-store';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin, Reflux.connect(PicturesStore, 'picture')],

  getInitialState() {
    return {
      picture: null
    };
  },

  render() {
    return (
      <div>
        <div className="page-header">
          <AddPictureForm/>
        </div>
        <Picture image={this.state.picture}/>
      </div>
    );
  }
});
