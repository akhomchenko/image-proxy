import React from 'react/addons';
import AddPictureForm from './AddPictureForm';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return (
      <div className="page-header">
        <AddPictureForm/>
      </div>
    );
  }
});
