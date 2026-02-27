export default function DecisionPanel({ result }) {
  if (!result) {
    return (
      <section className="card">
        <h3>Decision</h3>
        <p>No decision yet.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>Decision + Explanation</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </section>
  );
}
