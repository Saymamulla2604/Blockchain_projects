let web3;
        let toDoListContract;
        let accounts;

        async function init() {
            // Connect to the injected Ethereum provider (MetaMask)
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                } catch (error) {
                    console.error("User denied account access");
                }
            } else {
                console.error("No Ethereum provider detected");
                return;
            }

            // Load the ToDoList contract
            const contractAddress = "0x2a589c962DD041B87D2D87A5D4C019319BBb65b8"; // Replace with the actual contract address
            toDoListContract = new web3.eth.Contract(ToDoListABI, contractAddress);

            // Fetch accounts
            accounts = await web3.eth.getAccounts();

            // Initial UI update
            updateTaskList();

            // Call updateTaskList periodically to keep the UI in sync with the contract state
            setInterval(updateTaskList, 4000);
        }

        async function addTask() {
            const taskInput = document.getElementById('taskInput');
            const taskContent = taskInput.value;
            if (!taskContent) {
                alert("Task content cannot be empty");
                return;
            }

            try {
                await toDoListContract.methods.addTask(taskContent).send({ from: accounts[0] });
            } catch (error) {
                console.error("Error adding task:", error.message);
                alert("Error adding task. Check the console for details.");
            }

            taskInput.value = ''; // Clear the input field after adding the task
        }

        async function completeTask(taskId) {
            try {
                await toDoListContract.methods.completeTask(taskId).send({ from: accounts[0] });
            } catch (error) {
                console.error("Error completing task:", error.message);
                alert("Error completing task. Check the console for details.");
            }
        }

        async function deleteTask(taskId) {
            try {
                await toDoListContract.methods.deleteTask(taskId).send({ from: accounts[0] });
            } catch (error) {
                console.error("Error deleting task:", error.message);
                alert("Error deleting task. Check the console for details.");
            }
        }

        async function updateTaskList() {
            const taskListElement = document.getElementById('taskList');
            taskListElement.innerHTML = ''; // Clear the existing list

            const taskCount = await toDoListContract.methods.taskCount().call();

            for (let i = 1; i <= taskCount; i++) {
                const task = await toDoListContract.methods.tasks(i).call();
                const taskItem = document.createElement('li');

                taskItem.innerHTML = `
                    <span>${task.content}</span>
                    <button onclick="completeTask(${i})" ${task.completed ? 'disabled' : ''}>Complete</button>
                    <button onclick="deleteTask(${i})">Delete</button>
                `;

                taskListElement.appendChild(taskItem);
            }
        }

        // Run the initialization function
        init();