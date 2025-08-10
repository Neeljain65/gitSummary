import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function SyncUserPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

    await db.user.upsert({
        where: { id: user.id },
        update: {
            imageUrl: user.imageUrl,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
            email: user.emailAddresses[0]?.emailAddress,
        },
        create: {
            id: user.id,
            createdAt: new Date(),
            imageUrl: user.imageUrl,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
            email: user.emailAddresses[0]?.emailAddress,
        },
    });

    redirect("/dashboard");
}