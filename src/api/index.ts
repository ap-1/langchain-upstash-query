import { Hono } from "hono";
import { type Bindings } from "..";

import { generate } from "./generate";
import { retrieve } from "./retrieve";
import { vote } from "./vote";

type Option = {
	text: string;
	votes: number;
};

export type Question = {
	id: number;
	text: string;
	options: Option[];
};

export const api = new Hono<{ Bindings: Bindings }>();

api.post("/generate", generate);
api.get("/retrieve", retrieve);
api.post("/vote", vote);
