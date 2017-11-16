import Palette from '../../Palette'

export default `
  .react-contextmenu {
      color: ${Palette.PALE_GRAY};
      background-color: #0F171A;
      border: none;
      border-radius: 4px;
      display: none;
  }

  .react-contextmenu.react-contextmenu--visible {
    display: inline-block;
  }

  .cm-s-haiku .CodeMirror-cursor {
    border-left: 1px solid ${Palette.LIGHTEST_PINK};
  }

  .react-contextmenu-item {
    color: ${Palette.PALE_GRAY};
    font-size: 12px;
  }

  .react-contextmenu-item.react-contextmenu-item--active,
  .react-contextmenu-item.react-contextmenu-item--selected {
      color: ${Palette.PALE_GRAY};
      background-color: ${Palette.COAL};
      border-color: ${Palette.COAL};
      text-decoration: none;
  }

  .react-contextmenu-item.react-contextmenu-item--disabled,
  .react-contextmenu-item.react-contextmenu-item--disabled:hover {
      color: ${Palette.PALE_GRAY};
      background-color: transparent;
      border-color: rgba(0,0,0,.15);
  }

  .react-contextmenu-item--divider {
      margin-bottom: 3px;
      padding: 2px 0;
      border-bottom: 1px solid rgba(0,0,0,.15);
      cursor: inherit;
  }

  .react-contextmenu-item--divider:hover {
      background-color: transparent;
      border-color: rgba(0,0,0,.15);
  }
  `
