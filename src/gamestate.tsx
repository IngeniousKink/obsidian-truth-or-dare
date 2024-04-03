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

export function selectRandomCard(cards: Card[], gameState: GameState): Card | null {
    if (cards.length === 0) return null;

    const rng = seedrandom(gameState.seed);
    const randomIndex = Math.floor(rng() * cards.length);
    return cards[randomIndex];
}

export function selectRandomAvailableCard(gameState: GameState): Card | null {
    const allCards = getAvailableCards(gameState);
    return selectRandomCard(allCards, gameState);
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

export function selectCardsByCategory(gameState: GameState): { [key: string]: Card[] } {
    const categories = selectCategories(gameState);
    const availableCards = getAvailableCards(gameState);
    const cardsByCategory: { [key: string]: Card[] } = {};

    for (const category of categories) {
        cardsByCategory[category] = availableCards
            .filter(card => card.category === category)
    }

    return cardsByCategory;
}

export function selectCardByRef(gameState: GameState, ref: string | undefined): Card | null {
    if (!ref) return null;

    const allCards = getAllCards(gameState.template);
    for (const card of allCards) {
        if (card.ref === ref) {
            return card;
        }
    }
    return null;
}
