# ts-rate-limiter-lite

Um rate limiter leve, rápido e fácil de usar para Node.js com TypeScript. Proteja suas APIs com controle inteligente de requisições!

##  Instalação

```bash
npm install ts-rate-limiter-lite
```

##  Uso Básico

### 1. Importe e configure

```typescript
import { 
  RateLimiterFactory, 
  MemoryStorage 
} from 'ts-rate-limiter-lite';

// Criar armazenamento em memória
const storage = new MemoryStorage();

// Configurar o rate limiter
const rateLimiter = RateLimiterFactory.create(
  { 
    strategy: 'fixedWindow', // ou 'slidingWindow'
    options: {
      maxRequests: 100,      // Máximo de requisições
      interval: 60000,       // Janela de tempo em ms (1 minuto)
    },
  },
  storage
);
```

### 2. Use no seu código

```typescript
async function handleRequest(userId: string) {
  // Verificar se usuário ultrapassou o limite
  const result = await rateLimiter.isRateLimited(userId);
  
  if (result.remaining <= 0) {
    return {
      status: 429,
      message: 'Muitas requisições. Tente novamente em ' + 
               Math.ceil((result.reset - Date.now()) / 1000) + 's'
    };
  }
  
  // Requisição permitida!
  return {
    status: 200,
    data: 'Sucesso!',
    remaining: result.remaining
  };
}
```

##  Estratégias

### Fixed Window (Janela Fixa)
Reseta o contador em intervalos fixos.

**Quando usar**: Simples, rápido, bom para a maioria dos casos.

```typescript
const limiter = RateLimiterFactory.create(
  {
    strategy: 'fixedWindow',
    options: {
      maxRequests: 100,
      interval: 60000, // Reset a cada 1 minuto
    },
  },
  storage
);
```

### Sliding Window (Janela Deslizante)
Janela que "desliza" continuamente, mais preciso.

**Quando usar**: Maior precisão, quando precisa evitar picos no final de intervalos.

```typescript
const limiter = RateLimiterFactory.create(
  {
    strategy: 'slidingWindow',
    options: {
      maxRequests: 100,
      interval: 60000,
    },
  },
  storage
);
```

##  Resultado de uma Requisição

Cada chamada retorna um objeto com informações úteis:

```typescript
const result = await rateLimiter.isRateLimited('user123');

console.log(result);
// {
//   limit: 100,          // Limite máximo
//   remaining: 87,       // Requisições restantes
//   used: 13,           // Requisições já usadas
//   reset: 1705600000   // Timestamp quando reseta (ms)
// }
```

##  Exemplos Práticos

### Express.js

```typescript
import express from 'express';
import { RateLimiterFactory, MemoryStorage } from 'ts-rate-limiter-lite';

const app = express();
const storage = new MemoryStorage();

const limiter = RateLimiterFactory.create(
  {
    strategy: 'fixedWindow',
    options: {
      maxRequests: 50,
      interval: 60000,
    },
  },
  storage
);

// Middleware de rate limit
app.use(async (req, res, next) => {
  const userId = req.ip || 'unknown';
  const result = await limiter.isRateLimited(userId);
  
  res.set('X-RateLimit-Limit', result.limit.toString());
  res.set('X-RateLimit-Remaining', result.remaining.toString());
  
  if (result.remaining <= 0) {
    return res.status(429).json({
      error: 'Limite de requisições atingido',
      resetIn: Math.ceil((result.reset - Date.now()) / 1000) + 's'
    });
  }
  
  next();
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'Protegido por rate limit!' });
});

app.listen(3000);
```

### Fastify

```typescript
import Fastify from 'fastify';
import { RateLimiterFactory, MemoryStorage } from 'ts-rate-limiter-lite';

const fastify = Fastify();
const storage = new MemoryStorage();

const limiter = RateLimiterFactory.create(
  {
    strategy: 'fixedWindow',
    options: {
      maxRequests: 100,
      interval: 60000,
    },
  },
  storage
);

fastify.addHook('preHandler', async (request, reply) => {
  const userId = request.ip;
  const result = await limiter.isRateLimited(userId);
  
  if (result.remaining <= 0) {
    reply.status(429);
    throw new Error('Rate limit exceeded');
  }
});

fastify.get('/api/endpoint', async () => {
  return { message: 'OK' };
});

fastify.listen({ port: 3000 });
```

##  API Completa

### `isRateLimited(key: string): Promise<RateLimitResult>`
Verifica se uma chave (usuário/IP) ultrapassou o limite.

```typescript
const result = await limiter.isRateLimited('user123');
```

### `getRateLimit(key: string): Promise<RateLimitResult | null>`
Obtém informações sem fazer requisição.

```typescript
const info = await limiter.getRateLimit('user123');
console.log(info?.remaining); // Requisições restantes
```

### `resetRateLimit(key: string): Promise<void>`
Reseta o contador manualmente.

```typescript
await limiter.resetRateLimit('user123');
```

##  Configuração

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `strategy` | string | - | `'fixedWindow'` ou `'slidingWindow'` |
| `maxRequests` | number | 100 | Máximo de requisições permitidas |
| `interval` | number | 60000 | Intervalo em milissegundos (padrão: 1 min) |

## Vantagens

**Leve**: Sem dependências pesadas  
**Rápido**: Otimizado para performance  
**Fácil**: API simples e intuitiva  
**TypeScript**: Tipagem completa  
**Flexível**: Duas estratégias diferentes  
**Node.js**: Framework agnóstico  

##  Licença

MIT

##  Autor

Robson Developer

---

**Dúvidas?** Consulte a documentação ou abra uma issue no repositório!
