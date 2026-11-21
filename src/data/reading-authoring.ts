import type { Question } from '../types';

type ReadingPart = 5 | 6 | 7;
type ExplainedOption = [text: string, reason: string];

export type ReadingDraft = Omit<Question, 'part' | 'options' | 'optionReasons'> & {
  options: [ExplainedOption, ExplainedOption, ExplainedOption, ExplainedOption];
};

export function readingQuestion(part: ReadingPart, draft: ReadingDraft): Question {
  const { options, ...question } = draft;
  return {
    ...question,
    part,
    options: options.map(([text]) => text),
    optionReasons: options.map(([, reason]) => reason),
  };
}

export function readingPassageQuestions(
  part: 6 | 7,
  topic: string,
  passages: NonNullable<Question['passages']>,
  drafts: Omit<ReadingDraft, 'topic' | 'passages'>[],
): Question[] {
  return drafts.map((draft) => readingQuestion(part, { ...draft, topic, passages }));
}
