import { IncludeOptions, WhereOptions } from 'sequelize';
import { plainToInstance } from 'class-transformer';
import { CreateFinancialGoal, UpdateOptions } from '../types/request/financial_goal';
import { FinancialGoalModel } from '../models';
import { FinancialGoalDTO } from '../types/DTOs';
import { CustomError } from '../lib';
import { ApiError } from '../enums';

async function createFinancialGoal(newGoal: CreateFinancialGoal): Promise<FinancialGoalDTO> {
  const financialGoal = await FinancialGoalModel.create(newGoal);

  return plainToInstance(FinancialGoalDTO, financialGoal);
}

async function updateFinancialGoal(
  newGoal: UpdateOptions,
  where: WhereOptions<FinancialGoalModel>,
): Promise<FinancialGoalDTO> {
  const financialGoal = await FinancialGoalModel.findOne({
    where,
  });

  if (!financialGoal) {
    throw new CustomError(ApiError.FinancialGoal.FINANCIAL_GOAL_NOT_EXIST);
  }

  const updated = await FinancialGoalModel.update(newGoal, {
    where,
  });

  return plainToInstance(FinancialGoalDTO, updated[0][1]);
}

async function getFinancialGoal(
  where: WhereOptions<FinancialGoalModel>,
  include: IncludeOptions[],
): Promise<FinancialGoalDTO> {
  const financialGoal = await FinancialGoalModel.findOne({
    where,
    include,
  });

  return plainToInstance(FinancialGoalDTO, financialGoal);
}

async function getAllFinancialGoals(
  where: WhereOptions<FinancialGoalModel>,
  include: IncludeOptions[],
): Promise<FinancialGoalDTO[]> {
  const financialGoals = await FinancialGoalModel.findAll({
    where,
    include,
  });

  return plainToInstance(FinancialGoalDTO, financialGoals);
}

export const financialGoalService = {
  createFinancialGoal,
  updateFinancialGoal,
  getAllFinancialGoals,
  getFinancialGoal,
};
