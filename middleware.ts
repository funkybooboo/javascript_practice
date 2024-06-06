export {default} from "next-auth/middleware";

export const config = {
    matcher: [
        // * : zero or more
        // + : one or more
        // ? zero or one
        '/users/:id*'
    ]
}