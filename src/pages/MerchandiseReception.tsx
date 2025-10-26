import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { InventoryNoAvailable } from "../types";

export default function MerchandiseReception() {
  const location = useLocation();
  const navigate = useNavigate();

  // get values send of page "/" 
  const state = location.state as { inventory?: InventoryNoAvailable[] } | null;
  const inventoryNoAvailable = state?.inventory ?? [];

  // add item "cantidad_a_dar"
  const [inventory, setInventory] = useState(
    inventoryNoAvailable.map((item) => ({
      ...item,
      cantidad_a_dar: 0,
    }))
  );

  const handleQuantityChange = (producto: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.producto === producto) {
          const nuevaCantidad = Math.max(0, item.cantidad_a_dar + delta);

          return { ...item, cantidad_a_dar: nuevaCantidad };
        }
        return item;
      })
    );
  };

  const groupedByVendor = inventory.reduce((acc, item) => {
    if (!acc[item.vendor]) acc[item.vendor] = [];
    acc[item.vendor].push(item);
    return acc;
  }, {} as Record<string, (InventoryNoAvailable & { cantidad_a_dar: number })[]>);

  const generateReport = () => {
    const updatedInventory = inventory.map((item) => ({
      ...item,
      cantidad_producto_faltante: Math.max(
        0,
        item.cantidad_producto_faltante - item.cantidad_a_dar
      ),
    }));

    navigate("/final-report", { state: { inventory: updatedInventory } });
  };

  return (
    <div className="bg-[#2E6D92] w-full max-h-screen p-3 text-white scrollbar-thumb-[#205777] scrollbar-thumb-rounded-full scrollbar-track-[#5695A4] scrollbar-thin overflow-y-scroll">
      <h1 className="text-2xl font-semibold mb-3 text-center">Reabastecimiento</h1>

      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedByVendor).map(([vendor, products]) => (
          <div
            key={vendor}
            className="bg-[#205777] rounded-xl p-4 w-full"
          >
            <h2 className="text-lg font-semibold mb-3">
              {vendor}
            </h2>

            {/* list items */}
            <ul className="space-y-2">
              {products.map((p) => (
                <li
                  key={p.producto}
                  className="flex items-center justify-between text-sm border-b pb-2 border-gray-100"
                >
                  <div className="flex-1 pr-2">
                    <span className="block font-medium">{p.producto}</span>
                    <span className="text-gray-400">{p.descripcion}</span>
                  </div>

                  <div className="flex flex-col items-center w-20">
                    <span className="text-gray-400 text-xs">Faltan</span>
                    <span className={`${p.cantidad_producto_faltante === 0 ? "text-gray-400" : "text-red-400"} font-semibold`}>
                      {p.cantidad_producto_faltante}
                    </span>
                  </div>

                  <div className="flex flex-col items-center w-20">
                    <span className="text-gray-400 text-xs">Proveer</span>
                    <span className={`${p.cantidad_a_dar === 0 ? "text-gray-400" : "text-blue-400"} font-semibold`}>
                      {p.cantidad_a_dar}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-row items-center gap-1">
                    <button
                      className="px-2 py-1 bg-[#5695A4] rounded"
                      onClick={() => handleQuantityChange(p.producto, -1)}
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>

                    <button
                      className="px-2 py-1 bg-[#77AFB5] rounded"
                      onClick={() => handleQuantityChange(p.producto, +1)}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end mt-6">
        <button onClick={() => generateReport()} className="bg-[#77AFB5] px-2 py-1 rounded">
          Hacer Pedido
        </button>
      </div>
    </div>
  );
}

