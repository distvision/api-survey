import { Request, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveyUsersRepository } from '../repositories/SurveysUsersRepository'
import { UsersRepository } from '../repositories/UsersRepository'

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

  const surveyAlreadyExists = await surveyRepository.findOne({id: survey_id,})

  if(!surveyAlreadyExists){
    return res.status(400).json({
      error: "survey does not exists"
    })
  }

  const surveyUser = surveyUsersRepository.create({
    user_id: userAlreadyExists.id,
    survey_id,
  })
  await surveyUsersRepository.save(surveyUser)
  

  return res.json(surveyUser)
}
}

export{SendMailController}