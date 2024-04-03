export type GameEvent = 
    | CreateActorEvent
    | DeleteActorEvent
    | ChangeActorNameEvent
    | ChangeActorInventoryAddEvent
    | ChangeActorInventoryRemoveEvent
    | DrawCardEvent
    | SkipCardEvent
    | CompleteCardEvent
    | AssignSlotEvent
    | UnassignSlotEvent
    | AdvanceStackEvent;

export type WithTimestamp = {
    timestamp: number;
};

export type TimestampedEvent = GameEvent & WithTimestamp;

export type CreateActorEvent = {
    type: 'create_actor';
    actorId: string;
};

export type DeleteActorEvent = {
    type: 'delete_actor';
    actorId: string;
};

export type ChangeActorNameEvent = {
    type: 'change_actor_name';
    actorId: string;
    value: string;
};

export type ChangeActorInventoryAddEvent = {
    type: 'change_actor_inventory_add';
    actorId: string;
    value: string;
};

export type ChangeActorInventoryRemoveEvent = {
    type: 'change_actor_inventory_remove';
    actorId: string;
    value: string;
};

export type DrawCardEvent = {
    type: 'draw_card';
    cardRef: string;
};

export type SkipCardEvent = {
    type: 'skip_card';
    cardRef: string;
};

export type CompleteCardEvent = {
    type: 'complete_card';
    cardRef: string;
};

export type AssignSlotEvent = {
    type: 'assign_slot';
    actorId: string;
    slotIndex: number;
};

export type UnassignSlotEvent = {
    type: 'unassign_slot';
    slotIndex: number;
};

export type AdvanceStackEvent = {
    type: 'advance_stack';
};

export function timestampEvent<T extends GameEvent>(event: T): T & WithTimestamp {
    return {
        ...event,
        timestamp: Date.now()
    };
}

export function createActor(): CreateActorEvent {
    const actorId = (
        (Date.now() - 1700000000000) /** for good measure */
        .toString(32)
        .split('')
        .reverse()
        .join('')
    );

    return {
        type: 'create_actor',
        actorId
    };
}

export function deleteActor(actorId: string): DeleteActorEvent {
    return {
        type: 'delete_actor',
        actorId
    };
}

export function changeActorName(actorId: string, value: string): ChangeActorNameEvent {
    return {
        type: 'change_actor_name',
        actorId,
        value
    };
}

export function changeActorInventoryAdd(actorId: string, inventoryToAdd: string): ChangeActorInventoryAddEvent {
    return {
        type: 'change_actor_inventory_add',
        actorId,
        value: inventoryToAdd
    };
}

export function changeActorInventoryRemove(actorId: string, inventoryToRemove: string): ChangeActorInventoryRemoveEvent {
    return {
        type: 'change_actor_inventory_remove',
        actorId,
        value: inventoryToRemove
    };
}

export function assignSlot(actorId: string, slotIndex: number): AssignSlotEvent {
    return {
        type: 'assign_slot',
        actorId,
        slotIndex
    };
}

export function unassignSlot(slotIndex: number): UnassignSlotEvent {
    return {
        type: 'unassign_slot',
        slotIndex
    };
}

export function drawCard(cardRef: string): DrawCardEvent {
    return {
        type: 'draw_card',
        cardRef,
    };
}

export function skipCard(cardRef: string): SkipCardEvent {
    return {
        type: 'skip_card',
        cardRef
    };
}

export function completeCard(cardRef: string): CompleteCardEvent {
    return {
        type: 'complete_card',
        cardRef
    };
}

export function advanceStack(): AdvanceStackEvent {
    return {
        type: 'advance_stack',
    };
}

export const serializeEventToCodeBlock = (event: TimestampedEvent) => {
    let eventString = `\`\`\`truth-or-dare:event\n`;

    // Ensure type and timestamp are always at the top
    eventString += `type:${event.type}\n`;
    eventString += `timestamp:${event.timestamp}\n`;

    const eventWithStrKeys: { [key: string]: any } = event;

    for (const key in eventWithStrKeys) {
        if (key !== "type" && key !== "timestamp") {
            eventString += `${key}:${eventWithStrKeys[key]}\n`;
        }
    }

    eventString += `\`\`\`\n`;

    return eventString;
};
