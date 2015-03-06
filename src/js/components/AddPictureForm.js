import React from 'react/addons';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return (
      <div className="col-md-offset-4">
        <form className="form-inline" role="form">
          <div className="form-group">
            <input type="text" placeholder="URL" required="true"
              className="form-control"/>
          </div>{' '} {/* this is ugly, I know */}
          <input type="submit" value="Load!"
            className="btn btn-lg btn-primary"/>
        </form>
      </div>
    );
  }
});
