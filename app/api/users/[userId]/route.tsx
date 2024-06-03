import {NextRequest, NextResponse} from "next/server";
import schema from '../schema';
import prisma from "@/prisma/client";

interface Props {
    params: {
        userId: string;
    }
}

export async function GET(request: NextRequest, {params: {userId}}: Props) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
    });
    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }
    return NextResponse.json(user, {status: 200});
}

export async function PUT(request: NextRequest, {params: {userId}}: Props) {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400});
    }
    return NextResponse.json({id: 1, name: body.name}, {status: 200});
}

export function DELETE(request: NextRequest, {params: {userId}}: Props) {

    return NextResponse.json({}, {status: 200});
}
