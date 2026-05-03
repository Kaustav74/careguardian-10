const mockRequests = [
  { id: 'ER-101', patient: 'Arjun Mehta', severity: 'High', time: '2 mins ago' },
  { id: 'ER-102', patient: 'Neha Gupta', severity: 'Medium', time: '5 mins ago' },
];

export default function HospitalDashboard() {
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">Incoming Emergency Requests</h2>
      <div className="mt-4 space-y-3">
        {mockRequests.map((request) => (
          <div key={request.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium">{request.id} · {request.patient}</p>
            <p className="text-sm text-slate-500">Severity: {request.severity} · {request.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
