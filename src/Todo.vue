<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Expense Tracker</h1>
      <div class="row">
        <div class="col-md-4">
          <div class="sidebar">
            <div class="sidebar-header">
              <h4>{{ editingExpense ? 'Edit Expense' : 'Add Expense' }}</h4>
            </div>
            <div class="sidebar-content">
              <div class="form-group">
                <label for="expenseAmount">Amount</label>
                <input type="number" class="form-control" id="expenseAmount" v-model="newExpense.amount" placeholder="Enter amount" min="0" step="0.01">
              </div>
              <div class="form-group">
                <label for="expenseItem">Item</label>
                <input type="text" class="form-control" id="expenseItem" v-model="newExpense.item" placeholder="Enter item">
              </div>
              <div class="form-group">
                <label for="expenseCategory">Category</label>
                <select class="form-select" v-model="newExpense.category" id="expenseCategory">
                  <option value="" disabled selected>Select category</option>
                  <option value="Bills and Regular Payments">Bills and Regular Payments</option>
                  <option value="Day-to-Day Spending">Day-to-Day Spending</option>
                  <option value="Paying Off Debts">Paying Off Debts</option>
                  <option value="Saving Money for the Future">Saving Money for the Future</option>
                  <option value="Emergency Money">Emergency Money</option>
                </select>
              </div>
              <button class="btn btn-primary btn-block" @click="editingExpense ? updateExpense() : addExpense()">{{ editingExpense ? 'Edit' : 'Add' }} Expense</button>
            </div>
          </div>
        </div>
  
        <div class="col-md-8">
          <div class="main-content">
            <h2 class="mb-4">Expenses</h2>
            <ul class="list-group">
              <li v-for="expense in expenses" :key="expense.id" class="list-group-item">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <p><strong>Amount:</strong> {{ expense.data.amount }}</p>
                    <p><strong>Item:</strong> {{ expense.data.item }}</p>
                    <p><strong>Category:</strong> {{ expense.data.category }}</p>
                    <p><strong>Last Modified:</strong> {{ formatTimestamp(expense.data.modifiedAt) }}</p>
                  </div>
                  <div class="btn-group" role="group">
                    <button class="btn btn-danger" @click="deleteExpense(expense.id)"><i class="fas fa-trash"></i></button>
                    <button class="btn btn-secondary" @click="editExpense(expense)"><i class="fas fa-edit"></i></button>
                  </div>
                </div>
              </li>
            </ul>
            <p class="text-end">Total Expenses: {{ totalExpenses }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, onBeforeUnmount, computed } from 'vue';
    import db from './firebase/config.js';
    import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
  
    const expenses = ref([]);
    const newExpense = ref({ amount: 0, category: '', item: '' });
    const editingExpense = ref(null);
  
    const getExpenses = () => {
      const q = collection(db, 'Expenses');
      onSnapshot(q, (snapshot) => {
        expenses.value = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
      });
    }
  
    const addExpense = async () => {
      if (!newExpense.value.amount || !newExpense.value.category || !newExpense.value.item.trim()) {
        return;
      }
  
      const currentTime = new Date().toISOString();
  
      const docData = {
        amount: newExpense.value.amount,
        category: newExpense.value.category,
        item: newExpense.value.item,
        createdAt: currentTime,
        modifiedAt: currentTime // Set creation and modification timestamp
      };
  
      await addDoc(collection(db, 'Expenses'), docData);
      newExpense.value = { amount: 0, category: '', item: '' };
    }
  
    const deleteExpense = async (id) => {
      const confirmation = confirm("Are you sure you want to delete this expense?");
      if (confirmation) {
        try {
          await deleteDoc(doc(db, 'Expenses', id));
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      }
    }
  
    const editExpense = (expense) => {
      editingExpense.value = { id: expense.id, ...expense.data };
      newExpense.value = { ...expense.data };
    }
  
    const updateExpense = async () => {
      if (!newExpense.value.amount || !newExpense.value.category || !newExpense.value.item.trim()) {
        return;
      }
  
      try {
        await updateDoc(doc(db, 'Expenses', editingExpense.value.id), {
          amount: newExpense.value.amount,
          category: newExpense.value.category,
          item: newExpense.value.item,
          modifiedAt: new Date().toISOString() // Update modification timestamp
        });
        newExpense.value = { amount: 0, category: '', item: '' };
        editingExpense.value = null; // Clear editingExpense after update
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    }
  
    // Computed property to calculate total expenses
    const totalExpenses = computed(() => {
      return expenses.value.reduce((total, expense) => total + parseFloat(expense.data.amount), 0);
    });
  
    // Format timestamp
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleString();
    }
  
    // Cleanup the snapshot listener when the component is unmounted
    onBeforeUnmount(() => {
      // Unsubscribe from the snapshot listener
      // This is important to avoid memory leaks
      // and unexpected behavior after the component is destroyed
      // You should always clean up subscriptions in the lifecycle hooks
    });
  
    // Fetch initial data
    getExpenses();
  </script>
  
  <style scoped>
    .sidebar-content .form-group {
      margin-bottom: 15px; /* Adjust as needed */
    }
  </style>
  