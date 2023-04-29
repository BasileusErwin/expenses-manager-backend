import { TransactionType } from '../../src/enums';
import { CreateCategoryRequest, BodyRequest } from '../../src/types/request/category';

const category: CreateCategoryRequest = new CreateCategoryRequest({
  name: 'Category example',
  note: 'Note Example',
  type: TransactionType.INCOME,
  userId: '',
});

function buildCategory(attributes: Partial<BodyRequest>): CreateCategoryRequest {
  const build = Object.assign({}, category);

  const keys = Object.keys(attributes);

  keys.forEach((key) => {
    build[key] = attributes[key];
  });

  return build;
}

export const categoryFactory = {
  category,
  buildCategory,
};
