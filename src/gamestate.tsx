import { GameEvent } from "./parse-events.js";
import { Card, GameTemplate } from "./parse-template.js";
import seedrandom from 'seedrandom';

export type GameState = {
    template: GameTemplate;
    events: GameEvent[];
    previousCards: string[];
    displayedCard?: string;
    seed: string;
};

export function createGameState(gameTemplate: GameTemplate, gameEvents: GameEvent[], seed?: string): GameState {
    let gameState: GameState = {
        template: gameTemplate,
        events: gameEvents,
        previousCards: [],
        seed: seed || JSON.stringify(gameTemplate) + JSON.stringify(gameEvents)
    };

    for (const event of gameEvents) {
        gameState = applyEventToGameState(gameState, event);
    }

    return gameState;
}

function applyEventToGameState(gameState: GameState, event: GameEvent): GameState {
    console.log('processing event', event);
    if (event.type !== 'card-draw') return gameState;

    if (!event.card) return gameState; // TODO this can be done in typescript ?

    const card = findCardInGameTemplate(gameState.template, event.card);
    if (!card) return gameState;

    if (gameState.displayedCard) {
        gameState.previousCards.push(gameState.displayedCard);
    }

    gameState.displayedCard = card.ref;
    return gameState;
}

export function findCardInGameTemplate(gameTemplate: GameTemplate, searchRef: string): Card | null {
    for (const stack of gameTemplate.stacks) {
        for (const card of stack.cards) {
            if (card.ref == searchRef) {
                return card;
            }
        }
    }
    return null;
}

export function selectRandomCard(gameTemplate: GameTemplate, seed: string): Card | null {
    const allCards = gameTemplate.stacks.reduce((arr, stack) => arr.concat(stack.cards), [] as Card[]);
    if (allCards.length === 0) return null;

    const rng = seedrandom(seed);
    const randomIndex = Math.floor(rng() * allCards.length);
    return allCards[randomIndex];
}
