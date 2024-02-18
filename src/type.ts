interface SocketRes {
    (req: any): {
        ok: boolean;
        msg?: string;
        user?: {
            id: string;
            nick: string;
            no: number
        }
    }
}