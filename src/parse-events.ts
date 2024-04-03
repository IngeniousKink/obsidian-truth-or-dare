import type { Root, Code } from "mdast";

// Define a GameEvent type with game, type, timestamp and x
export type GameEvent = {
  type: string;
  timestamp: number;
  x: number;
};

/**
 * This function takes a markdown abstract syntax tree (AST) and converts it into an array of game events.
 * The game events are represented as a GameEvent, where each event is an object with a game, type, timestamp and x.
 * Each code block in the markdown creates a new event in the GameEvent array.
 * 
 * For example, given the following markdown:
 * 
 * ```truth-or-dare:event
 * type:card-draw
 * timestamp: 1706012788684
 * x: 2
 * ```
 * 
 * The resulting GameEvent would be:
 * 
 * {
 *   game: "truth-or-dare",
 *   type: "card-draw",
 *   timestamp: 1706012788684,
 *   x: 2
 * }
 */
export function convertMarkdownToGameEvents(node: Root): GameEvent[] {
  return node.children.reduce<GameEvent[]>(
    (gameEvents, child) => processMarkdownNode(gameEvents, child as Code),
    []
  );
}

// Process a markdown node, which can be a code block
function processMarkdownNode(gameEvents: GameEvent[], child: Code): GameEvent[] {
  if (child.type === 'code') {
    const event = extractEventFromCode(child);
    return [...gameEvents, event];
  }

  return gameEvents;
}

// Extract the game event from a code block
function extractEventFromCode(node: Code): GameEvent {
  const lines = node.value.split('\n');
  const event: GameEvent = {
    type: '',
    timestamp: 0,
    x: 0,
  };

  for (const line of lines) {
    if (line.startsWith('type:')) {
      event.type = line.split(':')[1].trim();
    } else if (line.startsWith('timestamp:')) {
      event.timestamp = Number(line.split(':')[1].trim());
    } else if (line.startsWith('x:')) {
      event.x = Number(line.split(':')[1].trim());
    }
  }

  return event;
}
