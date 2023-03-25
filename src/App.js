import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transferAmount, setTransferAmount] = useState(null);

  useEffect(() => {
    getUsers();
    getAccounts();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/v1/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/v1/accounts");
      setAccounts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async (user) => {
    try {
      await axios.post("http://localhost:5001/api/v1/users", user);
      getUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const createAccount = async (account) => {
    try {
      await axios.post("http://localhost:5001/api/v1/accounts", account);
      getAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (userId, updatedUser) => {
    try {
      await axios.put(`http://localhost:5001/api/v1/users/${userId}`, updatedUser);
      getUsers();
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAccount = async (accountId, updatedAccount) => {
    try {
      await axios.put(`http://localhost:5001/api/v1/accounts/${accountId}`, updatedAccount);
      getAccounts();
      setSelectedAccount(null);
      setAccounts(
        accounts.map((account) => {
          if (account._id === accountId) {
            return {
              ...account,
              ...updatedAccount,
            };
          }
          return account;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/users/${userId}`);
      getUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/accounts/${accountId}`);
      getAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedAccount(null);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setSelectedUser(null);
  };

  const handleTransferSubmit = async (transferData) => {
    try {
      console.log(selectedAccount._id);
      await axios.put(`http://localhost:5001/api/v1/accounts/transfer/${selectedAccount._id}`, transferData);
      getAccounts();
      setSelectedAccount(null);
      setTransferAmount(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user._id} - {user.name} - {user.email} - {user.isActive ? "Active User" : "Inactive User"}
            <ul>
              {user.accounts.map((account) => (
                <li key={account._id}>
                  Account number: {account._id} - Cash: {account.cash}, Credit: {account.credit}
                  <button onClick={() => handleAccountSelect(account)}>Select Account</button>
                  <button onClick={() => deleteAccount(account._id)}>Delete Account</button>
                </li>
              ))}
            </ul>
            <button onClick={() => handleUserSelect(user)}>Select User</button>
            <button onClick={() => deleteUser(user._id)}>Delete User</button>
          </li>
        ))}
      </ul>
      <hr />
      <h1>Create User</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const user = {
            name: event.target.name.value,
            email: event.target.email.value,
          };
          createUser(user);
          event.target.reset();
        }}
      >
        <input type="text" name="name" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
        <button type="submit">Create User</button>
      </form>
      <hr />
      {selectedUser && (
        <>
          <h1>Update User</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const updatedUser = {
                name: event.target.name.value,
                email: event.target.email.value,
              };
              updateUser(selectedUser._id, updatedUser);
              event.target.reset();
            }}
          >
            <input type="text" name="name" defaultValue={selectedUser.name} />
            <input type="email" name="email" defaultValue={selectedUser.email} />
            <button type="submit">Update User</button>
          </form>
          <hr />
          <h1>Create Account</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const account = {
                accountNumber: event.target.accountNumber.value,
                balance: event.target.balance.value,
              };
              createAccount(account);
              event.target.reset();
            }}
          >
            <input type="text" name="accountNumber" placeholder="Account Number" />
            <input type="number" name="balance" placeholder="Balance" />
            <button type="submit">Create Account</button>
          </form>
        </>
      )}
      {selectedAccount && (
        <>
          <h1>Update Account</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const updatedAccount = {
                cash: event.target.cash.value,
                credit: event.target.credit.value,
                owner: event.target.owner.value,
                owner_id: event.target.owner_id.value,
              };
              updateAccount(selectedAccount._id, updatedAccount);
              event.target.reset();
            }}
          >
            <input type="number" name="cash" defaultValue={selectedAccount.cash} />
            <input type="number" name="credit" defaultValue={selectedAccount.credit} />
            <input type="text" name="owner" defaultValue={selectedAccount.owner} />
            <input type="text" name="owner_id" defaultValue={selectedAccount.owner_id} />
            <button type="submit">Update Account</button>
          </form>
          <hr />
          <h1>Transfer Money</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const moveDetails = {
                to: event.target.to.value,
                amount: Number(event.target.amount.value),
              };
              console.log(moveDetails);
              handleTransferSubmit(moveDetails);
              event.target.reset();
            }}
          >
            <input type="number" name="amount" placeholder="Amount" onChange={(event) => setTransferAmount(event.target.value)} />
            <input type="text" name="to" placeholder="Receiver account ID" onChange={(event) => setTransferAmount(event.target.value)} />
            <button type="submit">Transfer</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
