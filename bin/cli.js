#!/usr/bin/env node

import inquirer from 'inquirer';
import fetch from 'node-fetch';

const API_URL = process.env.API_URL;
if (!API_URL) {
  console.error('❌ Missing API_URL environment variable');
  process.exit(1);
}

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: ['Add product', 'List products', 'Exit'],
    },
  ]);

  if (action === 'Add product') {
    await addProduct();
    await mainMenu();
  } else if (action === 'List products') {
    await listProducts();
    await mainMenu();
  } else {
    process.exit(0);
  }
}

async function addProduct() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Product name:' },
    { type: 'input', name: 'price', message: 'Product price:', validate: v => !isNaN(v) },
    { type: 'input', name: 'count', message: 'Stock count:', validate: v => Number.isInteger(Number(v)) },
  ]);

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: answers.name,
        price: parseFloat(answers.price),
        count: parseInt(answers.count, 10),
      }),
    });

    const result = await res.json();
    if (!res.ok) throw result;
    console.log('✅ Product added:', result);
  } catch (err) {
    console.error('❌ Error adding product:', err);
  }
}

async function listProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    if (!res.ok) throw products;

    console.log('\n📦 Product list:');
    console.log(products);
    console.table(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
  }
}

mainMenu();
