import "../utils/env.js";
import { format, createLogger, transports } from "winston";
import type { TransformableInfo } from 'logform';
import type { Logger } from 'winston';

import path from 'path';
import fs from 'fs';

import { format as fnsFormat } from 'date-fns';
import type { FileTransportInstance } from "winston/lib/winston/transports/index.js";

function ensureDir(dir: string) {
   if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true });
}

function getLogFileName(dir: string): string {
   const now = new Date();
   const dateString = fnsFormat(now, 'yyyy-MM-dd_HH-mm-ss');
   return path.join(dir, `${dateString}.log`);
}

const customFormat = format.printf(({ timestamp, level, message, ...meta }: TransformableInfo) => {
   const msgText = typeof message === 'string' ? message : JSON.stringify(message);
   let msg = `[${timestamp}] ${level}: ${msgText}`;
   if (Object.keys(meta).length) msg += ` ${JSON.stringify(meta)}`;
   return msg;
});

export const logger: Logger = createLogger({
   level: process.env.LOG_LEVEL || 'verbose',
   format: format.combine(
      format.colorize({ all: true }),
      format.timestamp({ format: 'HH:mm:ss.SSS' }),
      format.splat(),
      customFormat
   ),
   transports: [new transports.Console()],
});

function waitForTransportFlush(transport: FileTransportInstance): Promise<void> {
   return new Promise((resolve) => {
      const stream = (transport as any)._stream;
      if (!stream || stream.destroyed || stream.writableEnded) {
         resolve();
         return;
      }
      stream.once('finish', resolve);
      stream.once('error', resolve);
      stream.once('close', resolve);
      transport.end?.();
   });
}

// winston log file transport, reset dir if no dir provided
export async function setLogDir(dir?: string): Promise<void> {
   const existingFileTransports = logger.transports
      .filter((t): t is FileTransportInstance => t instanceof transports.File);

   existingFileTransports.forEach(t => logger.remove(t));
   await Promise.all(existingFileTransports.map(waitForTransportFlush));

   if (dir) {
      ensureDir(dir);
      logger.add(new transports.File({ filename: getLogFileName(dir) }));
   }
}

