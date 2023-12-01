import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editdingRow, setEditingRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

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
    setSelectAll(false);
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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const length = data.length
      let allRowIds = [];
      for(var i = currentPage*10 -10 ; i<currentPage*10;i++){
        allRowIds.push(data[i].id);
      }
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = () => {

    const searchTermLower = searchTerm.toLowerCase();
    const filteredData = data.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTermLower) ||
        row.email.toLowerCase().includes(searchTermLower) ||
        row.role.toLowerCase().includes(searchTermLower)
    );
    setData(filteredData);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="outer-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
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
          {currentItems.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>
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

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
