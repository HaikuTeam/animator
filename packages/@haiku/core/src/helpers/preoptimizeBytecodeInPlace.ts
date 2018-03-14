import * as Transitions from '../Transitions';

export default function preoptimizeBytecodeInPlace(builder: any, bytecode: any, options: any) {
  if (bytecode.timelines) {
    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        for (const propertyName in bytecode.timelines[timelineName][selector]) {
          const keyframeGroup = bytecode.timelines[timelineName][selector][propertyName]

          preInterpolateKeyframes(
            builder,
            timelineName,
            selector,
            keyframeGroup
          );
        }
      }
    }
  }
}

function preInterpolateKeyframes(
  builder: any,
  keyframeGroup: any
) {
  

  if (sortedKeyframes.length < 1) {
    return;
  }

  for (let i = 0; i < sortedKeyframes.length; i++) {
    const currMs = sortedKeyframes[i]
    const nextMs = sortedKeyframes[i + 1]

    // Nothing to interpolate if there is no next keyframe
    if (!nextMs) {
      break;
    }

    const currKeyframeSpec = keyframeGroup[currMs];
    const nextKeyframeSpec = keyframeGroup[nextMs];

    // Nothing to interpolate if no curve is defined
    if (!currKeyframeSpec.curve) {
      break;
    }

    // We have to evaluate live as we execute if either bookend is an expression
    if (
      typeof currKeyframeSpec.value === 'function' ||
      typeof nextKeyframeSpec.value === 'function'
    ) {
      return;
    }


  }
}


ValueBuilder.prototype.grabValue = function _grabValue(
  timelineName,
  flexId,
  matchingElement,
  propertyName,
  propertiesGroup,
  timelineTime,
  haikuComponent,
  isPatchOperation,
  skipCache,
  clearSortedKeyframesCache,
)