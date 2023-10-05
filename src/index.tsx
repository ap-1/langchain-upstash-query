/// <reference types="@kitajs/html/htmx.d.ts" />

import Html from "@kitajs/html";

import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/cloudflare-workers";

import { Layout } from "./layout";
import { api } from "./api";

export type Bindings = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
	OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.route("/api", api);

app.use("*", logger());
app.use("/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
	const html = (
		<Layout>
			<header class="flex flex-row justify-between px-3 h-[3.75rem] bg-zinc-950">
				<button
					class="shrink-0 rounded-md bg-sky-400 text-sky-700 p-2 my-auto"
					hx-get="/api/retrieve"
					hx-disabled-elt="this"
					hx-target="#question"
					hx-swap="outerHTML"
					hx-trigger="click"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-refresh-ccw"
					>
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
						<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
						<path d="M16 16h5v5" />
					</svg>
				</button>

				<h1 class="text-md sm:text-xl py-4 text-center text-white font-bold uppercase my-auto">
					Would you rather...
				</h1>

				<button
					class="shrink-0 rounded-md bg-emerald-400 text-emerald-700 p-2 my-auto"
					hx-post="/api/generate"
					hx-disabled-elt="this"
					hx-target="#question"
					hx-swap="outerHTML"
					hx-trigger="click"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-copy-plus"
					>
						<line x1="15" x2="15" y1="12" y2="18" />
						<line x1="12" x2="18" y1="15" y2="15" />
						<rect
							width="14"
							height="14"
							x="8"
							y="8"
							rx="2"
							ry="2"
						/>
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
					</svg>
				</button>
			</header>

			<div
				id="question"
				class="grid items-center p-16 h-[calc(100vh-3.75rem)] bg-zinc-900 text-white"
			>
				<p class="text-4xl text-center font-bold">
					Press one of the two buttons above to play
				</p>
			</div>
		</Layout>
	);

	return c.html(html as string);
});

export default app;
