import { useContext, useEffect, useState } from 'react';
import { api } from '../../api/api';
import { RoomsAPI } from '../../constants/constants';
import { MdViewModule, MdTableRows, MdEdit, MdDelete } from 'react-icons/md';
import { AlertContext } from '../../context/AlertContext';
import { FaHouse, FaCampground } from 'react-icons/fa6';

const initialForm = { name: '', type: 'room', max_capacity: 1 };

const Rooms = () => {
  const { showAlert } = useContext(AlertContext);
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState('card');
  const [editingRoom, setEditingRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 30;
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchRooms(page);
  }, [page]);

  const fetchRooms = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api(
        RoomsAPI.ROOMS,
        'GET',
        null,
        {},
        { page: pageNum, page_size: pageSize }
      );
      setRooms(res.data.results || res.data);
      setCount(res.data.count || 0);
    } catch {
      setRooms([]);
      setCount(0);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingRoom) {
        await api(
          RoomsAPI.ROOM.replace(':roomId', editingRoom.id) + 'update/',
          'PUT',
          form
        );
        showAlert({ message: 'Room updated successfully!', type: 'success' });
      } else {
        await api(RoomsAPI.ROOMS + 'create/', 'POST', form);
        showAlert({ message: 'Room created successfully!', type: 'success' });
      }
      setShowModal(false);
      setForm(initialForm);
      setEditingRoom(null);
      fetchRooms(page);
    } catch (err) {
      setError(err?.detail || 'Failed to save room');
      showAlert({
        message: err?.detail || 'Failed to save room',
        type: 'error',
      });
    }
  };

  const handleEdit = (room) => {
    setForm({
      name: room.name,
      type: room.type,
      max_capacity: room.max_capacity,
    });
    setEditingRoom(room);
    setShowModal(true);
    setError('');
  };

  const handleDelete = (roomId) => {
    showAlert({
      message: 'Are you sure you want to delete this room?',
      type: 'warning',
      onSuccess: async () => {
        try {
          await api(
            RoomsAPI.ROOM.replace(':roomId', roomId) + 'delete/',
            'DELETE'
          );
          showAlert({ message: 'Room deleted successfully!', type: 'success' });
          fetchRooms(page);
        } catch (err) {
          showAlert({
            message: err?.detail || 'Failed to delete room',
            type: 'error',
          });
        }
      },
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditingRoom(null);
    setError('');
  };

  const totalPages = Math.ceil(count / pageSize) || 1;

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md ">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              {editingRoom ? 'Edit Room' : 'Create Room'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  name="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Type</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  name="type"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                >
                  <option value="room">Room</option>
                  <option value="tent">Tent</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Max Capacity</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  name="max_capacity"
                  type="number"
                  min={1}
                  value={form.max_capacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, max_capacity: e.target.value }))
                  }
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer hover:underline transition duration-200 ease-in-out"
                >
                  {editingRoom ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer hover:underline transition duration-200 ease-in-out"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Rooms</h1>
          <div className="flex items-center gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer hover:underline transition duration-200 ease-in-out"
              onClick={() => {
                setShowModal(true);
                setEditingRoom(null);
                setForm(initialForm);
                setError('');
              }}
            >
              + Create Room
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-l cursor-pointer ${view === 'card' ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
              onClick={() => setView('card')}
            >
              <MdViewModule className="mr-2" /> Card View
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-r cursor-pointer ${view === 'table' ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
              onClick={() => setView('table')}
            >
              <MdTableRows className="mr-2" /> Table View
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-blue-600 font-semibold text-lg animate-pulse">
              Loading...
            </span>
          </div>
        ) : view === 'card' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow flex overflow-hidden relative"
                >
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button
                      className="cursor-pointer bg-yellow-400 text-white p-2 rounded hover:bg-yellow-500"
                      title="Edit"
                      onClick={() => handleEdit(room)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="cursor-pointer bg-red-500 text-white p-2 rounded hover:bg-red-700"
                      title="Delete"
                      onClick={() => handleDelete(room.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                  <div className="w-1/3 bg-gray-200 flex items-center justify-center">
                    {room.type === 'room' ? (
                      <FaHouse className="text-5xl text-blue-400" />
                    ) : (
                      <FaCampground className="text-5xl text-green-500" />
                    )}
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-center">
                    <div className="font-bold text-lg">{room.name}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {room.type}
                    </div>
                    <div className="mt-2 text-sm">
                      Max Capacity:{' '}
                      <span className="font-semibold">{room.max_capacity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Max Capacity</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="border-t">
                      <td className="px-4 py-2">{room.name}</td>
                      <td className="px-4 py-2 capitalize">{room.type}</td>
                      <td className="px-4 py-2">{room.max_capacity}</td>
                      <td className="px-4 py-2">
                        <button
                          className="cursor-pointer bg-yellow-400 text-white p-2 rounded hover:bg-yellow-500 mr-2"
                          title="Edit"
                          onClick={() => handleEdit(room)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="cursor-pointer bg-red-500 text-white p-2 rounded hover:bg-red-700"
                          title="Delete"
                          onClick={() => handleDelete(room.id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Rooms;
