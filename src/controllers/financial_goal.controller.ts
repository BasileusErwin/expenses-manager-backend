import { NextFunction, Request, Response } from 'express';
import { CustomResponse } from '../lib';
import { TransactionModel } from '../models';
import { validationHelper } from '../helpers';
import { financialGoalService } from '../services';
import { CreateFinancialGoal } from '../types/request/financial_goal';

async function createFinancialGoal(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { userId } = res.locals;

    const body: CreateFinancialGoal = new CreateFinancialGoal({
      ...req.body,
      userId,
    });

    const financialGoal = await financialGoalService.createFinancialGoal(body);

    res.send(new CustomResponse(true, financialGoal));
  } catch (err) {
    return next(err);
  }
}

async function getFinancialGoalById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = res.locals;
    const { goalId } = req.params;

    const financialGoal = await financialGoalService.getFinancialGoal(
      {
        userId,
        goalId,
      },
      [
        {
          model: TransactionModel,
        },
      ],
    );

    return res.send(new CustomResponse(true, financialGoal));
  } catch (err) {
    return next(err);
  }
}

async function getAllFinancialGoals(_req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = res.locals;

    const financialGoals = await financialGoalService.getAllFinancialGoals(
      {
        userId,
      },
      [
        {
          model: TransactionModel,
        },
      ],
    );

    return res.send(new CustomResponse(true, financialGoals));
  } catch (err) {
    return next(err);
  }
}

export const financialGoalController = {
  createFinancialGoal,
  getFinancialGoalById,
  getAllFinancialGoals,
};
