import {v4 as uuid} from 'uuid';
import {List, Record} from 'immutable';
import {Observable} from 'utils/observable';
import {Saga} from 'utils/types';
import {action, key} from 'utils';
import {log} from 'utils/test-log';
import {call, take} from 'utils/saga';

export interface ITodo {
  id: string;
  title: string;
  info?: string;
  completed?: boolean;
}

export interface ITodoNew {
  title: string;
  info?: string;
}

export const TodoRecord = Record<ITodo>({
  id: '',
  title: '',
  info: '',
  completed: false,
});

export const TodoNewRecord = Record<ITodoNew>({
  title: '',
  info: '',
});

class Todos {
  @key public readonly type?: string;

  readonly data = new Observable<List<Record<ITodo>>>(List([
    new TodoRecord({id: uuid(), title: 'Learn JS', info: 'test description'}),
    new TodoRecord({id: uuid(), title: 'Buy staff'}),
    new TodoRecord({id: uuid(), title: 'Actualize diff'}),
  ]));

  constructor(type?: string) {
    this.type = type;
  }

  @action add(todo: ITodoNew) {
    this.data.update(data => (
      data.push(new TodoRecord(todo).set('id', uuid()))
    ));
  }

  @action remove(id: string) {
    const index = this.findById(id);
    if (index >= 0) {
      this.data.update(data => data.remove(index));
    }
  }

  @action setCompleted(id: string, completed: boolean) {
    const index = this.findById(id);
    if (index >= 0) {
      this.data.update(data => (
        data.update(index, todo => todo.set('completed', completed))
      ));
    }
  }

  private findById(id: string) {
    return this.data.get()
      .findIndex((todo) => todo.get('id') === id);
  }

  * watchSetCompleted(num: number): Saga {
    for (let i = 0; i < num; ) {
      const takenAction = yield take(this.setCompleted); // TODO improve effect type!
      // @ts-ignore
      const [, completed] = takenAction.payload;
      if (completed) i++;
    }

    yield call(log, `Congratulations! You've completed ${num} tasks!`);
  }
}

export default new Todos('main');
