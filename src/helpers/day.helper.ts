import { MonthEnum } from '../enums';
import moment from 'moment';

const getMaxDayByMonth = (month: MonthEnum): Number => {
  switch (month) {
    case MonthEnum.APRIL:
    case MonthEnum.JUNE:
    case MonthEnum.SEPTEMBER:
    case MonthEnum.NOVEMBER:
      return 30;

    case MonthEnum.JANUARY:
    case MonthEnum.MARCH:
    case MonthEnum.MAY:
    case MonthEnum.JULY:
    case MonthEnum.AUGUST:
    case MonthEnum.OCTOBER:
    case MonthEnum.DECEMBER:
      return 31;

    case MonthEnum.FEBRUARY:
      const year = moment().year();

      if (year % 4 !== 0 || year % 400 !== 0) {
        return 28;
      } else {
        return 29;
      }
  }
};

export const dayHelper = {
  getMaxDayByMonth,
};
