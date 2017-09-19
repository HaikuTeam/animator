import _getTimelineMaxTime from '@haiku/player/lib/helpers/getTimelineMaxTime'

// A cached version of the above that stores the max value so we
// can avoid doing what is a rather expensive calculation every frame.
// We also need to clear this cache; see `clearInMemoryBytecodeCaches`
export default function getTimelineMaxTime (timelineDescriptor) {
  if (timelineDescriptor.__max !== undefined) {
    return timelineDescriptor.__max
  }

  timelineDescriptor.__max = _getTimelineMaxTime(timelineDescriptor)

  return timelineDescriptor.__max
}
