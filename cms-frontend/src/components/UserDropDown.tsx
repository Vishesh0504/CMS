

import  { useState } from 'react';
import Select from 'react-select';

interface User{
  email:string;
  name:string;
}
const UserDropdown = ({ users }:{users:User[]}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  const options = users.map(user => ({
    value: user.email,
    label: user.name
  }));

  return (
    <Select
      isMulti
      options={options}
      value={selectedUsers}
      onChange={handleChange}
    />
  );
};

export default UserDropdown;
