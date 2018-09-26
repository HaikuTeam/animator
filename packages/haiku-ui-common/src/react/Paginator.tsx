// @ts-ignore
import * as Radium from 'radium';
import * as React from 'react';
import Palette from './../Palette';

const STYLES = {
  item: {
    width: '50%',
  },
  hidden: {
    pointerEvents: 'none',
    opacity: 0,
  },
  visible: {
    pointerEvents: 'all',
    opacity: 1,
  },
  pagerWrap: {
    flex: 'none',
    textAlign: 'center',
    height: '50px',
    width: '100%',
    backgroundColor: Palette.GRAY,
    pointerEvents: 'none',
    bottom: '0px',
  },
  pagerHolster: {
    pointerEvents: 'auto',
  },
  pageNumber: {
    fontSize: 55,
    margin: 4,
    cursor: 'pointer',
    ':hover': {
      color: Palette.SUNSTONE,
    },
  },
  arrow: {
    fontSize: 35,
    verticalAlign: 'text-bottom',
    cursor: 'pointer',
    ':hover': {
      color: Palette.SUNSTONE,
    },
  },
};

export interface PaginatorProps {
  numItemsPerPage: number;
  firstItemToDisplay: number;
  numTotalItems: number;
  onChangeFirstItemToDisplay: (firstItemToDisplay: number) => void;
}

export interface PaginatorState {
  numPages: number;
  currentPage: number;
}

export class Paginator extends React.PureComponent<PaginatorProps, PaginatorState> {
  state = {
    numPages: 0,
    currentPage: 0,
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
      const changePage = () => {
        this.props.onChangeFirstItemToDisplay(page * this.props.numItemsPerPage);
      };
      pages.push(
        <a
          key={`pagination-${page}`}
          onClick={changePage}
          style={{color: page === this.state.currentPage ? Palette.LIGHTEST_PINK : Palette.ROCK}}
        >
          <span key={`pagination-${page}-span`} style={STYLES.pageNumber}>•</span>
        </a>,
      );
    }
    return pages;
  }

  render () {
    const prevPage = () => {
      this.props.onChangeFirstItemToDisplay(Math.max(0, this.props.firstItemToDisplay - this.props.numItemsPerPage));
    };
    const nextPage = () => {
      this.props.onChangeFirstItemToDisplay(Math.min(this.props.firstItemToDisplay + this.props.numItemsPerPage, this.props.numTotalItems));
    };

    return (
      <div style={STYLES.pagerWrap} id="paginatorDiv">
        <div style={STYLES.pagerHolster}>
          {(this.props.firstItemToDisplay > 0) &&
            <span
              style={STYLES.arrow}
              key="prev"
              onClick={prevPage}
            >
              ←
            </span>
          }
          {this.renderPaginationDots()}
          {(this.props.firstItemToDisplay < this.props.numTotalItems - this.props.numItemsPerPage) &&
            <span
              style={STYLES.arrow}
              key="next"
              onClick={nextPage}
            >
            →
            </span>
          }
        </div>
      </div>
    );
  }
}

export default Radium(Paginator);
