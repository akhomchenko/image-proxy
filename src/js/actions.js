import Reflux from 'reflux';
import {add as addPicture} from './api/pictures';

const PicturesActions = Reflux.createActions({
  add: {asyncResult: true}
});

PicturesActions.add.listenAndPromise(addPicture);

export {PicturesActions};
