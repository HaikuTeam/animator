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
        unselectElementWithinTime: true,
        handleUpdatedBytecode: true
      }
    },
    'haiku-serialization/src/bll/Timeline.js': {
      exclude: {
        mapVisibleFrames: true,
        mapVisibleTimes: true,
        seekToTime: true,
        seek: true,
        setCurrentFrame: true,
        setAuthoritativeFrame: true,
        updateCurrentFrame: true,
        setCurrentFrame: true,
        tryToLeftAlignTickerInVisibleFrameRange: true,
        hoverFrame: true,
        setTimelinePixelWidth: true
      }
    },
    'haiku-serialization/src/bll/Element.js': {
      exclude: {
      }
    },
    'haiku-serialization/src/bll/Row.js': {
      exclude: {
        prev: true,
        next: true,
        hover: true,
        unhover: true,
        mapVisibleKeyframes: true,
        doesTargetHostElement: true,
        deselect: true,
        rehydrate: true,
        rehydrateKeyframes: true,
        blur: true,
        hoverAndUnhoverOthers: true
      }
    },
    'haiku-serialization/src/bll/Keyframe.js': {
      exclude: {
        prev: true,
        next: true,
        hasNextKeyframe: true
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
        assertBytecode: true,
        maybeLogDiff: true
      }
    }
  }
}
