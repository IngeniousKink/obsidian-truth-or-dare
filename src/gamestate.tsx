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

export function getAllCards(gameTemplate: GameTemplate): Card[] {
    return gameTemplate.stacks.reduce((arr, stack) => arr.concat(stack.cards), [] as Card[]);
}

export function selectRandomAvailableCard(gameState: GameState): Card | null {
    const allCards = getAvailableCards(gameState);
    if (allCards.length === 0) return null;

    const rng = seedrandom(gameState.seed);
    const randomIndex = Math.floor(rng() * allCards.length);
    return allCards[randomIndex];
}

export function getAvailableCards(gameState: GameState): Card[] {
    const allCards = getAllCards(gameState.template);
    const unavailableCards = [gameState.displayedCard, ...gameState.previousCards];
    return allCards.filter(card => !unavailableCards.includes(card.ref));
}

export function selectCategories(gameState: GameState): string[] {
    const allCards = getAllCards(gameState.template);
    const categories = allCards
        .filter(card => card.category !== undefined)
        .map(card => card.category as string);

    return [...new Set(categories)];
}

export function selectCardsByCategory(gameState: GameState): { [key: string]: string[] } {
    const categories = selectCategories(gameState);
    const availableCards = getAvailableCards(gameState);
    const cardsByCategory: { [key: string]: string[] } = {};

    for (const category of categories) {
        cardsByCategory[category] = availableCards
            .filter(card => card.category === category)
            .map(card => card.ref);
    }

    return cardsByCategory;
}