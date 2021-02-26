import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository";
import { AppError } from "../errors/AppError"

class AnswerController {
    async execute(req: Request, res: Response) {
        const { value } = req.params
        const { u } = req.query

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u),
        })

        if (!surveyUser) {
            throw new AppError("Survey user not found");
        }

        surveyUser.value = Number(value)
        await surveysUsersRepository.save(surveyUser)

        return res.json(surveyUser)
    }
}

export { AnswerController }