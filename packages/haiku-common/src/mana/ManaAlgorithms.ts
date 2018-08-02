import {BytecodeNode} from '@haiku/core/lib/api';
import {ElementLocator} from '@haiku/core/lib/HaikuNode';

export const findManaElement = (
  mana: string|BytecodeNode,
  completePath: string[],
  currentLocator: ElementLocator = [],
  currentPathIndex: number = 0,
): ElementLocator => {
  if (!mana || typeof mana === 'string') {
    return null;
  }

  // If found element, start looking at the next one
  const updatedPathIndex =
    mana.attributes.id === completePath[currentPathIndex] ?
    currentPathIndex + 1 :
    currentPathIndex;

  // If found last path element, search was a success
  if (updatedPathIndex === completePath.length) {
    return currentLocator;
  }

  for (let i = 0; i < mana.children.length; i++) {
    const child = mana.children[i];
    currentLocator.push(i);
    const found = findManaElement(child, completePath, currentLocator, updatedPathIndex);
    if (found) {
      return found;
    }
    currentLocator.pop();
  }

  return null;
};

export const getChildrenFromMana = (
  mana: string|BytecodeNode,
  elementLocator: ElementLocator,
): string|BytecodeNode => {

  if (!elementLocator) {
    return null;
  }

  const nonProcessedLocator = elementLocator.slice(0);

  let currentMana = mana;
  while (nonProcessedLocator.length) {
    if (!currentMana || typeof currentMana === 'string' || !currentMana.children) {
      return null;
    }

    const childrenIndex = nonProcessedLocator.shift();

    if (currentMana.children.length > childrenIndex) {
      currentMana = currentMana.children[childrenIndex];
    } else {
      return null;
    }
  }

  return currentMana;

};
