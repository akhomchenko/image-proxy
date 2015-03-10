import is from 'is_js';
import React from 'react/addons';
import Reflux from 'reflux';
import {PicturesActions} from '../actions';

export default React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    React.addons.LinkedStateMixin,
    Reflux.listenTo(PicturesActions.add.failed, 'onAddFailed'),
    Reflux.listenTo(PicturesActions.add.completed, 'onAddCompleted')
  ],

  getInitialState() {
    return {imageUrl: null, errorMessage: null};
  },

  handleSubmit(e) {
    e.preventDefault();
    PicturesActions.add(this.state.imageUrl);
  },

  onAddCompleted() {
    this.setState({errorMessage: null});
  },

  onAddFailed(error) {
    const errorMessage = (error || {}).error || 'without any reason';
    this.setState({errorMessage});
  },

  render() {
    return (
      <div className="row">
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
        <br/>
      {is.existy(this.state.errorMessage) ?
        <div className="alert alert-danger" role="alert">
          <strong>Failed to request image: {this.state.errorMessage}</strong>
        </div> : null}
      </div>
    );
  }
});
