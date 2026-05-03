import PageContainer from '../../components/PageContainer';
import SkeletonCard from '../../components/SkeletonCard';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';

export default function HospitalListPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ maxDistanceKm: 30, costCategory: '', hasIcu: false, minBeds: 1 });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('maxDistanceKm', filters.maxDistanceKm);
    if (filters.costCategory) params.set('costCategory', filters.costCategory);
    if (filters.hasIcu) params.set('hasIcu', 'true');
    params.set('minBeds', filters.minBeds);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    api.get(`/hospitals?${query}`).then(({ data }) => setHospitals(data)).finally(() => setLoading(false));
  }, [query]);

  return (
    <PageContainer>
      <section className="grid gap-6 md:grid-cols-4">
        <aside className="card h-fit md:col-span-1">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Filters</h3>
          <label className="mb-3 block text-sm">Distance (km)
            <input type="range" min="5" max="100" value={filters.maxDistanceKm} onChange={(e) => setFilters((f) => ({ ...f, maxDistanceKm: e.target.value }))} className="w-full" />
          </label>
          <label className="mb-3 block text-sm">Cost
            <select className="input mt-1" value={filters.costCategory} onChange={(e) => setFilters((f) => ({ ...f, costCategory: e.target.value }))}><option value="">Any</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
          </label>
          <label className="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.hasIcu} onChange={(e) => setFilters((f) => ({ ...f, hasIcu: e.target.checked }))} /> ICU Available</label>
          <label className="block text-sm">Minimum Beds<input type="number" min="1" className="input mt-1" value={filters.minBeds} onChange={(e) => setFilters((f) => ({ ...f, minBeds: e.target.value }))} /></label>
        </aside>

        <div className="space-y-4 md:col-span-3">
          <h2 className="text-2xl font-semibold tracking-tight">Nearby Hospitals</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : hospitals.map((hospital) => (
              <article key={hospital._id} className="card transition hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{hospital.name}</h3>
                    <p className="text-sm text-slate-500">{hospital.city} · {hospital.distanceKm} km</p>
                  </div>
                  <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase">{hospital.costCategory}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><p>🛏️ Beds: <span className="font-medium">{hospital.availableBeds}</span></p><p>🏥 ICU: <span className="font-medium">{hospital.icuAvailable ? 'Yes' : 'No'}</span></p></div>
                <div className="mt-3 flex flex-wrap gap-2">{hospital.facilities?.map((facility) => <span key={facility} className="rounded-lg bg-slate-100 px-2 py-1 text-xs">{facility}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
