const Terms = () => {
  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-blue-400">
          Términos y Condiciones
        </h1>

        <p className="text-gray-300 mb-6">
          Al realizar una compra en KidStore Perú aceptas los siguientes términos:
        </p>

        <ul className="space-y-4 text-gray-400 list-disc list-inside">
          <li>Todos los productos digitales no tienen devolución una vez entregados.</li>
          <li>El cliente es responsable de proporcionar datos correctos.</li>
          <li>Los tiempos de entrega pueden variar según la plataforma.</li>
          <li>No nos hacemos responsables por bloqueos o restricciones externas de plataformas.</li>
          <li>Las compras fraudulentas serán reportadas.</li>
        </ul>

      </div>
    </div>
  );
};

export default Terms;
