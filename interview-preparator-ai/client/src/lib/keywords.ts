/**
 * Domain-specific keywords for relevance scoring
 */

export const ROLE_SKILL_KEYWORDS: Record<string, string[]> = {
  frontend_react: [
    'jsx', 'tsx', 'state', 'props', 'hooks', 'useeffect', 'usestate', 'usememo', 'usecallback',
    'reconciliation', 'virtual dom', 'fiber', 'effects', 'context', 'memo', 'render', 'component',
    'key', 'ref', 'lifecycle', 'mount', 'unmount', 'redux', 'zustand', 'routing', 'react router',
    'performance', 'optimization', 'lazy', 'suspense', 'error boundary', 'portal', 'fragment',
    'dom', 'event', 'synthetic', 'controlled', 'uncontrolled', 'form', 'validation'
  ],
  backend_node: [
    'express', 'middleware', 'api', 'rest', 'graphql', 'rate limit', 'jwt', 'auth', 'token',
    'database', 'db', 'sql', 'nosql', 'mongodb', 'postgres', 'cache', 'redis', 'memcached',
    'queue', 'worker', 'job', 'bull', 'scaling', 'load', 'cluster', 'async', 'await', 'promise',
    'event loop', 'callback', 'stream', 'buffer', 'http', 'https', 'socket', 'websocket',
    'npm', 'package', 'module', 'require', 'import', 'export', 'error handling', 'logging',
    'monitoring', 'deployment', 'docker', 'container', 'microservice', 'serverless'
  ],
  data_sql: [
    'index', 'indexes', 'join', 'inner join', 'left join', 'outer join', 'query plan', 'explain',
    'normalization', '1nf', '2nf', '3nf', 'transaction', 'acid', 'isolation', 'commit', 'rollback',
    'aggregate', 'group by', 'having', 'window', 'partition', 'row_number', 'rank', 'schema',
    'table', 'column', 'primary key', 'foreign key', 'constraint', 'unique', 'null', 'select',
    'insert', 'update', 'delete', 'where', 'order by', 'limit', 'offset', 'subquery', 'cte',
    'view', 'stored procedure', 'trigger', 'function', 'performance', 'optimization', 'slow query',
    'execution plan', 'statistics', 'cardinality', 'denormalization', 'sharding', 'replication'
  ],
};

/**
 * Related term groups for semantic scoring
 */
export const RELATED_TERMS: Record<string, string[][]> = {
  frontend_react: [
    ['state', 'setstate', 'usestate', 'statemanagement'],
    ['effect', 'useeffect', 'sideeffect', 'lifecycle'],
    ['component', 'render', 'rerender', 'update'],
    ['performance', 'optimization', 'memo', 'usememo', 'usecallback'],
    ['props', 'properties', 'data', 'passing'],
  ],
  backend_node: [
    ['api', 'endpoint', 'route', 'handler'],
    ['database', 'db', 'query', 'data'],
    ['auth', 'authentication', 'authorization', 'jwt', 'token'],
    ['async', 'await', 'promise', 'callback'],
    ['performance', 'optimization', 'cache', 'scaling'],
  ],
  data_sql: [
    ['index', 'indexes', 'indexing', 'performance'],
    ['join', 'inner', 'outer', 'left', 'right'],
    ['query', 'select', 'where', 'filter'],
    ['aggregate', 'group', 'sum', 'count', 'avg'],
    ['transaction', 'commit', 'rollback', 'acid'],
  ],
};

/**
 * STAR framework keywords for contextual relevance
 */
export const STAR_KEYWORDS = {
  situation: ['project', 'team', 'working', 'company', 'role', 'context', 'background', 'when', 'where'],
  task: ['needed', 'challenge', 'problem', 'goal', 'objective', 'responsibility', 'assigned', 'had to'],
  action: ['did', 'implemented', 'created', 'built', 'designed', 'developed', 'decided', 'chose', 'approach', 'first', 'then', 'next'],
  result: ['achieved', 'reduced', 'improved', 'increased', 'saved', 'delivered', 'impact', 'outcome', 'metric', 'percent', '%', 'success'],
};

/**
 * Common stopwords to ignore during keyword matching
 */
export const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it',
  'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they',
  'have', 'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how', 'we', 'our', 'us', 'i',
  'my', 'me', 'you', 'your', 'so', 'do', 'does', 'did', 'can', 'could', 'would', 'should'
]);

/**
 * Get keywords for a specific role/skill
 */
export function getKeywordsForRole(roleSkill: string): string[] {
  return ROLE_SKILL_KEYWORDS[roleSkill] || [];
}

/**
 * Get related term groups for semantic matching
 */
export function getRelatedTerms(roleSkill: string): string[][] {
  return RELATED_TERMS[roleSkill] || [];
}

/**
 * Extract important keywords from question text
 */
export function extractQuestionKeywords(question: string): string[] {
  const normalized = question.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !STOPWORDS.has(word));
  
  return [...new Set(normalized)];
}
