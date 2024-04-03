import { GameEvent } from 'src/parse-events.js';
import { createGameState, findCardInGameTemplate, getAllCards, selectRandomAvailableCard, getAvailableCards, selectCardsByCategory, GameState } from '../src/gamestate.js';
import { Card, GameTemplate, Stack } from 'src/parse-template.js';

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


describe('selectCardsByCategory', () => {
  let gameState: GameState;
  let gameTemplate: GameTemplate;
  let cards: Card[];
  let stack: Stack;

  beforeEach(() => {
    cards = [
      { ref: '1', text: 'Card 1', category: 'Category 1' },
      { ref: '2', text: 'Card 2', category: 'Category 2' },
      { ref: '3', text: 'Card 3', category: 'Category 3' },
      { ref: '4', text: 'Card 4', category: 'Category 1' },
      { ref: '5', text: 'Card 5', category: 'Category 2' },
      { ref: '6', text: 'Card 6', category: 'Category 3' },
    ];
    stack = { name: 'Stack 1', ref: '#Stack 1', cards: cards };
    gameTemplate = { stacks: [stack] };
    gameState = createGameState(gameTemplate, []);
  });

  it('should return cards grouped by category', () => {
    const result = selectCardsByCategory(gameState);
    expect(result).toEqual({
      'Category 1': [
        { ref: '1', text: 'Card 1', category: 'Category 1' },
        { ref: '4', text: 'Card 4', category: 'Category 1' }
      ],
      'Category 2': [
        { ref: '2', text: 'Card 2', category: 'Category 2' },
        { ref: '5', text: 'Card 5', category: 'Category 2' }
      ],
      'Category 3': [
        { ref: '3', text: 'Card 3', category: 'Category 3' },
        { ref: '6', text: 'Card 6', category: 'Category 3' }
      ],
    });
  });

  it('should return an empty object if there are no categories', () => {
    const result = selectCardsByCategory({
      ...gameState,
      template: {
        ...gameTemplate,
        stacks: [],
      }
    });
    expect(result).toEqual({});
  });

  it('should return an empty array for each category if there are no available cards', () => {
    const result = selectCardsByCategory({
      ...gameState,
      previousCards: ['1', '2', '3', '4', '5', '6']
    });
    expect(result).toEqual({ 'Category 1': [], 'Category 2': [], 'Category 3': [] });
  });


  it('should only include cards that are available', () => {
    gameState = {
      ...gameState,
      previousCards: ['4']
    };
    const result = selectCardsByCategory(gameState);
    expect(result['Category 1']).not.toContain('4');
  });

  it('should not include categories that have no available cards', () => {
    gameState = {
      ...gameState,
      previousCards: ['1', '4']
    };
    const result = selectCardsByCategory(gameState);
    expect(result).not.toHaveProperty('Category1');
  });
});