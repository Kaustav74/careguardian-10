import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState('');

  useEffect(() => {
    api.get('/telemedicine/doctors').then(({ data }) => setDoctor(data.find((d) => d._id === doctorId)));
  }, [doctorId]);

  const book = async () => {
    const { data } = await api.post('/telemedicine/appointments', { doctorId, slot });
    navigate(`/telemedicine/call/${data._id}`);
  };

  if (!doctor) return <PageContainer><div className="card">Loading doctor...</div></PageContainer>;

  return <PageContainer><section className="card"><h2 className="text-xl font-semibold">Book with Dr. {doctor.name}</h2><select className="input mt-3" value={slot} onChange={(e) => setSlot(e.target.value)}><option value="">Select slot</option>{doctor.slots.map((s) => <option key={s} value={s}>{s}</option>)}</select><button className="btn-primary mt-3" onClick={book} disabled={!slot}>Confirm Booking</button></section></PageContainer>;
}
