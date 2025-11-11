import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { method, url, body } = req
    const path = url?.replace("/api", "") || ""
    const ASAAS_URL = `https://api.asaas.com/v3${path}`

    try {
        const response = await fetch(ASAAS_URL, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ASAAS_TOKEN}`,
            },
            body: ["POST", "PUT", "PATCH"].includes(method || "")
                ? JSON.stringify(body)
                : undefined,
        })

        const data = await response.text()
        res.status(response.status).send(data)
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
}
