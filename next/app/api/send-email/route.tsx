
import {Resend} from 'resend';
import WelcomeTemplate from "@/emails/WelcomeTemplate";
import {NextRequest, NextResponse} from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    await resend.emails.send({
        from: 'you need to own this domain',
        to: 'nate.stott@ifit.com',
        subject: '...',
        react: <WelcomeTemplate name={"Nate"}/>
    });
    return NextResponse.json({message: "email sent"},{status: 200});
}