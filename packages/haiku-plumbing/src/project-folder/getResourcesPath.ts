import {isMac} from 'haiku-common/lib/environments/os';
import {join} from 'path';

// TODO:
// - Ensure we are using the correct path in Windows.
// - If clean up if the route to the resources path is the same in both platforms.
// - Add a note stating why we have to do this manually

/**
 * Returns the path to the resources directory. You can define resources in the
 * root `package.json` file under `extraResources`
 *
 * FIXME: according to the docs, Electron provides a process-level variable
 * (`process.resourcesPath`) with this value, but it's `null` in
 * `haiku-plumbing` for some reason I couldn't figure out.
 */
export const getResourcesPath = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (isMac()) {
    return join(process.execPath, '..', '..', '..', '..', '..', 'Resources');
  }

  return join(process.execPath, '..', 'resources');
};
