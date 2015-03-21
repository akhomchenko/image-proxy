## CLI

use `npm start & gulp serve &` for development

use `gulp --release --production` when you are ready to deploy

## Deployment

* Checkout `deploy` branch
* Merge `master` via `git merge --squash master`
* Run `gulp --release --production`
* Commit and push to Heroku via `git push heroku deploy:master`
