# Nodeless Server 

# Nodeless Backend Service

A lightweight backend server powered by the **Breez Liquid SDK** that enables you to create and pay Lightning (BOLT 11/BOLT 12) and on-chain Bitcoin invoices. Designed as a **nodeless**, **self-custodial** solution, this service simplifies Bitcoin payments and message verification for modern applications.

---

## ✨ Features

- **Create Lightning Invoices**  
  Generate Lightning invoices using BOLT 11 and BOLT 12 formats.

- **On-Chain Transactions**  
  Receive payments directly to an on-chain Bitcoin address.

- **Pay Invoices**  
  Send payments to BOLT 11, BOLT 12 invoices, or Bitcoin addresses.

- **Health Check Endpoint**  
  Easily verify your SDK connection status with a simple API call.

- **Sign Messages**  
  Sign arbitrary messages using your wallet’s private key.

- **Verify Signatures**  
  Verify signed messages using the wallet’s public key.

- **Stylized Logging**  
  Colorful, NestJS-style console logs for clean and readable debugging output.

---

## 🛠️ Setup

### 1. Prerequisites

Make sure you have the following before getting started:

- **Node.js** v16 or later
- A **Breez API key**  
  → [Request your API key here](https://breez.technology/request-api-key/)
- A **12-word mnemonic seed phrase** from a Breez wallet  
  ⚠️ **Never share or expose your mnemonic!**  
  Use a wallet with minimal balance and regularly withdraw to a secure storage wallet.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/nodeless-backend.git
cd nodeless-backend

# Install dependencies
npm install

# Create a `.env` file and add your credentials
cp .env.example .env
# Fill in your Breez API key and mnemonic in the .env file

# Start the server
npm run start


