import { execSync, spawn } from "child_process";
import { rmSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = join(root, ".next");

// 1. Mata qualquer processo na porta 3004
try {
  execSync(
    'for /f "tokens=5" %a in (\'netstat -aon ^| findstr :3004\') do taskkill /F /PID %a',
    { shell: "cmd.exe", stdio: "ignore" }
  );
} catch {
  // porta livre, sem problema
}

// 2. Deleta .next com força (ignora erros de arquivo travado)
if (existsSync(nextDir)) {
  try {
    rmSync(nextDir, { recursive: true, force: true });
    console.log("✓ Cache .next removido");
  } catch {
    console.warn("⚠ Não foi possível remover .next por completo, continuando...");
  }
}

// 3. Sobe o dev server
const child = spawn("npx", ["next", "dev", "-p", "3004"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));

// Repassa Ctrl+C corretamente
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
