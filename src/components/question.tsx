import Html from "@kitajs/html";
import { type Question } from "../api";

interface QuestionProps {
	question: Question;
	showResults?: boolean;
}

export const QuestionContainer = ({ question, showResults }: QuestionProps) => {
	const votes = question.options.reduce((s, option) => s + option.votes, 0);

	return (
		<div
			id="question"
			class="h-[calc(100vh-3.75rem)] bg-zinc-900 text-white"
		>
			<div class="flex flex-col h-[calc(100%-1rem)]">
				<div class="shrink-0 flex justify-center py-4">
					<h1 class="w-3/4 text-center text-xl">
						{question.text.replace("Would you rather", "").trim()}
					</h1>
				</div>

				<div class="flex flex-col h-full sm:flex-row gap-2 px-4">
					{question.options.map((option, idx) => (
						<button
							hx-post={`/api/vote?questionId=${question.id}&optionIdx=${idx}`}
							hx-disabled-elt="this"
							hx-target="#question"
							hx-swap="outerHTML"
							hx-trigger="click"
							disabled={showResults}
							class="basis-1/2 flex flex-col justify-center items-center p-16 bg-zinc-800 w-full h-full rounded-md even:bg-blue-600 odd:bg-red-600"
						>
							{showResults && (
								<p class="text-7xl font-extrabold">
									{Math.trunc((100 * option.votes) / votes)}%
								</p>
							)}
							<p class="break-words text-4xl text-center uppercase font-bold">
								{option.text}
							</p>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
