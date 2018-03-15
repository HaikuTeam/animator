import * as Transitions from '../Transitions';

const MSPF = 16.666; // Default timestep of 16.666 milliseconds per frame

export default function preoptimizeBytecodeInPlace(
  component: any,
  builder: any,
  bytecode: any, 
  options: any,
) {
  if (bytecode.timelines) {
    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        const flexId = selector.split(':')[1];
        const matchingElement = component.findElementsByHaikuId(flexId)[0];
        console.log(matchingElement);

        for (const propertyName in bytecode.timelines[timelineName][selector]) {
          const propertyGroup = bytecode.timelines[timelineName][selector];
          const keyframeGroup = bytecode.timelines[timelineName][selector][propertyName];

          preInterpolateKeyframes(
            component,
            builder,
            timelineName,
            flexId,
            matchingElement,
            propertyName,
            propertyGroup,
            keyframeGroup,
          );
        }
      }
    }
  }
}

function preInterpolateKeyframes(
  component: any,
  builder: any,
  timelineName: string,
  flexId: string,
  matchingElement: any,
  propertyName: string,
  propertyGroup: any,
  keyframeGroup: any,
) {
  const sortedKeyframes = Transitions.sortedKeyframes(keyframeGroup);

  if (sortedKeyframes.length < 1) {
    return;
  }

  for (let i = 0; i < sortedKeyframes.length; i++) {
    const currMs = sortedKeyframes[i];
    const nextMs = sortedKeyframes[i + 1];

    // Nothing to interpolate if there is no next keyframe
    if (!nextMs) {
      break;
    }

    const currKeyframeSpec = keyframeGroup[currMs];
    const nextKeyframeSpec = keyframeGroup[nextMs];

    // Nothing to interpolate if:
    //   - no curr nor next keyframe object
    //   - no curve is defined
    if (
      !currKeyframeSpec ||
      !nextKeyframeSpec ||
      !currKeyframeSpec.curve) {
      break;
    }

    // We have to evaluate live as we execute if either bookend is an expression
    if (
      typeof currKeyframeSpec.value === 'function' ||
      typeof nextKeyframeSpec.value === 'function'
    ) {
      return;
    }

    // Going to iterate up through every time that will be rendered assuming a default timestep
    let t = currMs;
    while (t < nextMs) {
      const ms = Math.round(t);

      const computedValueForTime = builder.grabValue(
        timelineName,
        flexId,
        matchingElement,
        propertyName,
        propertyGroup,
        ms,
        component,
        false, // isPatchOperation
        false, // skipCache
        false, // clearSortedKeyframesCache
      );

      keyframeGroup[ms] = {
        value: computedValueForTime,
        // Signal to the renderer that a playback recomputation is not needed
        built: true,
      };

      t = t + MSPF;
    }

    // The curve is now expressed as a series of explicit values;
    // this has to happen after the above, because the curve is used internally
    // to determine how to do the interpolation
    delete keyframeGroup[currMs].curve;
  }
}
