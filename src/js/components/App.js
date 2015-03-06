import React from 'react/addons';
import Picture from './Picture';
import AddPictureForm from './AddPictureForm';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState() {
    return {
      image: null
    }
  },

  render() {
    return (
      <div>
        <div className="page-header">
        <AddPictureForm/>
      </div>
      <Picture image={this.state.image}/>
      </div>
    );
  }
});
