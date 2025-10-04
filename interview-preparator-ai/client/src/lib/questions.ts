export type QuestionId = string;

export interface Question {
  id: QuestionId;
  q: string;
}

export const QUESTIONS = {
  frontend_react: [
    { id: 'fr1', q: 'Explain reconciliation and keys in React. Give an example from your experience.' },
    { id: 'fr2', q: 'Describe a tricky bug you fixed related to React state management.' },
    { id: 'fr3', q: 'How do you optimize performance in a React application? Share a specific example.' },
    { id: 'fr4', q: 'Explain the difference between useEffect and useLayoutEffect with a real-world use case.' },
    { id: 'fr5', q: 'Describe a situation where you had to choose between component composition and props drilling.' },
    { id: 'fr6', q: 'Tell me about a time you debugged a complex React rendering issue.' },
    { id: 'fr7', q: 'How do you handle error boundaries in React? Describe an implementation you did.' },
    { id: 'fr8', q: 'Explain Context API vs Redux. When did you choose one over the other?' },
    { id: 'fr9', q: 'Describe a challenging frontend architecture decision you made.' },
    { id: 'fr10', q: 'Tell me about implementing server-side rendering or static generation in a React project.' },
    { id: 'fr11', q: 'How do you ensure accessibility in React components? Give a specific example.' },
    { id: 'fr12', q: 'Describe a time when you had to refactor a large React codebase.' },
    { id: 'fr13', q: 'Explain custom hooks you created and the problem they solved.' },
    { id: 'fr14', q: 'Tell me about optimizing bundle size in a React application.' },
    { id: 'fr15', q: 'Describe handling complex forms in React with validation.' },
    { id: 'fr16', q: 'How do you approach testing React components? Share a challenging test case.' },
    { id: 'fr17', q: 'Tell me about implementing real-time features in a React app.' },
    { id: 'fr18', q: 'Describe a situation where you improved developer experience on your React team.' },
    { id: 'fr19', q: 'How do you handle authentication and authorization in React apps?' },
    { id: 'fr20', q: 'Tell me about a time you had to learn a new React pattern or library quickly.' },
  ],
  backend_node: [
    { id: 'bn1', q: 'How do you design a rate limiter for an API? Describe your implementation.' },
    { id: 'bn2', q: 'Tell me about a critical performance bottleneck you identified and resolved in Node.js.' },
    { id: 'bn3', q: 'Describe your approach to error handling and logging in a Node.js application.' },
    { id: 'bn4', q: 'How do you handle database migrations in production? Share a specific experience.' },
    { id: 'bn5', q: 'Explain a complex API design decision you made. What were the trade-offs?' },
    { id: 'bn6', q: 'Describe implementing authentication and session management in an Express app.' },
    { id: 'bn7', q: 'Tell me about debugging a memory leak in a Node.js application.' },
    { id: 'bn8', q: 'How do you ensure API security? Describe implementing security measures.' },
    { id: 'bn9', q: 'Describe designing and implementing a microservices architecture.' },
    { id: 'bn10', q: 'Tell me about handling file uploads and processing in Node.js.' },
    { id: 'bn11', q: 'How do you approach database schema design? Share a complex example.' },
    { id: 'bn12', q: 'Describe implementing caching strategies in your backend services.' },
    { id: 'bn13', q: 'Tell me about a time you optimized database queries for better performance.' },
    { id: 'bn14', q: 'How do you handle background jobs and task queues? Describe your implementation.' },
    { id: 'bn15', q: 'Describe setting up monitoring and alerting for a production Node.js service.' },
    { id: 'bn16', q: 'Tell me about implementing WebSocket or real-time communication.' },
    { id: 'bn17', q: 'How do you approach API versioning? Share a migration experience.' },
    { id: 'bn18', q: 'Describe handling transactions and ensuring data consistency.' },
    { id: 'bn19', q: 'Tell me about implementing third-party API integrations with error handling.' },
    { id: 'bn20', q: 'How do you approach load testing and capacity planning for backend services?' },
  ],
  data_sql: [
    { id: 'ds1', q: 'Explain indexing trade-offs and describe a real incident you handled related to indexes.' },
    { id: 'ds2', q: 'Tell me about optimizing a slow-running query. What was your approach?' },
    { id: 'ds3', q: 'Describe designing a data model for a complex business domain.' },
    { id: 'ds4', q: 'How do you handle data migration at scale? Share a specific experience.' },
    { id: 'ds5', q: 'Explain ACID properties and describe a scenario where you ensured them.' },
    { id: 'ds6', q: 'Tell me about implementing a data warehouse or analytics pipeline.' },
    { id: 'ds7', q: 'Describe debugging data inconsistency issues in a production database.' },
    { id: 'ds8', q: 'How do you approach database partitioning or sharding? Share an implementation.' },
    { id: 'ds9', q: 'Tell me about handling slowly changing dimensions in a data warehouse.' },
    { id: 'ds10', q: 'Describe implementing ETL pipelines with error handling and monitoring.' },
    { id: 'ds11', q: 'How do you ensure data quality and validation in your pipelines?' },
    { id: 'ds12', q: 'Tell me about optimizing joins and aggregations in complex queries.' },
    { id: 'ds13', q: 'Describe a time you had to choose between SQL and NoSQL solutions.' },
    { id: 'ds14', q: 'How do you handle database backups and disaster recovery? Share an experience.' },
    { id: 'ds15', q: 'Tell me about implementing incremental data loading strategies.' },
    { id: 'ds16', q: 'Describe working with window functions to solve a complex analytical problem.' },
    { id: 'ds17', q: 'How do you approach query performance tuning? Share a detailed example.' },
    { id: 'ds18', q: 'Tell me about implementing data access patterns for high concurrency.' },
    { id: 'ds19', q: 'Describe handling temporal or time-series data effectively.' },
    { id: 'ds20', q: 'How do you monitor and maintain database health in production?' },
  ],
} as const;

export type RoleSkill = keyof typeof QUESTIONS;

export const ROLE_SKILL_OPTIONS: { value: RoleSkill; label: string }[] = [
  { value: 'frontend_react', label: 'Front-End Engineer (React)' },
  { value: 'backend_node', label: 'Back-End Engineer (Node.js)' },
  { value: 'data_sql', label: 'Data Engineer (SQL)' },
];

/**
 * Get a random question for a given role/skill
 */
export function getRandomQuestion(roleSkill: RoleSkill): Question {
  const questions = QUESTIONS[roleSkill];
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Get all questions for a role/skill
 */
export function getQuestions(roleSkill: RoleSkill): Question[] {
  return [...QUESTIONS[roleSkill]];
}
