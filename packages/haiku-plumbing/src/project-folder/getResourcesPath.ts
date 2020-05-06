import {isMac} from 'haiku-common/lib/environments/os';
import {join} from 'path';

// TODO:
// - Ensure we are using the correct path in Windows.
// - If clean up if the route to the resources path is the same in both platforms.
// - Add a note stating why we have to do this manually
export const getResourcesPath = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (isMac()) {
    return join(process.execPath, '..', '..', '..', '..', '..', 'Resources');
  }

  return join(process.execPath, '..', '..', 'resources');
};
