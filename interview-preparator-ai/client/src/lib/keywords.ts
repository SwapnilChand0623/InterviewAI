/**
 * Domain-specific keywords for relevance scoring
 */

export const ROLE_SKILL_KEYWORDS: Record<string, string[]> = {
  frontend_react: [
    // Core concepts
    'jsx', 'tsx', 'react', 'reactjs', 'state', 'props', 'hooks', 'component', 'components',
    // Hooks (all variations)
    'useeffect', 'usestate', 'usememo', 'usecallback', 'useref', 'usecontext', 'usereducer',
    'use effect', 'use state', 'use memo', 'use callback', 'use ref', 'use context', 'use reducer',
    'hook', 'custom hook', 'custom hooks',
    // Rendering
    'render', 'rendering', 'rerender', 'rerenders', 'reconciliation', 'virtual dom', 'vdom', 'fiber',
    'dom', 'real dom', 'shadow dom', 'update', 'updates', 'updating',
    // State management
    'state management', 'stateful', 'stateless', 'redux', 'zustand', 'mobx', 'context', 'context api',
    'global state', 'local state', 'shared state', 'reducer', 'dispatch', 'action',
    // Effects & Lifecycle
    'effects', 'side effect', 'side effects', 'lifecycle', 'mount', 'unmount', 'mounting', 'unmounting',
    'cleanup', 'dependency', 'dependencies', 'dependency array',
    // Performance
    'performance', 'optimization', 'optimize', 'memo', 'memoization', 'memoize', 'lazy', 'lazy loading',
    'suspense', 'code splitting', 'bundle', 'tree shaking',
    // Component types
    'functional', 'functional component', 'class component', 'pure component', 'hoc', 'higher order',
    'fragment', 'portal', 'error boundary', 'boundary',
    // Props & Data
    'properties', 'prop', 'pass', 'passing', 'children', 'child', 'parent', 'data flow',
    // Events
    'event', 'events', 'handler', 'handlers', 'onclick', 'onchange', 'synthetic', 'synthetic event',
    // Forms
    'form', 'forms', 'input', 'controlled', 'uncontrolled', 'validation', 'validate',
    // Routing
    'routing', 'router', 'react router', 'route', 'routes', 'navigate', 'navigation', 'link',
    // Keys & Refs
    'key', 'keys', 'ref', 'refs', 'reference', 'references', 'forwarding',
  ],
  backend_node: [
    // Core Node.js
    'node', 'nodejs', 'node.js', 'javascript', 'js', 'server', 'backend', 'runtime',
    // Frameworks
    'express', 'expressjs', 'express.js', 'framework', 'koa', 'fastify', 'nest', 'nestjs',
    // API concepts
    'api', 'apis', 'rest', 'restful', 'rest api', 'endpoint', 'endpoints', 'route', 'routes', 'routing',
    'graphql', 'graph ql', 'mutation', 'query', 'resolver', 'schema',
    // Middleware
    'middleware', 'middlewares', 'handler', 'handlers', 'request', 'response', 'req', 'res',
    // Authentication
    'auth', 'authentication', 'authorization', 'jwt', 'token', 'tokens', 'session', 'sessions',
    'passport', 'oauth', 'security', 'secure',
    // Database
    'database', 'db', 'databases', 'sql', 'nosql', 'mongodb', 'mongo', 'postgres', 'postgresql',
    'mysql', 'sqlite', 'orm', 'sequelize', 'mongoose', 'prisma', 'typeorm',
    'connection', 'pool', 'connection pool', 'transaction', 'transactions',
    // Caching
    'cache', 'caching', 'redis', 'memcached', 'memory cache', 'cdn',
    // Async operations
    'async', 'await', 'asynchronous', 'synchronous', 'promise', 'promises', 'callback', 'callbacks',
    'event loop', 'non-blocking', 'blocking',
    // Streams & Buffers
    'stream', 'streams', 'streaming', 'buffer', 'buffers', 'pipe', 'piping',
    // HTTP
    'http', 'https', 'protocol', 'get', 'post', 'put', 'delete', 'patch', 'method', 'methods',
    'status code', 'header', 'headers', 'body', 'request body', 'response body',
    // WebSockets
    'socket', 'sockets', 'websocket', 'websockets', 'socket.io', 'realtime', 'real-time', 'bidirectional',
    // Package management
    'npm', 'yarn', 'package', 'packages', 'module', 'modules', 'dependency', 'dependencies',
    'require', 'import', 'export', 'commonjs', 'esm', 'es modules',
    // Error handling
    'error', 'errors', 'error handling', 'exception', 'exceptions', 'try', 'catch', 'throw',
    // Logging & Monitoring
    'logging', 'logger', 'log', 'logs', 'winston', 'morgan', 'monitoring', 'monitor', 'metrics',
    // Scaling & Performance
    'scaling', 'scale', 'scalability', 'load', 'load balancing', 'cluster', 'clustering', 'worker',
    'workers', 'queue', 'queues', 'job', 'jobs', 'bull', 'message queue', 'background',
    'rate limit', 'rate limiting', 'throttle', 'throttling',
    // Deployment
    'deployment', 'deploy', 'docker', 'container', 'containerization', 'kubernetes', 'k8s',
    'microservice', 'microservices', 'serverless', 'lambda', 'function', 'cloud',
    // Testing
    'test', 'testing', 'unit test', 'integration', 'jest', 'mocha', 'chai',
  ],
  data_sql: [
    // Core concepts
    'sql', 'query', 'queries', 'querying', 'database', 'db', 'rdbms', 'relational',
    // Tables & Schema
    'table', 'tables', 'column', 'columns', 'row', 'rows', 'record', 'records',
    'schema', 'schemas', 'structure', 'data structure',
    // Indexes
    'index', 'indexes', 'indices', 'indexing', 'indexed', 'btree', 'b-tree', 'hash index',
    'composite index', 'clustered', 'non-clustered', 'unique index',
    // Joins
    'join', 'joins', 'joining', 'inner join', 'left join', 'right join', 'outer join', 'full join',
    'cross join', 'self join', 'natural join', 'left outer', 'right outer',
    // Queries
    'select', 'insert', 'update', 'delete', 'create', 'drop', 'alter', 'truncate',
    'where', 'having', 'order by', 'group by', 'limit', 'offset', 'distinct',
    'subquery', 'subqueries', 'nested', 'cte', 'common table', 'with', 'recursive',
    // Aggregates
    'aggregate', 'aggregates', 'aggregation', 'sum', 'count', 'avg', 'average', 'min', 'max',
    'group', 'grouping', 'rollup', 'cube',
    // Window functions
    'window', 'window function', 'partition', 'partition by', 'row_number', 'rank', 'dense_rank',
    'lead', 'lag', 'over', 'frame',
    // Constraints
    'constraint', 'constraints', 'primary key', 'foreign key', 'unique', 'not null', 'null',
    'check', 'default', 'auto increment', 'identity',
    // Transactions
    'transaction', 'transactions', 'acid', 'atomic', 'consistency', 'isolation', 'durability',
    'commit', 'rollback', 'savepoint', 'begin', 'start transaction',
    'lock', 'locking', 'deadlock', 'serializable', 'read committed', 'repeatable read',
    // Normalization
    'normalization', 'normalize', 'normalized', 'denormalization', 'denormalize',
    '1nf', '2nf', '3nf', 'bcnf', 'first normal', 'second normal', 'third normal',
    // Performance
    'performance', 'optimize', 'optimization', 'slow query', 'fast', 'speed',
    'execution plan', 'query plan', 'explain', 'explain plan', 'analyze',
    'statistics', 'cardinality', 'selectivity', 'cost', 'scan', 'table scan', 'index scan',
    // Advanced
    'view', 'views', 'materialized', 'stored procedure', 'procedure', 'function', 'functions',
    'trigger', 'triggers', 'cursor', 'cursors',
    'sharding', 'shard', 'partition', 'partitioning', 'replication', 'replica', 'master', 'slave',
    // Data types
    'varchar', 'char', 'int', 'integer', 'bigint', 'decimal', 'float', 'date', 'datetime',
    'timestamp', 'boolean', 'text', 'blob', 'json', 'jsonb', 'array',
  ],
};

/**
 * Synonym maps per domain - synonyms map to root term
 */
export const SYNONYMS: Record<string, Record<string, string[]>> = {
  frontend_react: {
    'jsx': ['tsx', 'render tree', 'elements', 'element', 'markup', 'xml', 'syntax'],
    'state': ['usestate', 'use state', 'stateful', 'state management', 'setstate', 'local state', 'component state'],
    'props': ['properties', 'attributes', 'prop', 'data', 'parameters', 'arguments'],
    'hooks': ['use effect', 'use state', 'use memo', 'use callback', 'use ref', 'use context', 'hook', 'custom hook'],
    'component': ['components', 'functional component', 'class component', 'function component', 'pure component', 'react component'],
    'render': ['rendering', 'rerender', 'renders', 'rerenders', 'display', 'paint', 'draw', 'update'],
    'virtual dom': ['vdom', 'reconciliation', 'fiber', 'diffing', 'diff algorithm'],
    'effect': ['side effect', 'useeffect', 'use effect', 'effects', 'side effects', 'lifecycle'],
    'lifecycle': ['mount', 'unmount', 'mounting', 'unmounting', 'component lifecycle', 'lifecycle methods'],
    'optimization': ['optimize', 'optimizing', 'memo', 'memoization', 'memoize', 'performance', 'fast', 'efficient'],
    'event': ['events', 'handler', 'handlers', 'onclick', 'onchange', 'synthetic event', 'event listener'],
    'form': ['forms', 'input', 'inputs', 'controlled', 'uncontrolled', 'validation', 'validate'],
  },
  backend_node: {
    'api': ['apis', 'endpoint', 'endpoints', 'rest', 'restful', 'rest api', 'web api', 'service'],
    'express': ['expressjs', 'express.js', 'framework', 'web framework', 'server framework'],
    'middleware': ['middlewares', 'handler', 'handlers', 'interceptor', 'plugin'],
    'database': ['db', 'databases', 'data store', 'datastore', 'persistence', 'storage'],
    'async': ['asynchronous', 'await', 'promise', 'promises', 'non-blocking', 'concurrent'],
    'cache': ['caching', 'redis', 'memcached', 'memory cache', 'in-memory', 'cached'],
    'auth': ['authentication', 'authorization', 'jwt', 'token', 'session', 'login', 'security'],
    'scaling': ['scale', 'scalability', 'load balancing', 'horizontal scaling', 'vertical scaling', 'distributed'],
    'queue': ['queues', 'job queue', 'message queue', 'bull', 'background job', 'worker', 'task queue'],
    'request': ['req', 'http request', 'api request', 'incoming', 'client request'],
    'response': ['res', 'http response', 'api response', 'reply', 'send'],
    'route': ['routes', 'routing', 'router', 'path', 'endpoint'],
    'error': ['errors', 'exception', 'exceptions', 'error handling', 'try catch', 'throw'],
  },
  data_sql: {
    'index': ['indexes', 'indices', 'indexing', 'indexed', 'btree', 'hash index', 'composite index'],
    'join': ['joins', 'joining', 'inner join', 'left join', 'outer join', 'right join', 'cross join'],
    'query': ['queries', 'querying', 'select', 'select statement', 'sql statement', 'command'],
    'transaction': ['transactions', 'transactional', 'acid', 'commit', 'rollback', 'atomic'],
    'aggregate': ['aggregation', 'group by', 'sum', 'count', 'avg', 'average', 'min', 'max', 'grouping'],
    'normalization': ['normalize', '1nf', '2nf', '3nf', 'normalized', 'normal form', 'denormalization'],
    'performance': ['optimize', 'optimization', 'slow query', 'execution plan', 'query plan', 'fast', 'speed', 'efficient'],
    'schema': ['schemas', 'table', 'tables', 'column', 'columns', 'structure', 'data structure', 'database structure'],
    'constraint': ['constraints', 'primary key', 'foreign key', 'unique', 'check', 'validation'],
    'subquery': ['subqueries', 'nested query', 'inner query', 'derived table', 'cte', 'with'],
  },
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

/**
 * Simple stemming: remove common suffixes
 */
export function stem(word: string): string {
  let stemmed = word.toLowerCase();
  
  // Remove plural 's'
  if (stemmed.endsWith('s') && stemmed.length > 3 && !stemmed.endsWith('ss')) {
    stemmed = stemmed.slice(0, -1);
  }
  
  // Remove 'ing'
  if (stemmed.endsWith('ing') && stemmed.length > 5) {
    stemmed = stemmed.slice(0, -3);
  }
  
  // Remove 'ed'
  if (stemmed.endsWith('ed') && stemmed.length > 4) {
    stemmed = stemmed.slice(0, -2);
  }
  
  return stemmed;
}

/**
 * Get synonyms for a term in a specific domain
 */
export function getSynonyms(term: string, roleSkill: string): string[] {
  const domainSynonyms = SYNONYMS[roleSkill];
  if (!domainSynonyms) return [];
  
  const termLower = term.toLowerCase();
  
  // Check if term is a root
  if (domainSynonyms[termLower]) {
    return [termLower, ...domainSynonyms[termLower]];
  }
  
  // Check if term is a synonym
  for (const [root, syns] of Object.entries(domainSynonyms)) {
    if (syns.some(syn => syn.toLowerCase() === termLower)) {
      return [root, ...syns];
    }
  }
  
  return [termLower];
}

/**
 * Get required keywords for a specific question + role/skill
 * Returns keywords that should be considered for this question
 */
export function getRequiredKeywords(question: string, roleSkill: string): string[] {
  const roleKeywords = getKeywordsForRole(roleSkill);
  const questionKeywords = extractQuestionKeywords(question);
  
  // Combine: prioritize question keywords, then add relevant role keywords
  const required = [
    ...questionKeywords,
    ...roleKeywords.slice(0, 10), // Top 10 role keywords
  ];
  
  return [...new Set(required)];
}
