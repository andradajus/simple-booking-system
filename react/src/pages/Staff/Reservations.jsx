import { useEffect, useState, useMemo, useContext } from 'react';
import { api } from '../../api/api';
import { RoomsAPI } from '../../constants/constants';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import { UserContext } from '../../context/UserContext';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const Reservations = () => {
  const { showAlert } = useContext(UserContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [calendarView, setCalendarView] = useState('month');

  const handleSelectSlot = ({ start }) => {
    if (!selecting) {
      setStartDate(start);
      setEndDate(null);
      setSelecting(true);
    } else {
      if (start >= startDate) {
        setEndDate(start);
        setSelecting(false);
      } else {
        setStartDate(start);
        setEndDate(null);
      }
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api(RoomsAPI.ROOMS, 'GET');
        setRooms(res.data.results || res.data);
        if ((res.data.results || res.data).length > 0) {
          setSelectedRoom((res.data.results || res.data)[0]);
        }
      } catch {
        setRooms([]);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedRoom) return;
      try {
        const url = RoomsAPI.ROOM_BOOKINGS.replace(':roomId', selectedRoom.id);
        const params = calendarView === 'week' ? { view: 'weekly' } : {};
        const res = await api(url, 'GET', null, params);
        setReservations(res.data.results || res.data);
      } catch {
        setReservations([]);
      }
    };
    fetchReservations();
  }, [selectedRoom, calendarView]);

  const events = useMemo(() => {
  const baseEvents = reservations.map((r) => ({
    title: r.user && r.user.username ? r.user.username : 'RESERVED',
    start: new Date(r.start_date),
    end: new Date(r.end_date),
    allDay: true,
  }));
  if (startDate && selecting) {
    baseEvents.push({
      title: 'Your selection',
      start: startDate,
      end: startDate,
      allDay: true,
      isSelection: true,
    });
  }
  if (startDate && endDate) {
    baseEvents.push({
      title: 'Your selection',
      start: startDate,
      end: endDate,
      allDay: true,
      isSelection: true,
    });
  }
  return baseEvents;
}, [reservations, startDate, endDate, selecting]);

  const eventStyleGetter = (event) => {
    if (event.isSelection) {
      return {
        style: {
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '1px',
          border: 'none',
          opacity: 0.8,
        },
      };
    }
    return {};
  };

  return (
    <>
      <div className="flex h-full min-h-screen">
        <div className="w-1/3 border-r p-4 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Rooms</h2>
          <ul>
            {rooms.map((room) => (
              <li
                key={room.id}
                className={`p-3 mb-2 rounded cursor-pointer ${selectedRoom && selectedRoom.id === room.id ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-200'}`}
                onClick={() => setSelectedRoom(room)}
              >
                {room.name}{' '}
                <span className="text-xs text-gray-500">({room.type})</span>
                <div className="text-xs text-gray-400">
                  Pax: {room.max_capacity}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">
              {selectedRoom
                ? `Vacancy for ${selectedRoom.name}`
                : 'Select a room'}
            </h2>
            <div>
              <button
                className={`px-3 py-1 rounded-l ${calendarView === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setCalendarView('month')}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 rounded-r ${calendarView === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setCalendarView('week')}
              >
                Week
              </button>
            </div>
          </div>
          {selectedRoom && (
            <div className="mb-4 text-gray-600">
              Max Pax:{' '}
              <span className="font-semibold">{selectedRoom.max_capacity}</span>
            </div>
          )}
          <div className="border rounded bg-white min-h-[400px] p-2">
            {selectedRoom ? (
              <>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 400 }}
                  views={['month', 'week']}
                  view={calendarView}
                  onView={setCalendarView}
                  selectable
                  onSelectSlot={handleSelectSlot}
                  eventPropGetter={eventStyleGetter}
                />
                {startDate && (
                  <div className="mt-4">
                    <div className="flex w-full justify-center gap-5">
                      <span className="font-semibold">Start:</span>{' '}
                      {startDate.toLocaleDateString()}
                      {endDate && (
                        <>
                          {' '}
                          <span className="font-semibold">End:</span>{' '}
                          {endDate.toLocaleDateString()}
                        </>
                      )}
                    </div>
                    {!endDate && selecting && (
                      <div className="text-sm text-blue-600">
                        Select an end date.
                      </div>
                    )}
                    {endDate && (
                      <button
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full text-center cursor-pointer"
                        disabled={bookingLoading}
                        onClick={async () => {
                          setBookingLoading(true);
                          setBookingError('');
                          try {
                            const url = RoomsAPI.ROOM.replace(':roomId', selectedRoom.id) + 'reserve/';
                            await api(
                              url,
                              'POST',
                              {
                                start_date: startDate
                                  .toISOString()
                                  .slice(0, 10),
                                end_date: endDate.toISOString().slice(0, 10),
                              }
                            );
                            setStartDate(null);
                            setEndDate(null);
                            setSelecting(false);
                            const bookingsUrl = RoomsAPI.ROOM_BOOKINGS.replace(':roomId', selectedRoom.id);
                            const params = calendarView === 'week' ? { view: 'weekly' } : {};
                            const res = await api(
                              bookingsUrl,
                              'GET',
                              null,
                              params
                            );
                            setReservations(res.data.results || res.data);
                          } catch (err) {
                            setBookingError(
                              err?.detail || 'Failed to book reservation'
                            );
                            showAlert({
                              type: 'error',
                              message: err?.detail || 'Failed to book reservation',
                            });
                          }
                          setBookingLoading(false);
                        }}
                      >
                        {bookingLoading ? 'Booking...' : 'Book Reservation'}
                      </button>
                    )}
                    {bookingError && (
                      <div className="text-red-500 mt-2">{bookingError}</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No room selected.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservations;