# Automation Scripts 101

## Core Concepts You Need

### 1. File System Operations
```typescript
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, resolve, basename } from 'path';

// Check if file/folder exists
existsSync('./apps/my-app')

// List directories
readdirSync('./apps', { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

// Read JSON files
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// Path operations
join('apps', 'my-app')        // apps/my-app
basename('/apps/my-app')      // my-app
resolve('./apps')             // /full/path/to/apps
```

### 2. Running Shell Commands

**Bun's `$` template:**
```typescript
import { $ } from 'bun';

// Simple command
await $`ls -la`;

// With variables
const dir = 'apps/my-app';
await $`cd ${dir} && npm install`;

// Capture output
const output = await $`git status`.text();

// Handle errors
try {
  await $`npm run build`;
} catch (error) {
  console.log('Build failed:', error.message);
}
```

**Alternative - spawn processes:**
```typescript
const proc = Bun.spawn(['npm', 'install'], {
  cwd: './apps/my-app',
  stdout: 'pipe'
});

const output = await new Response(proc.stdout).text();
```

### 3. Process Arguments & Environment
```typescript
// Command line args
const args = process.argv.slice(2); // Skip 'bun' and script name
const appNames = args.filter(arg => !arg.startsWith('-'));

// Environment variables
const NODE_ENV = process.env.NODE_ENV || 'development';

// Exit with error code
process.exit(1);
```

### 4. Async Patterns You'll Use

**Sequential processing:**
```typescript
for (const app of apps) {
  await buildApp(app);
}
```

**Parallel processing:**
```typescript
const results = await Promise.all(
  apps.map(app => buildApp(app))
);
```

**Batch processing:**
```typescript
const batches = chunk(apps, 3); // Process 3 at a time
for (const batch of batches) {
  await Promise.all(batch.map(buildApp));
}
```

### 5. Error Handling Patterns
```typescript
async function buildApp(name: string): Promise<{ name: string, success: boolean, error?: string }> {
  try {
    await $`cd apps/${name} && npm run build`;
    return { name, success: true };
  } catch (error) {
    return { 
      name, 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
```

### 6. Configuration Patterns

**Simple config file:**
```typescript
// config.ts
export const config = {
  appsDir: 'packages',
  buildCommand: 'npm run build',
  parallel: 4
};

// Using it
import { config } from './config.ts';
```

**Environment-based config:**
```typescript
const isDev = process.env.NODE_ENV === 'development';
const buildCmd = isDev ? 'npm run dev' : 'npm run build';
```

### 7. Dependency Resolution (Advanced)
```typescript
function buildDependencyGraph(apps: App[]): App[] {
  const visited = new Set<string>();
  const result: App[] = [];
  
  function visit(app: App) {
    if (visited.has(app.name)) return;
    
    // Visit dependencies first
    app.dependencies.forEach(dep => {
      const depApp = apps.find(a => a.name === dep);
      if (depApp) visit(depApp);
    });
    
    visited.add(app.name);
    result.push(app);
  }
  
  apps.forEach(visit);
  return result;
}
```

## Essential Bun APIs

### File Operations
```typescript
// Read files
const file = Bun.file('./package.json');
const content = await file.text();
const json = await file.json();

// Write files
await Bun.write('./output.txt', 'Hello world');
```

### Process Management
```typescript
// Spawn process
const proc = Bun.spawn(['git', 'status'], {
  cwd: process.cwd(),
  stdout: 'pipe',
  stderr: 'pipe'
});

// Check exit code
await proc.exited;
console.log('Exit code:', proc.exitCode);
```

## Common Automation Patterns

### 1. Discovery Pattern
```typescript
function discoverApps(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => existsSync(join(dir, d.name, 'package.json')))
    .map(d => d.name);
}
```

### 2. Validation Pattern
```typescript
function validateApp(appPath: string): boolean {
  const pkgPath = join(appPath, 'package.json');
  if (!existsSync(pkgPath)) return false;
  
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  return pkg.scripts?.build !== undefined;
}
```

### 3. Progress Reporting
```typescript
let completed = 0;
const total = apps.length;

async function buildWithProgress(app: string) {
  const result = await buildApp(app);
  completed++;
  console.log(`[${completed}/${total}] ${app} - ${result.success ? '✅' : '❌'}`);
  return result;
}
```

### 4. Cleanup Pattern
```typescript
process.on('SIGINT', async () => {
  console.log('\nCleaning up...');
  // Kill any running processes, clean temp files, etc.
  process.exit(0);
});
```

## Pro Tips

**1. Always handle errors gracefully:**
```typescript
// Don't do this
await $`npm run build`; // Crashes entire script if one app fails

// Do this
try {
  await $`npm run build`;
  return { success: true };
} catch (error) {
  return { success: false, error: error.message };
}
```

**2. Use TypeScript interfaces:**
```typescript
interface BuildResult {
  app: string;
  success: boolean;
  duration: number;
  error?: string;
}
```

**3. Make scripts resumable:**
```typescript
// Skip already built apps
if (existsSync(join(app.path, 'dist'))) {
  console.log(`Skipping ${app.name} (already built)`);
  return;
}
```

**4. Add dry-run mode:**
```typescript
const dryRun = args.includes('--dry-run');

if (dryRun) {
  console.log('Would run:', command);
} else {
  await $`${command}`;
}
```

## Quick Reference - What You Actually Need

**For 90% of automation scripts:**
- `fs` operations: `existsSync`, `readdirSync`, `readFileSync`
- `path` operations: `join`, `basename`
- Bun's `$` for shell commands
- `process.argv` for CLI args
- `Promise.all` for parallel execution
- Try/catch for error handling

**That's literally it.** Master these and you can automate anything.