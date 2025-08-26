/**
 * CLI Logger - Colorized console output for CLI commands
 */

import chalk from "chalk";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export interface CLILogger {
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  trace(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

class ColorizedLogger implements CLILogger {
  private readonly name: string;
  private readonly level: LogLevel;
  private readonly noColor: boolean;

  constructor(name: string, level: LogLevel = "info") {
    this.name = name;
    this.level = level;
    this.noColor = process.env["NO_COLOR"] === "1";
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    args: unknown[]
  ): string {
    const levelIcon = this.getLevelIcon(level);
    const levelColor = this.getLevelColor(level);
    const nameColor = this.noColor ? this.name : chalk.dim(`[${this.name}]`);

    const formattedLevel = this.noColor
      ? level.toUpperCase()
      : levelColor(levelIcon);
    const argsStr =
      args.length > 0
        ? ` ${args
            .map(arg =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")}`
        : "";

    return `${formattedLevel} ${nameColor} ${message}${argsStr}`;
  }

  private getLevelIcon(level: LogLevel): string {
    const icons = {
      error: "❌",
      warn: "⚠️ ",
      info: "ℹ️ ",
      debug: "🔍",
      trace: "🔬"
    };
    return icons[level] || "ℹ️ ";
  }

  private getLevelColor(level: LogLevel): (text: string) => string {
    if (this.noColor) return (text: string) => text;

    const colors = {
      error: chalk.red,
      warn: chalk.yellow,
      info: chalk.blue,
      debug: chalk.cyan,
      trace: chalk.magenta
    };
    return colors[level] || chalk.white;
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, args));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, args));
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, args));
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, args));
    }
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.shouldLog("trace")) {
      console.trace(this.formatMessage("trace", message, args));
    }
  }

  success(message: string, ...args: unknown[]): void {
    const icon = this.noColor ? "✓" : "✅";
    const successColor = this.noColor ? (text: string) => text : chalk.green;
    const nameColor = this.noColor ? this.name : chalk.dim(`[${this.name}]`);

    const argsStr =
      args.length > 0
        ? ` ${args
            .map(arg =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")}`
        : "";

    console.log(`${successColor(icon)} ${nameColor} ${message}${argsStr}`);
  }
}

let globalLogLevel: LogLevel = (process.env["LOG_LEVEL"] as LogLevel) || "info";

export function setGlobalLogLevel(level: LogLevel): void {
  globalLogLevel = level;
}

export function createLogger(name: string, level?: LogLevel): CLILogger {
  return new ColorizedLogger(name, level || globalLogLevel);
}
