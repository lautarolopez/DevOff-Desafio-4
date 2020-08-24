import {
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

let sockets = new Map<string, WebSocket>();

interface MnsjObj {
  name: string;
  mnsj: string;
}

const broadcastEvent = (obj: MnsjObj) => {
  sockets.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(obj));
  });
};

export const chatConnection = async (ws: WebSocket) => {
  const uuid = v4.generate();
  sockets.set(uuid, ws);

  for await (const event of ws) {
    if (isWebSocketCloseEvent(event)) {
      sockets.delete(uuid);
    }
    if (typeof event === "string") {
      let eventObject = JSON.parse(event);
      broadcastEvent(eventObject);
    }
  }
};
