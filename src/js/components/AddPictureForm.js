import React from 'react/addons';
import {PicturesActions} from '../actions';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin, React.addons.LinkedStateMixin],

  getInitialState() {
    return {
      imageUrl: null
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    PicturesActions.add(this.state.imageUrl);
  },

  render() {
    return (
      <div className="col-md-offset-4">
        <form className="form-inline" role="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="text" placeholder="URL" required="true"
              className="form-control" valueLink={this.linkState('imageUrl')}/>
          </div>{' '} {/* this is ugly, I know */}
          <input type="submit" value="Load!"
            className="btn btn-lg btn-primary"/>
        </form>
      </div>
    );
  }
});
