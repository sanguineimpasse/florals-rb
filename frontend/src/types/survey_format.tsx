type DetailField = {
  id: string,
  title: string, 
  type: string, 
  optional: boolean, 
  choices?: string[],
  limit?: number
};

type PageQuestions = {
  id: string,
  question: string
};

type Pages = {
  title: string, 
  questions: Array<PageQuestions>
};

export type Survey = {
  id: string,
  version: string,
  title: string,
  type: string,
  desc?: string,
  color?: string,
  details_field: {
    title: string,
    fields: Array<DetailField>
  },
  pages: Array<Pages>
};

export default Survey;