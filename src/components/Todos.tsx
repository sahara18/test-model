import {memo} from 'react';
import {List, Record} from 'immutable';
import todos, {ITodo} from 'models/todos';
import {useObservable} from 'utils/Observable';
import TodoHeader from './TodoHeader';
import TodoForm from './TodoForm';
import Todo from './Todo';

const Todos = memo<{}>(() => {
  const data = useObservable<List<Record<ITodo>>>(todos.data);

  return (
    <table>
      <thead>
      <TodoHeader/>
      <TodoForm onSubmit={todos.add}/>
      </thead>

      <tbody>
      {data.map(((todo) => (
        <Todo
          key={todo.get('id')}
          data={todo}
          onToggleCompleted={todos.setCompleted}
          onRemove={todos.remove}
        />
      )))}
      </tbody>
    </table>
  );
});

export default Todos;
