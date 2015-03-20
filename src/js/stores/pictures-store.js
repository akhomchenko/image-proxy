import Reflux from 'reflux';
import Immutable from 'immutable';
import {PicturesActions} from '../actions';
import Picture from '../models/picture';

export default Reflux.createStore({
  listenables: [PicturesActions],

  init() {
    this.pictures = Immutable.List();
  },

  getInitialState() {
    return this.pictures;
  },

  onAddCompleted(result) {
    this.pictures = this.pictures.push(new Picture(result));
    this.trigger(this.pictures);
  }
});
