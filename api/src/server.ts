// #rumoaoproximonivel

import express from "express"

const app = express()

/*
- GET -> Busca
- POST -> Salvar
- PUT -> Alterar
- DELETE -> Apagar
- PATCH -> Alteração Específica
*/

app.get("/", (req, res) => {
    return res.json({ message: "Hello World!" })
})

app.post("/", (req, res) => {
    // Recebe dados para salvar...

    return res.json({ message: "Os dados foram salvos com sucesso!" })
})

app.listen(3000, () => console.log("Server is running!"))