import { CurrencyEnum, FinancialGoalsType, MonthEnum } from '../../src/enums';
import { CreateFinancialGoal, CreateFinancialGoalBody } from '../../src/types/request/financial_goal';

const financialGoal: CreateFinancialGoal = new CreateFinancialGoal({
  name: 'Finacial goal example',
  note: 'Note Example',
  currency: CurrencyEnum.EUR,
  userId: '',
  month: MonthEnum.JANUARY,
  targetAmount: 0,
  type: FinancialGoalsType.SAVING,
  year: 2023,
});

function buildFinancialGoal(attributes: Partial<CreateFinancialGoalBody>): CreateFinancialGoal {
  const build = Object.assign({}, financialGoal);

  const keys = Object.keys(attributes);

  keys.forEach((key) => {
    build[key] = attributes[key];
  });

  return build;
}

export const financialGoalFactory = {
  financialGoal,
  buildFinancialGoal,
};
