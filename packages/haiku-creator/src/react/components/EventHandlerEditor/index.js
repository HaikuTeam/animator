/* global monaco */
import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import ElementTitle from './ElementTitle';
import Editor from './Editor';
import EditorActions from './EditorActions';
import EventSelector from './EventSelector';
import HandlerManager from './HandlerManager';
import {
  ModalWrapper,
  ModalHeader,
  ModalFooter,
} from 'haiku-ui-common/lib/react/Modal';
import {RevealPanel} from 'haiku-ui-common/lib/react/RevealPanel';
import {
  EDITOR_WIDTH,
  EVALUATOR_STATES,
  AUTOCOMPLETION_ITEMS,
} from './constants';

const STYLES = {
  container: {
    width: EDITOR_WIDTH,
    minHeight: '230px',
    paddingRight: 0,
    position: 'fixed',
    top: '110px',
    left: 'calc(50% + 150px)',
    transform: 'translateX(-50%)',
    margin: 0,
    right: 0,
  },
  outer: {
    position: 'relative',
    overflow: 'hidden',
  },
  editorsWrapper: {
    width: '100%',
    padding: '23px 0 23px 18px',
  },
  frameEditorWrapper: {
    padding: '23px 23px 45px 18px',
  },
  tagWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingRight: '25px',
  },
  tag: {
    padding: '2px 15px',
    height: '25px',
    marginRight: '15px',
    marginBottom: '15px',
    background: Palette.BLUE,
    borderRadius: '4px',
    textTransform: 'uppercase',
    color: Palette.SUNSTONE,
    cursor: 'pointer',
    userSelect: 'none',
  },
  allOptions: {
    cursor: 'pointer',
    userSelect: 'none',
    display: 'inline-block',
    marginBottom: '15px',
  },
};

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

class EventHandlerEditor extends React.PureComponent {
  constructor (props) {
    super(props);

    this.handlerManager = null;
    this.completionDisposer = null;

    this.setupMonaco();

    this.state = {
      editorWithErrors: false,
      currentEvent: null,
    };
  }

  setupMonaco () {
    // Absurdely, monaco doesn't provide an importable module, so we have
    // to do some trickery to load it (see index.html), and sometimes may not
    // be already available, hence this weird logic.
    if (typeof monaco === 'undefined') {
      return setTimeout(() => {
        this.setupMonaco();
      }, 100);
    }

    monaco.editor.defineTheme('haiku-actions', {
      base: 'vs-dark',
      inherit: true,
      // `rules` requires colors without the leading '#' ¯\_(ツ)_/¯
      rules: [{backgroundColor: Palette.SPECIAL_COAL.replace('#', '')}],
      colors: {
        'editor.foreground': Palette.PALE_GRAY,
        'editor.background': Palette.DARKEST_COAL,
        'editorCursor.foreground': Palette.LIGHTEST_PINK,
        'list.focusBackground': Palette.BLACK,
        focusBorder: Palette.BLACK,
        'editorWidget.background': Palette.DARKEST_COAL,
        'editor.lineHighlightBorder': Palette.DARKEST_COAL,
      },
    });

    monaco.editor.setTheme('haiku-actions');

    // Remove the default autocompletion options (console, window, GeoLocation, etc)
    // due to a [bug][1] in monaco this removes most of the stuff, but leaves
    // reserved keywords as options.
    // If you want to enable default atocompletion again, just remove the function call
    //
    // [1]: https://github.com/Microsoft/monaco-editor/issues/596
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
    });

    // Define our own autocompletion items
    this.completionDisposer = monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems (model, position) {
        return AUTOCOMPLETION_ITEMS.map((option) =>
          Object.assign(option, {
            kind: monaco.languages.CompletionItemKind.Function,
          }),
        );
      },
    });
  }

  /**
   * Since the Glass renders on every animation frame, we implemented a custom
   * shouldComponentUpdate function for performance reasons.
   *
   * We should avoid at all costs:
   *
   * 1- Triggering a re-render
   * 2- Instantiating a HandlerManager
   */
  shouldComponentUpdate (
    {element, visible, options},
    {editorWithErrors, currentEvent},
  ) {
    const pkey1 = element && element.getPrimaryKey();
    const pkey2 = this.props.element && this.props.element.getPrimaryKey();

    if (element && (pkey1 !== pkey2 || !this.handlerManager)) {
      this.handlerManager = new HandlerManager(element);
      return true;
    }

    if (
      (options && options.frame !== this.props.options.frame) ||
      visible !== this.props.visible ||
      editorWithErrors !== this.state.editorWithErrors ||
      currentEvent !== this.state.currentEvent
    ) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps (nextProps) {
    if (isNumeric(nextProps.options.frame)) {
      const event = HandlerManager.frameToEvent(nextProps.options.frame);
      this.setState({currentEvent: event});
    }
  }

  componentWillUnmount () {
    if (this.completionDisposer) {
      this.completionDisposer.dispose();
    }
  }

  canBeClosedExternally () {
    return !this.state.currentEvent;
  }

  doPersist () {
    const result = this.handlerManager.serialize();
    this.props.save(this.props.element, result);
  }

  doClose () {
    this.hideEditor(() => {
      this.props.close();
    });
  }

  doCloseIgnoringErrors () {
    // Hide and close without checking for errors (this.state.editorWithErrors)
    this.setState({currentEvent: null}, this.props.close);
  }

  doSave () {
    if (!this.state.editorWithErrors && this.state.currentEvent) {
      this.handlerManager.replaceEvent(
        this.editor.serialize(),
        this.state.currentEvent,
      );
      this.doPersist();
    }
  }

  doRemove () {
    const eventToDelete = isNumeric(this.props.options.frame)
      ? HandlerManager.frameToEvent(this.props.options.frame)
      : this.state.currentEvent;

    this.handlerManager.delete(eventToDelete);
    this.doPersist();
  }

  showEditor (event) {
    this.setState({currentEvent: event});
  }

  hideEditor (callback) {
    if (!this.state.editorWithErrors) {
      this.setState({currentEvent: null}, callback);
    }
  }

  doCloseFromEsc = () => {
    if (!this.state.editorWithErrors) {
      this.doSave();
      this.doClose();
    }
  };

  doSaveFromCmdS = () => {
    if (!this.state.editorWithErrors) {
      this.doSave();
    }
  };

  onEditorContentChange ({evaluator}) {
    this.setState({
      editorWithErrors: evaluator && evaluator.state === EVALUATOR_STATES.ERROR,
    });
  }

  renderEditor () {
    const event = this.state.currentEvent;
    const {id, handler} = this.handlerManager.getOrGenerateEventHandler(event);

    return (
      <Editor
        onContentChange={(serializedEvent, oldEvent) => {
          this.onEditorContentChange(serializedEvent, oldEvent);
        }}
        selectedEventName={event}
        params={handler.params}
        contents={handler.body}
        key={id}
        ref={(editor) => {
          this.editor = editor;
        }}
      />
    );
  }

  render () {
    if (!this.handlerManager) {
      return null;
    }

    const visibilityStyles = this.props.visible ? {} : {visibility: 'hidden'};
    const applicableEventHandlers = this.handlerManager.getApplicableEventHandlers();

    return (
      <ModalWrapper style={{...visibilityStyles, ...STYLES.container}}
            onEsc={this.doCloseFromEsc}
            onCmdEnter={this.doCloseFromEsc}
            onCmdS={this.doSaveFromCmdS}>
        <div
          onMouseDown={(mouseEvent) => {
            // Prevent outer view from closing us
            mouseEvent.stopPropagation();
          }}
        >
          <ModalHeader>
            <ElementTitle
              element={this.props.element}
              aria-label={
                isNumeric(this.props.options.frame)
                  ? `Frame ${this.props.options.frame}`
                  : null
              }
              onEditorRemoved={() => {
                this.doRemove();
                if (isNumeric(this.props.options.frame)) {
                  this.doClose();
                } else {
                  this.hideEditor();
                }
              }}
              breadcrumb={
                isNumeric(this.props.options.frame) || !this.state.currentEvent
                  ? ''
                  : '> ' + this.state.currentEvent
              }
              isDeleteable={!!this.state.currentEvent}
            />
          </ModalHeader>

          <div style={STYLES.outer} ref={(revealWrapper) => {
            this.revealWrapper = revealWrapper;
          }}>
            {isNumeric(this.props.options.frame) && this.state.currentEvent ? (
              <div
                style={{
                  ...STYLES.editorsWrapper,
                  ...STYLES.frameEditorWrapper,
                }}
              >
                {this.renderEditor()}
              </div>
            ) : (
              <RevealPanel
                showDetail={!!this.state.currentEvent}
                leftPanel={
                  <div style={{paddingTop: '35px'}}>
                    <EventSelector
                      options={applicableEventHandlers}
                      disabledOptions={this.handlerManager}
                      onFocus={() => {
                        this.revealWrapper.style.overflow = 'visible';
                      }}
                      onBlur={() => {
                        this.revealWrapper.style.overflow = 'hidden';
                      }}
                      onChange={(event) => {
                        this.showEditor(event);
                      }}
                    />

                    <div style={STYLES.tagWrapper}>
                      {this.handlerManager
                        .userVisibleEvents()
                        .map(({id, event, handler}) => {
                          return (
                            <span
                              key={event}
                              onClick={() => {
                                this.showEditor(event);
                              }}
                              style={STYLES.tag}
                            >
                              {event}
                            </span>
                          );
                        })}
                    </div>
                  </div>}
                rightPanel={
                  <div style={STYLES.editorsWrapper}>
                    <span
                      onClick={() => {
                        this.doSave();
                        this.hideEditor();
                      }}
                      style={{
                        ...STYLES.allOptions,
                        opacity: this.state.editorWithErrors ? '0.5' : '1',
                      }}
                    >
                      &lt; All Actions
                    </span>
                    {this.state.currentEvent && this.renderEditor()}
                  </div>}
              />
            )}
          </div>
          {this.state.currentEvent && (
            <ModalFooter>
              <EditorActions
                onCancel={() => {
                  this.doCloseIgnoringErrors();
                }}
                onSave={() => {
                  this.doSave();
                  this.doClose();
                }}
                aria-label={
                  this.state.editorWithErrors
                    ? 'an event handler has a syntax error'
                    : ''
                }
                isSaveDisabled={this.state.editorWithErrors}
              />
            </ModalFooter>
          )}
        </div>
      </ModalWrapper >);
  }
}

EventHandlerEditor.defaultProps = {
  options: {},
};

export default EventHandlerEditor;
