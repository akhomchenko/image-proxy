/* global fetch */
import is from 'is_js';

const add = (url) => new Promise((resolve, reject) =>
  fetch(`/base64?url=${url}`)
    .then(res => {
      if (is.not.within(res.status, 199, 299)) {
        res.json().then(reject);
      } else {
        resolve(res.json());
      }
    }));

export {add};
