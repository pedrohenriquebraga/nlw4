import request from "supertest"
import { createConnection, getConnection } from "typeorm"
import { app } from "../app"

describe("Answer", () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()

    })

    it("Deve retornar erro para pesquisas inexistentes", async () => {
        const response = await request(app).get("/answers/10?u=123")

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message")
    })
})