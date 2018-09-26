import * as React from 'react';
import Palette from './../Palette';

const STYLES = {
  pagerWrap: {
    flex: 'none',
    textAlign: 'center',
    height: '50px',
    width: '100%',
    backgroundColor: Palette.GRAY,
    pointerEvents: 'none',
    bottom: '0px',
    transition: 'opacity 125ms, filter 140ms',
  },
  pagerHolster: {
    pointerEvents: 'auto',
  },
  pageNumber: {
    fontSize: 55,
    margin: 4,
    cursor: 'pointer',
  },
  arrow: {
    fontSize: 35,
    verticalAlign: 'text-bottom',
    cursor: 'pointer',
  },
};

export interface PaginatorProps {
  numItemsPerPage: number;
  firstItemToDisplay: number;
  numTotalItems: number;
  blur: boolean;
  fadeOut: boolean;
  onChangeFirstItemToDisplay: (firstItemToDisplay: number) => void;
}

export interface PaginatorState {
  numPages: number;
  currentPage: number;
  currentHoveredPage: number;
  currentHoveredArrow: string;
}

export class Paginator extends React.PureComponent<PaginatorProps, PaginatorState> {
  state = {
    numPages: 0,
    currentPage: 0,
    currentHoveredPage: -1,
    currentHoveredArrow: '',
  };

  componentWillReceiveProps (nextPros: PaginatorProps) {
    const numPages = Math.ceil(nextPros.numTotalItems / nextPros.numItemsPerPage);
    const currentPage = Math.floor(nextPros.firstItemToDisplay / nextPros.numItemsPerPage);
    this.setState({numPages, currentPage});
  }

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }

  renderPaginationDots () {
    const pages = [];

    for (let page = 0; page < this.state.numPages; page++) {
      pages.push(
        <a
          key={`pagination-${page}`}
          onClick={this.changeFirstItemToDisplay.bind(null, page * this.props.numItemsPerPage)}
          onMouseEnter={this.hoverPageOn.bind(null, page)}
          onMouseLeave={this.hoverPageOff}
          style={{color: page === this.state.currentPage ? Palette.LIGHTEST_PINK : Palette.ROCK}}
        >
          <span
            key={`pagination-${page}-span`}
            style={{...STYLES.pageNumber, color: page === this.state.currentHoveredPage && Palette.SUNSTONE}}
          >
          •
          </span>
        </a>,
      );
    }
    return pages;
  }

  changeFirstItemToDisplay = (itemNum: number) => {
    this.props.onChangeFirstItemToDisplay(itemNum);
  };

  hoverPageOn = (page: number) => {
    this.setState({currentHoveredPage: page});
  };

  hoverPageOff = () => {
    this.setState({currentHoveredPage: -1});
  };

  hoverArrowOn = (arrow: string) => {
    this.setState({currentHoveredArrow: arrow});
  };

  hoverArrowOff = () => {
    this.setState({currentHoveredArrow: ''});
  };

  render () {
    return (
      <div
        style={{
          ...STYLES.pagerWrap,
          opacity: this.props.fadeOut ? 0 : 1,
          filter: this.props.blur ? 'blur(2px)' : '',
        }}
        id="paginatorDiv"
      >
        <div style={STYLES.pagerHolster}>
          {(this.props.firstItemToDisplay > 0) &&
            <span
              style={{...STYLES.arrow, color: 'prev' === this.state.currentHoveredArrow && Palette.SUNSTONE}}
              key="prev"
              onClick={this.changeFirstItemToDisplay.bind(null, Math.max(this.props.firstItemToDisplay - this.props.numItemsPerPage, 0))}
              onMouseEnter={this.hoverArrowOn.bind(null, 'prev')}
              onMouseLeave={this.hoverArrowOff}
            >
              ←
            </span>
          }
          {this.renderPaginationDots()}
          {(this.props.firstItemToDisplay < this.props.numTotalItems - this.props.numItemsPerPage) &&
            <span
              style={{...STYLES.arrow, color: 'next' === this.state.currentHoveredArrow && Palette.SUNSTONE}}
              key="next"
              onClick={this.changeFirstItemToDisplay.bind(null, Math.min(this.props.firstItemToDisplay + this.props.numItemsPerPage, this.props.numTotalItems))}
              onMouseEnter={this.hoverArrowOn.bind(null, 'next')}
              onMouseLeave={this.hoverArrowOff}
            >
            →
            </span>
          }
        </div>
      </div>
    );
  }
}
