/* eslint-disable @typescript-eslint/no-namespace */
// declare global {
//     namespace NodeJS {
//         interface ProcessEnv {
//             NODE_ENV: 'development' | 'production';
//             ADMIN_USERNAME: string,
//             ADMIN_PASSWORD: string,
//             JWT_SECRET: string,
//             JWT_DURATION?: string,
//         }
//     }
// }

export type FieldErrors = ReturnType<ZodError["flatten"]>["fieldErrors"];


export { }