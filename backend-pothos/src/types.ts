import { Session } from '@prisma/client';
import { IncomingMessage, OutgoingMessage } from 'http';
import { IronSession } from 'iron-session';

export interface Context {
  req: IncomingMessage;
  res: OutgoingMessage;
  ironSession: IronSession;
  session?: Session | null;
}
