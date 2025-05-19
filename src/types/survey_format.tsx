type DetailField = {
  title: string, 
  type: string, 
  optional: boolean, 
  choices?: string[],
  limit?: number
}

type Pages = {
  title: string, 
  questions: string[]
}

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