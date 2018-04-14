module.exports = {
  modules: {
    'haiku-serialization/src/ws/Websocket.js': {
      exclude: {
        send: true,
        sendWhenConnected: true,
        sendImmediate: true,
        request: true
      },
      log: {
        not: (out) => {
          return !!out.match(/masterHeartbeat/)
        }
      }
    },
    'haiku-serialization/src/bll/ActiveComponent.js': {
      exclude: {
        setTimelineTimeValue: true,
        locateTemplateNodeByComponentId: true,
        fetchActiveBytecodeFile: true,
        buildCurrentTimelineUid: true,
        fetchRootElement: true,
        eachCoreComponentInstance: true,
        findElementByComponentId: true,
        unselectElementWithinTime: true
      }
    }
  }
}
