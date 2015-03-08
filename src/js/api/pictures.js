import superagent from 'superagent';

const add = (url) => new Promise((resolve, reject) => {
  superagent.get('/base64')
    .query({url})
    .end((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res.body);
    });
});

export {add};
