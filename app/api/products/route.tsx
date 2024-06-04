import {NextRequest, NextResponse} from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const products = await prisma.product.findMany();
    if (!products) {
        return NextResponse.json({error: "No products found"}, {status: 404});
    }
    return NextResponse.json(products, {status: 200});
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({error: validation.error.errors}, {status: 400});
    }
    const newProduct = await prisma.product.create({
        data: {
            name: body.name,
            description: body.description,
            price: body.price,
            stock: body.stock
        }
    });
    return NextResponse.json(newProduct, {status: 201});
}