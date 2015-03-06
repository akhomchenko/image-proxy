import Reflux from 'reflux';
import {PicturesActions} from '../actions';
import Picture from '../models/picture';

export default Reflux.createStore({
  listenables: [PicturesActions],

  onAdd(url) {
    this.trigger(new Picture({url}));
  }
});
