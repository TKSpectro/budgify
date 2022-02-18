// import { Session, User } from '@prisma/client';
// import { addSeconds, differenceInSeconds } from 'date-fns';
// import { IncomingMessage, ServerResponse } from 'http';
// import { getIronSession, IronSession, IronSessionOptions } from 'iron-session';
// import { prisma } from './prisma';

// // The duration that the session will be valid for, in seconds (default is 15 days).
// // We will automatically renew these sessions after 25% of the validity period.
// const SESSION_TTL = 15 * 24 * 3600;

// declare module 'iron-session' {
//   interface IronSessionData {
//     // The database ID of the session:
//     sessionID?: string | null;
//   }
// }

// if (!process.env.COOKIE_SECRET) {
//   console.warn(
//     'No `COOKIE_SECRET` environment variable was set. This can cause production errors.',
//   );
// }

// const SESSION_OPTIONS: IronSessionOptions = {
//   password: {
//     1: process.env.COOKIE_SECRET as string,
//   },
//   cookieName: 'session.info',
//   ttl: SESSION_TTL,
//   cookieOptions: {
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     httpOnly: true,
//   },
// };

// export async function createSession(ironSession: IronSession, user: User) {
//   const session = await prisma.session.create({
//     data: {
//       userId: user.id,
//       expiresAt: addSeconds(new Date(), SESSION_TTL),
//     },
//   });

//   ironSession.sessionID = session.id;

//   await ironSession.save();

//   return session;
// }

// export async function removeSession(
//   ironSession: IronSession,
//   session?: Session | null,
// ) {
//   ironSession.destroy();
//   await ironSession.save();

//   if (session) {
//     await prisma.session.delete({ where: { id: session.id } });
//   }
// }

// interface CachedSession {
//   session: Session | null;
//   ironSession: IronSession;
// }

// const sessionCache = new WeakMap<IncomingMessage, CachedSession>();
// export async function resolveSession(
//   req: IncomingMessage,
//   res: ServerResponse,
// ): Promise<CachedSession> {
//   const cachedSession = sessionCache.get(req);
//   if (cachedSession) {
//     return cachedSession;
//   }

//   const ironSession = await getIronSession(req, res, SESSION_OPTIONS);
//   const sessionID = ironSession.sessionID;

//   let session: Session | null = null;

//   if (sessionID) {
//     session = await prisma.session.findFirst({
//       where: {
//         id: sessionID,
//         expiresAt: {
//           gte: new Date(),
//         },
//       },
//     });

//     if (session) {
//       // If we resolve a session in the request, we'll automatically renew it 25% of the session has elapsed:
//       const shouldRefreshSession =
//         differenceInSeconds(session.expiresAt, new Date()) < 0.75 * SESSION_TTL;

//       if (shouldRefreshSession) {
//         await prisma.session.update({
//           where: {
//             id: session.id,
//           },
//           data: {
//             expiresAt: addSeconds(new Date(), SESSION_TTL),
//           },
//         });

//         await ironSession.save();
//       }
//     } else {
//       // There was no session found in the DB, but one was found in the session store.
//       // This means that the browser is out-of-date with the server. In this case,
//       // we just destroy the session entirely.
//       ironSession.destroy();
//       await ironSession.save();
//     }
//   }

//   sessionCache.set(req, { session, ironSession });

//   return { session, ironSession };
// }
export const lulz = 'lulz';
