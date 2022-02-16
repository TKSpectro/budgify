import type { Prisma, User, Session, Post, Comment } from "/home/spectro/dev/budgify/backend-pothos/node_modules/.pnpm/@prisma+client@3.9.2_prisma@3.9.2/node_modules/@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "sessions" | "posts" | "comments";
        ListRelations: "sessions" | "posts" | "comments";
        Relations: {
            sessions: {
                Shape: Session[];
                Types: PrismaTypes["Session"];
            };
            posts: {
                Shape: Post[];
                Types: PrismaTypes["Post"];
            };
            comments: {
                Shape: Comment[];
                Types: PrismaTypes["Comment"];
            };
        };
    };
    Session: {
        Name: "Session";
        Shape: Session;
        Include: Prisma.SessionInclude;
        Where: Prisma.SessionWhereUniqueInput;
        Fields: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
    Post: {
        Name: "Post";
        Shape: Post;
        Include: Prisma.PostInclude;
        Where: Prisma.PostWhereUniqueInput;
        Fields: "author" | "comments";
        ListRelations: "comments";
        Relations: {
            author: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            comments: {
                Shape: Comment[];
                Types: PrismaTypes["Comment"];
            };
        };
    };
    Comment: {
        Name: "Comment";
        Shape: Comment;
        Include: Prisma.CommentInclude;
        Where: Prisma.CommentWhereUniqueInput;
        Fields: "author" | "post";
        ListRelations: never;
        Relations: {
            author: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            post: {
                Shape: Post;
                Types: PrismaTypes["Post"];
            };
        };
    };
}