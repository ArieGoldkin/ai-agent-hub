/**
 * CLI Spinner - Loading indicators for CLI operations
 */

import ora, { type Ora, type Options } from "ora";

export interface CLISpinner {
  start(text?: string): CLISpinner;
  stop(): CLISpinner;
  succeed(text?: string): CLISpinner;
  fail(text?: string): CLISpinner;
  warn(text?: string): CLISpinner;
  info(text?: string): CLISpinner;
  text: string;
  isSpinning: boolean;
}

class SpinnerWrapper implements CLISpinner {
  private spinner: Ora;

  constructor(options: string | Options) {
    this.spinner = ora(options);
  }

  start(text?: string): CLISpinner {
    if (text) {
      this.spinner.text = text;
    }
    this.spinner.start();
    return this;
  }

  stop(): CLISpinner {
    this.spinner.stop();
    return this;
  }

  succeed(text?: string): CLISpinner {
    this.spinner.succeed(text);
    return this;
  }

  fail(text?: string): CLISpinner {
    this.spinner.fail(text);
    return this;
  }

  warn(text?: string): CLISpinner {
    this.spinner.warn(text);
    return this;
  }

  info(text?: string): CLISpinner {
    this.spinner.info(text);
    return this;
  }

  get text(): string {
    return this.spinner.text;
  }

  set text(value: string) {
    this.spinner.text = value;
  }

  get isSpinning(): boolean {
    return this.spinner.isSpinning;
  }
}

/**
 * Create a new spinner instance
 */
export function createSpinner(text?: string): CLISpinner {
  const options: Options = {
    text: text || "Loading...",
    color: "cyan",
    spinner: "dots"
  };

  // Disable spinner in CI environments or when NO_COLOR is set
  if (process.env["CI"] === "true" || process.env["NO_COLOR"] === "1") {
    (options as Options & { isEnabled?: boolean }).isEnabled = false;
  }

  return new SpinnerWrapper(options);
}

/**
 * Create a spinner with custom options
 */
export function createCustomSpinner(options: Options): CLISpinner {
  // Disable spinner in CI environments or when NO_COLOR is set
  if (process.env["CI"] === "true" || process.env["NO_COLOR"] === "1") {
    (options as Options & { isEnabled?: boolean }).isEnabled = false;
  }

  return new SpinnerWrapper(options);
}

/**
 * Utility function to run an async operation with a spinner
 */
export async function withSpinner<T>(
  text: string,
  operation: (spinner: CLISpinner) => Promise<T>,
  successText?: string,
  failureText?: string
): Promise<T> {
  const spinner = createSpinner(text);
  spinner.start();

  try {
    const result = await operation(spinner);
    spinner.succeed(successText);
    return result;
  } catch (error) {
    spinner.fail(
      failureText ||
        `Failed: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
