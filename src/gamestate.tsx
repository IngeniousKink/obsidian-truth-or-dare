import { CreateActorEvent, DrawCardEvent, GameEvent, TimestampedEvent, DeleteActorEvent, ChangeActorNameEvent } from "./events.js";
import { ParsedCard } from "./parse/parse-card.js";
import { CardWithRef, GameTemplate } from "./parse/parse-template.js";
import seedrandom from 'seedrandom';

export type Actor = {
    id: string;
    name: string;
    inventory: string[]
};

export type GameState = {
    template: GameTemplate;

    events: TimestampedEvent[];
    seed: string;

    previousCards: string[];

    actors: Actor[];

    displayedCard?: string;
    allocation: string[];

    preview: {
        displayedCard?: string,
        allocation: string[],
    }
};

export function createGameState(gameTemplate: GameTemplate, gameEvents: TimestampedEvent[], seed?: string): GameState {
    let gameState: GameState = {
        template: gameTemplate,
        events: gameEvents,
        previousCards: [],
        actors: [],
        allocation: [],
        preview: {
            allocation: []
        },
        seed: seed || JSON.stringify(gameTemplate) + JSON.stringify(gameEvents)
    };

    for (const event of gameEvents) {
        gameState = applyEventToGameState(gameState, event);
    }

    return gameState;
}


export function findCardInGameTemplate(gameTemplate: GameTemplate, searchRef: string): CardWithRef | null {
    for (const stack of gameTemplate.stacks) {
        for (const card of stack.cards) {
            if (card.ref == searchRef) {
                return card;
            }
        }
    }
    return null;
}

export function getAllCards(gameTemplate: GameTemplate): CardWithRef[] {
    return gameTemplate.stacks.reduce((arr, stack) => arr.concat(stack.cards), [] as CardWithRef[]);
}

export function selectRandomCard(cards: CardWithRef[], gameState: GameState): CardWithRef | null {
    if (cards.length === 0) return null;

    const rng = seedrandom(gameState.seed);
    const randomIndex = Math.floor(rng() * cards.length);
    return cards[randomIndex];
}

export function selectRandomAvailableCard(gameState: GameState): CardWithRef | null {
    const allCards = getAvailableCards(gameState);
    return selectRandomCard(allCards, gameState);
}

export function getAvailableCards(gameState: GameState): CardWithRef[] {
    const allCards = getAllCards(gameState.template);
    const unavailableCards = [gameState.displayedCard, ...gameState.previousCards];
    return allCards.filter(card => !unavailableCards.includes(card.ref));
}

export function getCategories(card: ParsedCard): string[] {
    return card.annotations
        .map(annotation => annotation?.category)
        .filter(category => category !== undefined) as string[];
}

export function selectCategories(gameState: GameState): string[] {
    const allCards = getAllCards(gameState.template);

    const categories = allCards.flatMap(getCategories)

    return [...new Set(categories)];
}

export function selectCardsByCategory(gameState: GameState): { [key: string]: CardWithRef[] } {
    const categories = selectCategories(gameState);
    const availableCards = getAvailableCards(gameState);
    const cardsByCategory: { [key: string]: CardWithRef[] } = {};

    for (const category of categories) {
        cardsByCategory[category] = availableCards
            .filter(card => getCategories(card).includes(category))
    }

    return cardsByCategory;
}

export function selectCardByRef(gameState: GameState, ref: string | undefined): CardWithRef | null {
    if (!ref) return null;

    const allCards = getAllCards(gameState.template);
    for (const card of allCards) {
        if (card.ref === ref) {
            return card;
        }
    }
    return null;
}




function handleDrawCardEvent(gameState: GameState, event: DrawCardEvent): GameState {
    const card = findCardInGameTemplate(gameState.template, event.cardRef);
    if (!card) return gameState;

    let previousCards = [...gameState.previousCards];
    if (gameState.displayedCard) {
        previousCards.push(gameState.displayedCard);
    }

    return {
        ...gameState,
        previousCards: previousCards,
        displayedCard: card.ref,
    };
}
function handleCreateActor(state: GameState, event: CreateActorEvent): GameState {
    return {
        ...state,
        actors: [
            ...state.actors,
            {
                id: event.actorId,
                name: `Player ${event.actorId}`,
                inventory: []
            }
        ]
    };
}

function handleDeleteActor(state: GameState, event: DeleteActorEvent): GameState {
    return {
        ...state,
        actors: state.actors.filter(actor => actor.id !== event.actorId),
    };
}

function handleChangeActorName(state: GameState, event: ChangeActorNameEvent): GameState {
    return {
        ...state,
        actors: state.actors.map(actor =>
            actor.id === event.actorId
                ? { ...actor, name: event.value }
                : actor
        )
    };
}


function applyEventToGameState(gameState: GameState, event: GameEvent): GameState {
    switch (event.type) {
        case 'draw_card':
            return handleDrawCardEvent(gameState, event as DrawCardEvent);
        case 'create_actor':
            return handleCreateActor(gameState, event as CreateActorEvent);
        case 'delete_actor':
            return handleDeleteActor(gameState, event as DeleteActorEvent);
        case 'change_actor_name':
            return handleChangeActorName(gameState, event as ChangeActorNameEvent);
        default:
            return gameState;
    }
}
