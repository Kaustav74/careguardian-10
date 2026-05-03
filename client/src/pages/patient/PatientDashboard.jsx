export default function PatientDashboard() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="card md:col-span-2">
        <h2 className="text-xl font-semibold">Emergency SOS</h2>
        <p className="mt-2 text-slate-500">Trigger immediate emergency coordination.</p>
        <button className="mt-6 w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-semibold text-white shadow-soft hover:bg-red-600">
          SOS - Request Immediate Help
        </button>
      </div>
      <div className="card">
        <h3 className="font-semibold">Health Snapshot</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Blood Group: O+</li>
          <li>Allergies: Penicillin</li>
          <li>Emergency Contact: +91 98xxxxxx12</li>
        </ul>
      </div>
    </section>
  );
}
