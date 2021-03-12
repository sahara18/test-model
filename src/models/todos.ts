import {v4 as uuid} from 'uuid';
import autobind from 'autobind-decorator';
import {List, Record} from 'immutable';
import {Observable} from 'utils/Observable';

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

export const RecordTodo = Record<ITodo>({
  id: '',
  title: '',
  info: '',
  completed: false,
});

export const RecordTodoNew = Record<ITodoNew>({
  title: '',
  info: '',
});

@autobind class Todos {
  readonly data = new Observable<List<Record<ITodo>>>(List([
    new RecordTodo({id: uuid(), title: 'Learn JS', info: 'test description'}),
    new RecordTodo({id: uuid(), title: 'Buy staff'}),
    new RecordTodo({id: uuid(), title: 'Actualize diff'}),
  ]));

  add(todo: ITodoNew) {
    this.data.update(data => (
      data.push(new RecordTodo(todo).set('id', uuid()))
    ));
  }

  remove(id: string) {
    const index = this.findById(id);
    if (index >= 0) {
      this.data.update(data => data.remove(index));
    }
  }

  setCompleted(id: string, completed: boolean) {
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
}

export default new Todos();
