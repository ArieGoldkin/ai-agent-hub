import { createHash } from 'crypto';
import { FileOperation } from '../debug-mode/types.js';
import { FileOperationParams } from './types.js';

export class FileOperations {
  static createFileOperation(params: FileOperationParams): FileOperation {
    return {
      timestamp: new Date(),
      agentId: params.agentId,
      operation: params.operation,
      filepath: params.filepath,
      beforeHash: params.beforeContent ? this.hashContent(params.beforeContent) : undefined,
      afterHash: params.afterContent ? this.hashContent(params.afterContent) : undefined,
      success: params.success,
      duration: params.duration
    };
  }

  private static hashContent(content: string): string {
    return createHash('md5').update(content).digest('hex').substring(0, 8);
  }
}