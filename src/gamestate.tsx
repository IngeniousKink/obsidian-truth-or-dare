import { GameEvent } from "./parse-events.js";
import { Card, GameTemplate } from "./parse-template.js";

export type GameState = {
    template: GameTemplate;
    events: GameEvent[];
    previousCard: string[];
    displayedCard?: string;
};

export function createGameState(gameTemplate: GameTemplate, gameEvents: GameEvent[]): GameState {
    let gameState: GameState = {
        template: gameTemplate,
        events: gameEvents,
        previousCard: []
    };

    for (const event of gameEvents) {
        gameState = applyEventToGameState(gameState, event);
    }

    return gameState;
}

function applyEventToGameState(gameState: GameState, event: GameEvent): GameState {
    if (event.type !== 'card-draw') return gameState;

    const card = findCardInGameTemplate(gameState.template, event.x);
    if (!card) return gameState;

    if (gameState.displayedCard) {
        gameState.previousCard.push(gameState.displayedCard);
    }

    gameState.displayedCard = card.ref;
    return gameState;
}

function findCardInGameTemplate(gameTemplate: GameTemplate, x: number): Card | null {
    for (const stack of gameTemplate.stacks) {
        for (const card of stack.cards) {
            if (card.ref.endsWith('^' + x)) {
                return card;
            }
        }
    }

    return null;
}