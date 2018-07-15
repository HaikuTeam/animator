import * as React from 'react';
import * as moment from 'moment';

export default class Comment extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      replyContent: '',
      commentContent: '',
    };
  }

  contentDisplay (comment) {
    if (comment.isEditing) {
      return (
        <div>
          <input
            type="text"
            name="commentContent"
            value={this.state.commentContent || ''}
            ref="commentInput"
            tabIndex="1"
            style={{
              display: 'block',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              padding: 5,
              width: '100%',
              borderRadius: 2,
            }}
            onClick={(clickEvent) => {
              clickEvent.preventDefault();
              this.refs.commentInput.focus();
            }}
            onKeyDown={(keyDownEvent) => {
              if (keyDownEvent.which === 27) { // esc
                this.props.comment.isEditing = false;
                this.props.comment.isOpened = false;
                this.props.comment.isCancelled = true;
                this.setState({commentContent: ''});
              }
            }}
            onKeyPress={(keyPressEvent) => {
              if (keyPressEvent.which === 13) { // enter
                this.props.comment.content = this.state.commentContent;
                this.props.comment.isEditing = false;
                this.props.model.save();
                this.setState({commentContent: ''});
              }
            }}
            onChange={(keyEvent) => {
              this.setState({
                commentContent: keyEvent.target.value,
              });
            }} />
        </div>
      );
    }

    return (
      <div>
        {comment.content}
      </div>
    );
  }

  metaDisplay (comment, topLevel) {
    let humanTime;
    if (comment.created) {
      const mom = moment(comment.created);
      humanTime = mom.fromNow();
    }
    return (
      <div>
        <span style={{color: '#999'}}>{comment.author || 'Anonymous'}</span>
        <span style={{color: '#999'}}>
          {
            (humanTime)
            ? <span>
              <span>&nbsp;&middot;&nbsp;</span>
              <span>{humanTime}</span>
            </span>
            : ''
          }
        </span>
        {
          (topLevel)
          ? <span
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '10px',
              color: '#999',
            }}
            onClick={() => {
              comment.isOpened = false;
              this.forceUpdate();
            }}>
                close
            </span>
          : ''
        }
        {
          (topLevel && !comment.isEditing && !comment.isReplying)
          ? <span
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              color: '#f66',
            }}
            onClick={() => {
              comment.isOpened = false;
              comment.isArchived = true;
              this.props.model.save();
              this.forceUpdate();
            }}>
                trash
            </span>
          : ''
        }
      </div>
    );
  }

  repliesDisplay (comment) {
    if (comment.replies && comment.replies.length > 0) {
      return (
        <div>
          {comment.replies.map((reply, index) => {
            if (reply.isArchived) {
              return '';
            }
            if (!reply.content || reply.content.length < 1) {
              return '';
            }
            return (
              <div key={`reply-${index}`} style={{marginTop: '10px'}}>
                {this.metaDisplay(reply)}
                {this.contentDisplay(reply)}
              </div>
            );
          })}
        </div>
      );
    }

    return '';
  }

  render () {
    if (this.props.comment.isArchived) {
      return <span />;
    }
    if (this.props.comment.isCancelled) {
      return <span />;
    }
    if (!this.props.comment.isOpened) {
      return (
        <span
          onMouseDown={(mouseEvent) => {
            mouseEvent.stopPropagation();
            mouseEvent.preventDefault();
          }}
          onMouseUp={(mouseEvent) => {
            mouseEvent.stopPropagation();
            mouseEvent.preventDefault();
          }}
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            clickEvent.preventDefault();
            this.props.comment.isOpened = true;
            this.forceUpdate();
          }}
          style={{
            position: 'absolute',
            left: this.props.x || 0,
            top: this.props.y || 0,
            pointerEvents: 'auto',
            width: 50,
            height: 50,
            padding: '11px 10px 10px',
            borderRadius: '50%',
            backgroundColor: '#333',
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            cursor: 'pointer',
            opacity: 0.8,
            boxShadow: '0px 1px 13px 0px rgba(0,0,0,0.75)',
          }}>
          {this.props.index + 1}
        </span>
      );
    }
    return (
      <span
        onMouseDown={(mouseEvent) => {
          mouseEvent.stopPropagation();
          mouseEvent.preventDefault();
        }}
        onMouseUp={(mouseEvent) => {
          mouseEvent.stopPropagation();
          mouseEvent.preventDefault();
        }}
        style={{
          position: 'absolute',
          left: this.props.x || 0,
          top: this.props.y || 0,
          width: this.props.comment.w || 250,
          height: this.props.comment.h || null,
          pointerEvents: 'auto',
          padding: 10,
          borderRadius: 2,
          backgroundColor: '#333',
          color: 'white',
          opacity: 0.8,
          boxShadow: '0px 1px 13px 0px rgba(0,0,0,0.5)',
          overflowX: 'hidden',
          overflowY: 'auto',
          zIndex: 2001,
        }}>
        {this.metaDisplay(this.props.comment, true)}
        {this.contentDisplay(this.props.comment)}
        {this.repliesDisplay(this.props.comment)}
        {
          (this.props.comment.isReplying)
          ? <span
            style={{
              display: 'block',
              marginTop: 15,
            }}>
            <input
              type="text"
              name="replyContent"
              value={this.state.replyContent || ''}
              ref="replyInput"
              style={{
                display: 'block',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                padding: 5,
                width: '100%',
                borderRadius: 2,
              }}
              onKeyPress={(keyPressEvent) => {
                if (keyPressEvent.which === 13) { // enter
                  this.props.model.reply(this.props.comment.id, this.state.replyContent, {
                    created: Date.now(),
                    author: null, // TODO
                  });
                  this.props.model.save();
                  this.props.comment.isReplying = false;
                  this.setState({replyContent: ''});
                }
              }}
              onKeyDown={(keyDownEvent) => {
                if (keyDownEvent.which === 27) { // esc
                  this.props.comment.isReplying = false;
                  this.setState({replyContent: ''});
                }
              }}
              onClick={() => {
                this.refs.replyInput.focus();
              }}
              onChange={(keyEvent) => {
                this.setState({
                  replyContent: keyEvent.target.value,
                });
              }} />
            <span
              onClick={() => {
                this.props.comment.isReplying = false;
                this.forceUpdate();
              }}
              style={{
                cursor: 'pointer',
                color: '#999',
                marginTop: 5,
                marginBottom: 20,
              }}>
                cancel
              </span>
          </span>
          : (this.props.comment.isEditing)
            ? ''
            : <span
              onClick={() => {
                this.props.comment.isReplying = true;
                this.forceUpdate();
              }}
              style={{
                display: 'block',
                marginTop: 15,
                marginBottom: 20,
                cursor: 'pointer',
                color: '#999',
              }}>
                reply
              </span>
        }
      </span>
    );
  }
}
