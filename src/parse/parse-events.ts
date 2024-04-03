import { AdvanceStackEvent, AssignSlotEvent, ChangeActorInventoryAddEvent, ChangeActorInventoryRemoveEvent, ChangeActorNameEvent, CompleteCardEvent, CreateActorEvent, DeleteActorEvent, DrawCardEvent, GameEvent, SkipCardEvent, TimestampedEvent, UnassignSlotEvent, WithTimestamp } from "@obsidian-truth-or-dare/events.js";
import type { Root, Code } from "mdast";

/**
 * This function takes a markdown abstract syntax tree (AST) and converts it into an array of game events.
 * The game events are represented as a GameEvent, where each event is an object with a game, type, timestamp and x.
 * Each code block in the markdown creates a new event in the GameEvent array.
 * 
 * For example, given the following markdown:
 * 
 * ```truth-or-dare:event
 * type:name-of-event
 * timestamp: 1706012788684
 * x: 2
 * ```
 * 
 * The resulting GameEvent would be:
 * 
 * {
 *   game: "truth-or-dare",
 *   type: "name-of-event",
 *   timestamp: 1706012788684,
 *   x: 2
 * }
 */
export function convertMarkdownToGameEvents(node: Root): TimestampedEvent[] {
  return node.children.reduce<TimestampedEvent[]>(
    (gameEvents, child) => processMarkdownNode(gameEvents, child as Code),
    []
  );
}

// Process a markdown node, which can be a code block
function processMarkdownNode(gameEvents: TimestampedEvent[], child: Code): TimestampedEvent[] {
  if (child.type === 'code' && child.lang === 'truth-or-dare:event') {
    try {
      const event = extractEventFromCode(child as Code);
      return [...gameEvents, event];
    } catch(error) {
      if (error instanceof UnparseableEventError) {
        console.warn(error);
      } else {
        throw error;
      }
    }
  }

  return gameEvents;
}

export class UnparseableEventError extends Error {
  constructor(public event: any) {
    super(`Unable to parse the event ${event.type ? `of type ${event.type}` : ''} ${JSON.stringify(event)}`);
    this.name = "UnparseableEventError";
    this.event = event;
  }
}

// Extract the game event from a code block
function extractEventFromCode(node: Code): TimestampedEvent {
  const lines = node.value.split('\n');
  const event: any = {};

  for (const line of lines) {
    const [key, value] = line.split(':');

    if (key && value) {
      event[key.trim()] = value.trim();
    }
  }

  if (!('timestamp' in event)) {
      throw new UnparseableEventError(event);
  }

  switch (event.type) {
    case 'create_actor':
      if ('actorId' in event) {
        return event as CreateActorEvent & WithTimestamp;
      }
      break;
    case 'delete_actor':
      if ('actorId' in event) {
        return event as DeleteActorEvent & WithTimestamp;
      }
      break;
    case 'change_actor_name':
      if ('actorId' in event && 'value' in event) {
        return event as ChangeActorNameEvent & WithTimestamp;
      }
      break;
    case 'change_actor_inventory_add':
      if ('actorId' in event && 'value' in event) {
        return event as ChangeActorInventoryAddEvent & WithTimestamp;
      }
      break;
    case 'change_actor_inventory_remove':
      if ('actorId' in event && 'value' in event) {
        return event as ChangeActorInventoryRemoveEvent & WithTimestamp;
      }
      break;
    case 'draw_card':
      if ('cardRef' in event) {
        return event as DrawCardEvent & WithTimestamp;
      }
      break;
    case 'skip_card':
      if ('cardId' in event) {
        return event as SkipCardEvent & WithTimestamp;
      }
      break;
    case 'complete_card':
      if ('cardId' in event) {
        return event as CompleteCardEvent & WithTimestamp;
      }
      break;
    case 'assign_slot':
      if ('actorId' in event && 'slotIndex' in event) {
        return event as AssignSlotEvent & WithTimestamp;
      }
      break;
    case 'unassign_slot':
      if ('slotIndex' in event) {
        return event as UnassignSlotEvent & WithTimestamp;
      }
      break;
    case 'advance_stack':
      return event as AdvanceStackEvent & WithTimestamp;
    default:
      throw new UnparseableEventError(event);
  }

  throw new UnparseableEventError(event);
}

