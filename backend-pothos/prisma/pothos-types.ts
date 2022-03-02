import type { Prisma, User, Payment, Household, Message } from "/home/spectro/dev/budgify/backend-pothos/node_modules/.pnpm/@prisma+client@3.9.2_prisma@3.9.2/node_modules/@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "households" | "ownedHouseholds" | "payments" | "receivedMessages" | "sentMessages";
        ListRelations: "households" | "ownedHouseholds" | "payments" | "receivedMessages" | "sentMessages";
        Relations: {
            households: {
                Shape: Household[];
                Types: PrismaTypes["Household"];
            };
            ownedHouseholds: {
                Shape: Household[];
                Types: PrismaTypes["Household"];
            };
            payments: {
                Shape: Payment[];
                Types: PrismaTypes["Payment"];
            };
            receivedMessages: {
                Shape: Message[];
                Types: PrismaTypes["Message"];
            };
            sentMessages: {
                Shape: Message[];
                Types: PrismaTypes["Message"];
            };
        };
    };
    Payment: {
        Name: "Payment";
        Shape: Payment;
        Include: Prisma.PaymentInclude;
        Where: Prisma.PaymentWhereUniqueInput;
        Fields: "user" | "household";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            household: {
                Shape: Household;
                Types: PrismaTypes["Household"];
            };
        };
    };
    Household: {
        Name: "Household";
        Shape: Household;
        Include: Prisma.HouseholdInclude;
        Where: Prisma.HouseholdWhereUniqueInput;
        Fields: "owner" | "members" | "payments" | "messages";
        ListRelations: "members" | "payments" | "messages";
        Relations: {
            owner: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            members: {
                Shape: User[];
                Types: PrismaTypes["User"];
            };
            payments: {
                Shape: Payment[];
                Types: PrismaTypes["Payment"];
            };
            messages: {
                Shape: Message[];
                Types: PrismaTypes["Message"];
            };
        };
    };
    Message: {
        Name: "Message";
        Shape: Message;
        Include: Prisma.MessageInclude;
        Where: Prisma.MessageWhereUniqueInput;
        Fields: "sender" | "receiver" | "household";
        ListRelations: never;
        Relations: {
            sender: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            receiver: {
                Shape: User | null;
                Types: PrismaTypes["User"];
            };
            household: {
                Shape: Household | null;
                Types: PrismaTypes["Household"];
            };
        };
    };
}