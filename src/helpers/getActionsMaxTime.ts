export default (
  name: string,
  actions,
  mspf: number,
): number => {
  let max = 0;

  if (!actions) {
    return max;
  }

  for (const selector in actions) {
    for (const eventName in actions[selector]) {
      const [
        _, // always "timeline"
        timelineNameOfListener,
        frameKeyOfListener,
      ] = eventName.split(':');

      // Skip non-frame-listener events
      if (!timelineNameOfListener || !frameKeyOfListener) {
        continue;
      }

      // Skip frame listeners for timelines other than us
      if (timelineNameOfListener !== name) {
        continue;
      }

      const frameOfListener = Number(frameKeyOfListener);
      const timeOfListener = frameOfListener * mspf;

      if (timeOfListener > max) {
        max = timeOfListener;
      }
    }
  }

  return max;
};
