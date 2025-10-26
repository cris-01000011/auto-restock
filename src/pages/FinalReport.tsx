import { useLocation, useNavigate } from "react-router-dom";
import * as xlsx from '@e965/xlsx';
import type { InventoryNoAvailable } from "../types";

export default function FinalReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { inventory?: InventoryNoAvailable[] } | null;
  const inventory = state?.inventory ?? [];

  const remaining = inventory.filter((item) => item.cantidad_producto_faltante > 0);

  const makeExcelFinalReport = () => {
    const dataForExcel = remaining.map(({ producto, descripcion, vendor, cantidad_producto_faltante }) => ({
      Producto: producto,
      Descripción: descripcion,
      Vendor: vendor,
      "Cantidad Faltante": cantidad_producto_faltante,
    }));

    const worksheet = xlsx.utils.json_to_sheet(dataForExcel);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Reporte Final");

    const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report_final.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-[#2E6D92] p-6 w-full max-h-screen text-white scrollbar-thumb-[#205777] scrollbar-thumb-rounded-full scrollbar-track-[#5695A4] scrollbar-thin overflow-y-scroll">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Reporte Final de Faltantes
      </h1>

      {remaining.length === 0 ? (
        <p>No hay productos faltantes.</p>
      ) : (
        <ul className="bg-[#205777] divide-y divide-gray-200 p-2 rounded-xl">
          {remaining.map((item) => (
            <li key={item.producto} className="py-2 flex justify-between">
              <span>
                {item.producto} - {item.descripcion}
              </span>
              <span className="font-semibold">
                Faltan: {item.cantidad_producto_faltante}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3 justify-center mt-5">
        <button onClick={() => navigate("/")} className="bg-[#77AFB5] px-2 py-1 rounded">
          <i className="bi bi-house"></i>
        </button>
        <button onClick={makeExcelFinalReport} className="bg-[#77AFB5] px-2 py-1 rounded">
          Descargar Reporte
        </button>
      </div>
    </div>
  );
}

