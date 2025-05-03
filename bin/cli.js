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
      choices: ['Add product', 'Delete product', 'List products', 'Exit'],
    },
  ]);

  if (action === 'Add product') {
    await addProduct();
    await mainMenu();
  } else if (action === 'Delete product') {
    await deleteProduct();
    await mainMenu();
  } else if (action === 'List products') {
    await listProducts();
    await mainMenu();
  } else {
    process.exit(0);
  }
}

async function deleteProduct() {
  await listProducts();
  const answers = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'Input the id to delete: ' },
  ]);

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: answers.id }),
    });

    const result = await res.json();
    if (!res.ok) throw result;
    console.log('✅ Product deleted:', result);
  } catch (err) {
    console.error('❌ Error deleting product:', err);
  }
}

async function addProduct() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Product name:' },
    { type: 'input', name: 'description', message: 'Product description:' },
    { type: 'input', name: 'imageUrl', message: 'Product image URL:', default: 'www.sample.com' },
    { type: 'input', name: 'price', message: 'Product price:', validate: v => !isNaN(v) },
    { type: 'input', name: 'count', message: 'Stock count:', validate: v => Number.isInteger(Number(v)) },
  ]);

  const answerJSON = JSON.stringify({
    name: answers.name,
    description: answers.description,
    imageUrl: answers.imageUrl,
    price: parseFloat(answers.price),
    count: parseInt(answers.count, 10),
  });

  console.log(answerJSON);

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: answerJSON
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
