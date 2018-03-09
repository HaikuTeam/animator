import React from "react";
import Color from "color";
import Popover from "react-popover";
import Palette from "haiku-ui-common/lib/Palette";
import FigmaImporter from "./importers/FigmaImporter"
import FileSystemImporter from "./importers/FileSystemImporter"

const STYLES = {
  popover: {
    background: Palette.COAL,
    padding: '8px 18px',
    borderRadius: '4px',
    textAlign: 'left',
    position: 'relative',
  },
  button: {
    position: "relative",
    zIndex: 2,
    padding: "3px 9px",
    backgroundColor: Palette.DARKER_GRAY,
    color: Palette.ROCK,
    fontSize: 13,
    fontWeight: "bold",
    marginTop: -4,
    borderRadius: 3,
    cursor: "pointer",
    transform: "scale(1)",
    transition: "transform 200ms ease",
    ":hover": {
      backgroundColor: Color(Palette.DARKER_GRAY).darken(0.2)
    },
    ":active": {
      transform: "scale(.8)"
    }
  }
};

const importers = {
  MENU: 0,
  FILE: 1,
  FIGMA: 2
};

class FileImporter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isPopoverOpen: false
    };
  }

  showPopover() {
    this.setState({ isPopoverOpen: true });
  }

  hidePopover() {
    this.setState({ isPopoverOpen: false });
  }

  get popoverBody() {
    return (
      <div style={STYLES.popover}>
        <FileSystemImporter />
        <FigmaImporter />
      </div>
    );
  }

  render() {
    return (
      <Popover
        onOuterAction={() => {
          this.hidePopover();
        }}
        isOpen={this.state.isPopoverOpen}
        place="below"
        body={this.popoverBody}
      >
        <button
          style={STYLES.button}
          onClick={() => {
            this.showPopover();
          }}
        >
          +
        </button>
      </Popover>
    );
  }
}

FileImporter.propTypes = {
  onFileDrop: React.PropTypes.func.isRequired
};

export default FileImporter;
