import is from 'is_js';
import cx from 'classnames';
import Reflux from 'reflux';
import React from 'react/addons';
import {PicturesActions} from '../actions';

const {PureRenderMixin, LinkedStateMixin} = React.addons;
const {listenTo} = Reflux;

export default React.createClass({
  mixins: [
    PureRenderMixin, LinkedStateMixin,
    listenTo(PicturesActions.add.failed, 'onAddFailed'),
    listenTo(PicturesActions.add.completed, 'onAddCompleted')
  ],

  getInitialState() {
    return {imageUrl: null, errorMessage: null, isLoading: false};
  },

  handleSubmit(e) {
    e.preventDefault();
    PicturesActions.add(this.state.imageUrl);
    this.setState({isLoading: true});
  },

  onAddCompleted() {
    this.setState({imageUrl: null, errorMessage: null, isLoading: false});
  },

  onAddFailed(error) {
    const errorMessage = (error || {}).error || 'without any reason';
    this.setState({errorMessage, isLoading: false});
  },

  render() {
    const isLoading = this.state.isLoading;
    const loadButtonText = isLoading ? 'Loading...' : 'Load!';
    const loadButtonStyles = cx('btn btn-lg btn-primary', {disabled: isLoading});

    return (
      <div className="row">
        <div className="col-md-offset-4">
          <form className="form-inline" role="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" placeholder="URL" required="true"
                className="form-control" valueLink={this.linkState('imageUrl')}/>
            </div>{' '} {/* this is ugly, I know */}
            <input type="submit" value={loadButtonText} className={loadButtonStyles}/>
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
