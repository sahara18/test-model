import {ChangeEvent, memo, useCallback} from 'react';
import {Record} from 'immutable';
import {ITodo} from 'models/todos';
import cx from 'classnames';
import './Todo.scss';

interface IProps {
  data: Record<ITodo>;
  onToggleCompleted: (id: string, completed: boolean) => void;
  onRemove: (id: string) => void;
}

const Todo = memo<IProps>((props) => {
  const {
    data,
    onToggleCompleted,
    onRemove,
  } = props;

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onToggleCompleted(data.get('id'), e.target.checked)
  }, [data, onToggleCompleted]);

  const handleRemoveClick = useCallback(() => {
    onRemove(data.get('id'))
  }, [data, onRemove]);

  return (
    <tr
      className={cx(
        'todo',
        {todo_completed: data.get('completed')},
      )}
    >
      <td>
        <input
          type="checkbox"
          checked={data.get('completed')}
          onChange={handleInputChange}
        />
      </td>
      <td>{data.get('title')}</td>
      <td className="todo-info">{data.get('info')}</td>
      <td><button onClick={handleRemoveClick}>Remove</button></td>
    </tr>
  );
});

export default Todo;
