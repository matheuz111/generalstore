interface Props {
  method: string;
}

const PaymentInstructions = ({ method }: Props) => {
  if (!method) return null;

  return (
    <div className="mt-5 bg-black/40 border border-white/10 rounded-xl p-4 space-y-4">

      {/* ================= YAPE ================= */}
      {method === "yape" && (
        <>
          <h4 className="text-lg font-bold text-purple-400">
            Pago con Yape
          </h4>

          <img
            src="/images/yape.jpg"
            alt="QR Yape"
            className="w-48 mx-auto rounded-lg"
          />

          <div className="text-sm text-gray-300 space-y-1 text-center">
            <p><strong>Número:</strong> 963 469 586</p>
            <p><strong>Nombre:</strong> Freddy Aystin Rodriguez Uricay</p>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Envía el pago y adjunta el comprobante al finalizar.
          </p>
        </>
      )}

      {/* ================= PLIN ================= */}
      {method === "plin" && (
        <>
          <h4 className="text-lg font-bold text-green-400">
            Pago con Plin
          </h4>

          <img
            src="/images/plin.jpg"
            alt="QR Plin"
            className="w-48 mx-auto rounded-lg"
          />

          <div className="text-sm text-gray-300 space-y-1 text-center">
            <p><strong>Número:</strong> 963 469 586</p>
            <p><strong>Nombre:</strong> Freddy Aystin Rodriguez Uricay</p>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Envía el pago y adjunta el comprobante al finalizar.
          </p>
        </>
      )}

      {/* ================= TRANSFERENCIA ================= */}
      {method === "transferencia" && (
        <>
          <h4 className="text-lg font-bold text-blue-400">
            Transferencia Bancaria
          </h4>

          <ul className="text-sm text-gray-300 space-y-2">
            <li><strong>BCP:</strong> 19206197697098</li>
            <li><strong>Interbank:</strong> 8983302393569</li>
            <li><strong>BBVA:</strong> 001108140213226768</li>
          </ul>

          <p className="text-sm text-gray-300">
            <strong>Titular:</strong> Freddy Aystin Rodriguez Uricay
          </p>

          <p className="text-xs text-gray-400">
            Realiza la transferencia y adjunta el comprobante.
          </p>
        </>
      )}

      {/* ================= BINANCE ================= */}
      {method === "binance" && (
        <>
          <h4 className="text-lg font-bold text-yellow-400">
            Binance Pay
          </h4>

          <img
            src="/images/binance.jpg"
            alt="QR Binance Pay"
            className="w-48 mx-auto rounded-lg"
          />

          <div className="text-sm text-gray-300 space-y-1 text-center">
            <p><strong>ID Pay:</strong> 1066569170</p>
            <p><strong>Nombre:</strong> Kidstore</p>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Escanea el QR o usa el ID Pay para completar el pago.
          </p>
        </>
      )}

    </div>
  );
};

export default PaymentInstructions;
