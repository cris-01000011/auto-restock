# 🧾 Auto Restock

React + TypeScript + Vite application that automates the process of detecting missing products based on customer orders and the current inventory.  
The app reads two Excel files, compares them, and generates detailed reports showing which products need to be restocked.

---

## How to use

### 📂 Upload the Excel Files

Upload the following files
(you can download this files in the first page of the project):

- customer_orders.xlsx
- inventory.xlsx

---

### ⚙️ Automatic Report Generation

Once both files are uploaded, the system will automatically process the data and generate a report with the products **missing in stock**.

The report will be **automatically downloaded** as an Excel file.

---

### 📦 Merchandise Reception

After the first report, you will be redirected to **`/merchandise-reception`**.

In this section, select the products you want to **restock**.

---

### 📊 Final Report

When finished, you can generate a **final report** that includes:

- The customer orders  
- The missing products  
- The restock quantities  

You can then **download this final report** as an Excel file.

---

## ⚙️ Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/cris-01000011/auto-restock.git
cd auto-restock
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the development server

```bash
npm run dev
```
