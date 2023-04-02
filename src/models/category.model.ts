import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TransactionType } from '../enums';
import { TransactionModel } from '.';

@Table({ modelName: 'categories', paranoid: true })
export class CategoryModel extends Model<CategoryModel> {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  public categoryId: string;

  @Column({
    allowNull: false,
  })
  public type: TransactionType;

  @Column({
    allowNull: false,
  })
  public value: string;

  @Column({ allowNull: true })
  public note: string;

  @HasMany(() => TransactionModel, 'category_id')
  public trasactions: TransactionModel[];
}

export default CategoryModel;
