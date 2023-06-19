import { Schema } from 'mongoose';

enum MongooseQueryMethods {
  Find = 'find',
  FindOne = 'findOne',
  FindById = 'findById',
  FindOneAndDelete = 'findOneAndDelete',
  FindOneAndRemove = 'findOneAndRemove',
  FindOneAndUpdate = 'findOneAndUpdate',
  FindByIdAndDelete = 'findByIdAndDelete',
  FindByIdAndRemove = 'findByIdAndRemove',
  FindByIdAndUpdate = 'findByIdAndUpdate',
  UpdateOne = 'updateOne',
  UpdateMany = 'updateMany',
  DeleteOne = 'deleteOne',
  DeleteMany = 'deleteMany',
  CountDocuments = 'countDocuments',
  Distinct = 'distinct',
}

function applySoftDelete(schema: Schema) {
  for (const method of Object.values(MongooseQueryMethods)) {
    schema.pre(new RegExp(method), function () {
      this.where({ deletedAt: null, 'items.deletedAt': null });
    });
  }
}

export const mongoUtil = {
  applySoftDelete,
};
