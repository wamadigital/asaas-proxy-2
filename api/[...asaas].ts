import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // ✅ Corrige CORS
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // ✅ Responde rapidamente a pré-verificações do navegador (OPTIONS)
    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

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

        // ✅ Envia os mesmos headers CORS também na resposta final
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")

        const data = await response.text()
        res.status(response.status).send(data)
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
}
