import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../../services/api';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function VideoConsultationPage() {
  const { appointmentId } = useParams();
  const [session, setSession] = useState(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    api.post('/telemedicine/video/session', { appointmentId }).then(({ data }) => {
      setSession(data);
      socket.emit('join_consultation', data.roomId);
    });
    socket.on('consult_message', (payload) => setChat((c) => [...c, payload]));
    return () => socket.off('consult_message');
  }, [appointmentId]);

  const send = () => {
    if (!msg.trim() || !session) return;
    socket.emit('consult_message', { roomId: session.roomId, text: msg, type: 'text', ts: Date.now() });
    setMsg('');
  };

  return <PageContainer><section className="grid gap-4 lg:grid-cols-3"><div className="card lg:col-span-2"><h2 className="text-xl font-semibold">Video Consultation</h2><p className="text-sm text-slate-500">Room: {session?.roomId || 'connecting...'}</p><div className="mt-3 h-64 rounded-xl bg-slate-900/90 text-white grid place-items-center">Stable call placeholder (WebRTC/Twilio ready)</div><div className="mt-3 flex gap-2"><button className="btn-primary" onClick={() => setMuted((m) => !m)}>{muted ? 'Unmute' : 'Mute'}</button><button className="btn-primary" onClick={() => setVideoOff((v) => !v)}>{videoOff ? 'Video On' : 'Video Off'}</button><button className="rounded-xl border px-4" onClick={() => window.history.back()}>End Call</button></div></div><aside className="card"><h3 className="font-semibold">Consultation Chat</h3><div className="mt-2 h-56 overflow-auto space-y-1 text-sm">{chat.map((c,i)=><p key={i}>{c.type==='prescription'?'📄':''}{c.text}</p>)}</div><div className="mt-2 flex gap-2"><input className="input" value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Type or prescription..."/><button className="btn-primary" onClick={send}>Send</button></div></aside></section></PageContainer>;
}
