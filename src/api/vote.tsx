import Html from "@kitajs/html";
import { QuestionContainer } from "../components/question";

import { Query } from "@upstash/query";
import { Redis } from "@upstash/redis/cloudflare";

import { type Handler } from "hono";
import { type Question } from ".";

export const vote: Handler = async (c) => {
	const { questionId, optionIdx } = c.req.query();

	const id = parseInt(questionId);
	const option = parseInt(optionIdx);

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

	const documents = await questionsById.match({ id });
	const question = documents[0].data;

	question.options[option].votes += 1;

	await questions.update(questionId, question);

	return c.html(
		(<QuestionContainer question={question} showResults />) as string
	);
};
