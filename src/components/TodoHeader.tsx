import {memo} from 'react';

const TodoHeader = memo<{}>(() => {
  return (
    <tr>
      <th/>
      <th>Title</th>
      <th>Info</th>
      <th/>
    </tr>
  );
});

export default TodoHeader;
