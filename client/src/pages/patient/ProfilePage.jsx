export default function ProfilePage() {
  return (
    <section className="mx-auto max-w-2xl card">
      <h2 className="mb-4 text-xl font-semibold">Medical Profile</h2>
      <form className="grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Full Name" defaultValue="Riya Sharma" />
        <input className="input" placeholder="Blood Group" defaultValue="O+" />
        <input className="input md:col-span-2" placeholder="Allergies" defaultValue="Penicillin" />
        <input className="input md:col-span-2" placeholder="Current Conditions" defaultValue="Asthma" />
        <button className="btn-primary md:col-span-2">Save Profile</button>
      </form>
    </section>
  );
}
