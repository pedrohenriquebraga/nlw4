import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveyRepository"
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository"
import { UsersRepository } from "../repositories/UserRepository"
import { resolve } from "path"
import SendMailService from "../services/SendMailService"
import { AppError } from "../errors/AppError"

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveyRepository = getCustomRepository(SurveysRepository)
        const surveyUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await usersRepository.findOne({ email })

        if (!user) {
            throw new AppError("User does not exists")
        }

        const survey = await surveyRepository.findOne({ id: survey_id })
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")


        if (!survey) {
            throw new AppError("Survey does not exists")
        }
        const surveyUserAlreadyExists = await surveyUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"]
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return res.json(surveyUserAlreadyExists)
        }

        // Salvar às informações na tabela surveyUser

        const surveyUser = surveyUsersRepository.create({
            user_id: user.id,
            survey_id: survey_id
        })

        await surveyUsersRepository.save(surveyUser)
        variables.id = surveyUser.id

        // Enviar e-mail ao usuário

        await SendMailService.execute(email, survey.title, variables, npsPath)
        return res.json(surveyUser)
    }
}

export { SendMailController }