import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editdingRow, setEditingRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setEditingRow(data.find((e) => e.id === id));
  };

  const handleChange = (id, updatedRow) => {
    setEditingRow(updatedRow);
  };

  const handleSave = (id, updatedRow) => {
    const updatedData = data.map((rowEle) => {
      if (rowEle.id === id) {
        return updatedRow;
      }
      return rowEle;
    });
    setData(updatedData);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const updatedData = data.filter((rowEle) => rowEle.id !== id);
    setData(updatedData);
  };

  const handleBulkDelete = () => {
    const updatedData = data.filter((row) => !selectedRows.includes(row.id));
    setData(updatedData);
    setSelectedRows([]);
  };

  const toggleRowSelection = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
    }
  };

  return (
    <div className="outer-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>
              <button onClick={handleBulkDelete}>Bulk Delete</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                {editingId === row.id ? (
                  <input
                    type="text"
                    value={editdingRow?.name}
                    onChange={(e) =>
                      handleChange(row.id, { ...editdingRow, name: e.target.value })
                    }
                  />
                ) : (
                  row.name
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    type="text"
                    value={editdingRow?.email}
                    onChange={(e) =>
                      handleChange(row.id, { ...editdingRow, email: e.target.value })
                    }
                  />
                ) : (
                  row.email
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    type="text"
                    value={editdingRow?.role}
                    onChange={(e) =>
                      handleChange(row.id, { ...editdingRow, role: e.target.value })
                    }
                  />
                ) : (
                  row.role
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <button onClick={() => handleSave(row.id, editdingRow)}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(row.id)}>Edit</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(row.id)}>Delete</button>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
