import Reflux from 'reflux';
import {PicturesActions} from '../actions';
import Picture from '../models/picture';

export default Reflux.createStore({
  listenables: [PicturesActions],

  onAddCompleted(result) {
    this.trigger(new Picture(result));
  },

  onAddFailed() {

  }
});
