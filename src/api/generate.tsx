import Html from "@kitajs/html";
import { QuestionContainer } from "../components/question";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { Query } from "@upstash/query";
import { Redis } from "@upstash/redis/cloudflare";

import { type Handler } from "hono";
import { type Question } from ".";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

const questionSchema = z.object({
	text: z
		.string()
		.describe(
			"The actual text of the would-you-rather question that gets presented to the user."
		),
	options: z
		.array(
			z
				.string()
				.describe(
					"The actual text of an option that get presented to the user."
				)
		)
		.describe("The options that the user can choose from."),
});

export const generate: Handler = async (c) => {
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

	const llm = new ChatOpenAI({
		openAIApiKey: c.env.OPENAI_API_KEY,
		temperature: 1,
	});

	const model = llm.bind({
		functions: [
			{
				name: "output_formatter",
				description: "Should always be used to properly format output",
				parameters: zodToJsonSchema(questionSchema),
			},
		],
		function_call: { name: "output_formatter" },
	});

	const outputParser = new JsonOutputFunctionsParser();
	const chain = model.pipe(outputParser);

	const response = (await chain.invoke(
		"Generate a fun, never-before-heard-of question for a would-you-rather game."
	)) as z.infer<typeof questionSchema>;

	const id = await redis.incr("num_questions");
	const question: Question = {
		id,
		text: response.text,
		options: response.options.map((option) => ({
			text: option,
			votes: 0,
		})),
	};

	await questions.set(id.toString(), question);

	return c.html((<QuestionContainer question={question} />) as string);
};
