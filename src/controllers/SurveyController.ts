import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveyRepository"
import * as Yup from "yup"
import { AppError } from "../errors/AppError"

class SurveyController {
    async create(req: Request, res: Response) {
        const { title, description } = req.body

        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required()
        })

        try {
            await schema.validate(req.body, { abortEarly: false })
        } catch (error) {
            throw new AppError(error)
        }

        const surveysRepository = getCustomRepository(SurveysRepository)
        const survey = surveysRepository.create({
            title, description
        })

        await surveysRepository.save(survey)

        return res.status(201).json(survey)
    }

    async show(req: Request, res: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository)
        const all = await surveysRepository.find()

        return res.json(all)
    }
}

export { SurveyController }