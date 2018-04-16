module.exports = {
  modules: {
    'haiku-plumbing/lib/Master.js': {
      exclude: {
        masterHeartbeat: true,
        handleMethodMessage: true,
        callMethodWithMessage: true,
        logMethodMessage: true
      }
    },
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
    },
    'haiku-serialization/src/bll/Project.js': {
      exclude: {
        findActiveComponentBySceneName: true,
        masterHeartbeat: true
      }
    },
    'haiku-serialization/src/bll/ModuleWrapper.js': {
      exclude: {
        fetchInMemoryExport: true
      }
    },
    'haiku-serialization/src/bll/File.js': {
      exclude: {
        assertContents: true,
        assertBytecode: true
      }
    }
  }
}
