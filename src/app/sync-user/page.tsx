import {auth, clerkClient} from '@clerk/nextjs/server';
import { redirect } from 'next/dist/server/api-utils';
import React from 'react';
import { db } from '~/server/db';


const syncUser = async () => {
    const {userId} = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const  Client = await clerkClient();
const user = await Client.users.getUser(userId);
    if (!user) {
        throw new Error("User not found");
    }

    await db.user.upsert({
        where: { id: user.id },
        update: {
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress 
        },
        create: {
            id: user.id,
            createdAt: new Date(),
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress 
        },
    })
    return redirect('/dashboard');
    
}
export default syncUser;