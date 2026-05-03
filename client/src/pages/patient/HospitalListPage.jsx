import PageContainer from '../../components/PageContainer';
import SkeletonCard from '../../components/SkeletonCard';
import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export default function HospitalListPage() {
  const [filters, setFilters] = useState({ maxDistanceKm: 30, costCategory: '', hasIcu: false, minBeds: 1 });
  const [debounced, setDebounced] = useState(filters);
  useEffect(() => { const t = setTimeout(() => setDebounced(filters), 250); return () => clearTimeout(t); }, [filters]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('maxDistanceKm', debounced.maxDistanceKm);
    if (debounced.costCategory) params.set('costCategory', debounced.costCategory);
    if (debounced.hasIcu) params.set('hasIcu', 'true');
    params.set('minBeds', debounced.minBeds);
    return params.toString();
  }, [debounced]);

  const { data: hospitals = [], isLoading, isFetching } = useQuery({
    queryKey: ['hospitals', query],
    queryFn: async () => (await api.get(`/hospitals?${query}`)).data.data || [],
    placeholderData: (prev) => prev,
  });

  return (
    <PageContainer>
      <section className="grid gap-6 md:grid-cols-4">
        <aside className="card h-fit md:col-span-1">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Filters</h3>
          <label className="mb-3 block text-sm">Distance (km)<input type="range" min="5" max="100" value={filters.maxDistanceKm} onChange={(e) => setFilters((f) => ({ ...f, maxDistanceKm: e.target.value }))} className="w-full" /></label>
          <label className="mb-3 block text-sm">Cost<select className="input mt-1" value={filters.costCategory} onChange={(e) => setFilters((f) => ({ ...f, costCategory: e.target.value }))}><option value="">Any</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label className="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.hasIcu} onChange={(e) => setFilters((f) => ({ ...f, hasIcu: e.target.checked }))} /> ICU Available</label>
          <label className="block text-sm">Minimum Beds<input type="number" min="1" className="input mt-1" value={filters.minBeds} onChange={(e) => setFilters((f) => ({ ...f, minBeds: e.target.value }))} /></label>
        </aside>

        <div className="space-y-4 md:col-span-3">
          <h2 className="text-2xl font-semibold tracking-tight">Nearby Hospitals {isFetching && <span className="text-xs text-slate-500">Updating…</span>}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : hospitals.map((hospital) => (
                  <article key={hospital._id} className="card transition hover:-translate-y-0.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{hospital.name}</h3>
                        <p className="text-sm text-slate-500">{hospital.city} · {hospital.distanceKm} km</p>
                      </div>
                      <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase">{hospital.costCategory}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <p>🛏️ Beds: <span className="font-medium">{hospital.availableBeds}</span></p>
                      <p>🏥 ICU: <span className="font-medium">{hospital.icuAvailable ? 'Yes' : 'No'}</span></p>
                    </div>
                  </article>
                ))}

            {!isLoading && hospitals.length === 0 && <p className="text-sm text-slate-500">No hospitals found for current filters.</p>}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
