import Html from "@kitajs/html";
import { QuestionContainer } from "../components/question";

import { Query } from "@upstash/query";
import { Redis } from "@upstash/redis/cloudflare";

import { type Handler } from "hono";
import { type Question } from ".";

export const retrieve: Handler = async (c) => {
	const redis = new Redis({
		url: c.env.UPSTASH_REDIS_REST_URL,
		token: c.env.UPSTASH_REDIS_REST_TOKEN,
		automaticDeserialization: false,
	});

	const query = new Query({ redis });
	const questions = query.createCollection<Question>("questions");
	const questionsById = questions.createIndex({
		name: "questions_by_id",
		terms: ["id"],
	});

	const numQuestions = (await redis.get("num_questions")) as string;
	const id = Math.floor(Math.random() * parseInt(numQuestions)) + 1;

	const documents = await questionsById.match({ id });
	const question = documents[0].data;

	return c.html((<QuestionContainer question={question} />) as string);
};
