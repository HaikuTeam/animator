# sdk-client

For client logic (e.g. ~/.haiku filesystem operations)


### Usage:

### npm install

`npm install --save git+ssh://git@github.com:HaikuTeam/sdk-client.git`  

Or to freeze at a version: (recommended if you don't like things breaking by surprise, but only if you know to manually update it when required)  

`npm install --save git+ssh://git@github.com:HaikuTeam/sdk-client.git#SPECIFIC_REF`

### Import and use

Just import as a standard js package and go to town.

```javascript
import {client} from 'haiku-sdk-client'
//...
```
### Develop

To develop the sdk:

 * npm link this project from this directory `npm link`
 * run `npm run develop`
 * in host project, run `npm link haiku-sdk-client`

 Changes will now by synced (via symlink) between this project and the host project's 'node_modules/haiku-sdk-client' directory