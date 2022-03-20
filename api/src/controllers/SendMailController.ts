import { Request, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveyUsersRepository } from '../repositories/SurveysUsersRepository'
import { UsersRepository } from '../repositories/UsersRepository'
import  SendMailService  from '../services/SendMailService'


class SendMailController {
async execute(req: Request, res: Response){
  const {email, survey_id} = req.body

  const usersRepository = getCustomRepository(UsersRepository)
  const surveyRepository = getCustomRepository(SurveysRepository)
  const surveyUsersRepository = getCustomRepository(SurveyUsersRepository)

  const userAlreadyExists = await usersRepository.findOne({email})

  if(!userAlreadyExists){
    return res.status(400).json({
      error: "user does not exists"
    })
  }

  const survey = await surveyRepository.findOne({id: survey_id,})

  if(!survey){
    return res.status(400).json({
      error: "survey does not exists"
    })
  }

  // Salvar as informações na tabela surveyUser
  const surveyUser = surveyUsersRepository.create({
    user_id: userAlreadyExists.id,
    survey_id,
  })
  
  await surveyUsersRepository.save(surveyUser)
  // Enviar e-mail para o usuario

  await SendMailService.execute(
    email,
    survey.title,
    survey.description
  )

  return res.json(surveyUser)
}
}

export{SendMailController}