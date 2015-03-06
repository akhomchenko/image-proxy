import React from 'react/addons';
import Picture from './Picture';
import AddPictureForm from './AddPictureForm';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return (
      <div>
        <div className="page-header">
        <AddPictureForm/>
      </div>
      <Picture url='http://placehold.it/400x400'/>
      </div>
    );
  }
});
