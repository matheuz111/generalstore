interface Props {
  selected: string;
  onSelect: (method: string) => void;
}

const methods = [
  {
    id: "yape",
    name: "Yape",
    description: "Pago inmediato desde tu celular",
  },
  {
    id: "plin",
    name: "Plin",
    description: "Transferencia rápida entre bancos",
  },
  {
    id: "transferencia",
    name: "Transferencia bancaria",
    description: "BCP / Interbank / BBVA",
  },
  {
    id: "binance",
    name: "Binance Pay",
    description: "Criptomonedas (USDT)",
  },
];

const PaymentMethods = ({ selected, onSelect }: Props) => {
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`w-full text-left p-4 rounded-xl border transition cursor-pointer
            ${
              selected === method.id
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
        >
          <p className="font-semibold text-lg">
            {method.name}
          </p>
          <p className="text-sm text-gray-400">
            {method.description}
          </p>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethods;
