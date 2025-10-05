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

  devops_cloud: [
    { id: 'dc1', q: 'Explain how you implemented CI/CD pipelines and the tools you used.' },
    { id: 'dc2', q: 'Describe a production incident related to deployment automation. How did you resolve it?' },
    { id: 'dc3', q: 'How do you manage secrets and environment variables in production?' },
    { id: 'dc4', q: 'Tell me about setting up observability using logs, metrics, and traces.' },
    { id: 'dc5', q: 'Explain how you would design a scalable infrastructure on AWS or GCP.' },
    { id: 'dc6', q: 'Describe container orchestration with Kubernetes and a challenge you faced.' },
    { id: 'dc7', q: 'How do you ensure cost optimization in cloud workloads?' },
    { id: 'dc8', q: 'Tell me about implementing blue-green or canary deployments.' },
    { id: 'dc9', q: 'Describe managing multi-region failover and disaster recovery in cloud systems.' },
    { id: 'dc10', q: 'How do you approach infrastructure-as-code? Give an example using Terraform or CDK.' },
  ],

  ml_ai: [
    { id: 'ml1', q: 'Explain bias-variance tradeoff and how you handled it in a project.' },
    { id: 'ml2', q: 'Describe a time when your ML model underperformed in production and how you diagnosed it.' },
    { id: 'ml3', q: 'Tell me about feature engineering techniques that made a measurable impact.' },
    { id: 'ml4', q: 'How do you ensure reproducibility and versioning in ML experiments?' },
    { id: 'ml5', q: 'Explain how you handled model deployment and monitoring at scale.' },
    { id: 'ml6', q: 'Describe working with unbalanced datasets. What methods did you use?' },
    { id: 'ml7', q: 'Tell me about optimizing model inference performance in real-time applications.' },
    { id: 'ml8', q: 'How do you decide between deep learning and classical ML approaches?' },
    { id: 'ml9', q: 'Describe a situation where data drift impacted your model performance.' },
    { id: 'ml10', q: 'Explain federated learning or privacy-preserving model training you worked on.' },
  ],

  security: [
    { id: 'sec1', q: 'Describe implementing authentication and authorization securely in a web app.' },
    { id: 'sec2', q: 'Explain XSS and CSRF. How did you mitigate them in past projects?' },
    { id: 'sec3', q: 'Tell me about handling secure secrets management and encryption.' },
    { id: 'sec4', q: 'Describe a time you conducted or remediated a penetration test.' },
    { id: 'sec5', q: 'How do you implement secure password storage and rotation?' },
    { id: 'sec6', q: 'Explain using HTTPS, HSTS, and CSP in frontend-backend communication.' },
    { id: 'sec7', q: 'Tell me about a real vulnerability you discovered and fixed.' },
    { id: 'sec8', q: 'How do you ensure secure API design and validation?' },
    { id: 'sec9', q: 'Describe setting up role-based access control (RBAC) in production.' },
    { id: 'sec10', q: 'How do you integrate security testing into CI/CD pipelines?' },
  ],

  system_design: [
    { id: 'sd1', q: 'How would you design a URL shortening service like bit.ly?' },
    { id: 'sd2', q: 'Describe designing a real-time chat application architecture.' },
    { id: 'sd3', q: 'How would you scale an image processing service?' },
    { id: 'sd4', q: 'Explain designing a distributed caching system.' },
    { id: 'sd5', q: 'How do you ensure consistency and availability in distributed databases?' },
    { id: 'sd6', q: 'Tell me about designing a rate limiter for millions of users.' },
    { id: 'sd7', q: 'How would you architect a recommendation system?' },
    { id: 'sd8', q: 'Explain how you would design a notification service.' },
    { id: 'sd9', q: 'How do you handle scaling database reads in high traffic systems?' },
    { id: 'sd10', q: 'Describe trade-offs between vertical and horizontal scaling with examples.' },
  ],

  mobile_flutter: [
    { id: 'mf1', q: 'Explain Flutter’s widget tree concept and how it affects rendering performance.' },
    { id: 'mf2', q: 'Describe state management strategies you’ve used in Flutter and why.' },
    { id: 'mf3', q: 'Tell me about integrating native code (Android/iOS) with Flutter.' },
    { id: 'mf4', q: 'How do you optimize startup time and performance in Flutter apps?' },
    { id: 'mf5', q: 'Explain how you handled API integration and error states gracefully.' },
    { id: 'mf6', q: 'Describe implementing animations in Flutter and ensuring smooth transitions.' },
    { id: 'mf7', q: 'Tell me about testing strategies in Flutter — unit, widget, and integration tests.' },
    { id: 'mf8', q: 'How do you manage local storage and offline functionality?' },
    { id: 'mf9', q: 'Explain how you set up CI/CD for mobile app deployment.' },
    { id: 'mf10', q: 'Describe publishing a Flutter app and handling version upgrades.' },
  ],
} as const;

export type RoleSkill = keyof typeof QUESTIONS;

export const ROLE_SKILL_OPTIONS: { value: RoleSkill; label: string }[] = [
  { value: 'frontend_react', label: 'Front-End Engineer (React)' },
  { value: 'backend_node', label: 'Back-End Engineer (Node.js)' },
  { value: 'data_sql', label: 'Data Engineer (SQL)' },
  { value: 'devops_cloud', label: 'DevOps / Cloud Engineer' },
  { value: 'ml_ai', label: 'Machine Learning Engineer / AI Specialist' },
  { value: 'security', label: 'Security Engineer' },
  { value: 'system_design', label: 'System Design / Architect' },
  { value: 'mobile_flutter', label: 'Mobile Engineer (Flutter)' },
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
