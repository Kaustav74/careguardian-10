import { mockHospitals } from '../../data/mockHospitals';

export default function HospitalListPage() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Nearby Hospitals</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {mockHospitals.map((hospital) => (
          <article key={hospital.id} className="card">
            <h3 className="text-lg font-semibold">{hospital.name}</h3>
            <p className="text-sm text-slate-500">{hospital.city}</p>
            <p className="mt-3 text-sm">Estimated arrival: <span className="font-medium">{hospital.eta}</span></p>
          </article>
        ))}
      </div>
    </section>
  );
}
