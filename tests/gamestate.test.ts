import { GameEvent } from 'src/parse-events.js';
import { createGameState, findCardInGameTemplate, getAllCards, selectRandomAvailableCard, getAvailableCards } from '../src/gamestate.js';

describe('Game State', () => {
  const mockGameTemplate = {
    stacks: [
      {
        name: 'stack1',
        ref: 'stackRef',
        cards: [
          { ref: 'card1', text: 'card1Text' },
          { ref: 'card2', text: 'card2Text' },
          { ref: 'card3', text: 'card3Text' }
        ]
      }
    ]
  }

  const mockGameEvents: GameEvent[] = [
    { type: 'card-draw', card: 'card1', timestamp: 0},
    { type: 'card-draw', card: 'card2', timestamp: 0 }
  ]

  test('createGameState', () => {
    const result = createGameState(mockGameTemplate, mockGameEvents);
    expect(result).toMatchSnapshot();
  });

  test('findCardInGameTemplate', () => {
    const result = findCardInGameTemplate(mockGameTemplate, 'card1');
    expect(result).toMatchSnapshot();
  });

  test('getAllCards', () => {
    const result = getAllCards(mockGameTemplate);
    expect(result).toMatchSnapshot();
  });

  test('getAvailableCards', () => {
    const mockGameState = createGameState(mockGameTemplate, mockGameEvents);
    const result = getAvailableCards(mockGameState);
    expect(result).toMatchSnapshot();
  });
});
