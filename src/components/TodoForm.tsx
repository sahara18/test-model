import {ChangeEvent, memo, useCallback, useState} from 'react';
import {Record} from 'immutable';
import {ITodoNew, RecordTodoNew} from 'models/todos';

interface IProps {
  onSubmit: (values: ITodoNew) => void;
}

const initialValues = new RecordTodoNew({
  title: '',
  info: '',
});

const TodoForm = memo<IProps>((props) => {
  const {onSubmit} = props;
  const [values, setValues] = useState<Record<ITodoNew>>(initialValues);

  const handleInputChange = useCallback((name: keyof ITodoNew) => (
    (e: ChangeEvent<HTMLInputElement>) => {
      setValues(values => values.set(name, e.target.value));
    }
  ), []);

  const handleAddClick = useCallback(() => {
    onSubmit(values.toJS());
    setValues(initialValues);
  }, [onSubmit, values]);

  return (
    <tr>
      <th/>
      <th>
        <input
          value={values.get('title')}
          onChange={handleInputChange('title')}
          placeholder="Title *"
        />
      </th>
      <th>
        <input
          value={values.get('info')}
          onChange={handleInputChange('info')}
          placeholder="Info"
        />
      </th>
      <th>
        <button
          onClick={handleAddClick}
          disabled={!values.get('title')}
        >
          Add
        </button>
      </th>
    </tr>
  );
});

export default TodoForm;
