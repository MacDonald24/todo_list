import { Moment } from 'moment';
import { ICategory } from 'app/shared/model/category.model';

export interface ITask {
  id?: number;
  title?: string;
  description?: string;
  date?: Moment;
  status?: boolean;
  category?: ICategory;
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public date?: Moment,
    public status?: boolean,
    public category?: ICategory
  ) {
    this.status = this.status || false;
  }
}
