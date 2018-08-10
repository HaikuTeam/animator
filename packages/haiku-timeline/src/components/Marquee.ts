import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import zIndex from './styles/zIndex';

export type MouseCallback = (event?: MouseEvent) => boolean;
export type MarqueeCallback = (rect?: DOMRect|ClientRect) => null;
export interface MarqueeConstructorArguments {
  onStart: MouseCallback;
  onChange: MarqueeCallback;
  onFinish: MarqueeCallback;
  area: HTMLElement;
}

class Marquee {
  private initialCursorPos = {x: 0, y: 0};
  private initialScroll = {x: 0, y: 0};
  private onStart: MouseCallback;
  private onChange: MarqueeCallback;
  private onFinish: MarqueeCallback;
  private area: HTMLElement;
  private selector: HTMLDivElement;
  private areaClass = 'marquee-selection-active';

  constructor ({onStart, onChange, onFinish, area}: MarqueeConstructorArguments) {
    this.onStart = onStart;
    this.onChange = onChange;
    this.onFinish = onFinish;
    this.area = area;
    this.selector = this.createSelector();
  }

  start () {
    this.area.addEventListener('mousedown', this.startUp);
  }

  private startUp = (event: MouseEvent) => {
    if (event.which === 3 || !this.onStart(event)) {
      return;
    }

    this.selector.style.display = 'block';
    this.getStartingPositions(event);
    this.selector.style.display = 'none';
    this.area.removeEventListener('mousedown', this.startUp);
    this.area.addEventListener('mousemove', this.handleMove);
    this.area.classList.add(this.areaClass);
    this.area.setAttribute('draggable', 'false');
    document.addEventListener('mouseup', this.reset);
  };

  private getStartingPositions (event: MouseEvent) {
    this.initialCursorPos = this.getCursorPos(event, this.area);
    this.initialScroll = this.getScroll(this.area);
    const top = this.initialCursorPos.x + this.initialScroll.x;
    const bottom = this.initialCursorPos.y + this.initialScroll.y;

    const selectorPos: DOMRect = {
      top,
      bottom,
      x: top,
      y: bottom,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
    };

    this.updatePos(this.selector, selectorPos);
  }

  private handleMove = (event: MouseEvent) => {
    const selectorPos = this.getPosition(event);
    this.selector.style.display = 'block';
    this.updatePos(this.selector, selectorPos);
    this.onChange(this.selector.getBoundingClientRect());
  };

  private createSelector () {
    const selector = document.createElement('div');
    selector.style.position = 'absolute';
    selector.style.background = Color(Palette.ROCK).alpha(0.25).rgb().toString();
    selector.style.border = `1px solid ${Palette.DARKER_ROCK2}`;
    selector.style.display = 'none';
    selector.style.pointerEvents = 'none';
    selector.style.zIndex = zIndex.marquee.base.toString();
    this.area.appendChild(selector);
    return selector;
  }

  private getPosition (event: MouseEvent) {
    const cursorPosNew = this.getCursorPos(event, this.area);
    const scrollNew = this.getScroll(this.area);

    // if area or document is scrolled those values have to be included aswell
    const scrollAmount = {
      x: scrollNew.x - this.initialScroll.x,
      y: scrollNew.y - this.initialScroll.y,
    };

    const selectorPos: DOMRect = {
      top: 0,
      bottom: 0,
      x: 0,
      y: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
    };

    // right
    if (cursorPosNew.x > this.initialCursorPos.x - scrollAmount.x) {
      selectorPos.x = this.initialCursorPos.x + this.initialScroll.x;
      selectorPos.width = cursorPosNew.x - this.initialCursorPos.x + scrollAmount.x;
      // left
    } else {
      selectorPos.x = cursorPosNew.x + scrollNew.x;
      selectorPos.width = this.initialCursorPos.x - cursorPosNew.x - scrollAmount.x;
    }

    // bottom
    if (cursorPosNew.y > this.initialCursorPos.y - scrollAmount.y) {
      selectorPos.y = this.initialCursorPos.y + this.initialScroll.y;
      selectorPos.height = cursorPosNew.y - this.initialCursorPos.y + scrollAmount.y;
    } else {
      selectorPos.y = cursorPosNew.y + scrollNew.y;
      selectorPos.height = this.initialCursorPos.y - cursorPosNew.y - scrollAmount.y;
    }

    return selectorPos;
  }

  private reset = (event: MouseEvent) => {
    document.removeEventListener('mouseup', this.reset);
    this.area.removeEventListener('mousemove', this.handleMove);
    this.area.addEventListener('mousedown', this.startUp);
    this.area.classList.remove(this.areaClass);
    this.area.removeAttribute('draggable');
    this.onFinish();

    this.selector.style.width = '0';
    this.selector.style.height = '0';
    this.selector.style.display = 'none';
  };

  private getCursorPos (event: MouseEvent, area: HTMLElement) {
    if (!event) {
      return {x: 0, y: 0};
    }

    const areaRect = area.getBoundingClientRect();

    return {
      x: event.clientX - areaRect.left,
      y: event.clientY - areaRect.top,
    };
  }

  private getScroll (area: HTMLElement) {
    return {
      y: area.scrollTop,
      x: area.scrollLeft,
    };
  }

  private updatePos (node: HTMLElement, pos: DOMRect) {
    node.style.left = pos.x + 'px';
    node.style.top = pos.y + 'px';
    node.style.width = pos.width + 'px';
    node.style.height = pos.height + 'px';
    return node;
  }
}

export default Marquee;
