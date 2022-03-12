import { EntityRepository, Repository } from "typeorm";
import { SurveyUsers } from "../models/SurveyUsers";

@EntityRepository(SurveyUsers)
class SurveyUsersRepository extends Repository<SurveyUsers> {

}

export {SurveyUsersRepository}