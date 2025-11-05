import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as xlsx from '@e965/xlsx';
import type { CustomerOrder, OrderAggregated, Inventory, InventoryNoAvailable } from './types';

function App() {
  const navigate = useNavigate();

  const [customerOrdersData, setCustomerOrdersData] = useState<OrderAggregated[]>([]);

  const getCustomerOrders = (json: CustomerOrder[]) => {
    const aggregatedOrders: { [sku: string]: OrderAggregated } = {};

    // get total require of an one product
    json.forEach(order => {
      const sku = order["Lineitem sku"];
      const name = order["Lineitem name"];
      const quantity = order["Lineitem quantity"];

      if (!aggregatedOrders[sku])
        return aggregatedOrders[sku] = { sku, name, quantity };

      aggregatedOrders[sku].quantity += quantity;
    })

    const result = Object.values(aggregatedOrders);

    setCustomerOrdersData(result);
  }

  const checkStockAvailability = (json: Inventory[]) => {
    const inventory: { [producto: string]: InventoryNoAvailable } = {};

    customerOrdersData.forEach(order => {
      const item = json.find(i => i.Producto === order.sku);
      const productQuantityNoAvailable = order.quantity - (item?.Existencias ?? 0);

      inventory[order.sku] = {
        producto: item?.Producto || order.name,
        descripcion: item?.Descripcion || "",
        vendor: item?.Vendor || "",
        cantidad_producto_faltante: productQuantityNoAvailable > 0 ? productQuantityNoAvailable : 0
      };
    });

    const result = Object.values(inventory);

    makeExcelProductNoAvailable(result);
  }

  const makeExcelProductNoAvailable = (inventory: InventoryNoAvailable[]) => {
    if (inventory.length <= 0) return;
    
    // get only products no availables
    const dataForExcel = inventory
      .filter(i => i.cantidad_producto_faltante > 0)
      .map(i => ({
        Producto: i.producto,
        Descripción: i.descripcion,
        Vendor: i.vendor,
        "Cantidad Faltante": i.cantidad_producto_faltante,
    }));

    const worksheet = xlsx.utils.json_to_sheet(dataForExcel); // convert json to sheet of excel
    const workbook = xlsx.utils.book_new(); // make new excel book empty

    // add worksheet to workbook with name "Faltantes"
    xlsx.utils.book_append_sheet(workbook, worksheet, "Faltantes");

    // convert workbook to binary data
    const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });

    // make Blob with excelBuffer binaries, then the browser can interprete how a file
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const url = window.URL.createObjectURL(blob); // url to download blob

    // create tag a to automate download xlsx file
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_no_available.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);

    navigate("./merchandise-reception", { state: { inventory } });
  }

  const readUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const data = event.target?.result;
      if (!data) return;

      try {
        // check data of the excel file
        const workbook = xlsx.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0]; // get first sheet name
        const worksheet = workbook.Sheets[sheetName]; // get sheet with name sheetName

        // convert sheet of excel to json
        const json: any[] = xlsx.utils.sheet_to_json(worksheet);

        if ("Lineitem sku" in json[0])
          return getCustomerOrders(json);

        checkStockAvailability(json);
        
      } catch (err) {
        console.error("Error at proccess file:", err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <main className="bg-[#2E6D92] w-full h-screen text-white flex flex-col items-center justify-center">
      <form className='bg-[#205777] p-3 rounded-xl mb-5'>
        <h1 className='text-center font-bold mb-3'>Subir Archivos</h1>

        <label htmlFor="customer_orders" className="bg-[#77AFB5] block mb-2 px-2 rounded py-1">
          <i className='bi bi-person mr-2'></i>
          Pedidos de clientes
        </label>
        <input
          className="file:bg-[#5695A4] file:px-3 file:py-2 file:mr-2 file:cursor-pointer bg-[#77AFB5] w-full rounded mb-5 cursor-pointer"
          type="file"
          name="customer_orders"
          id="customer_orders"
          accept=".xlsx, .xls"
          onChange={readUploadFile}
        />

        <label htmlFor="inventary" className="bg-[#77AFB5] block mb-2 px-2 rounded py-1">
          <i className='bi bi-table mr-2'></i>
          Inventario
        </label>
        <input
          className="file:bg-[#5695A4] file:px-3 file:py-2 file:mr-2 file:cursor-pointer bg-[#77AFB5] w-full rounded cursor-pointer"
          type="file"
          name="inventary"
          id="inventary"
          accept=".xlsx, .xls"
          onChange={readUploadFile}
        />
      </form>

      <div className="flex flex-row gap-2">
        <a href="/customer_orders.xlsx" download className="bg-[#77AFB5] block mb-2 px-2 rounded py-1">
          <i className='bi bi-download mr-2'></i>
          customer_orders.xlsx
        </a>
        <a href="/inventory.xlsx" download className="bg-[#77AFB5] block mb-2 px-2 rounded py-1">
          <i className='bi bi-download mr-2'></i>
          inventory.xlsx
        </a>
      </div>

      <a href="/Fase 1. Prueba práctica.xlsx" download className="fixed bottom-2 right-5 bg-[#77AFB5] mb-2 px-2 rounded py-1">
        <i className='bi bi-download mr-2'></i>
        Fase 1. Prueba práctica.xlsx
      </a>
    </main>
  );
}

export default App;

