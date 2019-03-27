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
    userSelect: 'none',
  },
  pagerHolster: {
    transform: 'translateY(-12px)',
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
    display: 'inline-block',
    marginBottom: -2,
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
    if (nextPros.numItemsPerPage === 0) {
      return;
    }
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
          onClick={() => {
            this.changeFirstItemToDisplay(page * this.props.numItemsPerPage);
          }}
          onMouseEnter={() => {
            this.hoverPageOn(page);
          }}
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
    if (this.props.numTotalItems <= this.props.numItemsPerPage) {
      return null;
    }

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
              onClick={() => {
                this.changeFirstItemToDisplay(Math.max(this.props.firstItemToDisplay - this.props.numItemsPerPage, 0));
              }}
              onMouseEnter={() => {
                this.hoverArrowOn('prev');
              }}
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
              onClick={() => {
                this.changeFirstItemToDisplay(Math.min(this.props.firstItemToDisplay + this.props.numItemsPerPage, this.props.numTotalItems));
              }}
              onMouseEnter={() => {
                this.hoverArrowOn('next');
              }}
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
